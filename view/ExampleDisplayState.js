sap.ui.define(["sap/ui/base/Object"],
  function(Object) {
    "use strict";

    var ExampleDisplayState = Object.extend("ExampleDisplayState", {
        constructor: function(oControllerDelegate, oViewModel, oStateMachine) {
            Object.apply(this);
            this._oControllerDelegate = oControllerDelegate;
            this._oViewModel = oViewModel;
            this._oStateMachine = oStateMachine;
          }
    });

    // //////////////////////////////////////////////////////
    // /// EventHandler functions
    // //////////////////////////////////////////////////////

    ExampleDisplayState.prototype.onEditPressed = function (oEvent) {
        this._oStateMachine.fire(this._oStateMachine.getTriggers().Edit);        
    };

    ExampleDisplayState.prototype.onDeletePressed = function (oEvent) {
        this._oStateMachine.fire(this._oStateMachine.getTriggers().Delete);
    };
    
    
    // //////////////////////////////////////////////////////
    // /// Private functions
    // //////////////////////////////////////////////////////


    return ExampleDisplayState;

}, /* bExport= */ true);
