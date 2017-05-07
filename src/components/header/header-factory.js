// function(hijinks, app) {
//     app.controls = app.controls || {}, app.controls.commandBarFactory = {}, app.controls.commandBarFactory.create = function() {
//         var instance = hijinks.uiControlFactory.create();
//         return instance.id = "command-bar", instance.template = "../../apps/recall-phone/components/command-bar.html",
//         instance.eventHandlers = [ {
//             target: ".back-button",
//             targetScope: instance,
//             event: "click",
//             handler: function() {
//                 app.actions.navigation.back();
//             }
//         }, {
//             target: ".home-button",
//             targetScope: instance,
//             event: "click",
//             handler: function() {
//                 app.actions.navigation.goHome();
//             }
//         }, {
//             target: ".settings-button",
//             targetScope: instance,
//             event: "click",
//             handler: function() {
//                 app.actions.navigation.loadProfileSettingsScreen();
//             }
//         } ], instance.onShow = function() {
//             // FIXME: This is a hack!  There are too many history items when
//             // we first get to home!  goHome gets called multiple times.
//             var currentScreen = hijinks.screenManager.getCurrentScreen();
//             currentScreen && "home-screen" === currentScreen.id && (instance.getChildren(".home-button").addClass("hide"),
//             instance.getChildren(".back-button").addClass("hide"));
//         }, instance;
//     };
// }(window.hijinks || (window.hijinks = {}), window.app || (window.app = {}))
var Child = {
    template: '<div>A</div>'
};
new Vue({
    el: '#header',
    data: {
        message: 'Hello Vue.js!'
    },
    components: {
      'my-component': Child
    }
})
