sap.ui.define(['jquery.sap.global',
              'state/view/BaseViewState',
              "sap/m/MessageBox",
	          "sap/m/MessageToast",
              'state/StateMachine'],
  function(jQuery, BaseViewState, MessageBox, MessageToast, StateMachine) {
    "use strict";

    var MainViewState = BaseViewState.extend("MainViewState", {
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
           ^    |       CANCEL
           |    |
     CANCEL|    | DELETE
           |    v
          +------+
          |Delete|
          +------+
              |
              | DeleteConfirm
              v
          +-------+
          |Deleted|
          +-------+
    */

    //define the possible states of the UI
    MainViewState.create = function(oControllerDelegate, bFireInitialStateEvent) {
        var MaineViewState = new MainViewState();
        
        MaineViewState.setControllerDelegate(oControllerDelegate);
        
        MaineViewState.configureStateMachine(bFireInitialStateEvent);
        return MaineViewState;
    };


    // //////////////////////////////////////////////////////
    // /// State Machine Config
    // //////////////////////////////////////////////////////

    MainViewState.prototype.getDelegateFunctions = function() {
        //INFO could be injrected state config
        return [
            "byId",
            "onEnteredEditState"
        ]
    };
    
    //define the possible states of the UI
    MainViewState.prototype.getTriggers = function() {
        //INFO could be injrected state config
        return {
            Edit: "Edit",
            Cancel: "Cancel",
            Delete: "Delete",
            DeleteConfirm: "DeleteConfirm",
            Save: "Save"
        }
    };

    //define the possible triggers
    MainViewState.prototype.getStates = function() {
        //INFO could be injrected state config
        return {
            DisplayState: "DisplayState",
            EditState: "EditState",
            DeleteState: "DeleteState",
            ObjectDeletedState: "ObjectDeletedState"
        }
    };


// //////////////////////////////////////////////////////
// /// Public functions
// //////////////////////////////////////////////////////
    
    MainViewState.prototype.configureStateMachine = function(bFireInitialStateEvent) {
    
        //DisplayState + "Edit" ==> EditState
        //DisplayState + "Delete" ==> DeleteState
        this._oStateMachine.configure(this.getStates().DisplayState)
            .onEntry(this.onEnteredDisplayState.bind(this))
            .permit(this.getTriggers().Edit, this.getStates().EditState)
            .permit(this.getTriggers().Delete, this.getStates().DeleteState);
    
        //EditState + "Cancel" ==> DisplayState
        this._oStateMachine.configure(this.getStates().EditState)
            .onEntry(this.onEnteredEditState.bind(this))
            .beforeExit(this.onBeforeExitEditState.bind(this))
            .permit(this.getTriggers().Cancel, this.getStates().DisplayState)
            .permit(this.getTriggers().Save, this.getStates().DisplayState);
    
        //DeleteState + "Cancel" ==> DisplayState
        this._oStateMachine.configure(this.getStates().DeleteState)
            .onEntry(this.onEnteredDeleteState.bind(this))
            .permit(this.getTriggers().Cancel, this.getStates().DisplayState)
            .permit(this.getTriggers().DeleteConfirm, this.getStates().ObjectDeletedState);
    
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

    MainViewState.prototype.onEnteredDisplayState = function (oEvent) {
        console.log("display state");
        this._oControllerDelegate.byId("idStateText").setText(this._oStateMachine.getState());
        
        this._oViewModel.setProperty("/bCalculationControlsVisible", false);
        
        this._oControllerDelegate.byId("idEditButton").setVisible(true);
        this._oControllerDelegate.byId("idDeleteButton").setVisible(true);
        this._oControllerDelegate.byId("idCancelButton").setVisible(false);
        this._oControllerDelegate.byId("idSaveButton").setVisible(false);
    };

    MainViewState.prototype.onEnteredEditState = function (oEvent) {
        if(this._oControllerDelegate.onEnteredEditState()){
            return;
        }
        
        console.log("edit state");
        this._oControllerDelegate.byId("idStateText").setText(this._oStateMachine.getState());
        
        this._oViewModel.setProperty("/bCalculationControlsVisible", true);
        this._oControllerDelegate.byId("idEditButton").setVisible(false);
        this._oControllerDelegate.byId("idDeleteButton").setVisible(false);
        this._oControllerDelegate.byId("idCancelButton").setVisible(true);
        this._oControllerDelegate.byId("idSaveButton").setVisible(true);
    };

    //reset data before leaving the edit state
    MainViewState.prototype.onBeforeExitEditState = function(oEvent) {
        //TODO is this a job for the controller or the calculation logic?
        this._oViewModel.setProperty("/sInput1Value", "");
        this._oViewModel.setProperty("/sInput2Value", "");
    };

    MainViewState.prototype.onEnteredDeleteState = function (oEvent) {
        console.log("delete state");
        this._oControllerDelegate.byId("idStateText").setText(this._oStateMachine.getState());
        
        this._oViewModel.setProperty("/bCalculationControlsVisible", false);
        this._oControllerDelegate.byId("idEditButton").setVisible(true);
        this._oControllerDelegate.byId("idDeleteButton").setVisible(true);
        this._oControllerDelegate.byId("idCancelButton").setVisible(false);
        this._oControllerDelegate.byId("idSaveButton").setVisible(false);
        
        MessageBox.show(
            "Really delete this object?", {
                title: "Delete",
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function(oAction) { 
                    if(oAction === MessageBox.Action.YES) {
                        MessageToast.show("Object deleted");
                        
                        //deletion was confirmed
                        this._oStateMachine.fire(this.getTriggers().DeleteConfirm);
                    } else {
                        
                        //cancel deletion
                        this._oStateMachine.fire(this.getTriggers().Cancel);
                    }
                }.bind(this)
            }
        );
    };

    MainViewState.prototype.onEnteredObjectDeleteState = function (oEvent) {
        console.log("objectDeleted state");
        this._oControllerDelegate.byId("idStateText").setText(this._oStateMachine.getState());
        
        this._oControllerDelegate.byId("idInput").setVisible(false);
        this._oControllerDelegate.byId("idEditButton").setVisible(false);
        this._oControllerDelegate.byId("idDeleteButton").setVisible(false);
        this._oControllerDelegate.byId("idCancelButton").setVisible(false);
        this._oControllerDelegate.byId("idSaveButton").setVisible(false);
    };

    // /////////////////////////////////////////////////////////////////////////////
    // /// JSOM Model Data Access
    // /////////////////////////////////////////////////////////////////////////////

    //provide methods to access data from the jsonmodel instead of directly accessing via setProperty
    
    MainViewState.prototype.getCalculationInput = function () {
        return {
            sValue1: this._oViewModel.getProperty("/sInput1Value"),
            sValue2: this._oViewModel.getProperty("/sInput2Value")
        };
    };
    
    MainViewState.prototype.prefillInputs = function (sValue) {
        this._oViewModel.setProperty("/sInput1Value", sValue);
        this._oViewModel.setProperty("/sInput2Value", sValue);
    };
    

    return MainViewState;

}, /* bExport= */ true);
