/*  not currently used */

define(["dojo/_base/declare"], function (declare) {

   
    return declare(null, {


        constructor: function (args) {
            if (config.hideButton == true) {
                return;
            }
            var myDiv = args.myDiv;
            var panel = args.target;
            var $button = $('<button/>', { text: "click", id: "5" }).appendTo(myDiv);
            $button.click(function () {
                if (panel.style.display == "none" || panel.style.display == "")
                    panel.style.display = "inherit";
                else
                    panel.style.display = "none";
            });
        }

    });


});
