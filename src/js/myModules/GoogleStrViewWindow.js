define(["dojo/_base/declare", "dojo/dom-construct", "dojo/dom"], function (declare,domConstruct, dom) {


    return declare(null, {

        Click: null,
        constructor: function (args) {


            var target = args.target;
            var LL = args.LL;
        
            var btn = domConstruct.create("button", { id: "btnImage3" , title:"Google Street View", innerHTML:'<i class="fa fa-google"></i>'}, target);

            this.Click = function (evt) {
                var stall = 750; 
                var url = "GoogleStreet.html?y=" + LL.y + "&x=" + LL.x;
                try {
                   
                    var imgWindow = window.open(url, "Google Street View", "width=700, height=400,resizable=yes,scrollbars=yes");}
                catch(e){}

                  
            }

  
            btn.onclick = this.Click;

        }

    });


});
