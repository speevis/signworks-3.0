define(["dojo/_base/declare", "dojo/dom-construct", "dojo/dom"], function (declare,domConstruct, dom) {


    return declare(null, {

        Click: null,
        constructor: function (args) {


            var target = args.target;
            var LL = args.LL;

            var btn = domConstruct.create("button", { id: "btnImage2" , title:"Globespotter", innerHTML:'<i class="fa fa-binoculars"></i>'}, target);

            this.Click = function (evt) {
                var stall = 750;
               
                var url = "viewer_api.html?y=" + LL.y + "&x=" + LL.x;
                try {
                    var imgWindow = window.open(url, "Globespotter", "width=1100, height=1100,resizable=yes,scrollbars=yes");
                }
                catch (e) { }

              
            }

             
            btn.onclick = this.Click;

        }

    });


});
