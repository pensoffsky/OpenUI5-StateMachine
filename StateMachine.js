sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject'],
  function(jQuery, ManagedObject) {
    "use strict";

    var StateMachine = ManagedObject.extend("StateMachine", {
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
      }
    });


// //////////////////////////////////////////////////////
// /// Public functions
// //////////////////////////////////////////////////////

    StateMachine.prototype.test = function() {
        return false;
    };



// //////////////////////////////////////////////////////
// /// Private functions
// //////////////////////////////////////////////////////

    return StateMachine;

}, /* bExport= */ true);
