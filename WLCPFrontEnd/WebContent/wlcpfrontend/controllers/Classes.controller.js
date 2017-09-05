sap.ui.controller("wlcpfrontend.controllers.Classes", {
	
	dialog : null,
	
	editing : false,
	
	CreateClass : function(oEvent) {
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.CreateClass", this);
		this.getView().addDependent(this.dialog);
		this.dialog.open();
	},
	
	CancelCreateClass : function(oEvent) {
		this.dialog.close();
		this.getView().removeDependent(this.dialog);
	},
	
	EditClasses : function(oEvent) {
		
		if(!this.editing) {
			//Get the table
			var table = sap.ui.getCore().byId(this.getView().getId() + "--classesTable");
			
			//Loop through the rows
			for(var i = 0; i < table.getBinding().getLength() - 1; i++) {
				for(var n = 0; n < table.getRows()[i].getCells().length; n++) {
					if(n == 7) {
						table.getRows()[i].getCells()[n].setText("Edit");
					} else if(n == 2 || n == 3) {
						//Dont allow Teacher or School to be edited
					} else {
						table.getRows()[i].getCells()[n].setEditable(true);
					}
				}
			}
			
			//Change the edit button to save
			var editButton = sap.ui.getCore().byId(this.getView().getId() + "--editButton");
			editButton.setText("Save");
			editButton.setIcon("sap-icon://save")
			
			this.editing = true;
		} else {
			//Get the table
			var table = sap.ui.getCore().byId(this.getView().getId() + "--classesTable");
			
			//Loop through the rows
			for(var i = 0; i < table.getBinding().getLength() - 1; i++) {
				for(var n = 0; n < table.getRows()[i].getCells().length; n++) {
					if(n == 7) {
						table.getRows()[i].getCells()[n].setText("View");
					} else if(n == 2 || n == 3) {
						//Dont allow Teacher or School to be edited
					} else {
						table.getRows()[i].getCells()[n].setEditable(false);
					}
				}
			}
			
			//Change the edit button to save
			var editButton = sap.ui.getCore().byId(this.getView().getId() + "--editButton");
			editButton.setText("Enable Editing");
			editButton.setIcon("sap-icon://edit")
			
			this.editing = false;
		}
	},
	
	ViewEdit : function(oEvent) {
		if(this.editing) {
			this.AddRemoveStudents(oEvent);
		} else {
			this.ViewStudents(oEvent);
		}
	},
	
	ViewStudents : function(oEvent) {
		
		//Get the path to the student data
		var classId = oEvent.getSource().getParent().getCells()[0].getValue();
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.ViewClassStudents", this);
		this.dialog.setModel(sap.ui.getCore().getModel("odata"));
		this.dialog.getContent()[0].bindItems("/TeacherClasss(" + classId + ")/StudentDetails", this.dialog.getContent()[0].getBindingInfo("items").template);
		this.getView().addDependent(this.dialog);
		this.dialog.open();
	},
	
	AddRemoveStudents : function(oEvent) {
		console.log("Add Remove");
	}

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.views.Classes
*/
//	onInit: function() {	
//		
//	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf wlcpfrontend.views.Classes
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf wlcpfrontend.views.Classes
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf wlcpfrontend.views.Classes
*/
//	onExit: function() {
//
//	}

});