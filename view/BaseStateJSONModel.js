sap.ui.define(['jquery.sap.global',
                "state/view/BaseDelegateHandler",
              'sap/ui/model/json/JSONModel',
              'state/StateMachine'],
  function(jQuery, BaseDelegateHandler, JSONModel, StateMachine) {
    "use strict";

    var BaseStateJSONModel = BaseDelegateHandler.extend("BaseStateJSONModel", {
        constructor : function() {
            BaseDelegateHandler.apply(this, arguments);
            this._oStateMachine = new StateMachine(this.getStates(), this.getTriggers());
            this._oViewModel = new JSONModel();
            
          }
    });

    //define the possible states of the UI
    BaseStateJSONModel._oStateMachine = null;


// //////////////////////////////////////////////////////
// /// Public functions
// //////////////////////////////////////////////////////

    BaseStateJSONModel.prototype.getTriggers = function (fFunction) {
        return {};
    };

    BaseStateJSONModel.prototype.getStates = function (fFunction) {
        return {};
    };

    BaseStateJSONModel.prototype.fireTrigger = function (sTrigger) {
        console.log("fireTrigger " + sTrigger);
    
        this._oStateMachine.fire(sTrigger);
    };
    
    BaseStateJSONModel.prototype.getJSONModel = function () {
        return this._oViewModel;
    };
    
    

    // //////////////////////////////////////////////////////
    // /// Private functions
    // //////////////////////////////////////////////////////


    return BaseStateJSONModel;

}, /* bExport= */ true);
