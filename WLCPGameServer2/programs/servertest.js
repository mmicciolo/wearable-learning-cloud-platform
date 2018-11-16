var states = {
   servertest_start : 0,
   servertest_state_1 : 1,
   servertest_state_2 : 2,
};

var FSMGame = {

   gameInstanceId : 0,
   team : 0,
   player : 0,
   playerVM : null,

   running : true,
   state : states.servertest_start,
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
         case states.servertest_start:
            this.servertest_start();
            break;
         case states.servertest_state_1:
            this.servertest_state_1();
            break;
         case states.servertest_state_2:
            this.servertest_state_2();
            break;
      }
   },

   servertest_start : function() {
      this.state = states.servertest_state_1;
   },

   servertest_state_1 : function() {
      this.playerVM.DisplayText("Hello World!");
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.servertest_state_2, states.servertest_state_2, states.servertest_state_2, states.servertest_state_2]);
   },

   servertest_state_2 : function() {
      this.playerVM.DisplayText("It Works!");
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.servertest_state_1, states.servertest_state_1, states.servertest_state_1, states.servertest_state_1]);
   },

};

var SetGameVariables = function(gameInstanceId, team, player, playerVM) {
   FSMGame.gameInstanceId = gameInstanceId;
   FSMGame.team = team;
   FSMGame.player = player;
   FSMGame.playerVM = playerVM;
}


