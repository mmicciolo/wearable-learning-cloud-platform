sap.ui.controller("wlcpfrontend.controllers.Classes", {
	
	model : new sap.ui.model.json.JSONModel(),
	data : {
		table: [{
			ClassName : "Computer Science",
			TeacherName : "Matthew Micciolo",
			School : "Worcester Polytechnic Institue",
			Grade : 15,
			StartYear : 2017,
			EndYear : 2018,
		},
		{
			ClassName : "IMGD 4000",
			TeacherName : "Matthew Micciolo",
			School : "Worcester Polytechnic Institue",
			Grade : 15,
			StartYear : 2017,
			EndYear : 2018,
		}]
	},
	
	CreateClass : function(oEvent) {
		var fragment = sap.ui.xmlfragment("wlcpfrontend.fragments.CreateClass");
		this.getView().addDependent(fragment);
		fragment.open();
	},

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.views.Classes
*/
	onInit: function() {
		var table = this.getView().byId("classesTable");
		this.model.setData(this.data);
		//this.getView().setModel(this.model, "classes");
		sap.ui.getCore().setModel(this.model, "classes");
	}

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