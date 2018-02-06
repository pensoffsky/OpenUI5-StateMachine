sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"state/view/ViewControllerState"
], function(Controller, MessageBox, MessageToast, ViewControllerState) {
	"use strict";

	return Controller.extend("view.Main", {

		// /////////////////////////////////////////////////////////////////////////////
		// /// Member
		// /////////////////////////////////////////////////////////////////////////////
		
		_oViewControllerState : null,
		



		// /////////////////////////////////////////////////////////////////////////////
		// /// Initialization
		// /////////////////////////////////////////////////////////////////////////////


		onInit: function() {
			//create the stateMachine and configure it
			this._oViewControllerState = new ViewControllerState();
			this._oViewControllerState.createStateMachine(this);
		},

		// /////////////////////////////////////////////////////////////////////////////
		// /// StateMachine Events
		// /////////////////////////////////////////////////////////////////////////////

		//TODO how to overwrite state change handlers from viewControllerState

		// /////////////////////////////////////////////////////////////////////////////
		// /// Button EventHandler
		// /////////////////////////////////////////////////////////////////////////////

		onEditPressed : function(){
			this._oViewControllerState.fireTrigger(ViewControllerState.mTrigger.Edit);
		},
		
		onDeletePressed : function(){
			this._oViewControllerState.fireTrigger(ViewControllerState.mTrigger.Delete);
		},
		
		onCancelPressed : function(){
			this._oViewControllerState.fireTrigger(ViewControllerState.mTrigger.Cancel);
		},
		
		onSavePressed : function(){
			this._oViewControllerState.fireTrigger(ViewControllerState.mTrigger.Save);
		}
		
	});

});