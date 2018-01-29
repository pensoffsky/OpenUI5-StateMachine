sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"state/StateMachine"
], function(Controller, MessageBox, MessageToast, StateMachine) {
	"use strict";

	return Controller.extend("view.Main", {

		// /////////////////////////////////////////////////////////////////////////////
		// /// Member
		// /////////////////////////////////////////////////////////////////////////////
		
		_oStateMachine : null,

		//define the possible states of the UI
		_mStates : {
			DisplayState: "DisplayState",
			EditState: "EditState",
			DeleteState: "DeleteState",
			ObjectDeletedState: "ObjectDeletedState"
		},
		
		//define the triggers that can change the state of the UI
		_mTrigger : {
			Edit: "Edit",
			Cancel: "Cancel",
			Delete: "Delete",
			DeleteConfirm: "DeleteConfirm",
			Save: "Save"
		},

		// /////////////////////////////////////////////////////////////////////////////
		// /// Initialization
		// /////////////////////////////////////////////////////////////////////////////

		onInit: function() {
			//crate the stateMachine and configure it
			this._oStateMachine = new StateMachine(this._mStates, this._mTrigger);

			//DisplayState + "Edit" ==> EditState
			//DisplayState + "Delete" ==> DeleteState
			this._oStateMachine.configure(this._mStates.DisplayState)
				.onEntry(this._onEnteredDisplayState.bind(this))
				.permit(this._mTrigger.Edit, this._mStates.EditState)
				.permit(this._mTrigger.Delete, this._mStates.DeleteState);
				
			//EditState + "Cancel" ==> DisplayState
			this._oStateMachine.configure(this._mStates.EditState)
				.onEntry(this._onEnteredEditState.bind(this))
				.permit(this._mTrigger.Cancel, this._mStates.DisplayState)
				.permit(this._mTrigger.Save, this._mStates.DisplayState);
			
			//DeleteState + "Cancel" ==> DisplayState
			this._oStateMachine.configure(this._mStates.DeleteState)
				.onEntry(this._onEnteredDeleteState.bind(this))
				.permit(this._mTrigger.Cancel, this._mStates.DisplayState)
				.permit(this._mTrigger.DeleteConfirm, this._mStates.ObjectDeletedState);
			
			//ObjectDeletedState
			this._oStateMachine.configure(this._mStates.ObjectDeletedState)
				.onEntry(this._onEnteredObjectDeleteState.bind(this));
		
			//start the machine in DisplayState state, fire initial state event
			this._oStateMachine.setInitialState(this._mStates.DisplayState, true);
		},

		// /////////////////////////////////////////////////////////////////////////////
		// /// StateMachine Events
		// /////////////////////////////////////////////////////////////////////////////

		_onEnteredDisplayState: function () {
			console.log("display state");
			this.byId("idStateText").setText(this._oStateMachine.getState());
			
			this.byId("idEditButton").setVisible(true);
			this.byId("idDeleteButton").setVisible(true);
			this.byId("idCancelButton").setVisible(false);
			this.byId("idSaveButton").setVisible(false);
		},
		
		_onEnteredEditState: function () {
			console.log("edit state");
			this.byId("idStateText").setText(this._oStateMachine.getState());
			
			this.byId("idEditButton").setVisible(false);
			this.byId("idDeleteButton").setVisible(false);
			this.byId("idCancelButton").setVisible(true);
			this.byId("idSaveButton").setVisible(true);
		},
		
		_onEnteredDeleteState: function () {
			console.log("delete state");
			this.byId("idStateText").setText(this._oStateMachine.getState());
			
			this.byId("idEditButton").setVisible(true);
			this.byId("idDeleteButton").setVisible(true);
			this.byId("idCancelButton").setVisible(false);
			this.byId("idSaveButton").setVisible(false);
			
			MessageBox.show(
				"Really delete this object?", {
					title: "Delete",
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function(oAction) { 
						if(oAction === MessageBox.Action.YES) {
							MessageToast.show("Object deleted");
							this._oStateMachine.fire(this._mTrigger.DeleteConfirm);
						} else {
							this._oStateMachine.fire(this._mTrigger.Cancel);
						}
					}.bind(this)
				}
			);
		},
		
		_onEnteredObjectDeleteState: function () {
			console.log("objectDeleted state");
			this.byId("idStateText").setText(this._oStateMachine.getState());
			
			this.byId("idEditButton").setVisible(false);
			this.byId("idDeleteButton").setVisible(false);
			this.byId("idCancelButton").setVisible(false);
			this.byId("idSaveButton").setVisible(false);
		},

		// /////////////////////////////////////////////////////////////////////////////
		// /// Button EventHandler
		// /////////////////////////////////////////////////////////////////////////////

		onEditPressed : function(){
			this._oStateMachine.fire(this._mTrigger.Edit);
		},
		
		onDeletePressed : function(){
			this._oStateMachine.fire(this._mTrigger.Delete);
		},
		
		onCancelPressed : function(){
			this._oStateMachine.fire(this._mTrigger.Cancel);
		},
		
		onSavePressed : function(){
			this._oStateMachine.fire(this._mTrigger.Save);
		}
		
	});

});