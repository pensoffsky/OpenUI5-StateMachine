sap.ui.define(['jquery.sap.global',
              'state/view/BaseViewState',
              "sap/m/MessageBox",
	          "sap/m/MessageToast",
              'state/StateMachine'],
  function(jQuery, BaseViewState, MessageBox, MessageToast, StateMachine) {
    "use strict";

    var MainViewState3 = BaseViewState.extend("MainViewState3", {
        constructor : function() {
            BaseViewState.apply(this, arguments);
      }
    });

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

    //define the possible states of the UI
    MainViewState3.create = function(oControllerDelegate, bFireInitialStateEvent) {
        var oViewState = new MainViewState3();
        
        oViewState.setControllerDelegate(oControllerDelegate);
        
        oViewState.configureStateMachine(bFireInitialStateEvent);
        return oViewState;
    };


    // //////////////////////////////////////////////////////
    // /// State Machine Config
    // //////////////////////////////////////////////////////

    MainViewState3.prototype.getDelegateFunctions = function() {
        //INFO could be injrected state config
        return [
            "onStateEntered"
        ]
    };

    //define the possible states of the UI
    MainViewState3.prototype.getTriggers = function() {
        //INFO could be injrected state config
        return {
            Edit: "Edit",
            Cancel: "Cancel",
            Delete: "Delete",
            Save: "Save"
        }
    };

    //define the possible triggers
    MainViewState3.prototype.getStates = function() {
        //INFO could be injrected state config
        return {
            DisplayState: "DisplayState",
            EditState: "EditState",
            ObjectDeletedState: "ObjectDeletedState"
        }
    };


// //////////////////////////////////////////////////////
// /// Public functions
// //////////////////////////////////////////////////////

    MainViewState3.prototype.configureStateMachine = function(bFireInitialStateEvent) {

        //DisplayState + "Edit" ==> EditState
        //DisplayState + "Delete" ==> ObjectDeletedState
        this._oStateMachine.configure(this.getStates().DisplayState)
            .onEntry(this.onEnteredDisplayState.bind(this))
            .permit(this.getTriggers().Edit, this.getStates().EditState)
            .permit(this.getTriggers().Delete, this.getStates().ObjectDeletedState);

        //EditState + "Cancel" ==> DisplayState
        this._oStateMachine.configure(this.getStates().EditState)
            .onEntry(this.onEnteredEditState.bind(this))
            .beforeExit(this.onBeforeExitEditState.bind(this))
            .permit(this.getTriggers().Cancel, this.getStates().DisplayState)
            .permit(this.getTriggers().Save, this.getStates().DisplayState);

        //ObjectDeletedState
        this._oStateMachine.configure(this.getStates().ObjectDeletedState)
            .onEntry(this.onEnteredObjectDeleteState.bind(this));

        //start the machine in DisplayState state, fire initial state event
        this._oStateMachine.setInitialState(this.getStates().DisplayState, bFireInitialStateEvent);

        return this._oStateMachine;
    };


    // //////////////////////////////////////////////////////
    // /// State Change Handler
    // //////////////////////////////////////////////////////

//TODO add an event that fires on all state changes

    MainViewState3.prototype.onEnteredDisplayState = function (oEvent) {
        this._oControllerDelegate.onStateEntered(this._oStateMachine.getState());
    };

    MainViewState3.prototype.onEnteredEditState = function (oEvent) {
        this._oControllerDelegate.onStateEntered(this._oStateMachine.getState());
    };
    MainViewState3.prototype.onBeforeExitEditState = function(oEvent) {
        this._oControllerDelegate.onStateEntered(this._oStateMachine.getState());
    };

    MainViewState3.prototype.onEnteredObjectDeleteState = function (oEvent) {
        this._oControllerDelegate.onStateEntered(this._oStateMachine.getState());
    };

    // /////////////////////////////////////////////////////////////////////////////
    // /// JSOM Model Data Access
    // /////////////////////////////////////////////////////////////////////////////
    

    return MainViewState3;

}, /* bExport= */ true);
