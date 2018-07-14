var TransitionValidationRule = class TransitionValidationRule extends ValidationRule {
	
	validate(transition) {
		
		var transitionList = [];
		
		//Get a list of neighbor connections
		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({source : transition.connection.sourceId});
		
		//Loop through the neighbor connections
		for(var i = 0; i < neighborConnections.length; i++) {
			for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
				if(neighborConnections[i].id == GameEditor.getEditorController().transitionList[n].connection.id) {
					transitionList.push(GameEditor.getEditorController().transitionList[n]);
				}
			}
		}
		
		var orMaskAll = 0;
		
		//Loop through and or all active masks that have the same parent
		for(var i = 0; i < transitionList.length; i++) {
			
			//Get the active scopes
			var activeScopes = this.getActiveScopes3(transitionList[i]);
			
			//Get the active scope mask
			var activeScopeMask = this.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
			
			orMaskAll = orMaskAll | activeScopeMask;
		}
		
		//Loop through the transitions and apply their scope
		for(var i = 0; i < transitionList.length; i++) {
			
			var orMaskNeighbors = 0;
			
			//Get the neighbor active scope mask
			//for(var n = 0; n < transitionList.length; n++) {
				
				//if(transitionList[i].overlayId != transitionList[n].overlayId) {
					
					//Get the active scopes
					var activeScopes = this.getActiveScopes(transitionList[i], transitionList);
					
					//Get the active scope mask
					var activeScopeMask = this.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
					
					orMaskNeighbors = orMaskNeighbors | activeScopeMask;
				//}
			//}
			
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
					var activeScopeMask = this.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
					
					parentMask = activeScopeMask;
				}
			}
			
			//Check for game wide to game wide
			if(this.getBit(parentMask, 0) == 0x01) {
				parentMask = 0xffffffff;
			}
			
			var teamList = [];
			
			//Check for game wide to team (make sure it has team + players for that team)
			for(var team = 1; team < GameEditor.getEditorController().gameModel.TeamCount + 1; team++) {
				if(this.getBit(parentMask, team) == 0x01) {
					teamList.push("Team " + team);
			      }
			}
			
			if(teamList.length > 0) {
				var l = [];
				for(var g = 0; g < teamList.length; g++) {
					for(var c = 1; c < GameEditor.getEditorController().gameModel.PlayersPerTeam + 1; c++) {
						l.push(teamList[g] + " Player " + c);
					}
				}
				parentMask = parentMask | this.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, l);
			}
			
			var playerReturn = true;
		    var playerReturns = [];
		    
		    var team = 1;
			var player = 1;
			var count = 1;
			for(var n = 0; n < (GameEditor.getEditorController().gameModel.TeamCount * GameEditor.getEditorController().gameModel.PlayersPerTeam); n++) {
				if(!this.getBit(parentMask, n + GameEditor.getEditorController().gameModel.TeamCount + 1) == 0x01) {
	    			//playerReturn2 = false;
//    	            break;
	    	    } else {
	    	    	count++;
	    	    }
				if(count == GameEditor.getEditorController().gameModel.PlayersPerTeam + 1) {
					playerReturns.push("Team " + team);
		    		for(var player = 1; player < GameEditor.getEditorController().gameModel.PlayersPerTeam + 1; player++) {
		    			playerReturns.push("Team " + team + " Player " + player);
		    		}
				}
//			    if(playerReturn2) {
//		    		playerReturns2.push("Team " + team);
//		    		for(var player = 1; player < GameEditor.getEditorController().gameModel.PlayersPerTeam + 1; player++) {
//		    			playerReturns2.push("Team " + team + " Player " + player);
//		    		}
//		    	} else {
//		    		playerReturn2 = true;
//		    	}
				if((n + 1) % GameEditor.getEditorController().gameModel.PlayersPerTeam == 0 && GameEditor.getEditorController().gameModel.TeamCount != 1 || GameEditor.getEditorController().gameModel.PlayersPerTeam == 1) { team ++; player = 1; count = 1; } else { player++; }
			}
		    	    
		    if(playerReturns.length > 0) {
				parentMask = parentMask | this.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, playerReturns);
		    }
		    
