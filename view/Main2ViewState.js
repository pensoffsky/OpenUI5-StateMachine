sap.ui.define(['jquery.sap.global',
              'state/view/MainViewState',
              "sap/m/MessageBox",
	          "sap/m/MessageToast",
              'state/StateMachine'],
  function(jQuery, MainViewState, MessageBox, MessageToast, StateMachine) {
    "use strict";

    var MainViewState2 = MainViewState.extend("MainViewState2", {
        constructor : function() {
            MainViewState.apply(this, arguments);
      }
    });

    //define the possible states of the UI
    MainViewState2.create = function(oControllerDelegate, bFireInitialStateEvent) {
        var oViewState = new MainViewState2();
        
        oViewState.setControllerDelegate(oControllerDelegate);
        
        oViewState.configureStateMachine(bFireInitialStateEvent);
        return oViewState;
    };


    // //////////////////////////////////////////////////////
    // /// State Machine Config
    // //////////////////////////////////////////////////////


//TODO can we add the function to an array so that it is accumulative
    // MainViewState2.prototype.getDelegateFunctions = function() {
    //     //INFO could be injrected state config
    //     return [
    //         "onEnteredDeleteState"
    //     ]
    // };


// //////////////////////////////////////////////////////
// /// Public functions
// //////////////////////////////////////////////////////

    // //////////////////////////////////////////////////////
    // /// State Change Handler
    // //////////////////////////////////////////////////////

    

    MainViewState2.prototype.onEnteredDeleteState = function (oEvent) {
        console.log("delete state");
        this._oControllerDelegate.byId("idStateText").setText(this._oStateMachine.getState());
        
        this._oViewModel.setProperty("/bCalculationControlsVisible", false);
        this._oControllerDelegate.byId("idEditButton").setVisible(true);
        this._oControllerDelegate.byId("idDeleteButton").setVisible(true);
        this._oControllerDelegate.byId("idCancelButton").setVisible(false);
        this._oControllerDelegate.byId("idSaveButton").setVisible(false);
        
        //deletion was confirmed
        this._oStateMachine.fire(this.getTriggers().DeleteConfirm);
    };


    // /////////////////////////////////////////////////////////////////////////////
    // /// JSOM Model Data Access
    // /////////////////////////////////////////////////////////////////////////////
    

    return MainViewState2;

}, /* bExport= */ true);
