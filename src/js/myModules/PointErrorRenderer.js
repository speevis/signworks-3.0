/*  not currently used */

define(["dojo/_base/declare",
"esri/geometry/Point",
"esri/SpatialReference",
"esri/graphic"],
function (declare,
    Point,
    SpatialReference,
    Graphic) {

   
    return declare(null, {


        constructor: function (args) {

            var myDiv = args.target;
            var myInfo = args.info;
            var id = args.id;
            var supClick = args.supClick;
            
            var $mainDiv = $("<div>", { "id": "md_" + id, class: "pntError" }).appendTo(myDiv);

            var $errorLevel = $("<div>", { "id": "el_" + id, class: "pntError_1" }).appendTo($mainDiv);
            if (myInfo.ErrorLevel == "Error") {
                $errorLevel.html( '<i class="fa fa-times-circle" aria-hidden="true"></i>');
            }
            else if (myInfo.ErrorLevel == "Warning") {
                $errorLevel.html( '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>');
            }
            else if (myInfo.ErrorLevel == "Info") {

                $errorLevel.html( '<i class="fa fa-info-circle" aria-hidden="true"></i>');
            }

            var $mutcd = $("<div>", { "id": "mut_" + id, class: "pntError_1" }).appendTo($mainDiv);
            $mutcd.html ( myInfo.MUTCD);

            var $errorDesc = $("<div>", { "id": "ed_" + id, class: "pntError_1" }).appendTo($mainDiv);
            $errorDesc.html("Description: " + myInfo.CheckName);

            var $errorSupp = $("<div>", { "id": "es_" + id, class: "pntError_click" }).appendTo($mainDiv);
            $errorSupp.html("Support ID: " + myInfo.SupportIDs);
            $errorSupp.click(function (evt) {
                var evt = {pt:"", mapPoint:null}
                evt.pt = new Point(myInfo.X, myInfo.Y, new SpatialReference({ wkid: 3857 }));
                evt.id = myInfo.SupportIDs;
                supClick(evt);
                
            });
        }

    });


});
