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
