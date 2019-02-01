sap.ui.define(["sap/ui/base/Object"],
  function(Object) {
    "use strict";

    var ExampleEditState = Object.extend("ExampleEditState", {
        constructor: function(oControllerDelegate, oViewModel, oStateMachine) {
            Object.apply(this);
            this._oControllerDelegate = oControllerDelegate;
            this._oViewModel = oViewModel;
            this._oStateMachine = oStateMachine;
          }
    });

    // //////////////////////////////////////////////////////
    // /// Public functions
    // //////////////////////////////////////////////////////

    ExampleEditState.prototype.onCancelPressed = function (oEvent) {
        this._oStateMachine.fire(this._oStateMachine.getTriggers().Cancel);
        
        
        // this._oViewModel.setProperty("/sState", this._oStateMachine.getState());
    };

    ExampleEditState.prototype.onSavePressed = function (oEvent) {
        this._oStateMachine.fire(this._oStateMachine.getTriggers().Save);
        
        
        // this._oViewModel.setProperty("/sState", this._oStateMachine.getState());
    };
    
    
    // //////////////////////////////////////////////////////
    // /// Private functions
    // //////////////////////////////////////////////////////


    return ExampleEditState;

}, /* bExport= */ true);
