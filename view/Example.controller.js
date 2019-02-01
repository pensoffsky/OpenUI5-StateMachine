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

		// /////////////////////////////////////////////////////////////////////////////
		// /// Member
		// /////////////////////////////////////////////////////////////////////////////   		

		_oStateMachine: null,
		_oViewModel: null,
		
		_oCurrentState: null,
		_oDisplayState: null,
		_oEditState: null,
		_oDeletedState: null,		

		_oUtil: null,

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

			this._oDisplayState = new ExampleDisplayState(this,  this._oUtil, this._oViewModel, this._oStateMachine);
			this._oEditState = new ExampleEditState(this, this._oUtil, this._oViewModel, this._oStateMachine);			
			this._oDeletedState = new ExampleDeletedState(this, this._oUtil, this._oViewModel, this._oStateMachine);
			
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
				.onEntry(this.onEnteredDisplayState.bind(this))
				.permit(mTriggers.Edit, mStates.EditState)
				.permit(mTriggers.Delete, mStates.ObjectDeletedState);

			//EditState + "Cancel" ==> DisplayState
			oStateMachine.configure(mStates.EditState)
				.onEntry(this.onEnteredEditState.bind(this))
				.beforeExit(this.onBeforeExitEditState.bind(this))
				.permit(mTriggers.Cancel, mStates.DisplayState)
				.permit(mTriggers.Save, mStates.DisplayState);

			//ObjectDeletedState
			oStateMachine.configure(mStates.ObjectDeletedState)
				.onEntry(this.onEnteredObjectDeleteState.bind(this));

			return oStateMachine;
		},

		// /////////////////////////////////////////////////////////////////////////////
		// /// StateMachine EventHandler
		// /////////////////////////////////////////////////////////////////////////////

		onEnteredDisplayState: function (oEvent) {
			this._oViewModel.setProperty("/sState", this._oStateMachine.getState());
			this._oCurrentState = this._oDisplayState;
			this._oCurrentState.enterState();
		},

		onEnteredEditState: function (oEvent) {
			this._oViewModel.setProperty("/sState", this._oStateMachine.getState());
			this._oCurrentState = this._oEditState;
			this._oCurrentState.enterState();
		},

		onEnteredObjectDeleteState: function (oEvent) {
			this._oViewModel.setProperty("/sState", this._oStateMachine.getState());
			this._oCurrentState = this._oDeletedState;
			this._oCurrentState.enterState();
		},

		onBeforeExitEditState: function(oEvent) {
			
		},

		// /////////////////////////////////////////////////////////////////////////////
		// /// View EventHandler
		// /////////////////////////////////////////////////////////////////////////////
		
		onViewEvent : function(sFunctionName, oEvent){			
			this._oCurrentState[sFunctionName](oEvent);			
		}
		
	});

});