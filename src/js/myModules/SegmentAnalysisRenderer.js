/*  not currently used */

define(["dojo/_base/declare",
"myModules/PointErrorRenderer",
"myModules/ZoneBuildErrorRenderer"],
function (declare,
    PointErrorRenderer,
    ZoneBuildErrorRenderer) {

   
    return declare(null, {


        constructor: function (args) {

            var myDiv = args.target;
            var results = args.results;
            var fred;

            for (var info in results) {

                var bob = results[info];
                if (bob.ErrorType == "PointErrors") {

                     fred = new PointErrorRenderer({"info":bob, "id":info, "target":myDiv, "supClick":args.supClick});
                }
                else if (bob.ErrorType =="ZoneBuildErrors")
                {

                    fred = new ZoneBuildErrorRenderer({ "info": bob, "id": info, "target": myDiv, "supLayer":args.supLayer, "supClick": args.supClick });
                }

            }
            

        }

    });


});
