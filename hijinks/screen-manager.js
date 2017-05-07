function(hijinks) {
    function navigateToScreen(destinationScreen, data, addToHistory) {
        // Wait for any lingering transitions to finish before attempting to
        // navigate to a new screen.
        return currentTransitionPromise = currentTransitionPromise.finally(function() {
            return _navigateToScreen(destinationScreen, data, addToHistory);
        });
    }
    // Base functionality for navigateToScreen
    function _navigateToScreen(destinationScreen, data, addToHistory) {
        data = data || {};
        // record the referrer in the data to be sent
        // to the new screen.
        var currentScreenOrModal = getCurrentScreenOrModal();
        data.referrer = currentScreenOrModal && currentScreenOrModal.id;
        // Get the currently displayed screen from the DOM manager
        var currentScreen = getCurrentScreen();
        void 0 === addToHistory && (addToHistory = !0), // Test if history should be updated with this call
        currentScreen && addToHistory && // Add screen and data to history stack
        hijinks.history.add(currentScreen, currentScreen.getCurrentData());
        // If destination screen does not exist already in
        // screen managers list of screens, add it now
        var screenExists = !1;
        screenManager.screens.some(function(screen) {
            if (screen.id === destinationScreen.id) return screenExists = !0, !0;
        }), screenExists || screenManager.screens.push(destinationScreen);
        var transitionPromise;
        // If no screen currently exists, just transition in the
        // destination screen and exit early
        if (currentScreen) if (currentScreen.segues[destinationScreen.id]) {
            // If the current screen has a segue associated with the destination,
            // then execute it, otherwise do the default transitions
            var currentSegue = currentScreen.segues[destinationScreen.id];
            transitionPromise = performSegueTransition(currentSegue, currentScreen, destinationScreen, data);
        } else // perform default transitions
        transitionPromise = performDefaultTransition(currentScreen, destinationScreen, data); else transitionPromise = addScreen(destinationScreen).then(function() {
            return destinationScreen.transitionIn(data);
        });
        return $(window).trigger($.Event("new-screen-loading", {
            detail: {
                destination: destinationScreen
            }
        })), transitionPromise.then(function() {
            $(window).trigger($.Event("new-screen-loaded", {
                detail: {
                    destination: destinationScreen
                }
            }));
        });
    }
    // Query the DOM manager to get the current screen in the main-screen container
    function getCurrentScreen() {
        // We're looking for the current screen from the main-screens uiContainer
        var mainScreensContainer = dom.parentContainers.mainScreens, currentScreens = dom.getComponentsInContainer(mainScreensContainer, screenManager.screens);
        // Return the current screen (or first screen if more than one is found)
        // Return undefined if no current screen exists
        // We should never have more than 1 screen in the main-screen container
        // when calling this function, so warn if more are found
        return currentScreens.length > 1 && logger.warn("expected no more than 1 screen loaded in main-screens, but found %s", currentScreens.length),
        currentScreens[0];
    }
    // Return the data object for the current screen
    function getCurrentScreenData() {
        var currentScreen = getCurrentScreen();
        if (currentScreen) return currentScreen.getCurrentData();
    }
    // Perform the segue between sender and target screens
    function performSegueTransition(segue, sender, target, data) {
        // segue returns promise
        return segue.execute(sender, target, data).catch(function(err) {
            return logger.error(err, "segue from screen %s to %s failed with error", sender.id, target.id),
            performDefaultTransition(sender, target, data);
        });
    }
    // Perform the default transition of transition-out and then transition-in
    function performDefaultTransition(currentScreen, destinationScreen, data) {
        return currentScreen.transitionOut(destinationScreen).then(function() {
            if (currentScreen.id !== destinationScreen.id) return removeScreen(currentScreen);
        }).then(function() {
            return addScreen(destinationScreen);
        }).then(function() {
            return destinationScreen.transitionIn(data);
        });
    }
    // Add the requested screen and show it
    function addScreen(screen) {
        // We will be adding the screen to the main-screens uiContainer
        var mainScreensContainer = dom.parentContainers.mainScreens;
        return screen.init(mainScreensContainer).then(screen.show);
    }
    // Re-navigate to the current screen without add the it to the history stack
    function reloadCurrentScreen() {
        navigateToScreen(getCurrentScreen(), getCurrentScreenData(), !1);
    }
    // Remove the requested screen
    function removeScreen(screen) {
        return screen.remove(screen);
    }
    /**
     * Gets the current screen or modal in the top most position
     * @ returns {Object} a screen or modal object.
     * NOTE IF YOU USE THIS METHOD AGAIN YOU SHOULD MERGE MODAL MANAGER AND SCREEN MANAGER
     */
    function getCurrentScreenOrModal() {
        // modals will always be on top of a screen
        // if we have one we can be suire it is on top of a screen.
        var modal = hijinks.modalManager.getTopModal();
        if (modal) return modal;
        // If we don't have a modal get the screen on top.
        var screen = getCurrentScreen();
        return screen ? screen : void 0;
    }
    function getScreenMetricsContext() {
        // Grab the current screen or modal
        // and get the referrer attached to that screen or modal.
        var currentScreenOrModal = getCurrentScreenOrModal(), currentData = currentScreenOrModal && currentScreenOrModal.getCurrentData();
        return {
            currentScreen: currentScreenOrModal && currentScreenOrModal.id,
            referrer: currentData && currentData.referrer
        };
    }
    var logger = window.logger, dom = hijinks.dom, currentTransitionPromise = Promise.resolve(), screenManager = {
        screens: [],
        navigateTo: navigateToScreen,
        getCurrentScreen: getCurrentScreen,
        getCurrentScreenData: getCurrentScreenData,
        getScreenMetricsContext: getScreenMetricsContext,
        getCurrentScreenOrModal: getCurrentScreenOrModal,
        reloadCurrentScreen: reloadCurrentScreen
    };
    hijinks.screenManager = screenManager;
}(window.hijinks || (window.hijinks = {}))
