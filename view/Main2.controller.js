sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"state/view/BaseController",
	"state/view/SquaredCalculationLogic"
], function(Controller, BaseController, SquaredCalculationLogic) {
	"use strict";

	return BaseController.extend("view.Main2", {

		// /////////////////////////////////////////////////////////////////////////////
		// /// Member
		// /////////////////////////////////////////////////////////////////////////////
		
		// /////////////////////////////////////////////////////////////////////////////
		// /// Initialization
		// /////////////////////////////////////////////////////////////////////////////


		onInit: function() {
			if (BaseController.prototype.onInit) {
				BaseController.prototype.onInit.apply(this, arguments);
			}
			
			setTimeout(function () {
				//normally we attach to the routing events
				this._simulatedOnRouteMatched();
			}.bind(this), 200);
		},

		//use specialized calculation logic
		_createCalculationLogic: function () {
			return SquaredCaclulationLogic.create(this);
		},

		// /////////////////////////////////////////////////////////////////////////////
		// /// StateMachine Events
		// /////////////////////////////////////////////////////////////////////////////

		//TODO UGLY
		//delete will directly delete without confirmation
		onEnteredDeleteState: function(oEvent) {
			return true;
			
		},

		// /////////////////////////////////////////////////////////////////////////////
		// /// Button EventHandler
		// /////////////////////////////////////////////////////////////////////////////
		
		//overwritten EDIT button event handler, no error handling for this controller
		onEditPressed : function(){
			this.getView().setBusy(true);
			setTimeout(function () {
				this.getView().setBusy(false);
				this._oMainViewState.fireTrigger(this._oMainViewState.getTriggers().Edit);
			}.bind(this), 1000);
		},
		
	});

});