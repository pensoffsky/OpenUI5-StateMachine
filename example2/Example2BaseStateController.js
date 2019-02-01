sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'state/stateMachine/StateMachine'
], function(Controller, JSONModel, StateMachine) {
	"use strict";

	return Controller.extend("example2.Example2BaseStateController", {

		//TODO destroy machine on exit

		// /////////////////////////////////////////////////////////////////////////////
		// /// Member (for documentation purposes)
		// /////////////////////////////////////////////////////////////////////////////   		

		_oStateMachine: null,

		_oCurrentState: null,

		// /////////////////////////////////////////////////////////////////////////////
		// /// Initialization
		// /////////////////////////////////////////////////////////////////////////////

		onInit: function() {
			if (Controller.prototype.onInit) {
				Controller.prototype.onInit.apply(this, arguments);
			}			
		},


		_configureStateMachine: function(mStates, mTriggers, oStateMachineConfig) {
			var oStateMachine = new StateMachine(mStates, mTriggers);

			oStateMachineConfig.aStates.forEach(oState => {
				var oStateConfig = oStateMachine.configure(oState.sName);
				oStateConfig.setData(oState.vData);

				oState.aTransitions.forEach(oTransition => {
					oStateConfig.permit(oTransition.sTrigger, oTransition.sTargetState);
				});
			});		

			oStateMachine.onStateChanged(this.onStateChanged.bind(this));

			this._oStateMachine = oStateMachine;
			return oStateMachine;
		},

		// /////////////////////////////////////////////////////////////////////////////
		// /// StateMachine EventHandler
		// /////////////////////////////////////////////////////////////////////////////

		onStateChanged: function(oStateConfig){
			//we stored a ref to Example*State in the stateMachine state config
			//retrieve it here and use as the current ui state
			this._oCurrentState = oStateConfig.getData();
			this._oCurrentState.enterState();
		},
		

		// /////////////////////////////////////////////////////////////////////////////
		// /// View EventHandler
		// /////////////////////////////////////////////////////////////////////////////
		
		onViewEvent : function(sFunctionName, oEvent){			
			this._oCurrentState[sFunctionName](oEvent);			
		}
		
	});

});