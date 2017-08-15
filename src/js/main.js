
var map = null;
var haloLayer;
var zoneLayer;
var updateSupportFeature;
var updateSignFeature;
var muttValues;
var clickTask = "support";
//does this even do anything ?
//"use strict";
require(["esri/map",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/graphic",
    "esri/config",
    "esri/IdentityManager",
    "dojo/dom-construct",
    "dojo/dom",
    "myModules/MAR_Widget",
    "myModules/SupportWidget",
    "myModules/FeatureUtilities",
    "myModules/MapUtilities",
    "myModules/PanelToggleButton",
    "myModules/SelectSegmentButton",
    "esri/geometry/Point",
    "esri/SpatialReference",
    "esri/tasks/query",
    "dojo/domReady!"],
    function (Map,
        
        FeatureLayer,
        GraphicsLayer,
        Graphic,
        esriConfig,
        esriId,
        domConstruct,
        dom,
        MarWidget,
        SupportWidget,
        FeatureUtilities,
        MapUtilities,
        PanelToggleButton,
        SelectSegmentButton,
        Point,
        SpatialReference,
        Query
 
        ) {
   

        // refer to "Using the Proxy Page" for more information:  https://developers.arcgis.com/javascript/jshelp/ags_proxy.html
        // not sure if necessary or set up right - JCJ
        // It IS neccessary and is currently set up right - JCJ 7/27/17


       esriConfig.defaults.io.proxyUrl = config.layers.proxy;
  
     

        map = new Map("map", {
            basemap: "streets",
            center: [-77.007308, 38.875827],
            zoom: 18,
            slider: false
        });
        
        var mapClickFlag = 0;

        function message_receive(ev) {
            if (ev.originalEvent.key != 'message') return; // ignore other keys
            var message;
            if (ev.originalEvent.newValue != "")
                message = JSON.parse(ev.originalEvent.newValue);
            else
                message = JSON.parse(ev.originalEvent.oldValue);
            if (!message) return; // ignore empty msg or msg reset

            createNewSupport(message.x, message.y);
        }
       
       

           $(window).on('storage', message_receive);
        var timebandFeatureTable = new FeatureLayer( config.layers.timeband, {
            mode: FeatureLayer.MODE_SELECTION,
            outFields: ["*"]
        });
        

        var meterFeatureLayer = new FeatureLayer(config.layers.meters, {
            mode: FeatureLayer.MODE_SELECTION, definitionExpression: "STATUS <> 5",
            outFields: ["*"]
        });

        var signFeatureLayer = new FeatureLayer(config.layers.signs, {
            mode: FeatureLayer.MODE_SELECTION, definitionExpression: "SIGNSTATUS <> 5",
            outFields: ["*"]
        });
        var streetSegmentLayer = new FeatureLayer(config.layers.streetSegment, {
            mode: FeatureLayer.MODE_SELECTION,
            outFields: ["*"]
        });

        var supportFeatureLayer = new FeatureLayer(config.layers.support, {
            mode: FeatureLayer.MODE_ONDEMAND, definitionExpression: "SUPPORTSTATUS <> 5",
            outFields: ["*"]
        });

 
        
 
       


        haloLayer = new GraphicsLayer({ id: "select" });
        zoneLayer = new GraphicsLayer({ id: "zone" });
        map.addLayers([supportFeatureLayer,signFeatureLayer, zoneLayer, haloLayer]);
       
        map.on("layers-add-result", initControls);

     
       


        //get target div for MAR widget
        var myHeaderTarget = dom.byId("header");
        var leftPane = dom.byId("leftPane");
        //instantiate MAR widget
        var myMarWidget = new MarWidget({ "target": myHeaderTarget, "map": map });
      
    
       
        function initControls(evt) {
            
            muttValues = FeatureUtilities.getCodedValues(signFeatureLayer, "MUTCD");        
           
            var myRightTarget = dom.byId("supportPane");
            var mySignTarget = dom.byId("signPane");

            var mySupportWidget = new SupportWidget({
                "target": myRightTarget, "signTarget": mySignTarget,
                "map": map, "layer": supportFeatureLayer, "signLayer": signFeatureLayer, "metersLayer": meterFeatureLayer,
                "timebandLayer": timebandFeatureTable, "graphicsLayer":haloLayer
            });
       
            map.on("click", function (evt) {

                if (clickTask == "support") {

                    mySupportWidget.mapClick(evt);
                }
                else if (clickTask == "segment") {
                    clickTask = "support";
                    mySegSelect.mapClick(evt);
                }
                else if (clickTask == "newSegment") {

                    if (evt.mapPoint != null) {

                        clickTask = "support";
                        var stall = 750;
   //                     var latlong = MapUtilities.webMercatorToGeographic(evt.mapPoint);
                        var url = "New_viewer2.html?y=" + evt.mapPoint.y + "&x=" + evt.mapPoint.x;
                        try {
                            var imgWindow = window.open(url, "Globespotter", "width=1100, height=1100,resizable=yes,scrollbars=yes");
                        }
                        catch (e) { }
                    }
                    else {
                        clickTask = "support";
                    }
                }
            });
        };
    });

