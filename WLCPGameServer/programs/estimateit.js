var states = {
   EstimateIt2_start : 0,
   EstimateIt2_state_22 : 1,
   EstimateIt2_state_23 : 2,
   EstimateIt2_state_24 : 3,
   EstimateIt2_state_25 : 4,
   EstimateIt2_state_26 : 5,
   EstimateIt2_state_27 : 6,
   EstimateIt2_state_28 : 7,
};

var FSMGame = {

   gameInstanceId : 0,
   team : 1,
   player : 0,

   state : states.EstimateIt2_start,
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
         case states.EstimateIt2_start:
            this.EstimateIt2_start();
            break;
         case states.EstimateIt2_state_22:
            this.EstimateIt2_state_22();
            break;
         case states.EstimateIt2_state_23:
            this.EstimateIt2_state_23();
            break;
         case states.EstimateIt2_state_24:
            this.EstimateIt2_state_24();
            break;
         case states.EstimateIt2_state_25:
            this.EstimateIt2_state_25();
            break;
         case states.EstimateIt2_state_26:
            this.EstimateIt2_state_26();
            break;
         case states.EstimateIt2_state_27:
            this.EstimateIt2_state_27();
            break;
         case states.EstimateIt2_state_28:
            this.EstimateIt2_state_28();
            break;
      }
   },

   EstimateIt2_start : function() {
      this.state = states.EstimateIt2_state_22;
   },

   EstimateIt2_state_22 : function() {
      DisplayText(this.team, this.player, "Welcome To Estimate it! Push a button to start.");
      this.state = SingleButtonPress(["1", "2", "3", "4"], [states.EstimateIt2_state_23, states.EstimateIt2_state_23, states.EstimateIt2_state_23, states.EstimateIt2_state_23]);
   },

   EstimateIt2_state_23 : function() {
      DisplayText(this.team, this.player, "Your job is to find shapes scattered in the game area. When you find the right shape, push the corresponding button. For instance, push red to continue.");
      this.state = SingleButtonPress(["1", "2", "3", "4"], [states.EstimateIt2_state_25, states.EstimateIt2_state_24, states.EstimateIt2_state_24, states.EstimateIt2_state_24]);
   },

   EstimateIt2_state_24 : function() {
      DisplayText(this.team, this.player, "That was not red! Push a button to try again!");
      this.state = SingleButtonPress(["1", "2", "3", "4"], [states.EstimateIt2_state_23, states.EstimateIt2_state_23, states.EstimateIt2_state_23, states.EstimateIt2_state_23]);
   },

   EstimateIt2_state_25 : function() {
      DisplayText(this.team, this.player, "Now push green.");
      this.state = SingleButtonPress(["1", "2", "3", "4"], [states.EstimateIt2_state_26, states.EstimateIt2_state_27, states.EstimateIt2_state_26, states.EstimateIt2_state_26]);
   },

   EstimateIt2_state_26 : function() {
      DisplayText(this.team, this.player, "No, that was not green, push a button to try again.");
      this.state = SingleButtonPress(["1", "2", "3", "4"], [states.EstimateIt2_state_25, states.EstimateIt2_state_25, states.EstimateIt2_state_25, states.EstimateIt2_state_25]);
   },

   EstimateIt2_state_27 : function() {
      DisplayText(this.team, this.player, "Each person in your team will look for a different object. Ready to Start? Push any button to continue.");
      if(this.team == 1) {
         this.state = SingleButtonPress(["1", "2", "3", "4"], [states.EstimateIt2_state_28, states.EstimateIt2_state_28, states.EstimateIt2_state_28, states.EstimateIt2_state_28]);
      }
   },

   EstimateIt2_state_28 : function() {
      if(this.team == 1) {
         DisplayText(this.team, this.player, "Find a cube with a face 5 long. Press the black button if you want a hint.");
      }
   },

}

var DisplayText = function(team, player, text) {
	var vmClass = Java.type("wlcp.gameserver.vm.VirtualMachine");
	vmClass.DisplayText(team, player, text);
}

var SingleButtonPress = function(buttons, transitions) {
	var vmClass = Java.type("wlcp.gameserver.vm.VirtualMachine");
	return vmClass.SingleButtonPress(buttons, transitions);
}