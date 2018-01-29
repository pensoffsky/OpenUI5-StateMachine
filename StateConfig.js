sap.ui.define(['jquery.sap.global',
               'sap/ui/base/Object'],
  function(jQuery, Object, StateConfig) {
    "use strict";

    var StateConfig = Object.extend("StateConfig", {

      constructor : function() {
        Object.apply(this, arguments);
        this._oPermissions = {};
        this._fnOnEntry = null;
        this._fnBeforeExit = null;
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

    StateConfig.prototype.executeOnEntry = function () {
      if(this._fnOnEntry) {
        this._fnOnEntry();
      }
    };

    StateConfig.prototype.executeBeforeExit = function () {
        if(this._fnBeforeExit) {
            return this._fnBeforeExit();
        } else {
            return true;
        }
    };

    StateConfig.prototype.getStateForTrigger = function(sTrigger) {
      var sState = this._oPermissions[sTrigger];
      return sState;
    };



// //////////////////////////////////////////////////////
// /// Private functions
// //////////////////////////////////////////////////////

    return StateConfig;

}, /* bExport= */ true);
