var states = {
   stresstest1_start : 0,
   stresstest1_state_1 : 1,
   stresstest1_state_2 : 2,
};

var FSMGame = {

   gameInstanceId : 0,
   team : 0,
   player : 0,
   playerVM : null,

   running : true,
   state : states.stresstest1_start,
   oldState : null,

   start : function() {
      while(this.running) {
         if(this.state != this.oldState) {
            this.oldState = this.state;
            this.stateMachine(this.state);
         }
      }
   },

   stateMachine : function(state) {
      switch(state) {
         case states.stresstest1_start:
            this.stresstest1_start();
            break;
         case states.stresstest1_state_1:
            this.stresstest1_state_1();
            break;
         case states.stresstest1_state_2:
            this.stresstest1_state_2();
            break;
      }
   },

   stresstest1_start : function() {
      this.state = states.stresstest1_state_1;
   },

   stresstest1_state_1 : function() {
      this.playerVM.DisplayText("Hello World!");
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.stresstest1_state_2, states.stresstest1_state_2, states.stresstest1_state_2, states.stresstest1_state_2]);
   },

   stresstest1_state_2 : function() {
      this.playerVM.DisplayText("Yo!");
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.stresstest1_state_1, states.stresstest1_state_1, states.stresstest1_state_1, states.stresstest1_state_1]);
   },

};

var SetGameVariables = function(gameInstanceId, team, player, playerVM) {
   FSMGame.gameInstanceId = gameInstanceId;
   FSMGame.team = team;
   FSMGame.player = player;
   FSMGame.playerVM = playerVM;
}


