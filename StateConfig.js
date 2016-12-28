sap.ui.define(['jquery.sap.global',
               'sap/ui/base/ManagedObject'],
  function(jQuery, ManagedObject, StateConfig) {
    "use strict";

    var StateConfig = ManagedObject.extend("StateConfig", {
      metadata: {
        properties: {
          repeat: {
            type: "boolean",
              defaultValue: true
            }
        },
        events: {
	        press : {},
	        animationFinished : {},
	        animationStarted : {}
        }
      },

      constructor : function() {
    		ManagedObject.apply(this, arguments);
    		this._oPermissions = {};
        this._fnOnEntry = null;
        this._fnBeforeExit = null;
    	}
    });


// //////////////////////////////////////////////////////
// /// Public functions
// //////////////////////////////////////////////////////

    StateConfig.prototype.permit = function(sTrigger, sState) {
      this._oPermissions[sTrigger] = sState;
      return this;
    };

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
        this._fnBeforeExit();
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
