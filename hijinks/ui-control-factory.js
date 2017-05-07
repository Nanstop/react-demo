// uiControlFactory module
// This module is the base module for all controls in the Hijinks framework.
function(hijinks) {
    hijinks.uiControlFactory = {}, hijinks.uiControlFactory.create = function() {
        return function() {
            var uiControl = hijinks.uiComponentFactory.create();
            return uiControl.type = "control", uiControl;
        };
    }();
}(window.hijinks || (window.hijinks = {})), // WiP
// uiScreenFactory module
// This module is the base module for all screens in the Hijinks framework.
function(hijinks) {
    // Perform default inbound screen transition
    function performDefaultTransitionIn(screen, data) {
        // If the screen has an onTransitionIn function, execute it now
        if ("function" == typeof screen.onTransitionIn) return logger.debug("executing onTransitionIn function for screen %s", screen.id),
        screen.onTransitionIn(data);
    }
    // Perform default outbound screen transition
    function performDefaultTransitionOut(screen, nextScreen) {
        // If the screen has an onTransitionOut function, execute it now
        if ("function" == typeof screen.onTransitionOut) return logger.debug("executing onTransitionOut function for screen %s", screen.id),
        screen.onTransitionOut(nextScreen);
    }
    var logger = window.logger, Promise = window.Promise;
    hijinks.uiScreenFactory = {}, hijinks.uiScreenFactory.create = function() {
        // Create screen component from uiComponent base
        var currentData, screen = hijinks.uiComponentFactory.create();
        // Set uiComponent type to 'screen'
        // Setup method for handling default transition in for screen
        // Setup method for handling default transition out for screen
        // Setup container for registering segues
        return screen.type = "screen", screen.transitionIn = function(data) {
            return currentData = data, Promise.resolve().then(function() {
                return performDefaultTransitionIn(screen, data);
            });
        }, screen.transitionOut = function(nextScreen) {
            return Promise.resolve().then(function() {
                return performDefaultTransitionOut(screen, nextScreen);
            });
        }, screen.getCurrentData = function() {
            return currentData;
        }, screen.segues = {}, screen;
    };
}(window.hijinks || (window.hijinks = {}))
