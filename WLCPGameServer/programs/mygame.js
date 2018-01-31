var states = {
   mygame_start : 0,
   mygame_state_1 : 1,
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
      }
   },

   mygame_start : function() {
      this.state = states.mygame_state_1;
   },

   mygame_state_1 : function() {
   },

}
