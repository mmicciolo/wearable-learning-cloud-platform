sap.ui.controller("wlcpfrontend.controllers.Students", {
	
	
	dialog : null,
	
	edit : null,
	
	CreateStudentObject : function() {
		return {
			StudentId : 0,
			FirstName : "",
			LastName : "",
			Username : "",
			Password : "",
			Classes : [{
				FirstName : "matt",
				LastName : "micciolo"
			}]
		}
	},
	
	CreateStudentPressed : function(oEvent) {
		
		//Create an instance of the dialog
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.Students.CreateStudent", this);
		
		//Create a new student
		this.edit = this.CreateStudentObject();
		
		//Set the model
		this.dialog.setModel(new sap.ui.model.json.JSONModel(this.edit));
		
		//Open the dialog
		this.getView().addDependent(this.dialog);
		this.dialog.open();
	},
	
	CreateStudent : function(oEvent) {
		sap.ui.getCore().getModel("odata").create("/Students", oEvent.getSource().getModel().getData(), {success : this.success, error: this.error});
		this.dialog.close();
		this.getView().removeDependent(this.dialog);
	},
	
	success : function(oSuccess) {
		var i = 0;
	},
	
	error : function(oError) {
		var i = 0;
	},
	
	TilePress : function(oEvent) {
		
		//Create an instance of the dialog
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.Students.EditStudent", this);
		
		//Get the odata for the select student
		var oData = oEvent.getSource().getBindingContext("odata").getObject();
		
		//Create a new student
		this.edit = this.CreateStudentObject();
		
		//Bind it to a local model
		this.edit.FirstName = oData.FirstName;
		this.edit.LastName = oData.LastName;
		this.edit.Username = oData.Username;
		this.edit.Password = oData.Password;
		this.dialog.setModel(new sap.ui.model.json.JSONModel(this.edit));
		
		//Open the dialog
		this.getView().addDependent(this.dialog);
		this.dialog.open();
	},
	
	CancelDialog : function(oEvent) {
		
		//Close the dialog
		this.getView().removeDependent(this.dialog);
		this.dialog.close();
	},
	
	SaveStudent : function(oEvent) {
		sap.ui.getCore().getModel("odata").update("/Students(1)", this.edit);
		this.dialog.close();
		this.getView().removeDependent(this.dialog);
	},

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.views.Students
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf wlcpfrontend.views.Students
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf wlcpfrontend.views.Students
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf wlcpfrontend.views.Students
*/
//	onExit: function() {
//
//	}

});