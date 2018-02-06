var states = {
   servertest2_start : 0,
   servertest2_state_3 : 1,
   servertest2_state_4 : 2,
};

var FSMGame = {

   gameInstanceId : 0,
   team : 0,
   player : 0,
   playerVM : null,

   running : true,
   state : states.servertest2_start,
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
         case states.servertest2_start:
            this.servertest2_start();
            break;
         case states.servertest2_state_3:
            this.servertest2_state_3();
            break;
         case states.servertest2_state_4:
            this.servertest2_state_4();
            break;
      }
   },

   servertest2_start : function() {
      this.state = states.servertest2_state_3;
   },

   servertest2_state_3 : function() {
      this.playerVM.DisplayText("State 1!");
      this.state = states.servertest2_state_4;
   },

   servertest2_state_4 : function() {
      this.playerVM.DisplayText("State 2!");
      this.state = states.servertest2_state_3;
   },

};

var SetGameVariables = function(gameInstanceId, team, player, playerVM) {
   FSMGame.gameInstanceId = gameInstanceId;
   FSMGame.team = team;
   FSMGame.player = player;
   FSMGame.playerVM = playerVM;
}


