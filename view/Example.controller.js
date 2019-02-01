sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'state/StateMachine',
	'state/view/ExampleDisplayState',
	'state/view/ExampleEditState',
	'state/view/ExampleDeletedState',
	'state/view/ExampleUtil'
], function(Controller, JSONModel, StateMachine, ExampleDisplayState, ExampleEditState, ExampleDeletedState, ExampleUtil) {
	"use strict";

	return Controller.extend("view.Example", {

		//TODO destroy machine on exit

		// /////////////////////////////////////////////////////////////////////////////
		// /// Member (for documentation purposes)
		// /////////////////////////////////////////////////////////////////////////////   		

		_oViewModel: null,
		_oUtil: null,

		_oStateMachine: null,

		_oCurrentState: null,

		// /////////////////////////////////////////////////////////////////////////////
		// /// Initialization
		// /////////////////////////////////////////////////////////////////////////////

		onInit: function() {
			if (Controller.prototype.onInit) {
				Controller.prototype.onInit.apply(this, arguments);
			}

			this._oViewModel = new JSONModel({
				sState: null,
				bEditButtonVisible: false,
				bDeleteButtonVisible: false,
				bCancelButtonVisible: false,
				bSaveButtonVisible: false,
				bReloadButtonVisible: false
			});
			this.getView().setModel(this._oViewModel, "viewModel");

			this._oUtil = new ExampleUtil();

			this._oStateMachine = this._configureStateMachine();
			
			//start the machine in DisplayState state, fire initial state event
			//could also be called on router handleRouteMatched handler
			this._oStateMachine.setInitialState(this._oStateMachine.getStates().DisplayState, true /*bFireInitialStateEvent*/);
		},


		_configureStateMachine: function() {
			/*	
					SAVE
				+-----------------+
				|                 |
				v      EDIT       |
			+-------+ --------> +----+
			|Display|           |Edit|
			+-------+ <-------- +----+
				|       CANCEL
				|
				DELETE
				v
			+-------+
			|Deleted|
			+-------+
			*/

			var mStates = {
				DisplayState: "DisplayState",
				EditState: "EditState",
				ObjectDeletedState: "ObjectDeletedState"
			};
			var mTriggers = {
				Edit: "Edit",
				Cancel: "Cancel",
				Delete: "Delete",
				Save: "Save"
			};

			var oStateMachine = new StateMachine(mStates, mTriggers);

			//DisplayState + "Edit" ==> EditState
        	//DisplayState + "Delete" ==> ObjectDeletedState
			oStateMachine.configure(mStates.DisplayState)
				//.onEntry(this.onEnteredDisplayState.bind(this))
				.permit(mTriggers.Edit, mStates.EditState)
				.permit(mTriggers.Delete, mStates.ObjectDeletedState)
				.setData(new ExampleDisplayState(this,  this._oUtil, this._oViewModel, oStateMachine));

			//EditState + "Cancel" ==> DisplayState
			oStateMachine.configure(mStates.EditState)
				//.onEntry(this.onEnteredEditState.bind(this))
				//.beforeExit(this.onBeforeExitEditState.bind(this))
				.permit(mTriggers.Cancel, mStates.DisplayState)
				.permit(mTriggers.Save, mStates.DisplayState)
				.setData(new ExampleEditState(this, this._oUtil, this._oViewModel, oStateMachine));

			//ObjectDeletedState
			oStateMachine.configure(mStates.ObjectDeletedState)
				 //.onEntry(this.onEnteredObjectDeleteState.bind(this))
				.setData(new ExampleDeletedState(this, this._oUtil, this._oViewModel, this._oStateMachine));

			oStateMachine.onStateChanged(this.onStateChanged.bind(this));

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

		// onEnteredDisplayState: function (oEvent) {
			
		// },

		// onEnteredEditState: function (oEvent) {
			
		// },

		// onEnteredObjectDeleteState: function (oEvent) {
			
		// },

		// onBeforeExitEditState: function(oEvent) {
			
		// },

		// /////////////////////////////////////////////////////////////////////////////
		// /// View EventHandler
		// /////////////////////////////////////////////////////////////////////////////
		
		onViewEvent : function(sFunctionName, oEvent){			
			this._oCurrentState[sFunctionName](oEvent);			
		}
		
	});

});