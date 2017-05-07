// history module
// provides interface for managing the history of user navigation.
function(hijinks) {
    // Trigger historyChange event
    // Signals that the history stack went from having items to being empty
    // or that the stack was empty and now how items
    function sendHistoryUpdateEvent() {
        $(window).trigger($.Event("navigation-history-updated"));
    }
    // Count the current number of history items.
    function countHistoryItems() {
        return historyStack.length;
    }
    // delete history entries using a filter function
    // filterFunction: ({ screen: Object, data: Object }) => bool
    // if filterFunction returns true, the history entry will be deleted
    function deleteEntries(filterFunction) {
        var toDelete = [];
        // run each history item through filterFunction
        historyStack.forEach(function(historyEntry) {
            var shouldDelete = filterFunction(historyEntry.screen, historyEntry.data);
            shouldDelete && toDelete.push(historyEntry);
        }), toDelete.forEach(function(historyEntry) {
            var index = historyStack.indexOf(historyEntry);
            index > -1 && historyStack.splice(index, 1);
        });
    }
    // Add a new item to the history stack
    // screen: a reference to a uiScreen instance
    //    ex: app.navigationScreens.search
    // data: a JSON object containing screen-relevant data
    //    ex: { query: 'test term' }
    function addHistoryStackItem(screen, data) {
        // Create new history stack item for tracking
        var historyStackItem = {
            screen: screen,
            data: data
        };
        // Add history stack item to history stack collection
        historyStack.push(historyStackItem), sendHistoryUpdateEvent();
    }
    // Clear the history stack, primarily used when navigating back
    // to the top level with no need to maintain prior history data
    function clearHistoryStack() {
        historyStack = [], sendHistoryUpdateEvent();
    }
    // Remove latest item from the history stack
    function popHistory() {
        // Remove the last item from the history stack array
        var entry = historyStack.pop();
        return sendHistoryUpdateEvent(), entry;
    }
    // PRIVATE: Get the history stack for debug/test purposes
    function getHistoryStack() {
        return historyStack;
    }
    function back() {
        // Pop a screen off of the history stack
        var previousScreen = popHistory();
        // Ignore if we are the start of the history
        if (void 0 !== previousScreen) // Use the screen and data in the history stack to navigate back to that screen
        // Don't record this history state so pass false to navigateTo.
        return hijinks.screenManager.navigateTo(previousScreen.screen, previousScreen.data, !1);
    }
    // The history stack is an internal array that is only
    // accessible through the history public methods
    var historyStack = [];
    // The history module is attached to the hijinks framework object on
    // load and is always available directly within the use of the framework
    hijinks.history = {
        add: addHistoryStackItem,
        back: back,
        clear: clearHistoryStack,
        count: countHistoryItems,
        deleteEntries: deleteEntries,
        debug: {
            getAll: getHistoryStack
        }
    };
}(window.hijinks || (window.hijinks = {}))
