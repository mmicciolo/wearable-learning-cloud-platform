var states = {
   stresstest2_start : 0,
   stresstest2_state_3 : 1,
   stresstest2_state_4 : 2,
};

var FSMGame = {

   gameInstanceId : 0,
   team : 0,
   player : 0,
   playerVM : null,

   running : true,
   state : states.stresstest2_start,
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
         case states.stresstest2_start:
            this.stresstest2_start();
            break;
         case states.stresstest2_state_3:
            this.stresstest2_state_3();
            break;
         case states.stresstest2_state_4:
            this.stresstest2_state_4();
            break;
      }
   },

   stresstest2_start : function() {
      this.state = states.stresstest2_state_3;
   },

   stresstest2_state_3 : function() {
      this.playerVM.DisplayText("State 1");
      this.state = states.stresstest2_state_4;
   },

   stresstest2_state_4 : function() {
      this.playerVM.DisplayText("State 2");
      this.state = states.stresstest2_state_3;
   },

};

var SetGameVariables = function(gameInstanceId, team, player, playerVM) {
   FSMGame.gameInstanceId = gameInstanceId;
   FSMGame.team = team;
   FSMGame.player = player;
   FSMGame.playerVM = playerVM;
}


