sap.ui.define(['jquery.sap.global',
              'state/view/BaseStateJSONModel',
              "sap/m/MessageBox",
	          "sap/m/MessageToast",
              'state/StateMachine'],
  function(jQuery, BaseStateJSONModel, MessageBox, MessageToast, StateMachine) {
    "use strict";

    var MainStateJSONModel = BaseStateJSONModel.extend("MainStateJSONModel", {
        constructor : function() {
            BaseStateJSONModel.apply(this, arguments);
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
    MainStateJSONModel.create = function(oControllerDelegate) {
        var oMainStateJSONModel = new MainStateJSONModel();
        
        oMainStateJSONModel.setControllerDelegate(oControllerDelegate);
        
        oMainStateJSONModel.configureStateMachine();
        return oMainStateJSONModel;
    };


    // //////////////////////////////////////////////////////
    // /// State Machine Config
    // //////////////////////////////////////////////////////

    MainStateJSONModel.prototype.getDelegateFunctions = function() {
        //INFO could be injrected state config
        return [
            "byId",
            "onEnteredEditState"
        ]
    };
    
    //define the possible states of the UI
    MainStateJSONModel.prototype.getTriggers = function() {
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
    MainStateJSONModel.prototype.getStates = function() {
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
    
    MainStateJSONModel.prototype.configureStateMachine = function() {
    
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
        this._oStateMachine.setInitialState(this.getStates().DisplayState, true);
    
        return this._oStateMachine;
    };


    // //////////////////////////////////////////////////////
    // /// State Change Handler
    // //////////////////////////////////////////////////////

    MainStateJSONModel.prototype.onEnteredDisplayState = function () {
        console.log("display state");
        this._oControllerDelegate.byId("idStateText").setText(this._oStateMachine.getState());
        
        this._oViewModel.setProperty("/bCalculationControlsVisible", false);
        
        this._oControllerDelegate.byId("idEditButton").setVisible(true);
        this._oControllerDelegate.byId("idDeleteButton").setVisible(true);
        this._oControllerDelegate.byId("idCancelButton").setVisible(false);
        this._oControllerDelegate.byId("idSaveButton").setVisible(false);
    };

    MainStateJSONModel.prototype.onEnteredEditState = function () {
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
    MainStateJSONModel.prototype.onBeforeExitEditState = function() {
        //TODO is this a job for the controller or the calculation logic?
        this._oViewModel.setProperty("/sInput1Value", "");
        this._oViewModel.setProperty("/sInput2Value", "");
    };

    MainStateJSONModel.prototype.onEnteredDeleteState = function () {
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

    MainStateJSONModel.prototype.onEnteredObjectDeleteState = function () {
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
    
    MainStateJSONModel.prototype.getCalculationInput = function () {
        return {
            sValue1: this._oViewModel.getProperty("/sInput1Value"),
            sValue2: this._oViewModel.getProperty("/sInput2Value")
        };
    };
    
    MainStateJSONModel.prototype.prefillInputs = function (sValue) {
        this._oViewModel.setProperty("/sInput1Value", sValue);
        this._oViewModel.setProperty("/sInput2Value", sValue);
    };
    

    return MainStateJSONModel;

}, /* bExport= */ true);