//		    var playerReturn = true;
//		    var playerReturns = [];
//		    
//		    //Check for player wide to team wide
//		    for(var team = 1; team < GameEditor.getEditorController().gameModel.TeamCount + 1; team++) {
//		    	for(var player = 1; player < GameEditor.getEditorController().gameModel.PlayersPerTeam + 1; player++) {
//		    		if(!this.getBit(parentMask, (GameEditor.getEditorController().gameModel.PlayersPerTeam * team) + player) == 0x01) {
//		    			playerReturn = false;
//	    	            break;
//		    	    }
//		    	}
//		    	if(playerReturn) {
//		    		playerReturns.push("Team " + team);
//		    		for(var player = 1; player < GameEditor.getEditorController().gameModel.PlayersPerTeam + 1; player++) {
//		    			playerReturns.push("Team " + team + " Player " + player);
//		    		}
//		    	} else {
//		    		playerReturn = true;
//		    	}
//		    }
//		    
//		    if(playerReturns.length > 0) {
//				parentMask = parentMask | this.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, playerReturns);
//		    }
		  
			//Get the active scope masks
			var activeScopeMasks = this.getActiveScopeMasks(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, orMaskAll);
			
			var toGameWideMask = 0;
			for(var n = 1; n < GameEditor.getEditorController().gameModel.TeamCount + (GameEditor.getEditorController().gameModel.TeamCount * GameEditor.getEditorController().gameModel.PlayersPerTeam) + 1; n++) {
				toGameWideMask = this.setBit(toGameWideMask, n);
			}
			
		    //Takes care of team to game wide
		    //Takes care of player to game wide
		    if((parentMask & toGameWideMask) == toGameWideMask) {
		    	parentMask = 0xffffffff;
		    }
			
		    //Takes care of team to game wide
		    //Takes care of player to game wide
//		    if((parentMask & 8190) == 8190) {
//		    	parentMask = 0xffffffff;
//		    }

			//Get the active scope masks
			var activeScopeMasks = this.getActiveScopeMasks(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, orMaskAll);

			//And all of the masks together to get our new scope mask
			parentMask = parentMask & this.andScopeMasks(activeScopeMasks);
			
			transitionList[i].setScope(parentMask & (~orMaskNeighbors), GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam);	
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
			
			if(scopeCollection.length == 0 ) {
				for(var j = 0; j < transitionList[0].modelJSON.iconTabs.length; j++) {
					var trans = this.getTab(transitionList[0], transitionList[0].modelJSON.iconTabs[j].scope);
					for(var button = 0; button < 4; button++) {
						trans.singlePress[button].enabled = true;
					}
					this.setScopeData(transitionList[0], trans);
				}
			}
		}
	}
	
	getActiveScopes3(transition) {
		var activeScopes = [];
		for(var i = 0; i < transition.modelJSON.iconTabs.length; i++) {
			if(transition.modelJSON.iconTabs[i].singlePress[0].selected || transition.modelJSON.iconTabs[i].singlePress[1].selected || 
		       transition.modelJSON.iconTabs[i].singlePress[2].selected || transition.modelJSON.iconTabs[i].singlePress[3].selected) {
				activeScopes.push(transition.modelJSON.iconTabs[i].scope);
			} else if(transition.modelJSON.iconTabs[i].sequencePress.length > 0) {
				activeScopes.push(transition.modelJSON.iconTabs[i].scope);
			} else if(transition.modelJSON.iconTabs[i].keyboardField.length > 0) {
				activeScopes.push(transition.modelJSON.iconTabs[i].scope);
			} //else if(transition.modelJSON.iconTabs[i].sequencePress.length == 0) {
//				var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({source : transition.connection.sourceId});
//				var neighborTransitions = [];
//				for(var n = 0; n < neighborConnections.length; n++) {
//					for(var j = 0; j < GameEditor.getEditorController().transitionList.length; j++) {
//						if(GameEditor.getEditorController().transitionList[j].connection.id == neighborConnections[n].id && GameEditor.getEditorController().transitionList[j].overlayId != transition.overlayId) {
//							neighborTransitions.push(GameEditor.getEditorController().transitionList[j]);
//						}
//					}
//				}
//				var lengthZero = false;
//				for(var n = 0; n < neighborTransitions.length; n++) {
//					for(var j = 0; j < neighborTransitions[n].modelJSON.iconTabs.length; j++) {
//						if(neighborTransitions[n].modelJSON.iconTabs[j].sequencePress.length == 0) {
//							lengthZero = true;
//						}
//					}
//				}
//				if(!lengthZero) {
//					activeScopes.push(transition.modelJSON.iconTabs[i].scope);
//				}
//			}
		}
		return activeScopes;
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
//	        var tempMask = 0;
//	        for(var n = 1; n < teamCount + (teamCount * playersPerTeam) + 1; n++) {
//	          if(!((n >= ((teamCount * i) + 1)) && (n < (teamCount * i) + 1 + playersPerTeam))) {
//	            tempMask = this.setBit(tempMask, n);
//	          }
//	        }
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
		          //team++;
		          //break;
		        }
			}
			//if((i + 1) % teamCount == 0 && teamCount != 1 || playersPerTeam == 1) { team++; player = 1;} else { player++; }
			if((i + 1) % playersPerTeam == 0 && teamCount != 1 || playersPerTeam == 1) { team ++; player = 1; } else { player++; }
		}
