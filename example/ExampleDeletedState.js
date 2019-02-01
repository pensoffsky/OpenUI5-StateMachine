sap.ui.define(["sap/ui/base/Object"],
  function(Object) {
    "use strict";

    var ExampleDeletedState = Object.extend("ExampleDeletedState", {
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

    ExampleDeletedState.prototype.enterState = function (oEvent) {
        this._oViewModel.setProperty("/sState", "Deleted");
        this._oViewModel.setProperty("/bEditButtonVisible", false);
        this._oViewModel.setProperty("/bDeleteButtonVisible", false);
        this._oViewModel.setProperty("/bCancelButtonVisible", false);
        this._oViewModel.setProperty("/bSaveButtonVisible", false);  
        this._oViewModel.setProperty("/bReloadButtonVisible", true);
    };

    ExampleDeletedState.prototype.onReloadPressed = function (oEvent) {
        this._oUtil.reload(); 
    };
    
    // //////////////////////////////////////////////////////
    // /// Private functions
    // //////////////////////////////////////////////////////

    return ExampleDeletedState;

}, /* bExport= */ true);
