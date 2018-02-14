sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"state/view/BaseController",
	"state/view/SquaredCalculationLogic",
	"state/view/Main2ViewState"
], function(Controller, BaseController, SquaredCalculationLogic, Main2ViewState) {
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
		
		//use specialized calculation logic
		_createViewState: function () {
			return Main2ViewState.create(this);
		},

		// /////////////////////////////////////////////////////////////////////////////
		// /// StateMachine Events
		// /////////////////////////////////////////////////////////////////////////////

		//TODO UGLY, this has to be available in the basecontroller because it is checked in BaseDelegateHandler
		//TODO how to overwrite just a part of the behaviour?
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