//	    for(var i = 1; i < teamCount + 1; i++) {
//	      for(var n = 1; n < playersPerTeam + 1; n++) {
//	        if(this.getBit(activeMask, (teamCount * i) + n) == 0x01) {
//	          var tempMask = 0;
//	          var found = false;
//	          for(var j = 1; j < teamCount + (teamCount * playersPerTeam) + 1; j++) {
//	            if(j != i) {
//	              tempMask = this.setBit(tempMask, j);
//	            } else {
//	              found = true;
//	            }
//	          }
//	          if(found) {
//	            scopeMasks.push(tempMask);
//	            break;
//	          }
//	        }
//	      }
//	    }
	    
	    return scopeMasks;
	}
	
//	getActiveScopeMasks(teamCount, playersPerTeam, activeMask) {
//		    
//	    var scopeMasks = [];
//	    
//	    //Check for game wide
//	    if(this.getBit(activeMask, 0)) {
//	      scopeMasks.push(0x01);
//	    }
//	    
//	    var teamReturn = true;
//	    
//	    //Check for team wide 
//	    for(var i = 1; i < teamCount + 1; i++) {
//	      if(this.getBit(activeMask, i) == 0x01) {
//	        var tempMask = 0;
//	        for(var n = 1; n < teamCount + (teamCount * playersPerTeam) + 1; n++) {
//	          if(!((n >= ((teamCount * i) + 1)) && (n < (teamCount * i) + 1 + playersPerTeam))) {
//	            tempMask = this.setBit(tempMask, n);
//	          }
//	        }
//	       scopeMasks.push(tempMask);
//	      }
//	    }
//	    
//	    //Check for player wide
//	    for(var i = 1; i < teamCount + 1; i++) {
//	      for(var n = 1; n < playersPerTeam + 1; n++) {
//	        if(this.getBit(activeMask, (teamCount * i) + n) == 0x01) {
//	          var tempMask = 0;
//	          var found = false;
//	          for(var j = 1; j < teamCount + (teamCount * playersPerTeam) + 1; j++) {
//	            if(j != i) {
//	              tempMask = this.setBit(tempMask, j);
//	            } else {
//	              found = true;
//	            }
//	          }
//	          if(found) {
//	            scopeMasks.push(tempMask);
//	            break;
//	          }
//	        }
//	      }
//	    }
//	    
//	    return scopeMasks;
//	}
	  
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

var TransitionSequenceButtonPressValidationRule = class TransitionSequenceButtonPressValidationRule extends ValidationRule {
	
	validate(transition, sequence, scope) {
		
		var transitionList = [];
		
		//Get a list of neighbor connections
		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({source : transition.connection.sourceId});
		
		//Loop through the neighbor connections
		for(var i = 0; i < neighborConnections.length; i++) {
			for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
				if(neighborConnections[i].id == GameEditor.getEditorController().transitionList[n].connection.id) {
					transitionList.push(GameEditor.getEditorController().transitionList[n]);
				}
			}
		}
		
		//Loop through the transition list
		for(var i = 0; i < transitionList.length; i++) {
			for(var n = 0; n < transitionList[i].modelJSON.iconTabs.length; n++) {
				if(scope == transitionList[i].modelJSON.iconTabs[n].scope) {
					if(this.containsSequence(sequence, transitionList[i].modelJSON.iconTabs[n].sequencePress)) {
						return false;
					}
				}
			}
		}
		
		return true;	
	}
	
	containsSequence(sequence, sequences) {
		for(var i = 0; i < sequences.length; i++) {
			if(sequences[i].buttons.length == sequence.buttons.length) {
				var equal = true;
				for(var n = 0; n < sequence.buttons.length; n++) {
					if(sequences[i].buttons[n].number != sequence.buttons[n].number) {
						equal = false;
						break;
					}
				}
				if(equal) {
					return true;
				}
			}
		}
		return false;
	}
}

