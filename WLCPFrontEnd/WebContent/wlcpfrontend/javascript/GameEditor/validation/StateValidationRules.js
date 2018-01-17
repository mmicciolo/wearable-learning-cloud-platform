var StateScopeValidationRule = class StateScopeValidationRule extends ValidationRule {
	
	validate(state) {
		
		//Get the connection going to this state
		var connection = GameEditor.getJsPlumbInstance().getConnections({target : state.htmlId});
		
		//Get the connections stemming of the source of this states connection
		var allConnections = GameEditor.getJsPlumbInstance().getConnections({source : connection.sourceId});
		
		//Maintain a list of states the previous one is connected to
		var stateList = [];
		
		//Loop through all of these connections to get their active masks
		for(var i = 0; i < allConnections.length; i++) {
		
			//Find the state that the connection points to
			for(var n = 0; n < GameEditor.getEditorController().stateList.length; n++) {
				if(allConnections[i].targetId == GameEditor.getEditorController().stateList[n].htmlId) {
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
			
			//Get the neighbor active scope mask
			for(var n = 0; n < stateList.length; n++) {
				
				if(stateList[i].htmlId != stateList[n].htmlId) {
					
					//Get the active scopes
					var activeScopes = this.getActiveScopes(stateList[n].modelJSON);
					
					//Get the active scope mask
					var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
					
					orMaskNeighbors = orMaskNeighbors | activeScopeMask;
				}
			}
			
			//Get the active scope masks
			var activeScopeMasks = this.getActiveScopeMasks(3, 3, orMaskAll);

			//And all of the masks together to get our new scope mask
			var newScopeMask = this.andScopeMasks(activeScopeMasks);
			
			//Set the new scopes
			stateList[i].setScope(newScopeMask & (~orMaskNeighbors), 3, 3);			
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