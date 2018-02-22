var StateScopeValidationRule = class StateScopeValidationRule extends ValidationRule {

	validate(state) {
		
		//Get the connections going to this state
		var connectionsToState = GameEditor.getJsPlumbInstance().getConnections({target : state.htmlId});
		
		//TODO: What if no connections?
		var newConnectionsToState = [];
		for(var i = 0; i < connectionsToState.length; i++) {
			for(var n = 0; n < GameEditor.getEditorController().connectionList.length; n++) {
				if(connectionsToState[i].id == GameEditor.getEditorController().connectionList[n].connectionId) {
					if(!GameEditor.getEditorController().connectionList[n].isLoopBack) {
						newConnectionsToState.push(connectionsToState[i]);
					}
				}
			}
		}
		connectionsToState = newConnectionsToState;
		
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
			
			var transList = [];
			
			//Loop through all of these connections to get their active masks
			for(var n = 0; n < neighborConnections.length; n++) {
			
				//Find the transition
				for(var j = 0; j < GameEditor.getEditorController().transitionList.length; j++) {
					if(neighborConnections[n].id == GameEditor.getEditorController().transitionList[j].connection.id) {
						if(neighborConnections[n].targetId != stateList[i].htmlId) {
							transList.push(GameEditor.getEditorController().transitionList[j]);
						}
					}
				}	
			}
			
			var transitionNeighborMask = 0;
			var someTransitionNeighborMask = 0;
			
			for(var n = 0; n < transList.length; n++) {
				//Get the active scopes
				var activeScopes = transList[n].validationRules[0].getActiveScopes(transList[n], transList);
				
				//Get the active scope mask
				var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
				
				transitionNeighborMask = transitionNeighborMask | activeScopeMask;
				
				//Get the active scopes
				activeScopes = transList[n].validationRules[0].getActiveScopes3(transList[n], transList);
				
				//Get the active scope mask
				activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
				
				var activeScopeMasks = this.getActiveScopeMasks(3, 3, activeScopeMask);
				
				someTransitionNeighborMask = someTransitionNeighborMask | this.andScopeMasks(activeScopeMasks);
				someTransitionNeighborMask = someTransitionNeighborMask & (~activeScopeMask);
				
				//someTransitionNeighborMask = someTransitionNeighborMask | activeScopeMask;
				
				//var activeScopeMasks = this.getActiveScopeMasks(3, 3, activeScopeMask);
				
				//someTransitionNeighborMask = someTransitionNeighborMask | this.andScopeMasks(activeScopeMasks);
			}
			
			//OR together all connections without transitions
			//OR together all connections with transitions
//			var nonTransitionMask = 0;
//			var transitionMask = 0;
//			var orMaskAll2 = 0;
//			var connectionsToState2 = GameEditor.getJsPlumbInstance().getConnections({target : stateList[i].htmlId});
//			var newConnectionsToState2 = [];
//			var connectedToStart = false;
//			for(var n = 0; n < connectionsToState2.length; n++) {
//				for(var j = 0; j < GameEditor.getEditorController().connectionList.length; j++) {
//					if(connectionsToState2[n].id == GameEditor.getEditorController().connectionList[j].connectionId) {
//						if(!GameEditor.getEditorController().connectionList[j].isLoopBack) {
//							newConnectionsToState2.push(connectionsToState2[n]);
//						}
//					}
//				}
//			}
//			connectionsToState2 = newConnectionsToState2;
//			for(var n = 0; n < connectionsToState2.length; n++) {
//				var found = false;
//				for(var j = 0; j < GameEditor.getEditorController().transitionList.length; j++) {
//					if(connectionsToState2[n].id == GameEditor.getEditorController().transitionList[j].connection.id) {
//						var activeScopes = GameEditor.getEditorController().transitionList[j].validationRules[0].getActiveScopes3(GameEditor.getEditorController().transitionList[j]);
//						var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
//						transitionMask = transitionMask | activeScopeMask;
//						found = true;
//					}
//				}
//				if(!found) {
//					for(var j = 0; j < GameEditor.getEditorController().stateList.length; j++) {
//						if(connectionsToState2[n].sourceId == GameEditor.getEditorController().stateList[j].htmlId && GameEditor.getEditorController().stateList[j].htmlId.includes("start")) {
//							connectedToStart = true;
//							for(var k = 0; k < neighborConnections.length; k++) {
//								for(var l = 0; l < GameEditor.getEditorController().transitionList.length; l++) {
//									if(neighborConnections[k].id == GameEditor.getEditorController().transitionList[l].connection.id) {
//										var activeScopes = GameEditor.getEditorController().transitionList[l].validationRules[0].getActiveScopes3(GameEditor.getEditorController().transitionList[l]);
//										var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
//										var activeScopeMasks = this.getActiveScopeMasks(3, 3, activeScopeMask);
//										nonTransitionMask = nonTransitionMask | this.andScopeMasks(activeScopeMasks);
//										//nonTransitionMask = nonTransitionMask | activeScopeMask;
//									}
//								}
//							}
//						} else if(connectionsToState2[n].sourceId == GameEditor.getEditorController().stateList[j].htmlId && !GameEditor.getEditorController().stateList[j].htmlId.includes("start")) {
//							//Get the active scopes
//							var activeScopes = this.getActiveScopes(GameEditor.getEditorController().stateList[j].modelJSON);
//							
//							//Get the active scope mask
//							var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
//							
//							nonTransitionMask = nonTransitionMask | activeScopeMask;
//						}
//					}
//				}
//			}
//			
//			var parentMask = 0;
			//parentMask = nonTransitionMask | transitionMask;
			
			
			var parentMask = 0;
			var nonTransitionMask = 0;
			var transitionMask = 0;
			
			//Get the connections going to our state and exclude loopbacks
			var connectionsToState2 = GameEditor.getJsPlumbInstance().getConnections({target : stateList[i].htmlId});
			var newConnectionsToState2 = [];
			var connectedToStart = false;
			for(var n = 0; n < connectionsToState2.length; n++) {
				for(var j = 0; j < GameEditor.getEditorController().connectionList.length; j++) {
					if(connectionsToState2[n].id == GameEditor.getEditorController().connectionList[j].connectionId) {
						if(!GameEditor.getEditorController().connectionList[j].isLoopBack) {
							newConnectionsToState2.push(connectionsToState2[n]);
						}
					}
				}
			}
			connectionsToState2 = newConnectionsToState2;
			

			//Get a list of connections without transitions
			var connectionsWithoutTransitions = [];
			
			//Get a list of connections with transitions
			var connectionsWithTransitions = [];
			
			for(var n = 0; n < connectionsToState2.length; n++) {
				var found = false;
				for(var j = 0; j < GameEditor.getEditorController().transitionList.length; j++) {
					if(connectionsToState2[n].id == GameEditor.getEditorController().transitionList[j].connection.id) {
						connectionsWithTransitions.push(connectionsToState2[n]);
						found = true;
					}
				}
				if(!found) {
					connectionsWithoutTransitions.push(connectionsToState2[n]);
				}
			}
			
			//If we have no transitions
			if(connectionsWithTransitions.length == 0) {
				//Loop through our parent states
				for(var n = 0; n < GameEditor.getEditorController().stateList.length; n++) {
					for(var j = 0; j < connectionsWithoutTransitions.length; j++) {
						if(connectionsWithoutTransitions[j].sourceId == GameEditor.getEditorController().stateList[n].htmlId && GameEditor.getEditorController().stateList[n].htmlId.includes("start")) {
							nonTransitionMask = 0xffffffff;
						} else if(connectionsWithoutTransitions[j].sourceId == GameEditor.getEditorController().stateList[n].htmlId && !GameEditor.getEditorController().stateList[n].htmlId.includes("start")) {
							//Get the active scopes
							var activeScopes = this.getActiveScopes(GameEditor.getEditorController().stateList[n].modelJSON);
							
							//Get the active scope mask
							var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
							
							nonTransitionMask = nonTransitionMask | activeScopeMask;
						}
					}
				}
			}
			
			//If we have all transitions
			if(connectionsWithoutTransitions.length == 0) {
				//Loop through our parent states
				for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
					for(var j = 0; j < connectionsWithTransitions.length; j++) {
						if(connectionsWithTransitions[j].id == GameEditor.getEditorController().transitionList[n].connection.id) {
							var activeScopes = GameEditor.getEditorController().transitionList[n].validationRules[0].getActiveScopes3(GameEditor.getEditorController().transitionList[n]);
							var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
							transitionMask = transitionMask | activeScopeMask;
						} 
					}
				}
			}
			
			var transitionMask2 = 0;
			//If we have transitions and non transitions
			if(connectionsWithTransitions.length > 0 && connectionsWithoutTransitions.length > 0) {
				//Loop through our parent states
				for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
					for(var j = 0; j < connectionsWithTransitions.length; j++) {
						if(connectionsWithTransitions[j].id == GameEditor.getEditorController().transitionList[n].connection.id) {
							var activeScopes = GameEditor.getEditorController().transitionList[n].validationRules[0].getActiveScopes3(GameEditor.getEditorController().transitionList[n]);
							var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
							transitionMask2 = transitionMask2 | activeScopeMask;
						} 
					}
				}
			}

			
			var transitionAbove = false;
			var allTransitions = false; 
			var transitionCount = 0;
			//var connection = GameEditor.getJsPlumbInstance().getConnections({target : stateList[i].htmlId});
			var connection = newConnectionsToState2;
			for(var n = 0; n < connection.length; n++) {
				for(var j = 0; j < GameEditor.getEditorController().transitionList.length; j++) {
					if(connection[n].id == GameEditor.getEditorController().transitionList[j].connection.id) {
						transitionAbove = true;
						transitionCount++;
					}
				}
			}
			
			if(transitionCount == connection.length) {
				allTransitions = true;
			}
			
			if(!transitionAbove && !allTransitions && transList.length == 0) {
				parentMask = nonTransitionMask;
			} else if (!transitionAbove && transList.length > 0) {
				parentMask = someTransitionNeighborMask;
			} else if(transitionAbove && !allTransitions) {
				parentMask = transitionMask2;
			} else if(allTransitions) {
				parentMask = transitionMask;
			}
			
			
			//else if (!transitionAbove && transList.length > 0) {
