sap.ui.define(["sap/ui/base/Object"],
  function(Object) {
    "use strict";

    var ExampleEditState = Object.extend("ExampleEditState", {
        constructor: function(oControllerDelegate, oUtil, oViewModel, oStateMachine) {
            Object.apply(this);
            this._oUtil = oUtil;
            this._oControllerDelegate = oControllerDelegate;
            this._oViewModel = oViewModel;
            this._oStateMachine = oStateMachine;
          }
    });

    // //////////////////////////////////////////////////////
    // /// Public functions
    // //////////////////////////////////////////////////////

    ExampleEditState.prototype.enterState = function (oEvent) {
        this._oViewModel.setProperty("/bEditButtonVisible", false);
        this._oViewModel.setProperty("/bDeleteButtonVisible", false);
        this._oViewModel.setProperty("/bCancelButtonVisible", true);
        this._oViewModel.setProperty("/bSaveButtonVisible", true);  
        this._oViewModel.setProperty("/bReloadButtonVisible", false);
    }; 

    ExampleEditState.prototype.onCancelPressed = function (oEvent) {
        this._oStateMachine.fire(this._oStateMachine.getTriggers().Cancel);
    };

    ExampleEditState.prototype.onSavePressed = function (oEvent) {
        this._oStateMachine.fire(this._oStateMachine.getTriggers().Save);
    };
    
    
    // //////////////////////////////////////////////////////
    // /// Private functions
    // //////////////////////////////////////////////////////


    return ExampleEditState;

}, /* bExport= */ true);
