var states = {
   stresstest_start : 0,
   stresstest_state_1 : 1,
   stresstest_state_2 : 2,
};

var FSMGame = {

   gameInstanceId : 0,
   team : 0,
   player : 0,
   playerVM : null,

   running : true,
   state : states.stresstest_start,
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
         case states.stresstest_start:
            this.stresstest_start();
            break;
         case states.stresstest_state_1:
            this.stresstest_state_1();
            break;
         case states.stresstest_state_2:
            this.stresstest_state_2();
            break;
      }
   },

   stresstest_start : function() {
      this.state = states.stresstest_state_1;
   },

   stresstest_state_1 : function() {
      this.playerVM.DisplayText("Hello World!");
      this.state = states.stresstest_state_2;
   },

   stresstest_state_2 : function() {
      this.playerVM.DisplayText("Yo!");
      this.state = states.stresstest_state_1;
   },

};

var SetGameVariables = function(gameInstanceId, team, player, playerVM) {
   FSMGame.gameInstanceId = gameInstanceId;
   FSMGame.team = team;
   FSMGame.player = player;
   FSMGame.playerVM = playerVM;
}


