sap.ui.define(["sap/ui/base/Object"],
  function(Object) {
    "use strict";

    var ExampleUtil = Object.extend("ExampleUtil", {
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

    ExampleUtil.prototype.onEditPressed = function (oEvent) {
        this._oStateMachine.fire(this._oStateMachine.getTriggers().Edit);
        // this._oViewModel.setProperty("/sState", this._oStateMachine.getState());
    };
    
    
    // //////////////////////////////////////////////////////
    // /// Private functions
    // //////////////////////////////////////////////////////


    return ExampleUtil;

}, /* bExport= */ true);