//				parentMask = nonTransitionMask & (~someTransitionNeighborMask);
//			} else if(transitionAbove && !allTransitions) {
//				parentMask = nonTransitionMask | transitionMask;
//			} else if(allTransitions) {
//				parentMask = transitionMask;
//			}
			
			//if(parentMask == 0) {
//			if(nonTransitionMask == 0 && !transitionAbove && connectedToStart) {
//				//Get the active scope masks
//				var activeScopeMasks = this.getActiveScopeMasks(3, 3, orMaskAll);
//
//				//And all of the masks together to get our new scope mask
//				var newScopeMask = this.andScopeMasks(activeScopeMasks);
//				
//				//Set the new scopes
//				stateList[i].setScope(newScopeMask & (~orMaskNeighbors), 3, 3);		
//			} else {
				
				//Check for game wide to game wide
				if(this.getBit(parentMask, 0) == 0x01) {
					parentMask = 0xffffffff;
				}
				
				var teamList = [];
				
				//Check for game wide to team (make sure it has team + players for that team)
				for(var team = 1; team < 3 + 1; team++) {
					if(this.getBit(parentMask, team) == 0x01) {
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
			    		if(!this.getBit(parentMask, (3 * team) + player) == 0x01) {
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
				
			    //Takes care of team to game wide
			    //Takes care of player to game wide
			    if((parentMask & 8190) == 8190) {
			    	parentMask = 0xffffffff;
			    }
			   
			    //if(!allTransitions) {
				    parentMask = parentMask & this.andScopeMasks(activeScopeMasks);
			    //}
			    
				if(!transitionAbove && !allTransitions && transList.length == 0)  {
					//Set the new scopes
					stateList[i].setScope(parentMask & (~orMaskNeighbors), 3, 3);	
				} else if (!transitionAbove && transList.length > 0) {
					stateList[i].setScope(parentMask & (~orMaskNeighbors), 3, 3);
				} else if(transitionAbove && !allTransitions) {
			    	//stateList[i].setScope(parentMask & (~transitionNeighborMask), 3, 3);
				} else if(allTransitions) { 
			    	stateList[i].setScope(parentMask & (~transitionNeighborMask), 3, 3);
				}
				
				//else if (!transitionAbove && transList.length > 0) {
//					stateList[i].setScope(parentMask & (~orMaskNeighbors), 3, 3);
//				} else if(transitionAbove && !allTransitions) {
//			    	stateList[i].setScope(parentMask & (~transitionNeighborMask), 3, 3);
//			    } else if(allTransitions) { 
//			    	stateList[i].setScope(parentMask & (~transitionNeighborMask), 3, 3);
//			    }
			}	
		//}	
	}
	
	validate3(state) {
		
		//Get the connections going to this state
		var connectionsToState = GameEditor.getJsPlumbInstance().getConnections({target : state.htmlId});
		
		//TODO: What if no connections?
		var newConnectionsToState = [];
		for(var i = 0; i < connectionsToState.length; i++) {
			for(var n = 0; n < GameEditor.getEditorController().connectionList.length; n++) {
				if(connectionsToState[i].id == GameEditor.getEditorController().connectionList[n].connectionId) {
					if(!GameEditor.getEditorController().connectionList[n].isLoopBack) {
						newConnectionsToState.push(connectionsToState[i]);
					}
				}
			}
		}
		connectionsToState = newConnectionsToState;
		
		if(connectionsToState.length == 0) { return; }
		
//		var loopBackConnections = [];
//		var newConnectionsToState = [];
//		this.checkForLoopBacks(state.htmlId, state.htmlId, loopBackConnections);
//		for(var i = 0; i < connectionsToState.length; i++) {
//			var contains = false;
//			for(var n = 0; n < loopBackConnections.length; n++) {
//				if(connectionsToState[i].id == loopBackConnections[n].id) {
//					contains = true
//				}
//			}
//			if(!contains) { newConnectionsToState.push(connectionsToState[i]); }
//		}
//		connectionsToState = newConnectionsToState;
//		
//		if(connectionsToState.length == 0) { return; }
		
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
			
			var transList = [];
			
			//Loop through all of these connections to get their active masks
			for(var n = 0; n < neighborConnections.length; n++) {
			
				//Find the transition
				for(var j = 0; j < GameEditor.getEditorController().transitionList.length; j++) {
					if(neighborConnections[n].id == GameEditor.getEditorController().transitionList[j].connection.id) {
						if(neighborConnections[n].targetId != stateList[i].htmlId) {
							transList.push(GameEditor.getEditorController().transitionList[j]);
						}
					}
				}	
			}
			
			var transitionNeighborMask = 0;
			var someTransitionNeighborMask = 0;
			
			for(var n = 0; n < transList.length; n++) {
				//Get the active scopes
				var activeScopes = transList[n].validationRules[0].getActiveScopes(transList[n], transList);
				
				//Get the active scope mask
				var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
				
				transitionNeighborMask = transitionNeighborMask | activeScopeMask;
				
				//Get the active scopes
				activeScopes = transList[n].validationRules[0].getActiveScopes3(transList[n], transList);
				
				//Get the active scope mask
				activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
				
				someTransitionNeighborMask = someTransitionNeighborMask | activeScopeMask;
				
				//var activeScopeMasks = this.getActiveScopeMasks(3, 3, activeScopeMask);
				
				//someTransitionNeighborMask = someTransitionNeighborMask | this.andScopeMasks(activeScopeMasks);
			}
			
			
			
//			var parentMask = 0;
//			//Get parent state active scope masks
//			for(var n = 0; n < connectionsToState.length; n++) {
//				for(var j = 0; j < GameEditor.getEditorController().stateList.length; j++) {
//					if(connectionsToState[n].sourceId == GameEditor.getEditorController().stateList[j].htmlId && !GameEditor.getEditorController().stateList[j].htmlId.includes("start")) {
//						//Get the active scopes
//						var activeScopes = this.getActiveScopes(GameEditor.getEditorController().stateList[j].modelJSON);
//						
//						//Get the active scope mask
//						var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
//						
//						parentMask = parentMask | activeScopeMask;
//					}
//				}
//			}
			
			//OR together all connections without transitions
			//OR together all connections with transitions
			var nonTransitionMask = 0;
			var transitionMask = 0;
			var orMaskAll2 = 0;
			var connectionsToState2 = GameEditor.getJsPlumbInstance().getConnections({target : stateList[i].htmlId});
			var newConnectionsToState2 = [];
			var connectedToStart = false;
			for(var n = 0; n < connectionsToState2.length; n++) {
				for(var j = 0; j < GameEditor.getEditorController().connectionList.length; j++) {
					if(connectionsToState2[n].id == GameEditor.getEditorController().connectionList[j].connectionId) {
						if(!GameEditor.getEditorController().connectionList[j].isLoopBack) {
							newConnectionsToState2.push(connectionsToState2[n]);
						}
					}
				}
			}
			connectionsToState2 = newConnectionsToState2;
			for(var n = 0; n < connectionsToState2.length; n++) {
				var found = false;
				for(var j = 0; j < GameEditor.getEditorController().transitionList.length; j++) {
					if(connectionsToState2[n].id == GameEditor.getEditorController().transitionList[j].connection.id) {
						var activeScopes = GameEditor.getEditorController().transitionList[j].validationRules[0].getActiveScopes3(GameEditor.getEditorController().transitionList[j]);
						var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
						transitionMask = transitionMask | activeScopeMask;
						found = true;
					}
				}
				if(!found) {
					for(var j = 0; j < GameEditor.getEditorController().stateList.length; j++) {
						if(connectionsToState2[n].sourceId == GameEditor.getEditorController().stateList[j].htmlId && GameEditor.getEditorController().stateList[j].htmlId.includes("start")) {
							connectedToStart = true;
							for(var k = 0; k < neighborConnections.length; k++) {
								for(var l = 0; l < GameEditor.getEditorController().transitionList.length; l++) {
									if(neighborConnections[k].id == GameEditor.getEditorController().transitionList[l].connection.id) {
										var activeScopes = GameEditor.getEditorController().transitionList[l].validationRules[0].getActiveScopes3(GameEditor.getEditorController().transitionList[l]);
										var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
										var activeScopeMasks = this.getActiveScopeMasks(3, 3, activeScopeMask);
										nonTransitionMask = nonTransitionMask | this.andScopeMasks(activeScopeMasks);
										//nonTransitionMask = nonTransitionMask | activeScopeMask;
									}
								}
							}
						} else if(connectionsToState2[n].sourceId == GameEditor.getEditorController().stateList[j].htmlId && !GameEditor.getEditorController().stateList[j].htmlId.includes("start")) {
							//Get the active scopes
							var activeScopes = this.getActiveScopes(GameEditor.getEditorController().stateList[j].modelJSON);
							
							//Get the active scope mask
							var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
							
							nonTransitionMask = nonTransitionMask | activeScopeMask;
						}
//						if(connectionsToState2[n].sourceId == GameEditor.getEditorController().stateList[j].htmlId && !GameEditor.getEditorController().stateList[j].htmlId.includes("start")) {
//							//Get the active scopes
//							var activeScopes = this.getActiveScopes(GameEditor.getEditorController().stateList[j].modelJSON);
//							
//							//Get the active scope mask
//							var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
//							
//							nonTransitionMask = nonTransitionMask | activeScopeMask;
//						}
					}
				}
			}
			
			var parentMask = 0;
			//parentMask = nonTransitionMask | transitionMask;
			
			//Check to see if we have a transition above us
		    var transitionAbove = false;
			for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
				var connection = GameEditor.getJsPlumbInstance().getConnections({target : stateList[i].htmlId});
				for(var j = 0; j < connection.length; j++) {
					if(connection[j].id == GameEditor.getEditorController().transitionList[n].connection.id) {
						transitionAbove = true;
					}
				}
				//if(connection[0].id == GameEditor.getEditorController().transitionList[n].connection.id) {
					//transitionAbove = true;
				//}
			}
			
			var transitionAbove = false;
			var allTransitions = false; 
			var transitionCount = 0;
			//var connection = GameEditor.getJsPlumbInstance().getConnections({target : stateList[i].htmlId});
			var connection = newConnectionsToState2;
			for(var n = 0; n < connection.length; n++) {
				for(var j = 0; j < GameEditor.getEditorController().transitionList.length; j++) {
					if(connection[n].id == GameEditor.getEditorController().transitionList[j].connection.id) {
						transitionAbove = true;
						transitionCount++;
					}
				}
			}
			
			if(transitionCount == connection.length) {
				allTransitions = true;
			}
			
			if(!transitionAbove && !allTransitions && transList.length == 0) {
				parentMask = nonTransitionMask;
			} else if (!transitionAbove && transList.length > 0) {
				parentMask = nonTransitionMask & (~someTransitionNeighborMask);
			} else if(transitionAbove && !allTransitions) {
				parentMask = nonTransitionMask | transitionMask;
			} else if(allTransitions) {
				parentMask = transitionMask;
			}
			
//			if(transitionAbove) {
//				parentMask = nonTransitionMask | transitionMask;
//				//parentMask = transitionMask;
//			} else {
//				var neighborTransMask = 0;
//				//Get neighbor transitions
//				for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
//					for(var j = 0; j < neighborConnections.length; j++) {
//						if(GameEditor.getEditorController().transitionList[n].connection.id == neighborConnections[j].id) {
//							var activeScopes = GameEditor.getEditorController().transitionList[n].validationRules[0].getActiveScopes3(GameEditor.getEditorController().transitionList[n]);
//							var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
//							neighborTransMask = neighborTransMask | activeScopeMask;
//						}
//					}
//				}
//				parentMask = nonTransitionMask & (~neighborTransMask);
//			}
			
			//if(parentMask == 0) {
			if(nonTransitionMask == 0 && !transitionAbove && connectedToStart) {
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
					if(this.getBit(parentMask, team) == 0x01) {
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
			    		if(!this.getBit(parentMask, (3 * team) + player) == 0x01) {
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
				
			    //Takes care of team to game wide
			    //Takes care of player to game wide
			    if((parentMask & 8190) == 8190) {
			    	parentMask = 0xffffffff;
			    }
			   
			    //if(!allTransitions) {
				    parentMask = parentMask & this.andScopeMasks(activeScopeMasks);
			    //}
			    
				if(!transitionAbove && !allTransitions && transList.length == 0)  {
					//Set the new scopes
					stateList[i].setScope(parentMask & (~orMaskNeighbors), 3, 3);	
				} else if (!transitionAbove && transList.length > 0) {
					stateList[i].setScope(parentMask & (~orMaskNeighbors), 3, 3);
				} else if(transitionAbove && !allTransitions) {
			    	stateList[i].setScope(parentMask & (~transitionNeighborMask), 3, 3);
			    } else if(allTransitions) { 
			    	stateList[i].setScope(parentMask & (~transitionNeighborMask), 3, 3);
			    }
			}	
		}	
	}
	
	validate2(state) {
		
		//Get the connections going to this state
		var connectionsToState = GameEditor.getJsPlumbInstance().getConnections({target : state.htmlId});
		
		//TODO: What if no connections?
		var newConnectionsToState = [];
		for(var i = 0; i < connectionsToState.length; i++) {
			for(var n = 0; n < GameEditor.getEditorController().connectionList.length; n++) {
				if(connectionsToState[i].id == GameEditor.getEditorController().connectionList[n].connectionId) {
					if(!GameEditor.getEditorController().connectionList[n].isLoopBack) {
						newConnectionsToState.push(connectionsToState[i]);
					}
				}
			}
		}
		connectionsToState = newConnectionsToState;
		
		if(connectionsToState.length == 0) { return; }
		
//		var loopBackConnections = [];
//		var newConnectionsToState = [];
//		this.checkForLoopBacks(state.htmlId, state.htmlId, loopBackConnections);
//		for(var i = 0; i < connectionsToState.length; i++) {
//			var contains = false;
//			for(var n = 0; n < loopBackConnections.length; n++) {
//				if(connectionsToState[i].id == loopBackConnections[n].id) {
//					contains = true
//				}
//			}
//			if(!contains) { newConnectionsToState.push(connectionsToState[i]); }
//		}
//		connectionsToState = newConnectionsToState;
//		
//		if(connectionsToState.length == 0) { return; }
		
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
			
			var parentMask = 0;
			//Get parent state active scope masks
			for(var n = 0; n < connectionsToState.length; n++) {
				for(var j = 0; j < GameEditor.getEditorController().stateList.length; j++) {
					if(connectionsToState[n].sourceId == GameEditor.getEditorController().stateList[j].htmlId && !GameEditor.getEditorController().stateList[j].htmlId.includes("start")) {
						//Get the active scopes
						var activeScopes = this.getActiveScopes(GameEditor.getEditorController().stateList[j].modelJSON);
						
						//Get the active scope mask
						var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
						
						parentMask = parentMask | activeScopeMask;
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
					if(this.getBit(parentMask, team) == 0x01) {
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
			    		if(!this.getBit(parentMask, (3 * team) + player) == 0x01) {
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
				
			    //Takes care of team to game wide
			    //Takes care of player to game wide
			    if((parentMask & 8190) == 8190) {
			    	parentMask = 0xffffffff;
			    }
			    
				
				//Check to see if we have a transition above us
			    var transitionAbove = false;
				for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
					var connection = GameEditor.getJsPlumbInstance().getConnections({target : stateList[i].htmlId});
					if(connection[0].id == GameEditor.getEditorController().transitionList[n].connection.id) {
						//parentMask = GameEditor.getEditorController().transitionList[n].scopeMask;
						//parentMask = parentMask & this.andScopeMasks(activeScopeMasks);
						var activeScopes = GameEditor.getEditorController().transitionList[n].validationRules[0].getActiveScopes3(GameEditor.getEditorController().transitionList[n]);
						var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
						//Check for game wide to game wide
						if(this.getBit(activeScopeMask, 0) == 0x01) {
							activeScopeMask = 0xffffffff;
						}
						
						var teamList = [];
						
						//Check for game wide to team (make sure it has team + players for that team)
						for(var team = 1; team < 3 + 1; team++) {
							if(this.getBit(activeScopeMask, team) == 0x01) {
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
							activeScopeMask = activeScopeMask | this.getActiveScopeMask(3, 3, l);
						}
					    
					    var playerReturn = true;
					    var playerReturns = [];
					    
					    //Check for player wide to team wide
					    for(var team = 1; team < 3 + 1; team++) {
					    	for(var player = 1; player < 3 + 1; player++) {
					    		if(!this.getBit(activeScopeMask, (3 * team) + player) == 0x01) {
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
					    	activeScopeMask = activeScopeMask | this.getActiveScopeMask(3, 3, playerReturns);
					    }
					    
						//Get the active scope masks
						var activeScopeMasks = this.getActiveScopeMasks(3, 3, orMaskAll);
						
					    //Takes care of team to game wide
					    //Takes care of player to game wide
					    if((activeScopeMask & 8190) == 8190) {
					    	activeScopeMask = 0xffffffff;
					    }
					    
						stateList[i].setScope(activeScopeMask & this.andScopeMasks(activeScopeMasks), 3, 3);
						transitionAbove = true;
					}
				}
				
				if(!transitionAbove) {
					
				    parentMask = parentMask & this.andScopeMasks(activeScopeMasks);
				    
					//Set the new scopes
					stateList[i].setScope(parentMask & (~orMaskNeighbors), 3, 3);	
				}
			}	
		}	
	}
	
	static checkForLoopBacks(stateId, nextState, returnConnections) {
		var connections = GameEditor.getJsPlumbInstance().getConnections({source : nextState});
		for(var i = 0; i < connections.length; i++) {
			if(connections[i].targetId == stateId) {
				returnConnections.push(connections[i]);
			} else {
				this.checkForLoopBacks(stateId, connections[i].targetId, returnConnections, false);
			}
		}
	}
	
	static getConnectionsBelow(stateId, nextState, returnConnections) {
		var connections = GameEditor.getJsPlumbInstance().getConnections({source : nextState});
		for(var i = 0; i < connections.length; i++) {
			returnConnections.push(connections[i]);
			this.checkForLoopBacks(stateId, connections[i].targetId, returnConnections);
		}
	}
	
//validate(state) {
//		
//		//Get the connections going to this state
//		var connectionsToState = GameEditor.getJsPlumbInstance().getConnections({target : state.htmlId});
//		
//		//TODO: What if no connections?
//		if(connectionsToState.length == 0) { return; }
//		
//		//Get the connections stemming of the source of this states connection
//		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({source : connectionsToState[0].sourceId});
//		
//		//Maintain a list of states the previous one is connected to
//		var stateList = [];
//		
//		//Loop through all of these connections to get their active masks
//		for(var i = 0; i < neighborConnections.length; i++) {
//		
//			//Find the state that the connection points to
//			for(var n = 0; n < GameEditor.getEditorController().stateList.length; n++) {
//				if(neighborConnections[i].targetId == GameEditor.getEditorController().stateList[n].htmlId) {
//					stateList.push(GameEditor.getEditorController().stateList[n]);
//				}
//			}	
//		}
//		
//		var orMaskAll = 0;
//		
//		//Loop through and or all active masks that have the same parent
//		for(var i = 0; i < stateList.length; i++) {
//			
//			//Get the active scopes
//			var activeScopes = this.getActiveScopes(stateList[i].modelJSON);
//			
//			//Get the active scope mask
//			var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
//			
//			orMaskAll = orMaskAll | activeScopeMask;
//		}
//		
//		//Loop through all of the states and apply their scope
//		for(var i = 0; i < stateList.length; i++) {
//			
//			var orMaskNeighbors = 0;
//			var orScopeMask = 0;
//			
//			//Get the neighbor active scope mask
//			for(var n = 0; n < stateList.length; n++) {
//				
//				if(stateList[i].htmlId != stateList[n].htmlId) {
//					
//					//Get the active scopes
//					var activeScopes = this.getActiveScopes(stateList[n].modelJSON);
//					
//					//Get the active scope mask
//					var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
//					
//					orMaskNeighbors = orMaskNeighbors | activeScopeMask;
//					
//					orScopeMask = orScopeMask | stateList[i].scopeMask;
//				}
//			}
//			
//			var parentMask = 0;
//			var parentScopeMask = 0;
//			//Get parent state active scope masks
//			for(var n = 0; n < connectionsToState.length; n++) {
//				for(var j = 0; j < GameEditor.getEditorController().stateList.length; j++) {
//					if(connectionsToState[n].sourceId == GameEditor.getEditorController().stateList[j].htmlId && !GameEditor.getEditorController().stateList[j].htmlId.includes("start")) {
//						//Get the active scopes
//						var activeScopes = this.getActiveScopes(GameEditor.getEditorController().stateList[j].modelJSON);
//						
//						//Get the active scope mask
//						var activeScopeMask = this.getActiveScopeMask(3, 3, activeScopes);
//						
//						parentMask = parentMask | activeScopeMask;
//						
//						parentScopeMask = parentScopeMask | GameEditor.getEditorController().stateList[j].scopeMask;
//					}
//				}
//			}
//			
//			if((parentMask | parentScopeMask) == 0) {
//				
//				//Get the active scope masks
//				var activeScopeMasks = this.getActiveScopeMasks(3, 3, orMaskAll);
//
//				//And all of the masks together to get our new scope mask
//				var newScopeMask = this.andScopeMasks(activeScopeMasks);
//				
//				//Set the new scopes
//				stateList[i].setScope(newScopeMask & (~orMaskNeighbors), 3, 3);		
//			} else {
//				
//				//Check for game wide to game wide
//				if(this.getBit(parentMask, 0) == 0x01) {
//					parentMask = 0xffffffff;
//				}
//				
//				var teamList = [];
//				
//				//Check for game wide to team (make sure it has team + players for that team)
//				for(var team = 1; team < 3 + 1; team++) {
//					if(this.getBit(parentMask | parentScopeMask, team) == 0x01) {
//						teamList.push("Team " + team);
//				      }
//				}
//				
//				if(teamList.length > 0) {
//					var l = [];
//					for(var g = 0; g < teamList.length; g++) {
//						for(var c = 1; c < 3 + 1; c++) {
//							l.push(teamList[g] + " Player " + c);
//						}
//					}
//					parentMask = parentMask | this.getActiveScopeMask(3, 3, l);
//				}
//			    
//			    var playerReturn = true;
//			    var playerReturns = [];
//			    
//			    //Check for player wide to team wide
//			    for(var team = 1; team < 3 + 1; team++) {
//			    	for(var player = 1; player < 3 + 1; player++) {
//			    		if(!this.getBit(parentMask | parentScopeMask, (3 * team) + player) == 0x01) {
//			    			playerReturn = false;
//		    	            break;
//			    	    }
//			    	}
//			    	if(playerReturn) {
//			    		playerReturns.push("Team " + team);
//			    		for(var player = 1; player < 3 + 1; player++) {
//			    			playerReturns.push("Team " + team + " Player " + player);
//			    		}
//			    	} else {
//			    		playerReturn = true;
//			    	}
//			    }
//			    
//			    if(playerReturns.length > 0) {
//					parentMask = parentMask | this.getActiveScopeMask(3, 3, playerReturns);
//			    }
//			    
//				//Get the active scope masks
//				var activeScopeMasks = this.getActiveScopeMasks(3, 3, orMaskAll);
//				
//			    parentMask = parentMask | parentScopeMask;
//				
//			    //Takes care of team to game wide
//			    //Takes care of player to game wide
//			    if((parentMask & 8190) == 8190) {
//			    	parentMask = 0xffffffff;
//			    }
//			    
//			    parentMask = parentMask & this.andScopeMasks(activeScopeMasks);
//			    
//				//Set the new scopes
//				stateList[i].setScope(parentMask & (~orMaskNeighbors), 3, 3);	
//			}	
//		}	
//	}
	
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