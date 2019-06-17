const paginate = require('handlebars-paginate');
const moment = require('moment');
const util = require('util');
const year = new Date(new Date().getFullYear().toString()).getTime();
const DateFormats = {
    short: "DD MMMM - YYYY",
    long: "dddd DD.MM HH:mm"
};
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
        'paginate' :paginate,
        'originalImage':function (options) {
            return options.fn(this).replace(/([0-9]+x[0-9]+)|w[0-9]+/,'w1200');
        },
        'previewImage':function (options) {
            return options.fn(this).replace(/([0-9]+x[0-9]+)|w[0-9]+/,'300x300');
        },
        'breakLines': function(plaintext) {
            var i, output = '',
                lines = plaintext.split(/\r\n|\r|\n/g);
            for (i = 0; i < lines.length; i++) {
                if(lines[i]) {
                    output += '<p>' + lines[i] + '</p>';
                }
            }
            return Handlebars.SafeString(output);
        },
        "formatDate":function(datetime, format) {
            datetime= Number.parseInt(datetime);
                if (moment) {
                    // can use other formats like 'lll' too
                    format = DateFormats[format] || format;
                    const datep = moment(datetime).format(format);
                    return datep;
                }
                else {
                    return datetime;
                }
            }
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