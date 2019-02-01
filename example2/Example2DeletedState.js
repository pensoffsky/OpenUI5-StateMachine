sap.ui.define(["sap/ui/base/Object"],
  function(Object) {
    "use strict";

    var Example2DeletedState = Object.extend("Example2DeletedState", {
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

    Example2DeletedState.prototype.enterState = function (oEvent) {
        this._oViewModel.setProperty("/sState", "Deleted");
        this._oViewModel.setProperty("/bEditButtonVisible", false);
        this._oViewModel.setProperty("/bDeleteButtonVisible", false);
        this._oViewModel.setProperty("/bCancelButtonVisible", false);
        this._oViewModel.setProperty("/bSaveButtonVisible", false);  
        this._oViewModel.setProperty("/bReloadButtonVisible", true);
    };

    Example2DeletedState.prototype.onReloadPressed = function (oEvent) {
        this._oUtil.reload(); 
    };
    
    // //////////////////////////////////////////////////////
    // /// Private functions
    // //////////////////////////////////////////////////////

    return Example2DeletedState;

}, /* bExport= */ true);
