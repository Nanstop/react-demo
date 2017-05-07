// uiModalFactory module
// This module is the base module for all modals in the Hijinks framework.
function(hijinks) {
    hijinks.uiModalFactory = {}, hijinks.uiModalFactory.create = function() {
        // Perform default inbound modal transition
        function performDefaultTransitionIn(instance, data) {
            // If the modal has an onTransitionIn function, execute it now
            // If the modal has an onTransitionIn function, execute it now
            return instance.onTransitionIn && "function" == typeof instance.onTransitionIn ? (logger.debug("executing onTransitionIn function for modal %s", instance.id),
            instance.onTransitionIn(data)) : Promise.resolve();
        }
        // Perform default outbound modal transition
        function performDefaultTransitionOut(instance) {
            // If the screen has an onTransitionOut function, execute it now
            // If the screen has an onTransitionOut function, execute it now
            return instance.onTransitionOut && "function" == typeof instance.onTransitionOut ? (logger.debug("executing onTransitionOut function for modal %s", instance.id),
            instance.onTransitionOut()) : Promise.resolve();
        }
        var logger, Promise;
        return function() {
            logger = window.logger, Promise = window.Promise;
            // Create screen component from uiComponent base
            var instance = hijinks.uiScreenFactory.create();
            // Setup method for handling default transition in for screen
            instance.transitionIn = function(data) {
                return instance.data = data, performDefaultTransitionIn(instance, data);
            }, // Setup method for handling default transition out for screen
            instance.transitionOut = function() {
                return performDefaultTransitionOut(instance);
            }, instance.close = function() {
                hijinks.modalManager.closeModal(instance);
            }, instance.getCurrentData = function() {
                return instance.data;
            }, // FIXME: IMPORTANT - events are executed in the order in which they are
            // bound.  Because key events are bound to the window, it is CRITICAL that
            // the ESC key events to close modals are bound after the back button is
            // bound, because the back button checks to see if a modal is open before
            // it takes action.  If we close the modal first, we also navigate back,
            // which is not what we want.
            //
            // In addition, we do not want key events to occur for any views or modals
            // under the topmost visible z-layer. To do this, we are going to check to
            // see if this window is the topmost before firing the handlers.  We do this
            // instead of binding and unbinding events.
            //
            // We really need to look at a global key handler to cover these cases.
            instance.makeKeyHandler = function(handler) {
                return function() {
                    hijinks.modalManager.getTopModal() === instance && (event.stopImmediatePropagation(),
                    // perform passed in handler
                    handler());
                };
            };
            var instanceHandler = instance.makeKeyHandler(instance.close);
            return instance.eventHandlers = [ {
                target: window,
                event: "keydown",
                data: "esc",
                handler: instanceHandler
            } ], instance;
        };
    }();
}(window.hijinks || (window.hijinks = {}))
