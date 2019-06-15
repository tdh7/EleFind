const paginate = require('handlebars-paginate');
var register = function(Handlebars) {
    var helpers = {
        'equals' : function(arg1, arg2, options) {
            return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
        },
        'notEquals' : function(arg1, arg2, options) {
            return (arg1 !== arg2) ? options.fn(this) : options.inverse(this);
        },
        'select':  function(selected, options) {
            return options.fn(this).replace(
                new RegExp(' value=\"' + selected + '\"'),
                '$& selected="selected"');
        },
        'elefind.phone': function() {
            return '+091-23-54-33';
        },
        'elefind.mail': function() {
            return 'elefind@t2tr.com';
        },
        'elefind.address': function() {
            return "Đường Nguyễn Văn Cừ, Quận 5,TP.HCM";
        },
        'paginate' :paginate
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        return helpers;
    }

};

module.exports.register = register;
module.exports.helpers = register(null);