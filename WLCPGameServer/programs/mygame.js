var states = {
   mygame_start : 0,
   mygame_state_1 : 1,
   mygame_state_3 : 2,
   mygame_state_4 : 3,
};

var FSMGame = {

   gameInstanceId : 0,
   team : 0,
   player : 0,
   playerVM : null,

   running : true,
   state : states.mygame_start,
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
         case states.mygame_start:
            this.mygame_start();
            break;
         case states.mygame_state_1:
            this.mygame_state_1();
            break;
         case states.mygame_state_3:
            this.mygame_state_3();
            break;
         case states.mygame_state_4:
            this.mygame_state_4();
            break;
      }
   },

   mygame_start : function() {
      this.state = states.mygame_state_1;
   },

   mygame_state_1 : function() {
      this.playerVM.DisplayText("Press Red!");
      this.state = this.playerVM.SingleButtonPress(["1"], [states.mygame_state_3]);
   },

   mygame_state_3 : function() {
      this.playerVM.DisplayText("Red Sequence.");
      this.state = this.playerVM.SequenceButtonPress(["1"], [states.mygame_state_4]);
   },

   mygame_state_4 : function() {
      this.playerVM.DisplayText("Type Red!");
      this.state = this.playerVM.KeyboardInput(["red"], [states.mygame_state_1]);
   },

};

var SetGameVariables = function(gameInstanceId, team, player, playerVM) {
   FSMGame.gameInstanceId = gameInstanceId;
   FSMGame.team = team;
   FSMGame.player = player;
   FSMGame.playerVM = playerVM;
}


