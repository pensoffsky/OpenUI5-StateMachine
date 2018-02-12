sap.ui.define(['jquery.sap.global',
                "state/view/BaseDelegateHandler",
              'sap/ui/model/json/JSONModel',
              'state/StateMachine'],
  function(jQuery, BaseDelegateHandler, JSONModel, StateMachine) {
    "use strict";

    var BaseViewState = BaseDelegateHandler.extend("BaseViewState", {
        constructor : function() {
            BaseDelegateHandler.apply(this, arguments);
            this._oStateMachine = new StateMachine(this.getStates(), this.getTriggers());
            this._oViewModel = new JSONModel();
            
          }
    });

    //define the possible states of the UI
    BaseViewState._oStateMachine = null;


// //////////////////////////////////////////////////////
// /// Public functions
// //////////////////////////////////////////////////////

    BaseViewState.prototype.getTriggers = function (fFunction) {
        return {};
    };

    BaseViewState.prototype.getStates = function (fFunction) {
        return {};
    };

    BaseViewState.prototype.fireTrigger = function (sTrigger) {
        console.log("fireTrigger " + sTrigger);
    
        this._oStateMachine.fire(sTrigger);
    };
    
    BaseViewState.prototype.resetState = function (bFireStateEvent) {    
        this._oStateMachine.reset(bFireStateEvent);
    };
    
    BaseViewState.prototype.getJSONModel = function () {
        return this._oViewModel;
    };
    
    

    // //////////////////////////////////////////////////////
    // /// Private functions
    // //////////////////////////////////////////////////////


    return BaseViewState;

}, /* bExport= */ true);
