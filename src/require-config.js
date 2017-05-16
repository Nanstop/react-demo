var path = '../node_modules';
requirejs.config({
    paths: {
        'text':path+'/text/text',
    },
});
// require(['header-template'], function(template) {
//     console.log(template);
// });
define(function(require){
    var html = require("text!components/header/header-template.html");
    var body = document.body;
    var newElement = document.createElement('div');
    newElement.innerHtml = html;
    body.insertBefore(newElement,body.childNodes[0]);
});
