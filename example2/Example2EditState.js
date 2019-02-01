sap.ui.define(["sap/ui/base/Object"],
  function(Object) {
    "use strict";

    var Example2EditState = Object.extend("Example2EditState", {
        constructor: function(oControllerDelegate, oUtil, oViewModel) {
            Object.apply(this);
            this._oUtil = oUtil;
            this._oControllerDelegate = oControllerDelegate;
            this._oViewModel = oViewModel;
          }
    });

    // //////////////////////////////////////////////////////
    // /// Public functions
    // //////////////////////////////////////////////////////

    Example2EditState.prototype.enterState = function (oEvent) {
        this._oViewModel.setProperty("/sState", "Edit");
        this._oViewModel.setProperty("/bEditButtonVisible", false);
        this._oViewModel.setProperty("/bDeleteButtonVisible", false);
        this._oViewModel.setProperty("/bCancelButtonVisible", true);
        this._oViewModel.setProperty("/bSaveButtonVisible", true);  
        this._oViewModel.setProperty("/bReloadButtonVisible", false);
    }; 

    Example2EditState.prototype.onCancelPressed = function (oEvent) {
        this._oControllerDelegate._oStateMachine.fire(this._oControllerDelegate._oStateMachine.getTriggers().Cancel);
    };

    Example2EditState.prototype.onSavePressed = function (oEvent) {
        this._oControllerDelegate._oStateMachine.fire(this._oControllerDelegate._oStateMachine.getTriggers().Save);
    };
    
    
    // //////////////////////////////////////////////////////
    // /// Private functions
    // //////////////////////////////////////////////////////


    return Example2EditState;

}, /* bExport= */ true);
