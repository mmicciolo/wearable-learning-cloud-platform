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
					var activeScopes = this.getActiveScopes(transitionList[i], transitionList);
					
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
		
		//Loop through all of the transitions
		for(var i = 0; i < transitionList.length; i++) {
			
			var scopeCollection = [];
			for(var n = 0; n < transitionList.length; n++) {
				if(transitionList[i].overlayId != transitionList[n].overlayId) {
					for(var j = 0; j < transitionList[n].modelJSON.iconTabs.length; j++) {
						scopeCollection.push({transition : transitionList[n], model : transitionList[n].modelJSON.iconTabs[j]});
					}
				}
			}

			for(var button = 0; button < 4; button++) {
				for(var n = 0; n < scopeCollection.length; n++) {
					var selected = false;
					for(var j = 0; j < scopeCollection.length; j++) {
						if(scopeCollection[n].model.scope == scopeCollection[j].model.scope) {
							if(scopeCollection[j].model.singlePress[button].selected) {
								selected = true;
							}
						}
					}
					var trans = this.getTab(transitionList[i], scopeCollection[n].model.scope);
					if(trans != null) {
						trans.singlePress[button].enabled = !selected;
						this.setScopeData(transitionList[i], trans);
					}
				}
			}
		}
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
	
	getActiveScopes(transition, transitionList) {
		var scopeCollection = [];
		var activeScopes = [];
		for(var i = 0; i < transitionList.length; i++) {
			if(transition.overlayId != transitionList[i].overlayId) {
				for(var n = 0; n < transitionList[i].modelJSON.iconTabs.length; n++) {
					scopeCollection.push({transition : transitionList[i], model : transitionList[i].modelJSON.iconTabs[n]});
				}
			}
		}
		for(var i = 0; i < scopeCollection.length; i++) {
			var buttonsChecked = 0;
			for(var n = 0; n < scopeCollection.length; n++) {
				if((scopeCollection[i].model.scope == scopeCollection[n].model.scope) && !activeScopes.includes(scopeCollection[i].model.scope)) {
					for(var button = 0; button < 4; button++) {
						if(scopeCollection[n].model.singlePress[button].selected) {buttonsChecked++;}
					}
				}
			}
			if(buttonsChecked == 4) { 
				activeScopes.push(scopeCollection[i].model.scope); 
			}
		}
		
		return activeScopes;
	}
	
	setScopeData(transition, model) {
		for(var i = 0; i < transition.modelJSON.iconTabs.length; i++) {
			if(transition.modelJSON.iconTabs[i].scope == model.scope) {
				transition.modelJSON.iconTabs[i] = model;
				transition.model.setData(transition.modelJSON);
				break;
			}
		}
	}
	
	getTab(transition, scope) {
		for(var i = 0; i < transition.modelJSON.iconTabs.length; i++) {
			if(transition.modelJSON.iconTabs[i].scope == scope) {
				return transition.modelJSON.iconTabs[i];
			}
		}
		return null;
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