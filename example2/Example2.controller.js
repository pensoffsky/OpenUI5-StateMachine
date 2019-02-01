sap.ui.define([
	'state/example2/Example2BaseStateController',
	'sap/ui/model/json/JSONModel',
	'state/example2/Example2DisplayState',
	'state/example2/Example2EditState',
	'state/example2/Example2DeletedState',
	'state/example2/Example2Util'
], function(Example2BaseStateController, JSONModel, Example2DisplayState, Example2EditState, Example2DeletedState, Example2Util) {
	"use strict";

	return Example2BaseStateController.extend("example2.Example2", {

		//TODO destroy machine on exit

		// /////////////////////////////////////////////////////////////////////////////
		// /// Member (for documentation purposes)
		// /////////////////////////////////////////////////////////////////////////////   		

		_oViewModel: null,
		_oUtil: null,

		// /////////////////////////////////////////////////////////////////////////////
		// /// Initialization
		// /////////////////////////////////////////////////////////////////////////////

		onInit: function() {
			if (Example2BaseStateController.prototype.onInit) {
				Example2BaseStateController.prototype.onInit.apply(this, arguments);
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

			this._oUtil = new Example2Util();

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
			var oStateMachineConfig = {
				aStates: [{ //the display state
					sName: mStates.DisplayState,
					vData: new Example2DisplayState(this, this._oUtil, this._oViewModel),
					aTransitions: [{
						sTrigger: mTriggers.Edit,
						sTargetState: mStates.EditState
					}, {
						sTrigger: mTriggers.Delete,
						sTargetState: mStates.ObjectDeletedState
					}]
				},{ //the edit state
					sName: mStates.EditState,
					vData: new Example2EditState(this, this._oUtil, this._oViewModel),
					aTransitions: [{
						sTrigger: mTriggers.Save,
						sTargetState: mStates.DisplayState
					}, {
						sTrigger: mTriggers.Cancel,
						sTargetState: mStates.DisplayState
					}]
				},{ //the object deleted state
					sName: mStates.ObjectDeletedState,
					vData: new Example2DeletedState(this, this._oUtil, this._oViewModel),
					aTransitions: []
				}]
			}

			this._configureStateMachine(mStates, mTriggers, oStateMachineConfig);
			
			//start the machine in DisplayState state, fire initial state event
			//could also be called on router handleRouteMatched handler
			this._oStateMachine.setInitialState(this._oStateMachine.getStates().DisplayState, true /*bFireInitialStateEvent*/);
		}	
		
	});

});