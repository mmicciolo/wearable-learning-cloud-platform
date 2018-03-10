var states = {
   estimateit_start : 0,
   estimateit_state_1 : 1,
   estimateit_state_10 : 2,
   estimateit_state_11 : 3,
   estimateit_state_12 : 4,
   estimateit_state_13 : 5,
   estimateit_state_14 : 6,
   estimateit_state_15 : 7,
   estimateit_state_16 : 8,
   estimateit_state_17 : 9,
   estimateit_state_18 : 10,
   estimateit_state_19 : 11,
   estimateit_state_2 : 12,
   estimateit_state_20 : 13,
   estimateit_state_21 : 14,
   estimateit_state_22 : 15,
   estimateit_state_23 : 16,
   estimateit_state_24 : 17,
   estimateit_state_25 : 18,
   estimateit_state_26 : 19,
   estimateit_state_27 : 20,
   estimateit_state_28 : 21,
   estimateit_state_29 : 22,
   estimateit_state_3 : 23,
   estimateit_state_4 : 24,
   estimateit_state_5 : 25,
   estimateit_state_6 : 26,
   estimateit_state_7 : 27,
   estimateit_state_8 : 28,
   estimateit_state_9 : 29,
};

var FSMGame = {

   gameInstanceId : 0,
   team : 0,
   player : 0,
   playerVM : null,

   running : true,
   state : states.estimateit_start,
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
         case states.estimateit_start:
            this.estimateit_start();
            break;
         case states.estimateit_state_1:
            this.estimateit_state_1();
            break;
         case states.estimateit_state_10:
            this.estimateit_state_10();
            break;
         case states.estimateit_state_11:
            this.estimateit_state_11();
            break;
         case states.estimateit_state_12:
            this.estimateit_state_12();
            break;
         case states.estimateit_state_13:
            this.estimateit_state_13();
            break;
         case states.estimateit_state_14:
            this.estimateit_state_14();
            break;
         case states.estimateit_state_15:
            this.estimateit_state_15();
            break;
         case states.estimateit_state_16:
            this.estimateit_state_16();
            break;
         case states.estimateit_state_17:
            this.estimateit_state_17();
            break;
         case states.estimateit_state_18:
            this.estimateit_state_18();
            break;
         case states.estimateit_state_19:
            this.estimateit_state_19();
            break;
         case states.estimateit_state_2:
            this.estimateit_state_2();
            break;
         case states.estimateit_state_20:
            this.estimateit_state_20();
            break;
         case states.estimateit_state_21:
            this.estimateit_state_21();
            break;
         case states.estimateit_state_22:
            this.estimateit_state_22();
            break;
         case states.estimateit_state_23:
            this.estimateit_state_23();
            break;
         case states.estimateit_state_24:
            this.estimateit_state_24();
            break;
         case states.estimateit_state_25:
            this.estimateit_state_25();
            break;
         case states.estimateit_state_26:
            this.estimateit_state_26();
            break;
         case states.estimateit_state_27:
            this.estimateit_state_27();
            break;
         case states.estimateit_state_28:
            this.estimateit_state_28();
            break;
         case states.estimateit_state_29:
            this.estimateit_state_29();
            break;
         case states.estimateit_state_3:
            this.estimateit_state_3();
            break;
         case states.estimateit_state_4:
            this.estimateit_state_4();
            break;
         case states.estimateit_state_5:
            this.estimateit_state_5();
            break;
         case states.estimateit_state_6:
            this.estimateit_state_6();
            break;
         case states.estimateit_state_7:
            this.estimateit_state_7();
            break;
         case states.estimateit_state_8:
            this.estimateit_state_8();
            break;
         case states.estimateit_state_9:
            this.estimateit_state_9();
            break;
      }
   },

   estimateit_start : function() {
      this.state = states.estimateit_state_1;
   },

   estimateit_state_1 : function() {
      this.playerVM.DisplayText("WELCOME TO ESTIMATE IT! Push a button to start.");
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_2, states.estimateit_state_2, states.estimateit_state_2, states.estimateit_state_2]);
   },

   estimateit_state_10 : function() {
      this.playerVM.DisplayText("Listen carefully to the organizers as they tell you about the 2nd part. Wait and do not push any buttons until you are told.");
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_11, states.estimateit_state_11, states.estimateit_state_11, states.estimateit_state_11]);
   },

   estimateit_state_11 : function() {
      this.playerVM.DisplayText("Work as a team to find as many shapes as you can before time runs out. You have 8  minutes. Push the black button to continue.");
      this.state = this.playerVM.SingleButtonPress(["4"], [states.estimateit_state_12]);
   },

   estimateit_state_12 : function() {
      if(this.team == 1) {
         this.playerVM.DisplayText("Find a volume about 6 inches wide, with no flat faces.");
      }
      if(this.team == 2) {
         this.playerVM.DisplayText("Find a shape with 2 flat sides and 1 curved side, 8 inches tall.");
      }
      if(this.team == 3) {
         this.playerVM.DisplayText("Find a rectangular prism with 4 longer edges than the rest.");
      }
      if(this.team == 1) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "2134"], [states.estimateit_state_15, states.estimateit_state_13, states.estimateit_state_14]);
      }
      if(this.team == 2) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "1234"], [states.estimateit_state_15, states.estimateit_state_13, states.estimateit_state_14]);
      }
      if(this.team == 3) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "2214"], [states.estimateit_state_15, states.estimateit_state_13, states.estimateit_state_14]);
      }
   },

   estimateit_state_13 : function() {
      if(this.team == 1) {
         this.playerVM.DisplayText("I am a sphere, like a ball 6 inches tall. Push any button to continue.");
      }
      if(this.team == 2) {
         this.playerVM.DisplayText("A cylinder has 2 flat round sides and 1 curved side (like a soda can). Push any button to continue.");
      }
      if(this.team == 3) {
         this.playerVM.DisplayText("The 6 faces of a rectangular prism are rectangles (or squares). Push any button to continue.");
      }
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_12, states.estimateit_state_12, states.estimateit_state_12, states.estimateit_state_12]);
   },

   estimateit_state_14 : function() {
      if(this.team == 1) {
         this.playerVM.DisplayText("Congratulations! You have found the sphere. Press any button to continue.");
      }
      if(this.team == 2) {
         this.playerVM.DisplayText("Congratulations! You have found the cylinder. Press any button to continue.");
      }
      if(this.team == 3) {
         this.playerVM.DisplayText("Congratulations! You have found the rectangular prism. Press any button to continue.");
      }
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_16, states.estimateit_state_16, states.estimateit_state_16, states.estimateit_state_16]);
   },

   estimateit_state_15 : function() {
      if(this.team == 1) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      if(this.team == 2) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      if(this.team == 3) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_12, states.estimateit_state_12, states.estimateit_state_12, states.estimateit_state_12]);
   },

   estimateit_state_16 : function() {
      if(this.team == 1) {
         this.playerVM.DisplayText("Find a volume where each face has 4 right angles and all sides are 6 inches long.");
      }
      if(this.team == 2) {
         this.playerVM.DisplayText("Find a volume with 4 faces, with all acute angles.");
      }
      if(this.team == 3) {
         this.playerVM.DisplayText("Find a rectangular prism: two of its faces are squares with 4 inch sides.");
      }
      if(this.team == 1) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "3213"], [states.estimateit_state_19, states.estimateit_state_17, states.estimateit_state_18]);
      }
      if(this.team == 2) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "3141"], [states.estimateit_state_19, states.estimateit_state_17, states.estimateit_state_18]);
      }
      if(this.team == 3) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "3213"], [states.estimateit_state_19, states.estimateit_state_17, states.estimateit_state_18]);
      }
   },

   estimateit_state_17 : function() {
      if(this.team == 1) {
         this.playerVM.DisplayText("I am a cube: all faces are squares (4 right angles and same length sides). Push any button to continue.");
      }
      if(this.team == 2) {
         this.playerVM.DisplayText("A cylinder has 2 flat round sides and 1 curved side (like a soda can). Push any button to continue.");
      }
      if(this.team == 3) {
         this.playerVM.DisplayText("Hint: 4 inches is one third of your 12 inch dowel. Look for that square face. Push any button to continue.");
      }
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_16, states.estimateit_state_16, states.estimateit_state_16, states.estimateit_state_16]);
   },

   estimateit_state_18 : function() {
      if(this.team == 1) {
         this.playerVM.DisplayText("Congratulations! You have found the cube. Press any button to continue.");
      }
      if(this.team == 2) {
         this.playerVM.DisplayText("Congratulations! You have found the triangular pyramid. Press any button to continue.");
      }
      if(this.team == 3) {
         this.playerVM.DisplayText("Congratulations! You have found the rectangular prism. Press any button to continue.");
      }
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_20, states.estimateit_state_20, states.estimateit_state_20, states.estimateit_state_20]);
   },

   estimateit_state_19 : function() {
      if(this.team == 1) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      if(this.team == 2) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      if(this.team == 3) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_16, states.estimateit_state_16, states.estimateit_state_16, states.estimateit_state_16]);
   },

   estimateit_state_2 : function() {
      this.playerVM.DisplayText("Your job is to find shapes scattered in the game area. When you find the right shape you will be asked to input a button sequence. Drag and drop the buttons in the correct order and submit. Enter the sequence red green to continue.");
      this.state = this.playerVM.SequenceButtonPress(["", "12"], [states.estimateit_state_4, states.estimateit_state_3]);
   },

   estimateit_state_20 : function() {
      this.playerVM.DisplayText("Great Job! You reached LEVEL 3 of the ?Estimate it!? game. Wait until you are given instructions. Do not push any buttons until told to do so.");
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_21, states.estimateit_state_21, states.estimateit_state_21, states.estimateit_state_21]);
   },

   estimateit_state_21 : function() {
      if(this.team == 1) {
         this.playerVM.DisplayText("Find a sphere about 6 inches tall.");
      }
      if(this.team == 2) {
         this.playerVM.DisplayText("Find a cube with a face 8 inches long.");
      }
      if(this.team == 3) {
         this.playerVM.DisplayText("Find a volume where each face has 4 right angles and all sides are 6 inches long.");
      }
      if(this.team == 1) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "1341"], [states.estimateit_state_24, states.estimateit_state_22, states.estimateit_state_23]);
      }
      if(this.team == 2) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "2132"], [states.estimateit_state_24, states.estimateit_state_22, states.estimateit_state_23]);
      }
      if(this.team == 3) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "2143"], [states.estimateit_state_24, states.estimateit_state_22, states.estimateit_state_23]);
      }
   },

   estimateit_state_22 : function() {
      if(this.team == 1) {
         this.playerVM.DisplayText("Hint: My shape is like a ball. Push any button to continue.");
      }
      if(this.team == 2) {
         this.playerVM.DisplayText("Hint: A cube is a box with 6 equal square faces. Press any button to continue.");
      }
      if(this.team == 3) {
         this.playerVM.DisplayText("I am a cube: all faces are squares (4 right angles and same length sides).");
      }
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_21, states.estimateit_state_21, states.estimateit_state_21, states.estimateit_state_21]);
   },

   estimateit_state_23 : function() {
      if(this.team == 1) {
         this.playerVM.DisplayText("Congratulations! You have found the sphere. Press any button to continue.");
      }
      if(this.team == 2) {
         this.playerVM.DisplayText("Congratulations! You have found the cube. Press any button to continue.");
      }
      if(this.team == 3) {
         this.playerVM.DisplayText("Congratulations! You have found the cube. Press any button to continue.");
      }
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_25, states.estimateit_state_25, states.estimateit_state_25, states.estimateit_state_25]);
   },

   estimateit_state_24 : function() {
      if(this.team == 1) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      if(this.team == 2) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      if(this.team == 3) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_21, states.estimateit_state_21, states.estimateit_state_21, states.estimateit_state_21]);
   },

   estimateit_state_25 : function() {
      if(this.team == 1) {
         this.playerVM.DisplayText("Find a volume with 4 faces, with all acute angles.");
      }
      if(this.team == 2) {
         this.playerVM.DisplayText("Find a sphere about 8 inches tall.");
      }
      if(this.team == 3) {
         this.playerVM.DisplayText("Find a 6 inch tall cylinder.");
      }
      if(this.team == 1) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "3141"], [states.estimateit_state_28, states.estimateit_state_26, states.estimateit_state_27]);
      }
      if(this.team == 2) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "2141"], [states.estimateit_state_28, states.estimateit_state_26, states.estimateit_state_27]);
      }
      if(this.team == 3) {
         this.state = this.playerVM.SequenceButtonPress(["", "1313", "4"], [states.estimateit_state_28, states.estimateit_state_27, states.estimateit_state_26]);
      }
   },

   estimateit_state_26 : function() {
      if(this.team == 1) {
         this.playerVM.DisplayText("An acute angle measures less than 90 degrees. Press any button to continue.");
      }
      if(this.team == 2) {
         this.playerVM.DisplayText("Hint: The diameter of a sphere is the longest line from one end to the other. Press any button to continue.");
      }
      if(this.team == 3) {
         this.playerVM.DisplayText("I am a cylinder: My shape is like a soda can. Press any button to continue.");
      }
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_25, states.estimateit_state_25, states.estimateit_state_25, states.estimateit_state_25]);
   },

   estimateit_state_27 : function() {
      if(this.team == 1) {
         this.playerVM.DisplayText("Congratulations! You have found a triangular pyramid. Press any button to continue.");
      }
      if(this.team == 2) {
         this.playerVM.DisplayText("Congratulations! You have found the sphere. Press any button to continue.");
      }
      if(this.team == 3) {
         this.playerVM.DisplayText("Congratulations! You have found the cylinder. Press any button to continue.");
      }
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_29, states.estimateit_state_29, states.estimateit_state_29, states.estimateit_state_29]);
   },

   estimateit_state_28 : function() {
      if(this.team == 1) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      if(this.team == 2) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      if(this.team == 3) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_25, states.estimateit_state_25, states.estimateit_state_25, states.estimateit_state_25]);
   },

   estimateit_state_29 : function() {
      this.playerVM.DisplayText("Congratulations you have completed EstimateIt!");
   },

   estimateit_state_3 : function() {
      this.playerVM.DisplayText("That was the correct sequence! Push any button to continue.");
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_5, states.estimateit_state_5, states.estimateit_state_5, states.estimateit_state_5]);
   },

   estimateit_state_4 : function() {
      this.playerVM.DisplayText("That was the wrong sequence! Push any button to try again!");
      this.state = states.estimateit_state_2;
   },

   estimateit_state_5 : function() {
      this.playerVM.DisplayText("Each person in your team will look for a different object.Ready to Start? Push any button to get your first clue.");
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_6, states.estimateit_state_6, states.estimateit_state_6, states.estimateit_state_6]);
   },

   estimateit_state_6 : function() {
      if(this.team == 1 && this.player == 1) {
         this.playerVM.DisplayText("Find a cube with a face 6 inches long.");
      }
      if(this.team == 1 && this.player == 2) {
         this.playerVM.DisplayText("Find a rectangular prism with its longest edge about 6 inches.");
      }
      if(this.team == 1 && this.player == 3) {
         this.playerVM.DisplayText("Find a 6 inch tall cylinder.");
      }
      if(this.team == 2 && this.player == 1) {
         this.playerVM.DisplayText("Find a cube with a face 4 inches long.");
      }
      if(this.team == 2 && this.player == 2) {
         this.playerVM.DisplayText("Find a sphere about 6 inches in diameter.");
      }
      if(this.team == 2 && this.player == 3) {
         this.playerVM.DisplayText("Find a rectangular prism with its longest edge about 10 inches.");
      }
      if(this.team == 3 && this.player == 1) {
         this.playerVM.DisplayText("Find a cube with a face 8 inches long.");
      }
      if(this.team == 3 && this.player == 2) {
         this.playerVM.DisplayText("Find a rectangular prism with its longest edge about 10 inches long.");
      }
      if(this.team == 3 && this.player == 3) {
         this.playerVM.DisplayText("Find a sphere about 8 inches tall.");
      }
      if(this.team == 1 && this.player == 1) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "2143"], [states.estimateit_state_9, states.estimateit_state_8, states.estimateit_state_7]);
      }
      if(this.team == 1 && this.player == 2) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "1232"], [states.estimateit_state_9, states.estimateit_state_8, states.estimateit_state_7]);
      }
      if(this.team == 1 && this.player == 3) {
         this.state = this.playerVM.SequenceButtonPress(["", "1313", "4"], [states.estimateit_state_9, states.estimateit_state_7, states.estimateit_state_8]);
      }
      if(this.team == 2 && this.player == 1) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "3142"], [states.estimateit_state_9, states.estimateit_state_8, states.estimateit_state_7]);
      }
      if(this.team == 2 && this.player == 2) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "1341"], [states.estimateit_state_9, states.estimateit_state_8, states.estimateit_state_7]);
      }
      if(this.team == 2 && this.player == 3) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "1432"], [states.estimateit_state_9, states.estimateit_state_8, states.estimateit_state_7]);
      }
      if(this.team == 3 && this.player == 1) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "2132"], [states.estimateit_state_9, states.estimateit_state_8, states.estimateit_state_7]);
      }
      if(this.team == 3 && this.player == 2) {
         this.state = this.playerVM.SequenceButtonPress(["", "4", "2121"], [states.estimateit_state_9, states.estimateit_state_8, states.estimateit_state_7]);
      }
      if(this.team == 3 && this.player == 3) {
         this.state = this.playerVM.SequenceButtonPress(["", "2414", "4"], [states.estimateit_state_9, states.estimateit_state_7, states.estimateit_state_8]);
      }
   },

   estimateit_state_7 : function() {
      if(this.team == 1 && this.player == 1) {
         this.playerVM.DisplayText("Congratulations! You have found the cube. Press any button to continue.");
      }
      if(this.team == 1 && this.player == 2) {
         this.playerVM.DisplayText("Congratulations! You have found the prism. Press any button to continue.");
      }
      if(this.team == 1 && this.player == 3) {
         this.playerVM.DisplayText("Congratulations! You have found the cylinder. Press any button to continue.");
      }
      if(this.team == 2 && this.player == 1) {
         this.playerVM.DisplayText("Congratulations! You have found the cube. Press any button to continue.");
      }
      if(this.team == 2 && this.player == 2) {
         this.playerVM.DisplayText("Congratulations! You have found the sphere. Press any button to continue.");
      }
      if(this.team == 2 && this.player == 3) {
         this.playerVM.DisplayText("Congratulations! You have found the prism. Press any button to continue.");
      }
      if(this.team == 3 && this.player == 1) {
         this.playerVM.DisplayText("Congratulations! You have found the cube. Press any button to continue.");
      }
      if(this.team == 3 && this.player == 2) {
         this.playerVM.DisplayText("Congratulations! You have found the prism. Press any button to continue.");
      }
      if(this.team == 3 && this.player == 3) {
         this.playerVM.DisplayText("Congratulations! You have found the sphere. Press any button to continue.");
      }
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_10, states.estimateit_state_10, states.estimateit_state_10, states.estimateit_state_10]);
   },

   estimateit_state_8 : function() {
      if(this.team == 1 && this.player == 1) {
         this.playerVM.DisplayText("A cube is a box with 6 square faces (a face is a side). Push any button to continue.");
      }
      if(this.team == 1 && this.player == 2) {
         this.playerVM.DisplayText("A rectangular prism is like a shoebox. An edge is a border. Push any button to continue.");
      }
      if(this.team == 1 && this.player == 3) {
         this.playerVM.DisplayText("I am a cylinder: My shape is like a soda can. Push any button to continue.");
      }
      if(this.team == 2 && this.player == 1) {
         this.playerVM.DisplayText("A cube is a box with 6 square faces (a face is a side). Push any button to continue.");
      }
      if(this.team == 2 && this.player == 2) {
         this.playerVM.DisplayText("I have the shape a ball. Put a stick next to me to measure my height. Push any button to continue.");
      }
      if(this.team == 2 && this.player == 3) {
         this.playerVM.DisplayText("A rectangular prism is like a shoebox. An edge is a border. Push any button to continue.");
      }
      if(this.team == 3 && this.player == 1) {
         this.playerVM.DisplayText("A cube is a box with 6 square faces (a face is a side). Push any button to continue.");
      }
      if(this.team == 3 && this.player == 2) {
         this.playerVM.DisplayText("A rectangular prism?s shape is like a shoebox. Push any button to continue.");
      }
      if(this.team == 3 && this.player == 3) {
         this.playerVM.DisplayText("My shape is like a ball. You can use a stick to measure my height. Push any button to continue.");
      }
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_6, states.estimateit_state_6, states.estimateit_state_6, states.estimateit_state_6]);
   },

   estimateit_state_9 : function() {
      if(this.team == 1 && this.player == 1) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      if(this.team == 1 && this.player == 2) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      if(this.team == 1 && this.player == 3) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      if(this.team == 2 && this.player == 1) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      if(this.team == 2 && this.player == 2) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      if(this.team == 2 && this.player == 3) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      if(this.team == 3 && this.player == 1) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      if(this.team == 3 && this.player == 2) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      if(this.team == 3 && this.player == 3) {
         this.playerVM.DisplayText("That is incorrect, press any button to try again!");
      }
      this.state = this.playerVM.SingleButtonPress(["1", "2", "3", "4"], [states.estimateit_state_6, states.estimateit_state_6, states.estimateit_state_6, states.estimateit_state_6]);
   },

};

var SetGameVariables = function(gameInstanceId, team, player, playerVM) {
   FSMGame.gameInstanceId = gameInstanceId;
   FSMGame.team = team;
   FSMGame.player = player;
   FSMGame.playerVM = playerVM;
}


