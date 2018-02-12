sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"state/view/MainViewState",
	"state/view/CalculationLogic"
], function(Controller, MessageBox, MessageToast, MainViewState, CalculationLogic) {
	"use strict";

	return Controller.extend("view.Main", {

		// /////////////////////////////////////////////////////////////////////////////
		// /// Member
		// /////////////////////////////////////////////////////////////////////////////
		
		_oMainViewState : null,
		
		_oCalculationLogic : null,


		// /////////////////////////////////////////////////////////////////////////////
		// /// Initialization
		// /////////////////////////////////////////////////////////////////////////////


		onInit: function() {
			//create the stateMachine and configure it
			this._oMainViewState = MainViewState.create(this);
			this.getView().setModel(this._oMainViewState.getJSONModel(), "viewModel");
			
			this._oCalculationLogic = CalculationLogic.create(this);
		},

		// /////////////////////////////////////////////////////////////////////////////
		// /// StateMachine Events
		// /////////////////////////////////////////////////////////////////////////////


		//gets called from the state machine, allows prefill of date before entering the state
		onEnteredEditState: function() {
			this._oMainViewState.prefillInputs(this._oCalculationLogic.getPrefillValue());
		},
		

		// /////////////////////////////////////////////////////////////////////////////
		// /// Button EventHandler
		// /////////////////////////////////////////////////////////////////////////////
		
		
		onCalculatePressed: function () {
			var oValues = this._oMainViewState.getCalculationInput();
			var sRes = this._oCalculationLogic.plus(oValues.sValue1, oValues.sValue2);
			MessageToast.show(sRes);
		},


		onEditPressed : function(){			
			this._oMainViewState.fireTrigger(this._oMainViewState.getTriggers().Edit);
		},
		
		onDeletePressed : function(){
			this._oMainViewState.fireTrigger(this._oMainViewState.getTriggers().Delete);
		},
		
		onCancelPressed : function(){
			this._oMainViewState.fireTrigger(this._oMainViewState.getTriggers().Cancel);
		},
		
		onSavePressed : function(){
			this._oMainViewState.fireTrigger(this._oMainViewState.getTriggers().Save);
		}
		
	});

});