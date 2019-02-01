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

		_mStates: {
			DisplayState: "DisplayState",
			EditState: "EditState",
			ObjectDeletedState: "ObjectDeletedState"
		},
		_mTriggers: {
			Edit: "Edit",
			Cancel: "Cancel",
			Delete: "Delete",
			Save: "Save"
		},

		_oStateMachine: null,
		_oViewModel: null,
		
		_oCurrentState: null,
		_oDisplayState: null,
		_oEditState: null,
		_oDeletedSate: null,		

		_oUtil: null,

		// /////////////////////////////////////////////////////////////////////////////
		// /// Initialization
		// /////////////////////////////////////////////////////////////////////////////

		onInit: function() {
			if (Controller.prototype.onInit) {
				Controller.prototype.onInit.apply(this, arguments);
			}

			this._oViewModel = new JSONModel();
			this.getView().setModel(this._oViewModel, "viewModel");

			this._oUtil = new ExampleUtil();

			this._oStateMachine = this._configureStateMachine();

			this._oDisplayState = new ExampleDisplayState(this, this._oViewModel, this._oStateMachine);
			this._oEditState = new ExampleEditState(this, this._oViewModel, this._oStateMachine);
			this._oDeleteState = new ExampleDeletedState(this, this._oViewModel, this._oStateMachine);
			
			//start the machine in DisplayState state, fire initial state event
			//could also be called on router handleRouteMatched handler
			this._oStateMachine.setInitialState(this._mStates.DisplayState, true /*bFireInitialStateEvent*/);
		},


		_configureStateMachine: function() {
			var oStateMachine = new StateMachine(this._mStates, this._mTriggers);

			//DisplayState + "Edit" ==> EditState
        	//DisplayState + "Delete" ==> ObjectDeletedState
			oStateMachine.configure(this._mStates.DisplayState)
				.onEntry(this.onEnteredDisplayState.bind(this))
				.permit(this._mTriggers.Edit, this._mStates.EditState)
				.permit(this._mTriggers.Delete, this._mStates.ObjectDeletedState);

			//EditState + "Cancel" ==> DisplayState
			oStateMachine.configure(this._mStates.EditState)
				.onEntry(this.onEnteredEditState.bind(this))
				.beforeExit(this.onBeforeExitEditState.bind(this))
				.permit(this._mTriggers.Cancel, this._mStates.DisplayState)
				.permit(this._mTriggers.Save, this._mStates.DisplayState);

			//ObjectDeletedState
			oStateMachine.configure(this._mStates.ObjectDeletedState)
				.onEntry(this.onEnteredObjectDeleteState.bind(this));

			return oStateMachine;
		},

		// /////////////////////////////////////////////////////////////////////////////
		// /// StateMachine EventHandler
		// /////////////////////////////////////////////////////////////////////////////

		onEnteredDisplayState: function (oEvent) {
			this._oViewModel.setProperty("/sState", this._oStateMachine.getState());
			this._oCurrentState = this._oDisplayState;
		},

		onEnteredEditState: function (oEvent) {
			this._oViewModel.setProperty("/sState", this._oStateMachine.getState());
			this._oCurrentState = this._oEditState;
		},

		onEnteredObjectDeleteState: function (oEvent) {
			this._oViewModel.setProperty("/sState", this._oStateMachine.getState());
			this._oCurrentState = this._oDeletedSate;
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