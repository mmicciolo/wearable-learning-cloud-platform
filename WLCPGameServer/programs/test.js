//var states = {
//	MyGame_start : 0,
//	MyGame_state_2 : 1,
//	MyGame_state_5 : 2,
//	MyGame_state_6 : 3,
//	MyGame_state_7 : 4
//};
//
//var FSMGame = {
//		
//	gameInstanceId : 0,
//	team : 0,
//	player : 0,
//	
//	state : states.MyGame_start,
//	oldState : null,
//		
//	start : function() {
//		while(true) {
//			if(this.state != this.oldState) {
//				this.oldState = this.state;
//				this.stateMachine(this.state);
//			}
//		}
//	},
//	
//	stateMachine : function(state) {
//		switch(state) {
//			case states.MyGame_start:
//				this.MyGame_start();
//				break;
//			case states.MyGame_state_2:
//				this.MyGame_state_2();
//				break;
//			case states.MyGame_state_5:
//				this.MyGame_state_5();
//				break;
//			case states.MyGame_state_6:
//				this.MyGame_state_6();
//				break;
//			case states.MyGame_state_7:
//				this.MyGame_state_7();
//				break;
//		}
//	},
//	
//	MyGame_start : function() {
//		this.state = states.MyGame_state_2;
//	},
//	
//	MyGame_state_2 : function() {
//		DisplayText(this.team, this.player, "Hello World!");
//		if(SingleButtonPress(1234)) {
//			this.state = states.MyGame_state_5;
//		}
//	},
//	
//	MyGame_state_5 : function() {
//		if(this.team == 0) {
//			DisplayText(this.team, this.player, "Hello Team 1!");
//		}
//		this.state = states.MyGame_state_6;
//	},
//	
//	MyGame_state_6 : function() {
//		if(this.team == 0 && this.player == 0) {
//			DisplayText(this.team, this.player, "Hello Team 1 Player 1!");
//		}
//		this.state = states.MyGame_state_7;
//	},
//	
//	MyGame_state_7 : function() {
//		if(this.team == 0) {
//			DisplayText(this.team, this.player, "Hello Team 1!");
//		} else if (this.team == 1) {
//			DisplayText(this.team, this.player, "Hello Team 2!");
//		} else if(this.team == 2) {
//			DisplayText(this.team, this.player, "Hello Team 3!");
//		}
//	}
//}

var states = {
   test_start : 0,
   test_state_1 : 1,
   test_state_2 : 2,
   test_state_3 : 3,
   test_state_4 : 4,
   test_state_5 : 5,
};

var FSMGame = {

   gameInstanceId : 0,
   team : 0,
   player : 0,

   state : states.test_start,
   oldState : null,

   start : function() {
      while(true) {
         if(this.state != this.oldState) {
            this.oldState = this.state;
            this.stateMachine(this.state);
         }
      }
   },

   stateMachine : function(state) {
      switch(state) {
         case states.test_start:
            this.test_start();
            break;
         case states.test_state_1:
            this.test_state_1();
            break;
         case states.test_state_2:
            this.test_state_2();
            break;
         case states.test_state_3:
            this.test_state_3();
            break;
         case states.test_state_4:
            this.test_state_4();
            break;
         case states.test_state_5:
            this.test_state_5();
            break;
      }
   },

   test_start : function() {
      this.state = states.test_state_1;
   },

   test_state_1 : function() {
      DisplayText(this.team, this.player, "Hello World!");
      if(this.team == 1) {
         if(SingleButtonPress(1234)) {
            this.state = states.test_state_2;
         }
      }
      if(this.team == 2) {
         if(SingleButtonPress(1234)) {
            this.state = states.test_state_3;
         }
      }
   },

   test_state_2 : function() {
      if(this.team == 1) {
         DisplayText(this.team, this.player, "Hello Team 1!");
      }
      if(this.team == 1) {
         if(SingleButtonPress(1234)) {
            this.state = states.test_state_4;
         }
      }
   },

   test_state_3 : function() {
      if(this.team == 2) {
         DisplayText(this.team, this.player, "Hello Team 2!");
      }
      if(this.team == 2) {
         if(SingleButtonPress(1234)) {
            this.state = states.test_state_5;
         }
      }
   },

   test_state_4 : function() {
      if(this.team == 1) {
         DisplayText(this.team, this.player, "Hello Again Team 1!");
      }
   },

   test_state_5 : function() {
      if(this.team == 2) {
         DisplayText(this.team, this.player, "Hello Again team 2!");
      }
   },

}

var DisplayText = function(team, player, text) {
	var vmClass = Java.type("wlcp.gameserver.vm.VirtualMachine");
	vmClass.DisplayText(team, player, text);
}

var SingleButtonPress = function(buttons) {
	var vmClass = Java.type("wlcp.gameserver.vm.VirtualMachine");
	return vmClass.SingleButtonPress(buttons);
}