var TransitionKeyboardInputValidationRule = class TransitionKeyboardInputValidationRule extends ValidationRule {
	
	validate(transition, keyboardInput, scope) {
		
		var transitionList = [];
		
		//Get a list of neighbor connections
		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({source : transition.connection.sourceId});
		
		//Loop through the neighbor connections
		for(var i = 0; i < neighborConnections.length; i++) {
			for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
				if(neighborConnections[i].id == GameEditor.getEditorController().transitionList[n].connection.id) {
					transitionList.push(GameEditor.getEditorController().transitionList[n]);
				}
			}
		}
		
		//Loop through the transition list
		for(var i = 0; i < transitionList.length; i++) {
			for(var n = 0; n < transitionList[i].modelJSON.iconTabs.length; n++) {
				if(scope == transitionList[i].modelJSON.iconTabs[n].scope) {
					if(this.containsKeyboardInput(keyboardInput, transitionList[i].modelJSON.iconTabs[n].keyboardField)) {
						return false;
					}
				}
			}
		}
		
		return true;
	}
	
	containsKeyboardInput(keyboardInput, keyboardField) {
		for(var i = 0; i < keyboardField.length; i++) {
			if(keyboardField[i].value == keyboardInput) {
				return true;
			}
		}
		return false;
	}
}

var TransitionSelectedTypeValidationRule = class TransitionSelectedTypeValidationRule extends ValidationRule {
	
	validate(transition) {
		
		var transitionList = [];
		
		//Get a list of neighbor connections
		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({source : transition.connection.sourceId});
		
		//Loop through the neighbor connections
		for(var i = 0; i < neighborConnections.length; i++) {
			for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
				if(neighborConnections[i].id == GameEditor.getEditorController().transitionList[n].connection.id) {
					transitionList.push(GameEditor.getEditorController().transitionList[n]);
				}
			}
		}
		
		//Loop through the transition list
		for(var i = 0; i < transitionList.length; i++) {
			var scopes = transitionList[i].modelJSON.iconTabs;
			for(var n = 0; n < scopes.length; n++) {
				var activeList = [];
				for(var j = 0; j < transitionList.length; j++) {
					for(var k = 0; k < transitionList[j].modelJSON.iconTabs.length; k++) {
						if(scopes[n].scope == transitionList[j].modelJSON.iconTabs[k].scope) {
							activeList.push(this.getActiveTransitionType(transitionList[j], scopes[n].scope));
						}
					}
				}
				for(var j = 0; j < transitionList.length; j++) {
					for(var k = 0; k < transitionList[j].modelJSON.iconTabs.length; k++) {
						var transitionTypes = transitionList[j].modelJSON.iconTabs[k].transitionTypes;
						if(scopes[n].scope == transitionList[j].modelJSON.iconTabs[k].scope) {
							for(var l = 0; l < transitionTypes.length; l++) {
								if(activeList.includes("") && !activeList.includes("Single Button Press") && !activeList.includes("Sequence Button Press") && !activeList.includes("Keyboard Input")) {
									transitionTypes[l].visible = true;
								} else if(activeList.includes(transitionTypes[l].title)) {
									transitionTypes[l].visible = true;
									transitionList[j].modelJSON.iconTabs[k].activeTransition = transitionTypes[l].title;
								} else {
									transitionTypes[l].visible = false;
								}
							}
							transitionList[j].model.setData(transitionList[j].modelJSON);
						}
					}
				}
			}
		}
	}
	
	getActiveTransitionType(transition, scope) {
		for(var i = 0; i < transition.modelJSON.iconTabs.length; i++) {
			if(transition.modelJSON.iconTabs[i].scope == scope) {
				if(transition.modelJSON.iconTabs[i].singlePress[0].selected || transition.modelJSON.iconTabs[i].singlePress[1].selected || 
				    transition.modelJSON.iconTabs[i].singlePress[2].selected || transition.modelJSON.iconTabs[i].singlePress[3].selected) {
					return "Single Button Press";
				} else if(transition.modelJSON.iconTabs[i].sequencePress.length > 0) {
					return "Sequence Button Press";
				} else if(transition.modelJSON.iconTabs[i].keyboardField.length > 0) {
					return "Keyboard Input";
				}
			}
		}
		return "";
	}
}