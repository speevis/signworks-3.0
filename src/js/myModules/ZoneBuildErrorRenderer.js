
/*  not currently used */
define(["dojo/_base/declare",
"esri/geometry/Point",
"esri/geometry/Polyline",
"esri/SpatialReference",
"esri/graphic",
"esri/symbols/SimpleLineSymbol",
"esri/symbols/SimpleFillSymbol",
"esri/symbols/SimpleMarkerSymbol",
"esri/Color",
 "esri/layers/GraphicsLayer",
"myModules/MapUtilities",
"myModules/FeatureUtilities"],
function (declare,
    Point,
    Polyline,
    SpatialReference,
    Graphic,
    SimpleLineSymbol,
     SimpleFillSymbol,
    SimpleMarkerSymbol,
    Color,
    GraphicsLayer,
    MapUtilities,
    FeatureUtilities) {


    return declare(null, {


        constructor: function (args) {

            var myDiv = args.target;
            var myInfo = args.info;
            var id = args.id;
            var supClick = args.supClick;
            var supports = null;
            var $mainDiv = $("<div>", { "id": "md_" + id, class: "pntError" }).appendTo(myDiv);

            var $errorLevel = $("<div>", { "id": "el_" + id, class: "pntError_1" }).appendTo($mainDiv);
            if (myInfo.ErrorLevel == "Error") {
                $errorLevel.html('<i class="fa fa-times-circle" aria-hidden="true"></i>');
            }
            else if (myInfo.ErrorLevel == "Warning") {
                $errorLevel.html('<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>');
            }
            else if (myInfo.ErrorLevel == "Info") {

                $errorLevel.html('<i class="fa fa-info-circle" aria-hidden="true"></i>');
            }

            var $errorDesc = $("<div>", { "id": "ed_" + id, class: "pntError_1" }).appendTo($mainDiv);
            $errorDesc.html("Description: " + myInfo.CheckName)

            var $errorSupp = $("<div>", { "id": "es_" + id, class: "pntError_click" }).appendTo($mainDiv);
            $errorSupp.html("Support ID: " + myInfo.SupportIDs);

            var supportResults = function (features) {
                supports = features;
            };

            var selectSupports = function () {

                FeatureUtilities.getMultipleFeaturesByAttribute(args.supLayer, "GLOBALID", args.info.SupportIDs, supportResults);
            };

          
            selectSupports();
            $errorSupp.click(function (evt) {
                zoneLayer.clear();
                var p1 = myInfo.Polyline[0];
                var p2 = myInfo.Polyline[1];
                var pt1 = new Point(p1[0], p1[1], new SpatialReference({ wkid: 3857 }));
                var pt2 = new Point(p2[0], p2[1], new SpatialReference({ wkid: 3857 }));
                var poly = new Polyline([[p1[0], p1[1]], [p2[0], p2[1]]]);
                var sym = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 30,
                       new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("blue"), 3),
                       new Color([0,0,0,0.0])
                       );
                var grafSupp;
                for (var i = 0; i < supports.length; i++) {

                    grafSupp = new Graphic(supports[i].geometry, sym);
                    zoneLayer.add(grafSupp);
                };

               poly.spatialReference = new SpatialReference({ wkid: 3857 });
          //      poly = MapUtilities.webMercatorToGeographic(poly);
                var sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("blue"), 10);
                var graf = new Graphic(poly, sls);
                zoneLayer.add(graf);
                map.centerAt(pt1);
                
                evt.id = myInfo.SupportIDs;
                supClick(evt);

            });
        }

    });


});
