var states = {
   debug_start : 0,
   debug_state_1 : 1,
};

var FSMGame = {

   gameInstanceId : 0,
   team : 0,
   player : 0,
   playerVM : null,

   running : true,
   state : states.debug_start,
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
         case states.debug_start:
            this.debug_start();
            break;
         case states.debug_state_1:
            this.debug_state_1();
            break;
      }
   },

   debug_start : function() {
      this.state = states.debug_state_1;
   },

   debug_state_1 : function() {
      this.playerVM.DisplayText("Debugging!");
   },

};

var SetGameVariables = function(gameInstanceId, team, player, playerVM) {
   FSMGame.gameInstanceId = gameInstanceId;
   FSMGame.team = team;
   FSMGame.player = player;
   FSMGame.playerVM = playerVM;
}


