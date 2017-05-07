// events module
// Helper module for adding and removing event handlers the way our
// testing infrastrure and runtime expect them.
function(hijinks) {
    // Validate an event handler object
    function isValidEventHandlerObject(eventHandler) {
        // validate this object is truthy
        if (!eventHandler) return logger.warn("eventHandler object is null, undefined or invalid"),
        !1;
        // Make sure all required fields are provided
        if (!eventHandler.target || !eventHandler.event || !eventHandler.handler) return logger.warn("eventHandler objects require a target, event, and handler"),
        !1;
        // Get the target of the event handler
        var $target = getEventHandlerTarget(eventHandler);
        // Make sure 'target' points to a valid element
        // Make sure 'target' points to a valid element
        // Make sure 'event' is a string
        // The 'data' is optional, but if defined, validate it
        // Make sure 'handler' is a function
        return 0 === $target.length ? (logger.warn('eventHandler "target" of "%s" cannot be found', eventHandler.target),
        !1) : "string" != typeof eventHandler.event ? (logger.warn('eventHandler "event" must be a string'),
        !1) : eventHandler.data && "string" != typeof eventHandler.data ? (logger.warn('eventHandler "data" must be a string'),
        !1) : "function" == typeof eventHandler.handler || (logger.warn('eventHandler "handler" must be a function'),
        !1);
    }
    // Get the event handler target, taking target scope into
    // consideration if it is provided
    function getEventHandlerTarget(eventHandler) {
        return $(getTargetFromSelector(eventHandler.target), getTargetFromSelector(eventHandler.targetScope));
    }
    function getTargetFromSelector(selector) {
        if (selector) return selector.internal && "function" == typeof selector.internal.getDomElement ? selector.internal.getDomElement() : selector;
    }
    // Add a new event handler
    function addEventHandler(eventHandler) {
        // Make sure the event handler object has a valid definition,
        // otherwise ignore it
        if (!isValidEventHandlerObject(eventHandler)) return void logger.warn("invalid event handler, will be ignored");
        var $target = getEventHandlerTarget(eventHandler), delegateSelector = eventHandler.selector || null;
        logger.trace("adding %s event handler %s on %s", eventHandler.event, eventHandler.handler.name, eventHandler.target.selector),
        // Ensure that we don't assign the same handler to the same
        // event multiple times.
        $target.off(eventHandler.event, eventHandler.handler), $target.on(eventHandler.event, delegateSelector, eventHandler.data, eventHandler.handler);
    }
    // Remove event handler
    function removeEventHandler(eventHandler) {
        // Make sure the event handler object has a valid definition,
        // otherwise ignore it
        if (isValidEventHandlerObject(eventHandler)) {
            var $target = getEventHandlerTarget(eventHandler);
            logger.trace("removing %s event handler %s on %s", eventHandler.event, eventHandler.handler.name, eventHandler.target.selector),
            $target.off(eventHandler.event, eventHandler.handler);
        } else logger.warn("invalid event handler, will be ignored");
    }
    // Add event handlers by passing an array of eventHandler objects
    function addEventHandlers(eventHandlers) {
        eventHandlers.forEach(addEventHandler);
    }
    // Remove event handlers by passing an array of eventHandler objects
    function removeEventHandlers(eventHandlers) {
        // Process the list of eventHandler asyncronously
        return new Promise(function(resolve) {
            eventHandlers.forEach(removeEventHandler), resolve();
        });
    }
    var $ = window.jQuery, logger = window.logger, Promise = window.Promise;
    hijinks.events = {
        addEventHandler: addEventHandler,
        removeEventHandler: removeEventHandler,
        addEventHandlers: addEventHandlers,
        removeEventHandlers: removeEventHandlers
    };
}(window.hijinks || (window.hijinks = {}))
