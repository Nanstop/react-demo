function(hijinks) {
    // Add `modalScreen` to the `modalScreen` container and show it.
    // @private
    // @param {object} modalScreen - The modal screen to be shown
    // @returns {object} Promise which is resolved the modal is shown
    //
    function addModal(modalScreen) {
        return modalScreen.init(dom.parentContainers.modalScreen).then(modalScreen.show);
    }
    // Removes `modalScreen` from the `modalScreen` container and removes it
    // from the DOM
    // @private
    // @param {object} modalScreen - The modal screen to be removed
    // @returns {object} Promise which is resolved the modal is removed
    //
    function removeModal(modalScreen) {
        // Prevent `undefined` error when `removeModal` is called without a
        // `modalScreen`. This can happen because hijinks.modalManager.closeModal()
        // or hijinks.modalManager.closeAll() might be called when there are no
        // modals in activeModals.
        var index = activeModals.indexOf(modalScreen);
        return index === -1 ? Promise.resolve() : (activeModals.splice(index, 1), modalScreen.remove());
    }
    // Launch the specified modal
    // @class modalManager
    // @param {object} modalScreen - uiScreen to be used as the modal
    // @param {object} [data] - Optional data passed to the modal screen
    // @returns {object} Promise which is resolved when the modal is displayed
    //
    function open(modalScreen, data) {
        return addModal(modalScreen).then(function() {
            // make sure we have a data object to popular the referrer.
            data = data || {};
            // record the referrer in the data to be sent
            // to the new modal.
            var currentScreenOrModal = hijinks.screenManager.getCurrentScreenOrModal();
            return data.referrer = currentScreenOrModal && currentScreenOrModal.id, activeModals.push(modalScreen),
            modalScreen.transitionIn(data);
        });
    }
    // Close the modal and transition to the current navigated to screen
    // @class modalManager
    // @returns {object} Promise which is resolved when the modal is closed
    //
    function closeModal(instance) {
        return removeModal(instance).then(function() {
            $(window).trigger($.Event("modal-screen-dismissed", {
                modalId: instance.id
            }));
        });
    }
    function closeAll() {
        var promises = activeModals.map(function(modal) {
            return modal.remove();
        });
        return Promise.all(promises).then(function() {
            activeModals = [];
        });
    }
    function isModalOpen() {
        return activeModals.length > 0;
    }
    function getTopModal() {
        return isModalOpen() ? activeModals[activeModals.length - 1] : null;
    }
    // Provides an interface used to open and close modals and manage their
    // transition.
    var dom = hijinks.dom, Promise = window.Promise, activeModals = [];
    // Modal Manager singleton for managing the display of modal screens
    // @class modalManager
    //
    hijinks.modalManager = {
        open: open,
        closeModal: function(instance) {
            closeModal(instance);
        },
        isModalOpen: isModalOpen,
        getActiveModals: function() {
            return activeModals;
        },
        getTopModal: getTopModal,
        closeAll: closeAll
    };
}(window.hijinks || (window.hijinks = {}))
