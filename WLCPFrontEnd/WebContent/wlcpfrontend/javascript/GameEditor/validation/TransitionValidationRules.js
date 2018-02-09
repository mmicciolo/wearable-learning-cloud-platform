var TransitionValidationRule = class TransitionValidationRule extends ValidationRule {
	
	validate(transition) {
		
		var transitionList = [];
		
		//Get a list of neighbor connections
		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({source : transition.connection.sourceId});
		
		//Loop through the neighbor connections
		for(var i = 0; i < neighborConnections.length; i++) {
			//if(neighborConnections[i].id != transition.connection.id) {
				for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
					if(neighborConnections[i].id == GameEditor.getEditorController().transitionList[n].connection.id) {
						transitionList.push(GameEditor.getEditorController().transitionList[n]);
					}
				}
			//}
		}
		
		//Loop through the transitions and apply their scope
		for(var i = 0; i < transitionList.length; i++) {
			
			var orMaskNeighbors = 0;
			
			//Get the neighbor active scope mask
			for(var n = 0; n < transitionList.length; n++) {
				
				if(transitionList[i].overlayId != transitionList[n].overlayId) {
					
					//Get the active scopes
					//var activeScopes = this.getActiveScopes(transitionList[n].modelJSON);
					var activeScopes = this.getActiveScopes3(transitionList[i], transitionList);
					
					//Get the active scope mask
					var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
					
					orMaskNeighbors = orMaskNeighbors | activeScopeMask;
				}
			}
			
			var parentState = null;
			var parentMask = 0;
			//var parentScopeMask = 0;
			
			//Get our parent state
			for(var j = 0; j < GameEditor.getEditorController().stateList.length; j++) {
				if(GameEditor.getEditorController().stateList[j].htmlId == transition.connection.sourceId) {
					parentState = GameEditor.getEditorController().stateList[j];
					break;
				}
			}
			
			//Set the scope based on the parent
			if(parentState != null) {
				if(parentState.htmlId.includes("start")) {
					parentMask = 0xffffffff;
				} else {
					//Get the active scopes
					var activeScopes = this.getActiveScopes2(parentState.modelJSON);
					
					//Get the active scope mask
					var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
					
					parentMask = activeScopeMask;
				}
			}
			
			transitionList[i].setScope(parentMask & (~orMaskNeighbors), 3, 3);	
		}
		
		
		
		
//		if(parentState != null) {
//			if(parentState.htmlId.includes("start")) {
//				parentScopeMask = 0xffffffff;
//			} else {
//				parentScopeMask = parentState.scopeMask;
//			}
//		}
//		
//		transition.setScope(parentScopeMask, 3, 3);

//		//Get the connections stemming of the source of this transitions connection
//		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({source : transition.connection.sourceId});
//		
//		//Maintain a list of states the previous one is connected to
//		var transitionList = [];
//		
//		//Loop through all of these connections to get their active masks
//		for(var i = 0; i < neighborConnections.length; i++) {
//			//Find the neighbor transitions
//			for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
//				
//			}	
//		}
		
		var i = 0;
	}
	
	getActiveScopes2(model) {
		var activeScopes = [];
		for(var i = 0; i < model.iconTabs.length; i++) {
			if(model.iconTabs[i].displayText != "") {
				activeScopes.push(model.iconTabs[i].scope);
			}
		}
		return activeScopes;
	}
	
	getActiveScopes(model) {
		var activeScopes = [];
		for(var i = 0; i < model.iconTabs.length; i++) {
			if(model.iconTabs[i].singlePress.button1 == true || model.iconTabs[i].singlePress.button2 == true || model.iconTabs[i].singlePress.button3 == true || model.iconTabs[i].singlePress.button4 == true) {
				activeScopes.push(model.iconTabs[i].scope);
			}
		}
		return activeScopes;
	}
	
	getActiveScopes3(transition, transitionList) {
		var activeScopes = [];
		for(var i = 0; i < transitionList.length; i++) {
			var buttonCount = 0;
			if(transition.overlayId != transitionList[i].overlayId) {
				for(var n = 0; n < transitionList[i].modelJSON.iconTabs.length; n++) {
					if(transitionList[i].modelJSON.iconTabs[n].singlePress.button1 == true) {
						buttonCount++;
						this.setButtonEnabled(transitionList[i], transitionList, transitionList[i].modelJSON.iconTabs[n].scope, 1, false);
					} else {
						this.setButtonEnabled(transitionList[i], transitionList, transitionList[i].modelJSON.iconTabs[n].scope, 1, true);
					}
					if(transitionList[i].modelJSON.iconTabs[n].singlePress.button2 == true) {
						buttonCount++;
						this.setButtonEnabled(transitionList[i], transitionList, transitionList[i].modelJSON.iconTabs[n].scope, 2, false);
					} else {
						this.setButtonEnabled(transitionList[i], transitionList, transitionList[i].modelJSON.iconTabs[n].scope, 2, true);
					}
					if(transitionList[i].modelJSON.iconTabs[n].singlePress.button3 == true) {
						buttonCount++;
						this.setButtonEnabled(transitionList[i], transitionList, transitionList[i].modelJSON.iconTabs[n].scope, 3, false);
					} else {
						this.setButtonEnabled(transitionList[i], transitionList, transitionList[i].modelJSON.iconTabs[n].scope, 3, true);
					}
					if(transitionList[i].modelJSON.iconTabs[n].singlePress.button4 == true) {
						buttonCount++;
						this.setButtonEnabled(transitionList[i], transitionList, transitionList[i].modelJSON.iconTabs[n].scope, 4, false);
					} else {
						this.setButtonEnabled(transitionList[i], transitionList, transitionList[i].modelJSON.iconTabs[n].scope, 4, true);
					}
					if(buttonCount > 3) {
						activeScopes.push(transitionList[i].modelJSON.iconTabs[n].scope);
						break;
					}
				}
			}
		}
		return activeScopes;
	}
	
	setButtonEnabled(transition, transitionList, scope, button, enabled) {
		for(var i = 0; i < transitionList.length; i++) {
			if(transition.overlayId != transitionList[i].overlayId) {
				for(var n = 0; n < transitionList[i].modelJSON.iconTabs.length; n++) {
					if(transitionList[i].modelJSON.iconTabs[n].scope == scope) {
						if(button == 1) {
							transitionList[i].modelJSON.iconTabs[n].singlePress.button1Enabled = enabled;
						}
						if(button == 2) {
							transitionList[i].modelJSON.iconTabs[n].singlePress.button2Enabled = enabled;
						}
						if(button == 3) {
							transitionList[i].modelJSON.iconTabs[n].singlePress.button3Enabled = enabled;
						}
						if(button == 4) {
							transitionList[i].modelJSON.iconTabs[n].singlePress.button4Enabled = enabled;
						}
						transitionList[i].model.setData(transitionList[i].modelJSON);
					}
				}
			}
		}
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