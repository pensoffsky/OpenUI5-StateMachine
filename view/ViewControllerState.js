sap.ui.define(['jquery.sap.global',
              'sap/ui/base/Object',
              "sap/m/MessageBox",
	          "sap/m/MessageToast",
              'state/StateMachine'],
  function(jQuery, Object, MessageBox, MessageToast, StateMachine) {
    "use strict";

    var ViewControllerState = Object.extend("ViewControllerState", {
        
        
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
    ViewControllerState.mStates = {
        DisplayState: "DisplayState",
        EditState: "EditState",
        DeleteState: "DeleteState",
        ObjectDeletedState: "ObjectDeletedState"
    };

    //define the triggers that can change the state of the UI
    ViewControllerState.mTrigger = {
        Edit: "Edit",
        Cancel: "Cancel",
        Delete: "Delete",
        DeleteConfirm: "DeleteConfirm",
        Save: "Save"
    };


// //////////////////////////////////////////////////////
// /// Public functions
// //////////////////////////////////////////////////////

    ViewControllerState.prototype.assertIsFunction = function (fFunction) {
        if (fFunction && typeof fFunction === "function"){
            return true;
        }
        throw("not a function");
    };
    
    ViewControllerState.prototype.createStateMachine = function(oControllerDelegate) {
        // this.assertIsFunction(oControllerDelegate._onEnteredDisplayState);
        // this.assertIsFunction(oControllerDelegate._onEnteredEditState);
        // this.assertIsFunction(oControllerDelegate._onEnteredDeleteState);
        // this.assertIsFunction(oControllerDelegate._onEnteredObjectDeleteState);
        this.assertIsFunction(oControllerDelegate.byId);
        
        this._oControllerDelegate = oControllerDelegate;
        
        //crate the stateMachine and configure it
        this._oStateMachine = new StateMachine(ViewControllerState.mStates, ViewControllerState.mTrigger);

        //DisplayState + "Edit" ==> EditState
        //DisplayState + "Delete" ==> DeleteState
        this._oStateMachine.configure(ViewControllerState.mStates.DisplayState)
            .onEntry(this.onEnteredDisplayState.bind(this))
            .permit(ViewControllerState.mTrigger.Edit, ViewControllerState.mStates.EditState)
            .permit(ViewControllerState.mTrigger.Delete, ViewControllerState.mStates.DeleteState);
            
        //EditState + "Cancel" ==> DisplayState
        this._oStateMachine.configure(ViewControllerState.mStates.EditState)
            .onEntry(this.onEnteredEditState.bind(this))
            .beforeExit(this.onBeforeExitEditState.bind(this))
            .permit(ViewControllerState.mTrigger.Cancel, ViewControllerState.mStates.DisplayState)
            .permit(ViewControllerState.mTrigger.Save, ViewControllerState.mStates.DisplayState);
        
        //DeleteState + "Cancel" ==> DisplayState
        this._oStateMachine.configure(ViewControllerState.mStates.DeleteState)
            .onEntry(this.onEnteredDeleteState.bind(this))
            .permit(ViewControllerState.mTrigger.Cancel, ViewControllerState.mStates.DisplayState)
            .permit(ViewControllerState.mTrigger.DeleteConfirm, ViewControllerState.mStates.ObjectDeletedState);
        
        //ObjectDeletedState
        this._oStateMachine.configure(ViewControllerState.mStates.ObjectDeletedState)
            .onEntry(this.onEnteredObjectDeleteState.bind(this));
    
        //start the machine in DisplayState state, fire initial state event
        this._oStateMachine.setInitialState(ViewControllerState.mStates.DisplayState, true);
        
        return this._oStateMachine;
    };

    ViewControllerState.prototype.fireTrigger = function (sTrigger) {
        console.log("fireTrigger " + sTrigger);
    
        this._oStateMachine.fire(sTrigger);
    };


    // //////////////////////////////////////////////////////
    // /// Private functions
    // //////////////////////////////////////////////////////

    ViewControllerState.prototype.onEnteredDisplayState = function () {
        console.log("display state");
        this._oControllerDelegate.byId("idStateText").setText(this._oStateMachine.getState());
        
        this._oControllerDelegate.byId("idInput").setVisible(false);
        this._oControllerDelegate.byId("idEditButton").setVisible(true);
        this._oControllerDelegate.byId("idDeleteButton").setVisible(true);
        this._oControllerDelegate.byId("idCancelButton").setVisible(false);
        this._oControllerDelegate.byId("idSaveButton").setVisible(false);
    };

    ViewControllerState.prototype.onEnteredEditState = function () {
        console.log("edit state");
        this._oControllerDelegate.byId("idStateText").setText(this._oStateMachine.getState());
        
        this._oControllerDelegate.byId("idInput").setVisible(true);
        this._oControllerDelegate.byId("idEditButton").setVisible(false);
        this._oControllerDelegate.byId("idDeleteButton").setVisible(false);
        this._oControllerDelegate.byId("idCancelButton").setVisible(true);
        this._oControllerDelegate.byId("idSaveButton").setVisible(true);
    };

    //reset data before leaving the edit state
    ViewControllerState.prototype.onBeforeExitEditState = function() {
        this._oControllerDelegate.byId("idInput").setValue("");
    };

    ViewControllerState.prototype.onEnteredDeleteState = function () {
        console.log("delete state");
        this._oControllerDelegate.byId("idStateText").setText(this._oStateMachine.getState());
        
        this._oControllerDelegate.byId("idInput").setVisible(false);
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
                        this._oStateMachine.fire(ViewControllerState.mTrigger.DeleteConfirm);
                    } else {
                        
                        //cancel deletion
                        this._oStateMachine.fire(ViewControllerState.mTrigger.Cancel);
                    }
                }.bind(this)
            }
        );
    };

    ViewControllerState.prototype.onEnteredObjectDeleteState = function () {
        console.log("objectDeleted state");
        this._oControllerDelegate.byId("idStateText").setText(this._oStateMachine.getState());
        
        this._oControllerDelegate.byId("idInput").setVisible(false);
        this._oControllerDelegate.byId("idEditButton").setVisible(false);
        this._oControllerDelegate.byId("idDeleteButton").setVisible(false);
        this._oControllerDelegate.byId("idCancelButton").setVisible(false);
        this._oControllerDelegate.byId("idSaveButton").setVisible(false);
    };

    return ViewControllerState;

}, /* bExport= */ true);
