sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"state/view/BaseController",
	"state/view/Main3ViewState"
], function(Controller, BaseController, Main3ViewState) {
	"use strict";

	return BaseController.extend("view.Main3", {

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
		_createViewState: function () {
			return Main3ViewState.create(this);
		},

		// /////////////////////////////////////////////////////////////////////////////
		// /// StateMachine Events
		// /////////////////////////////////////////////////////////////////////////////

		onStateEntered: function (sState) {
			this.getView().getModel("viewModel").setProperty("/sState", sState);
		},

		// /////////////////////////////////////////////////////////////////////////////
		// /// Button EventHandler
		// /////////////////////////////////////////////////////////////////////////////
		
		onEditPressed : function(){		
			this._oMainViewState.fireTrigger(this._oMainViewState.getTriggers().Edit);
		},
		
	});

});