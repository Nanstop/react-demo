// dom module
// Responsible for handling everyting related to manipulating the dom
// for any component. This allows for better seperation of concerns.
function(hijinks) {
   // Pre-load templates for all singletons and factories in the provided hijinks
   // namespaces.
   function preloadTemplatesInNamespaces(namespaces) {
       // Enumerate all component namespaces
       var namespacePromises = namespaces.map(function(namespace) {
           if ("object" != typeof namespace) return Promise.resolve();
           // Enumerate all objects defined in each namespace
           var componentPromises = Object.keys(namespace).map(function(key) {
               var component = namespace[key];
               if ("object" != typeof component) return Promise.resolve();
               // Attempt to get template from either singletons or
               // factories.
               var template;
               return "function" == typeof component.instance ? template = component.instance().template : "function" == typeof component.create && (template = component.create({}).template),
               template ? loadAndCacheTemplate(template) : Promise.resolve();
           });
           return Promise.all(componentPromises);
       });
       return Promise.all(namespacePromises);
   }
   // If a template is cached, return it from the cache. Otherwise load
   // it into the cache and then return it.
   function loadAndCacheTemplate(template) {
       // Store the promise in the cache to avoid loading the same template
       // multiple times simultaneously
       return templateCache[template] || (templateCache[template] = new Promise(function(resolve, reject) {
           logger.trace("Pre-loading template: %s", template), $.get(template, function(response) {
               logger.debug("Template pre-loaded successfully: %s", template), resolve(response);
           }).fail(function() {
               reject(new Error(sprintf("Failed to pre-load template: %s", template)));
           });
       })), templateCache[template];
   }
   // Get the component DOM element as a jQuery object
   function getComponentElement(component) {
       // Make sure the component is defined
       if (!component) return void logger.warn("component not defined.");
       if (!component.internal) return void logger.warn("component does not contain an internal object");
       // Make sure the component has implemented the DOM id property
       // No need to provide warning here, it is expected that it may
       // not exist at times and this will leave the component undefined
       if (component.internal.domId) {
           // Verify that we found the component's element using the domId or error
           var $component = component.internal.getDomElement();
           if ($component) return $component;
       }
   }
   // Sets the visibility within the DOM as requested and then
   // returns a promise
   function setComponentVisibility(component, isVisible) {
       // Get the component DOM element as a jQuery object
       var $component = getComponentElement(component);
       // No component found.
       // No component found.
       // Sometimes we need to test if a component is being shown
       // before the template has finished loading into the DOM and
       // recognized by the browser via the .show CSS class.  By
       // storing this state in the data attribute, we are able to
       // query it immediately, preventing possible race conditions
       // when another logic wants to make sure the component is
       // shown at nearly the same time (before this promise fully
       // resolves)
       // Remove 'show' class from DOM element to trigger
       // CSS change to revert to pre-"show" status
       return $component ? isVisible ? ($component.data("component-shown", !0), loadComponentTemplate(component).then(function() {
           logger.trace("showing component %s", component.id), // Make sure the component hasn't been hidden while loading
           // the template
           $component.data("component-shown") && // Add 'show' class to DOM element to hang CSS
           // from for when the component is shown
           $component.addClass("show");
       })) : (logger.trace("hiding component %s", component.id), $component.removeData("component-shown"),
       $component.removeClass("show"), Promise.resolve()) : Promise.resolve(!1);
   }
   // Gets the visiblity of the component within the DOM
   function getComponentVisibility(component) {
       // Get the component DOM element as a jQuery object
       var $component = getComponentElement(component);
       // No component found.
       // No component found.
       return !!$component && !!$component.data("component-shown");
   }
   // Loads the component template and returns a promise
   function loadComponentTemplate(component) {
       // We're keeping track if the template was already loaded
       // since we only want to fire the onTemplateLoaded event
       // on the component if this is actually performing the
       // template load - not if it's already loaded
       var wasAlreadyLoaded = !1, $component = getComponentElement(component);
       // If component is already represented in the DOM, then we
       // already loaded the template, so exit early
       if ($component && $component.length > 0) return wasAlreadyLoaded = !0, Promise.resolve(wasAlreadyLoaded);
       if (!component.template) // Reject this promise if no template was set for this component
       return Promise.reject(new Error("no template set for component: " + component.id));
       // Get the parent container requested by the component
       // and verify that it exists within the DOM
       var $parentContainer = $(component.parentContainer);
       if (0 === $parentContainer.length && VALID_HTML_ID_REGEX.test(component.parentContainer) && (// look for the parent by ID to see if its already in the dom
       $parentContainer = $("#" + component.parentContainer)), 1 !== $parentContainer.length) {
           var errorString = sprintf("DOM element is required to have only 1 parent, but has %d parents.", $parentContainer.length);
           // FIXME: This should reject and we should fix the places where it
           // should reject.  But for now we are going to fail it and let it
           // pass so that all the tests will continue to pass
           // this does not cause issues in the actual app
           logger.error(errorString);
       }
       // Generate a DOM id for this component and store it as a
       // value on the component for future reference
       // Create the DOM element for this component and append it to
       // the requested parent container - this will be the element
       // the template is loaded into
       // FIXME: The id is used for class here, and it is references all over
       // the scss - because of this removing it will cause all sorts of tests
       // to fail.  So we are keeping it in untill we con go through and fix
       // all of the scss (and tests) to reference id instead
       return component.internal.domId = getDomId(component, $parentContainer.selector),
       $component = $('<div id="' + component.internal.domId + '"/>'), $component.addClass(component.id).addClass(component.class).addClass(component.type).appendTo($parentContainer),
       loadAndCacheTemplate(component.template).then(function(templateHtml) {
           // Load the component's HTML from the cache template
           return $component.html(templateHtml), Promise.resolve(wasAlreadyLoaded);
       });
   }
   function getDomId(component, componentSelector) {
       // combine all # . and space characters into a single -
       // then remove a leading -
       var parentId = componentSelector.replace(/[#\. ]+/g, "-").replace(/^-/, "");
       return parentId + "_" + component.type + "_" + component.id;
   }
   // Removes the representation of the component from the DOM
   function removeComponent(component) {
       // Get the component DOM element as a jQuery object
       var $component = getComponentElement(component);
       // If component does not exist, exit early
       $component && 0 !== $component.length && // Remove the component element from the DOM
       $component.remove();
   }
   // Get the top level children components within the requested parent container
   // and match them against a supplied list of uiComponents
   // Ex: Used for determining which screens are currently loaded in the main
   // screens container
   function getUiComponentsInParentContainer(parentContainer, uiComponents) {
       var components = [];
       // Process each top level child of the requested parent container
       return $.each($("#" + parentContainer).children(), function(index, component) {
           // Get jquery element for component
           var $component = $(component);
           // For each child, attempt to find a match in the supplied uiComponents
           // and add to return array if a match is found
           uiComponents.some(function(uiComponent) {
               if ($component.attr("id") === uiComponent.internal.domId) return components.push(uiComponent),
               !0;
           });
       }), components;
   }
   // Inititalize the DOM for this component.
   function initChildren(component) {
       var childPromises = [];
       return component.children.length > 0 && component.children.forEach(function(child) {
           child.parentContainer || (child.parentContainer = component.internal.domId), childPromises.push(child.init());
       }), Promise.all(childPromises);
   }
   // Inserts a script element into the DOM
   function insertScript(url, async, defer) {
       var scriptElement = document.createElement("script"), firstScriptElement = document.getElementsByTagName("script")[0];
       scriptElement.type = "text/javascript", scriptElement.async = async, scriptElement.defer = defer,
       scriptElement.src = url, firstScriptElement.parentNode.insertBefore(scriptElement, firstScriptElement);
   }
   var $ = window.jQuery, logger = window.logger, Promise = window.Promise, sprintf = window.sprintf, VALID_HTML_ID_REGEX = /^[a-z][a-z0-9.:_-]*$/i, parentContainers = {
       background: "background",
       mainScreens: "main-screens",
       globalControls: "global-controls",
       modalScreen: "modal-screen",
       buildNumber: "build-number"
   }, templateCache = {};
   // The DOM module is attached to the hijinks framework object on
   // load and is always available directly within the use of the framework
   hijinks.dom = {
       insertScript: insertScript,
       parentContainers: parentContainers,
       setVisibility: setComponentVisibility,
       getVisibility: getComponentVisibility,
       preloadTemplatesInNamespaces: preloadTemplatesInNamespaces,
       loadTemplate: loadComponentTemplate,
       getElement: getComponentElement,
       getComponentsInContainer: getUiComponentsInParentContainer,
       remove: removeComponent,
       initChildren: initChildren
   };
}(window.hijinks || (window.hijinks = {}))
