// uiComponentFactory module
// This module is the base module for all components in the Hijinks UI
// framework. uiControlFactory and uiScreenFactory both derive from
// this module.
function(hijinks) {
    hijinks.uiComponentFactory = {}, hijinks.uiComponentFactory.create = function() {
        // Initialize the component by loading it's template and calling
        // any instance specific initialization code.  Caller must provide
        // a valid jQuery DOM object to attach component UI to as child.
        function initializeComponent(component) {
            return hijinks.dom.loadTemplate(component).then(function(wasAlreadyLoaded) {
                return !wasAlreadyLoaded && component.onTemplateLoaded && typeof component.onTemplateLoaded == typeof Function ? (logger.trace("executing onTemplateLoaded function for component %s", component.id),
                component.onTemplateLoaded()) : Promise.resolve();
            }).then(function() {
                // prevent initializeComponent from calling the component's
                // onInit function multiple times.  This in turn prevents
                // multiple network calls to fetch data in certain cases
                if (component.hasInitialized) return Promise.resolve();
                component.hasInitialized = !0;
                // default promise in case component has no onInit function
                var promise = Promise.resolve();
                // If the component has an onInit function, execute it now
                return component.onInit && typeof component.onInit == typeof Function && (logger.trace("executing onInit function for component %s", component.id),
                promise = component.onInit()), promise.then(function() {
                    // initilize the component's children
                    return hijinks.dom.initChildren(component);
                });
            });
        }
        // Remove the component from the DOM
        function removeComponent(component) {
            return component.hide().then(function() {
                hijinks.dom.remove(component);
            });
        }
        // Display the component in the UI if it is not already visible
        function showComponent(component) {
            // Exit early if component is already visible
            // Exit early if component is already visible
            return isComponentVisible(component) ? Promise.resolve() : component.init().then(function() {
                // Exit early if component is already visible
                // Exit early if component is already visible
                return isComponentVisible(component) ? Promise.resolve() : hijinks.dom.setVisibility(component, !0);
            }).then(function() {
                // If the component has an onShow function, execute it now
                // If the component has an onShow function, execute it now
                return attachEventHandlers(component), component.onShow && typeof component.onShow == typeof Function ? (logger.trace("executing onShow function for component %s", component.id),
                component.onShow()) : Promise.resolve();
            });
        }
        // Toggles the visibility of the component. If the show flag is specified
        // then the visibility will be set based on that flag.
        function toggleComponent(show, component) {
            return void 0 === show && (show = !isComponentVisible(component)), show ? showComponent(component) : hideComponent(component);
        }
        function attachEventHandlers(component) {
            // If the component has event handlers, bind them now
            component.eventHandlers && Array.isArray(component.eventHandlers) && (logger.trace("binding eventHandlers for component %s", component.id),
            hijinks.events.addEventHandlers(component.eventHandlers));
        }
        // Hide the component in the UI if it is currently visible
        function hideComponent(component) {
            // Exit early if component is not already visible
            // Exit early if component is not already visible
            return isComponentVisible(component) ? hijinks.dom.setVisibility(component, !1).then(function() {
                // If the component has an onHide function, execute it now
                if (component.onHide && typeof component.onHide == typeof Function) return logger.trace("executing onHide function for component %s", component.id),
                component.onHide();
            }).finally(function() {
                detachEventHandlers(component);
            }) : Promise.resolve();
        }
        function detachEventHandlers(component) {
            // If the component has event handlers, release them now
            if (component.eventHandlers && Array.isArray(component.eventHandlers)) return logger.trace("releasing eventHandlers for component %s", component.id),
            hijinks.events.removeEventHandlers(component.eventHandlers);
        }
        // Return true if the component is currently visible in the UI
        function isComponentVisible(component) {
            return hijinks.dom.getVisibility(component);
        }
        // Allows for adding of single event handlers dynamically after
        // creation of component, useful for when the event handler
        // references the component itself via it's domId, which is
        // not possible until after the component has been initialized
        function addEventHandler(component, eventHandler) {
            component.eventHandlers || (component.eventHandlers = []), // Add the event handler to the component collection of event
            // handlers so that it is automatically removed when the
            // component is removed
            component.eventHandlers.push(eventHandler), // Perform the actual binding of the event handler
            hijinks.events.addEventHandler(eventHandler);
        }
        var logger, Promise;
        return function() {
            logger = window.logger, Promise = window.Promise;
            var component = {
                // Store an name for this instance of this component
                // which is also used in the generation of the DOM id
                id: "",
                // Component type allows for querying which type of
                // component this instance is, such as 'component',
                // 'screen', 'control', etc.
                type: "component",
                // Class allows for a component to have a different class than
                // that generated from the ID, allowing for us to apply the
                // same CSS to multiple controls onscreen without having to
                // apply a class dynamically
                class: "",
                // Store a parent container from hijinks.dom.parentContainers
                parentContainer: "",
                // FixMe: Replace with observable array so that when controls
                // are added or removed along with changes to their children
                // are propegated and notifications are raised.
                children: [],
                // Store the path to the HTML template for this component
                template: "",
                init: function() {
                    return initializeComponent(component);
                },
                remove: function() {
                    return removeComponent(component);
                },
                show: function() {
                    return showComponent(component);
                },
                hide: function() {
                    return hideComponent(component);
                },
                toggle: function(show) {
                    return toggleComponent(show, component);
                },
                isVisible: function() {
                    return isComponentVisible(component);
                },
                addEventHandler: function(eventHandler) {
                    return addEventHandler(component, eventHandler);
                },
                getChildren: function(selector) {
                    return $(selector, component.internal.getDomElement());
                },
                // For data utilized by the Hijinks framework, not to be
                // utilized by the app level or above
                internal: {
                    // Store the DOM element ID as generated by hijinks.dom
                    domId: "",
                    getDomElement: function() {
                        var $el = $("#" + component.internal.domId);
                        // The only proper way to test that a jQuery selection
                        // was successful is to test its length.
                        // The only proper way to test that a jQuery selection
                        // was successful is to test its length.
                        // There should never exist 2 HTML elements with the same
                        // ID, if we find more than 1 element, log a warning.
                        return $el.length ? ($el.length > 1 && logger.warn("found multiple elements with the ID %s", component.internal.domId),
                        $el.first()) : void logger.warn("could not find dom element with ID %s", component.internal.domId);
                    }
                }
            };
            return component;
        };
    }();
}(window.hijinks || (window.hijinks = {}))
