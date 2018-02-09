sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"state/view/MainStateJSONModel",
	"state/view/CalculationLogic"
], function(Controller, MessageBox, MessageToast, MainStateJSONModel, CalculationLogic) {
	"use strict";

	return Controller.extend("view.Main", {

		// /////////////////////////////////////////////////////////////////////////////
		// /// Member
		// /////////////////////////////////////////////////////////////////////////////
		
		_oMainStateJSONModel : null,
		
		_oCalculationLogic : null,


		// /////////////////////////////////////////////////////////////////////////////
		// /// Initialization
		// /////////////////////////////////////////////////////////////////////////////


		onInit: function() {
			//create the stateMachine and configure it
			this._oMainStateJSONModel = MainStateJSONModel.create(this);
			this.getView().setModel(this._oMainStateJSONModel.getJSONModel(), "viewModel");
			
			this._oCalculationLogic = CalculationLogic.create(this);
		},

		// /////////////////////////////////////////////////////////////////////////////
		// /// StateMachine Events
		// /////////////////////////////////////////////////////////////////////////////


		//gets called from the state machine, allows prefill of date before entering the state
		onEnteredEditState: function() {
			this._oMainStateJSONModel.prefillInputs(this._oCalculationLogic.getPrefillValue());
		},
		

		// /////////////////////////////////////////////////////////////////////////////
		// /// Button EventHandler
		// /////////////////////////////////////////////////////////////////////////////
		
		
		onCalculatePressed: function () {
			var oValues = this._oMainStateJSONModel.getCalculationInput();
			var sRes = this._oCalculationLogic.plus(oValues.sValue1, oValues.sValue2);
			MessageToast.show(sRes);
		},


		onEditPressed : function(){
			this._oMainStateJSONModel.fireTrigger(this._oMainStateJSONModel.getTriggers().Edit);
		},
		
		onDeletePressed : function(){
			this._oMainStateJSONModel.fireTrigger(this._oMainStateJSONModel.getTriggers().Delete);
		},
		
		onCancelPressed : function(){
			this._oMainStateJSONModel.fireTrigger(this._oMainStateJSONModel.getTriggers().Cancel);
		},
		
		onSavePressed : function(){
			this._oMainStateJSONModel.fireTrigger(this._oMainStateJSONModel.getTriggers().Save);
		}
		
	});

});