sap.ui.define(['jquery.sap.global',
               'sap/ui/base/Object'],
  function(jQuery, Object, StateConfig) {
    "use strict";

    var StateConfig = Object.extend("StateConfig", {

      constructor : function(sState) {
        Object.apply(this, arguments);
        this._oPermissions = {};
        this._fnOnEntry = null;
        this._fnBeforeExit = null;
        this._vData = null;
        this._sState = sState;
        }
    });


// //////////////////////////////////////////////////////
// /// Public functions
// //////////////////////////////////////////////////////

    /**
     * define for the trigger what state to end up in
     * @param  {string} sTrigger trigger applied to the state defined in the StateConfig
     * @param  {string} sState   state the machine ends up in
     * @return {object}          the stateconfig object for chaining
     */
    StateConfig.prototype.permit = function(sTrigger, sState) {
      this._oPermissions[sTrigger] = sState;
      return this;
    };

    /**
     * setup a callback that is called when the state is reached
     * @param  {function} fnCallback   callback to call when the state is active
     * @return {object}          the stateconfig object for chaining
     */
    StateConfig.prototype.onEntry = function(fnCallback) {
      this._fnOnEntry = fnCallback;
      return this;
    };

    StateConfig.prototype.beforeExit = function(fnCallback) {
      this._fnBeforeExit = fnCallback;
      return this;
    };

    StateConfig.prototype.executeOnEntry = function (oEvent) {
      if(this._fnOnEntry) {
        this._fnOnEntry(oEvent);
      }
    };

    StateConfig.prototype.executeBeforeExit = function (oEvent) {
        if(this._fnBeforeExit) {
            this._fnBeforeExit(oEvent);
        }
    };

    StateConfig.prototype.getStateForTrigger = function(sTrigger) {
      var sState = this._oPermissions[sTrigger];
      return sState;
    };

    /**
     * store any kind of data on a state config. 
     */
    StateConfig.prototype.setData = function(vData) {
      this._vData = vData;
      return this;
    };

    /**
     * returns data stored with setData
     */
    StateConfig.prototype.getData = function() {      
      return this._vData;
    };

/**
     * returns the state of this stateConfig
     */
    StateConfig.prototype.getState = function() {      
      return this._sState;
    };

// //////////////////////////////////////////////////////
// /// Private functions
// //////////////////////////////////////////////////////

    return StateConfig;

}, /* bExport= */ true);
