var StateScopeValidationRule = class StateScopeValidationRule extends ValidationRule {

validate(state) {
		
		//Get the connections going to this state
		var connectionsToState = GameEditor.getJsPlumbInstance().getConnections({target : state.htmlId});
		
		//TODO: What if no connections?
		if(connectionsToState.length == 0) { return; }
		
		//Get the connections stemming of the source of this states connection
		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({source : connectionsToState[0].sourceId});
		
		//Maintain a list of states the previous one is connected to
		var stateList = [];
		
		//Loop through all of these connections to get their active masks
		for(var i = 0; i < neighborConnections.length; i++) {
		
			//Find the state that the connection points to
			for(var n = 0; n < GameEditor.getEditorController().stateList.length; n++) {
				if(neighborConnections[i].targetId == GameEditor.getEditorController().stateList[n].htmlId) {
					stateList.push(GameEditor.getEditorController().stateList[n]);
				}
			}	
		}
		
		var orMaskAll = 0;
		
		//Loop through and or all active masks that have the same parent
		for(var i = 0; i < stateList.length; i++) {
			
			//Get the active scopes
			var activeScopes = this.getActiveScopes(stateList[i].modelJSON);
			
			//Get the active scope mask
			var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
			
			orMaskAll = orMaskAll | activeScopeMask;
		}
		
		//Loop through all of the states and apply their scope
		for(var i = 0; i < stateList.length; i++) {
			
			var orMaskNeighbors = 0;
			var orScopeMask = 0;
			
			//Get the neighbor active scope mask
			for(var n = 0; n < stateList.length; n++) {
				
				if(stateList[i].htmlId != stateList[n].htmlId) {
					
					//Get the active scopes
					var activeScopes = this.getActiveScopes(stateList[n].modelJSON);
					
					//Get the active scope mask
					var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
					
					orMaskNeighbors = orMaskNeighbors | activeScopeMask;
					
					orScopeMask = orScopeMask | stateList[i].scopeMask;
				}
			}
			
			var parentMask = 0;
			var parentScopeMask = 0;
			//Get parent state active scope masks
			for(var n = 0; n < connectionsToState.length; n++) {
				for(var j = 0; j < GameEditor.getEditorController().stateList.length; j++) {
					if(connectionsToState[n].sourceId == GameEditor.getEditorController().stateList[j].htmlId && !GameEditor.getEditorController().stateList[j].htmlId.includes("start")) {
						//Get the active scopes
						var activeScopes = this.getActiveScopes(GameEditor.getEditorController().stateList[j].modelJSON);
						
						//Get the active scope mask
						var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
						
						parentMask = parentMask | activeScopeMask;
						
						parentScopeMask = parentScopeMask | GameEditor.getEditorController().stateList[j].scopeMask;
					}
				}
			}
			
			if(parentMask == 0) {
				
				//Get the active scope masks
				var activeScopeMasks = this.getActiveScopeMasks(3, 3, orMaskAll);

				//And all of the masks together to get our new scope mask
				var newScopeMask = this.andScopeMasks(activeScopeMasks);
				
				//Set the new scopes
				stateList[i].setScope(newScopeMask & (~orMaskNeighbors), 3, 3);		
			} else {
				
				//Check for game wide to game wide
				if(this.getBit(parentMask, 0) == 0x01) {
					parentMask = 0xffffffff;
				}
				
				var teamList = [];
				
				//Check for game wide to team (make sure it has team + players for that team)
				for(var team = 1; team < 3 + 1; team++) {
					if(this.getBit(parentMask | parentScopeMask, team) == 0x01) {
						teamList.push("Team " + team);
				      }
				}
				
				if(teamList.length > 0) {
					var l = [];
					for(var g = 0; g < teamList.length; g++) {
						for(var c = 1; c < 3 + 1; c++) {
							l.push(teamList[g] + " Player " + c);
						}
					}
					parentMask = parentMask | this.getActiveScopeMask(3, 3, l);
				}
			    
			    var playerReturn = true;
			    var playerReturns = [];
			    
			    //Check for player wide to team wide
			    for(var team = 1; team < 3 + 1; team++) {
			    	for(var player = 1; player < 3 + 1; player++) {
			    		if(!this.getBit(parentMask | parentScopeMask, (3 * team) + player) == 0x01) {
			    			playerReturn = false;
		    	            break;
			    	    }
			    	}
			    	if(playerReturn) {
			    		playerReturns.push("Team " + team);
			    		for(var player = 1; player < 3 + 1; player++) {
			    			playerReturns.push("Team " + team + " Player " + player);
			    		}
			    	} else {
			    		playerReturn = true;
			    	}
			    }
			    
			    if(playerReturns.length > 0) {
					parentMask = parentMask | this.getActiveScopeMask(3, 3, playerReturns);
			    }
			    
				//Get the active scope masks
				var activeScopeMasks = this.getActiveScopeMasks(3, 3, orMaskAll);
				
			    parentMask = parentMask | parentScopeMask;
				
			    //Takes care of team to game wide
			    //Takes care of player to game wide
			    if((parentMask & 8190) == 8190) {
			    	parentMask = 0xffffffff;
			    }
			    
			    parentMask = parentMask & this.andScopeMasks(activeScopeMasks);
			    
				//Set the new scopes
				stateList[i].setScope(parentMask & (~orMaskNeighbors), 3, 3);	
			}	
		}	
	}
	
	getActiveScopes(model) {
		var activeScopes = [];
		for(var i = 0; i < model.iconTabs.length; i++) {
			if(model.iconTabs[i].displayText != "") {
				activeScopes.push(model.iconTabs[i].scope);
			}
		}
		return activeScopes;
	}
	
	getActiveScopeMask(teamCount, playersPerTeam, activeScopes) {
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
	
	  getActiveScopeMasks(teamCount, playersPerTeam, activeMask) {
		    
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
	        for(var n = 1; n < teamCount + (teamCount * playersPerTeam) + 1; n++) {
	          if(!((n >= ((teamCount * i) + 1)) && (n < (teamCount * i) + 1 + playersPerTeam))) {
	            tempMask = this.setBit(tempMask, n);
	          }
	        }
	       scopeMasks.push(tempMask);
	      }
	    }
	    
	    //Check for player wide
	    for(var i = 1; i < teamCount + 1; i++) {
	      for(var n = 1; n < playersPerTeam + 1; n++) {
	        if(this.getBit(activeMask, (teamCount * i) + n) == 0x01) {
	          var tempMask = 0;
	          var found = false;
	          for(var j = 1; j < teamCount + (teamCount * playersPerTeam) + 1; j++) {
	            if(j != i) {
	              tempMask = this.setBit(tempMask, j);
	            } else {
	              found = true;
	            }
	          }
	          if(found) {
	            scopeMasks.push(tempMask);
	            break;
	          }
	        }
	      }
	    }
	    
	    return scopeMasks;
	}
	  
    andScopeMasks(activeScopeMasks) {
	    var returnScope = 0xffffffff;
	    for(var i = 0; i < activeScopeMasks.length; i++) {
	      returnScope = returnScope & activeScopeMasks[i];
	    }
	    return returnScope;
	}
	
	setBit(number, bitNumber) {
	    var tempBit = 1;
	    tempBit = tempBit << bitNumber;
	    return number | tempBit;
	}
	
	getBit(number, bitNumber) {
	    return (number >> bitNumber) & 1;
	}

}