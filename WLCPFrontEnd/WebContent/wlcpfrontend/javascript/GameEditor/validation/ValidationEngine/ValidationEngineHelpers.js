var ValidationEngineHelpers = class ValidationEngineHelpers {
	
	constructor() {
		
	}
	
	/** 
	 * This method gets the active scopes of a given state by calling that states
	 * getActiveScopes. The scopes are returned as an array of strings.
	 */
	static getActiveScopesState(state) {
		return state.getActiveScopes();
	}
	
	/** 
	 * This method gets the active scopes of a given transition by calling that transitions
	 * getActiveScopes. The scopes are returned as an array of strings.
	 */
	static getActiveScopesTransition(transition) {
		return transition.getActiveScopes();
	}
	
	/** 
	 * This method gets the fully active scopes of a given transition by calling that transitions
	 * getActiveScopes. The scopes are returned as an array of strings. A fully active scope is one where
	 * the input transition it fully activated. For example, all single button press check boxes checked.
	 */
	static getFullyActiveScopesTransition(transition, neighborTransitions) {
		return transition.getFullyActiveScopes(neighborTransitions);
	}
	
	/**
	 * This method turns a list of the active scopes into a bitmask of the active scopes
	 * The bit mask looks like the following for 3 team 3 player game:
	 * 000 000 000 |   000   |     0
	 *    Players     Teams     Game Wide
	 *    
	 *    Bit 0 (right most) is Game Wide
	 *    Bit 1 is Team 1
	 *    Bit 4 is Team 1 Player
	 *    Etc.
	 */
	static getActiveScopeMask(teamCount, playersPerTeam, activeScopes) {
		var scopeMask = 0;
		var maskCount = 0;
		
		if(activeScopes.includes("Game Wide")) {
			scopeMask = this.setBit(scopeMask, maskCount);
		}
		maskCount++;
		
		for(var i = 0; i < teamCount; i++) {
			if(activeScopes.includes("Team " + (i + 1))) {
				scopeMask = this.setBit(scopeMask, maskCount);
			}
			maskCount++;
		}
		
		for(var i = 0; i < teamCount; i++) {
			for(var n = 0; n < playersPerTeam; n++) {
				if(activeScopes.includes("Team " + (i + 1) + " Player " + (n + 1))) {
					scopeMask = this.setBit(scopeMask, maskCount);
				}
				maskCount++;
			}
		}
		
		return scopeMask;
	}
	
	/**
	 * This method takes an active scope mask and provides a list of masks that are used to
	 * mask out scope selection possibilities. For example, if Team 1 scope is active
	 * then the Team 1 Player 1 - X should not be able to be set to active and hence masked out.
	 */
	static getActiveScopeMasks(teamCount, playersPerTeam, activeMask) {
	    
	    var scopeMasks = [];
	    
	    //Check for game wide
	    if(this.getBit(activeMask, 0)) {
	      scopeMasks.push(0x01);
	    }
	    
	    var teamReturn = true;
	    
	    //Check for team wide 
	    for(var i = 1; i < teamCount + 1; i++) {
	      if(this.getBit(activeMask, i) == 0x01) {
	       var tempMask = 0;
	       for(var n = 1; n < teamCount + 1; n++) {
	    	   tempMask = this.setBit(tempMask, n);
	       }
		   var team = 1;
		   var player = 1;
		   for(var n = 0; n < (teamCount * playersPerTeam); n++) {
			   if(i != team) {
				   tempMask = this.setBit(tempMask, n + teamCount + 1);
			   }
			   if((n + 1) % playersPerTeam == 0 && teamCount != 1 || playersPerTeam == 1) { team ++; player = 1; } else { player++; }
			}
	       scopeMasks.push(tempMask);
	      }
	    }
	    
	    //Check for player wide
		var team = 1;
		var player = 1;
		for(var i = 0; i < (teamCount * playersPerTeam); i++) {
			if(this.getBit(activeMask, i + teamCount + 1) == 0x01) {
				var tempMask = 0;
		        var found = false;
		        for(var j = 1; j < teamCount + (teamCount * playersPerTeam) + 1; j++) {
		          if(j != team) {
		            tempMask = this.setBit(tempMask, j);
		          } else {
		            found = true;
		          }
		        }
		        if(found) {
		          scopeMasks.push(tempMask);
		        }
			}
			if((i + 1) % playersPerTeam == 0 && teamCount != 1 || playersPerTeam == 1) { team ++; player = 1; } else { player++; }
		}
	    return scopeMasks;
	}
	
	/**
	 * Ands together the array of active scope masks generated from getActiveScopeMasks
	 */
    static andActiveScopeMasks(activeScopeMasks) {
	    var returnScope = 0xffffffff;
	    for(var i = 0; i < activeScopeMasks.length; i++) {
	      returnScope = returnScope & activeScopeMasks[i];
	    }
	    return returnScope;
	}
    
    /**
     * This method check for the following:
     * Game Wide -> Game Wide
     * Game Wide -> Team Wide (make sure it has team + players for that team)
     * Player Wide -> Team Wide
     * Team -> Game Wide
     * Player Wide -> Game Wide
     * It then returns a modified mask
     */
    static checkForScopeChanges(teamCount, playersPerTeam, activeScopeMask) {
    	
    	var returnActiveScopeMask = activeScopeMask;
    	
		var toGameWideMask = 0;
		for(var n = 1; n < teamCount + (teamCount * playersPerTeam) + 1; n++) {
			toGameWideMask = this.setBit(toGameWideMask, n);
		}
    	
    	//Check for Game Wide -> Game Wide
		if(this.getBit(activeScopeMask, 0) == 0x01) {
			returnActiveScopeMask = toGameWideMask + 1;
		}
		
		var teamList = [];
		
		//Game Wide -> Team Wide (make sure it has team + players for that team)
		for(var team = 1; team < teamCount + 1; team++) {
			if(this.getBit(activeScopeMask, team) == 0x01) {
				teamList.push("Team " + team);
		      }
		}
		
		if(teamList.length > 0) {
			var l = [];
			for(var g = 0; g < teamList.length; g++) {
				for(var c = 1; c < playersPerTeam + 1; c++) {
					l.push(teamList[g] + " Player " + c);
				}
			}
			returnActiveScopeMask = returnActiveScopeMask | this.getActiveScopeMask(teamCount, playersPerTeam, l);
		}
		
		//Player Wide -> Team Wide
	    var playerReturn = true;
	    var playerReturns = [];
	    
	    var team = 1;
		var player = 1;
		var count = 1;
		for(var n = 0; n < (teamCount * playersPerTeam); n++) {
			if(this.getBit(activeScopeMask, n + teamCount + 1) == 0x01) {
				count++;
    	    }
			if(count == playersPerTeam + 1) {
				playerReturns.push("Team " + team);
	    		for(var player = 1; player < playersPerTeam + 1; player++) {
	    			playerReturns.push("Team " + team + " Player " + player);
	    		}
			}
			if((n + 1) % playersPerTeam == 0 && teamCount != 1 || playersPerTeam == 1) { team ++; player = 1; count = 1; } else { player++; }
		}
		
	    if(playerReturns.length > 0) {
	    	returnActiveScopeMask = returnActiveScopeMask | this.getActiveScopeMask(teamCount, playersPerTeam, playerReturns);
	    }
		
	    //Check for Team -> Game Wide
	    //Check for Player Wide -> Game Wide
	    if((returnActiveScopeMask & toGameWideMask) == toGameWideMask) {
	    	returnActiveScopeMask = toGameWideMask + 1;
	    }
		
		return returnActiveScopeMask;
    }
    
    /**
     * This method check for the following:
     * Team -> Game Wide
     * Player Wide -> Game Wide
     * It then returns a modified mask
     */
    static checkForReverseScopeChanges(teamCount, playersPerTeam, parentMask, andScopeMask) {
    	
    	var toGameWideMask = 0;
		for(var n = 0; n < teamCount + (teamCount * playersPerTeam) + 1; n++) {
			toGameWideMask = this.setBit(toGameWideMask, n);
		}
		
		if(parentMask != toGameWideMask && andScopeMask == 1) {
			return parentMask;
		} else {
			return andScopeMask;
		}
		
    }
	
	/**
	 * Sets an individual bit to 1 in a number
	 */
	static setBit(number, bitNumber) {
	    var tempBit = 1;
	    tempBit = tempBit << bitNumber;
	    return number | tempBit;
	}
	
	/**
	 * Gets an individual bit in a number
	 */
	static getBit(number, bitNumber) {
	    return (number >> bitNumber) & 1;
	}

}