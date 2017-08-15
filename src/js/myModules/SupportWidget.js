define(["esri/tasks/query",
     "esri/layers/FeatureLayer",
     "esri/tasks/RelationshipQuery",
     "esri/symbols/SimpleLineSymbol",
     "esri/symbols/SimpleFillSymbol",
     "esri/symbols/SimpleMarkerSymbol",
     "esri/graphic",
     "esri/Color",
     "dojo/_base/declare",
     "myModules/MapUtilities",
     "myModules/FeatureUtilities",
     "myModules/SignWidget",
     "myModules/MeterWidget",
  
     "myModules/SignEditor",
     "myModules/MeterEditor",
     "myModules/SignImageWidget",
     "myModules/GlobespotterWindow",
     "myModules/GoogleStrViewWindow",
     "myModules/SupportEditor",
     "myModules/SignOrderUtilities"],
    function (Query,
        FeatureLayer,
        RelationshipQuery,
        SimpleLineSymbol,
        SimpleFillSymbol,
        SimpleMarkerSymbol,
        Graphic,
        Color,
        declare,
        MapUtilities,
        FeatureUtilities,
        SignWidget,
        MeterWidget,
        SignEditor,
        MeterEditor,
        SignImageWidget,
        GlobespotterWindow,
        GoogleStreetViewWindow,
        SupportEditor,
        SignOrderUtilities
        ) {


        return declare(null, {

            map: null,
            selectedFeatures: null,
        //    updateFeature:null,
            supportFeatureLayer: null,
            supportMetersLayer:null,
            signFeatureLayer: null,
            selectGraphicsLayer:null,
            currentSupportObId: null,
            signKey: null,
            sprtGmtry:null,
            sIndex: null,
            mapClick:null,
            constructor: function (args) {

                //clear support div just for safety
                $("#supportDIV").remove();
                var $mainNode = $("<div>", { id: "supportDIV", html: "No Support Feature Selected" }).appendTo(args.target);
                supportFeatureLayer = args.layer;
                signFeatureLayer = args.signLayer;
                supportMetersLayer = args.metersLayer;
                selectGraphicsLayer = args.graphicsLayer;
                var ne = this;
                var signDefine = "SIGNSTATUS <> 5";
                var codedValues; 
                var selectQuery = new Query();   
                var setRetired = false;
                var numSigns = 0;
                var retiredText;
                var isMeter = false;
                var isAnalysis = false;
                // graphic that highlights selected feature 
                var selectFeatureSymbol = function (feature,color) {

                    selectGraphicsLayer.clear();
                    var myColor;
                    if (isAnalysis) {

                        myColor = new Color("blue");
                    }
                    else
                    {
                        myColor = new Color("#FFFF00");
                    }
                    var sym = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 30,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, myColor , 3),
                        new Color([0, 255, 0, 0.0])
                        );
                    var graf = new Graphic(feature.geometry, sym);
                    selectGraphicsLayer.add(graf);

                };

                var signOrMeter = function(value){
                    // this is a big fat and I hope temporary hack -- seems that many signs are mislabeled as meters in the SUPPORTTYPE value of the support record.  I don't want to remove the
                    // meter code, so for now we will short-circuit this test
                    if (value > 114) {
                        retiredText = "Show Retired Meters";
                        isMeter = true;
                    }
                    else {
                        retiredText = "Show Retired Signs";
                        isMeter = false;
                    }
                };

                var updateFeature;

                this.mapClick = function (evt) {

                    if (evt.mapPoint == null) {
                        
                        selectQuery.where = "GLOBALID ='" + evt.id + "'";
                        selectQuery.geometry = null;
                        isAnalysis = true;
                    }
                    else {
                        selectQuery.geometry = MapUtilities.pointToExtent(map, evt.mapPoint, 12);
                        selectQuery.where = null;
                        isAnalysis = false;
                    }
                   

                    var createSupportControls = function (feature, featcount, idx, ret) {
                        updateFeature = feature;
                        $mainNode.empty();
                        selectFeatureSymbol(updateFeature);
                        var UVR = FeatureUtilities.getFeatureSymbol(supportFeatureLayer, updateFeature.attributes.SUPPORTTYPE.toString());
                       
                        var $img = $("<img>", { src: UVR.url, class: "supportImg" }).appendTo($mainNode);

                        codedValues = FeatureUtilities.getCodedValues(supportFeatureLayer, "SUPPORTTYPE");
                        var $supType = $("<div>", { id: "supportType", class: "supportDiv1" }).appendTo($mainNode);
                         signOrMeter(updateFeature.attributes.SUPPORTTYPE)
                       
                        $supType.html(  codedValues.name(updateFeature.attributes.SUPPORTTYPE));
                        $("<br>").insertAfter($supType);
             
                        codedValues = FeatureUtilities.getCodedValues(supportFeatureLayer, "SUPPORTSTATUS");
                        if (ret) {

                            updateFeature.attributes.SUPPORTSTATUS = 5;
                        }
                         var $supStat = $("<div>", { id: "supportStatus", class: "supportDiv2" }).appendTo($mainNode);
                        $supStat.html ( "STATUS:" + codedValues.name(updateFeature.attributes.SUPPORTSTATUS));
                         $("<br>").insertAfter($supStat);

                        var $supGUID = $("<div>", { id: "supportGUID", class: "supportDiv2" }).appendTo($mainNode);
                        $supGUID.html("ID:" +updateFeature.attributes.GLOBALID);
                        $("<br>").insertAfter($supGUID);
                       
                        var $btnImageDIV = $("<div>", { id: "btnImageDIV", style: { "text-align": "center" } }).appendTo($mainNode);
                        var latlong = MapUtilities.webMercatorToGeographic( updateFeature.geometry);
                       var btnImage = SignImageWidget({ target: btnImageDIV, objectID: updateFeature.attributes.OBJECTID, layer: supportFeatureLayer });
                       var btnGlobe = GlobespotterWindow({ target: btnImageDIV, LL:latlong });
                       var btnGoogle = GoogleStreetViewWindow({ target: btnImageDIV, LL:latlong });

                       var $navDiv = $("<div>", { id: "navButtons", style: { "text-align": "center" } } ).appendTo($mainNode);
                          $("<div>", { id: "editButtons", style: { "text-align": "right" }}).appendTo($mainNode);
                        var eButtons = new SupportEditor({ target: $mainNode[0], selFeature: updateFeature, selLayer: supportFeatureLayer, graphicsLayer: selectGraphicsLayer, index: idx, success: createWidget, cancel: createWidget, id: "_sup", timebandLayer: null });
                        var $showRetiredDiv = $("<div>").appendTo($mainNode);
                        var $chkRetiredSigns = $("<input />", { type: "checkbox", id: "checkShow" }).appendTo($showRetiredDiv);
                        $("<label />", { html: retiredText }).appendTo($showRetiredDiv);
                        if (signDefine == "") {
                            $chkRetiredSigns.prop('checked' , true);
                        }
                        else {
                            $chkRetiredSigns.prop('checked', false);
                        }
                        $chkRetiredSigns.click(function (evt) {

                            if (this.checked) {
                                signDefine = "";
                            }
                            else {
                                signDefine = "SIGNSTATUS <> 5";
                            }
                            getSignFeatures(updateFeature);
                        });
                    };

                    var createMeterWidgets = function (relatedRecords) {

                        var $meterTarget = $(args.signTarget);

                        if (setRetired) {

                            for (var record in relatedRecords[currentSupportObId].features) {

                                relatedRecords[currentSupportObId].features[record].attributes.STATUS = 5;
                            }
                            signFeatureLayer.applyEdits(null, relatedRecords[currentSupportObId].features, null, function () { }, function (err) { alert(err.message) });
                            //   return;
                        }
                        if (relatedRecords[currentSupportObId] === undefined) {
                            $meterTarget.html = "No Meter Records Found";
                            args.signTarget.innerHTML = "No Sign Records Found";
                        //    return;
                        }
                        else
                            $meterTarget.empty();
                        numSigns = relatedRecords[currentSupportObId].features.length;
                        for (var i = 0; i < relatedRecords[currentSupportObId].features.length; i++) {

// must make an editor to create some related records or this will never be hit.  DOH
                     //       var signWidge = new SignWidget({ "feature": relatedRecords[currentSupportObId].features[i], "target": args.signTarget, "layer": signFeatureLayer, "timebandLayer": args.timebandLayer, "order": i });
                        }

                    };
                    
                    var createSignWidgets = function (relatedRecords) {
                        var $signTarget = $(args.signTarget);
                        try{
                            var features = SignOrderUtilities.SortSigns(signFeatureLayer, relatedRecords[currentSupportObId].features, "SIGNORDER");
                        }
                        catch (err) {
                           
                            $signTarget.empty();
                        }
                       
                       
                        // if support has been retired, retire all associated signs
                        if (setRetired ) {

                            for (var record in relatedRecords[currentSupportObId].features) {

                                relatedRecords[currentSupportObId].features[record].attributes.STATUS = 5;
                                relatedRecords[currentSupportObId].features[record].attributes.SIGNORDER = 0;

                            }
                            signFeatureLayer.applyEdits(null, relatedRecords[currentSupportObId].features, null, function () {  }, function (err) { alert(err.message) });
                        }
                      
                        if (relatedRecords[currentSupportObId] === undefined) {
                            $signTarget.html = "No Sign Records Found";
                            args.signTarget.innerHTML = "No Sign Records Found";
                            return;
                        }
                        else
                            $signTarget.empty();
                        numSigns = relatedRecords[currentSupportObId].features.length;
                        for (var i = 0; i < relatedRecords[currentSupportObId].features.length; i++) {
                     
                            var signWidge = new SignWidget({ "feature": relatedRecords[currentSupportObId].features[i], "target": args.signTarget, "layer": signFeatureLayer, "timebandLayer": args.timebandLayer, "order": i, "features": relatedRecords[currentSupportObId].features , "supClick":ne.mapClick});
                        }


                    };

                    var AddSign = function () {
                        
                        var newFeature = { "attributes": { "OBJECTID": null, "SIGNTEXT": null, "MUTCD": null, "GLOBALID": null, "SIGNSTATUS": 1, "SUPPORTID": signKey, "SIGNNUMBER": null, "SIGNORDER":null,  "CREATED_USER": null, "CREATED_DATE": null, "LAST_EDITED_USER": null, "LAST_EDITED_DATE": null, "SIGNARROWDIRECTION": null } };
                        newFeature.setAttributes = function (a) { this.attributes = a; return this };
                        var addMe = new Graphic(null, null, newFeature);
                        var $mainNode = $("<div>", { id: "signDIV_" + numSigns, class: "signDIV" }).appendTo(args.signTarget); // domConstruct.create("div", { id: "signDIV_" + numSigns, class: "signDIV" }, args.signTarget);
                        var editor = new SignEditor({ target:$mainNode[0] , selFeature: newFeature, selLayer: signFeatureLayer, graphicsLayer: null, index: numSigns, success: createWidget, cancel: createWidget, id: "_sign", timebandLayer: args.timebandLayer, isNew:true });

          
                       
                    };

                    var createWidget = function ( index,retired)
                    {
                        if (index == undefined) {
                            index = 0;
                        }
                        setRetired = retired;
                        createSupportControls(selectedFeatures[index], selectedFeatures.length,index, setRetired);
                        getSignFeatures(selectedFeatures[index]);
                        sIndex = index;
                        var $addBtn = $("#addSign");
                       
                        if ($addBtn.length == 0) {
                            var $addDiv = $("#addPane").empty();
                            $addBtn = $("<div>", { id: "addSign" }).appendTo($addDiv);
                            $addBtn.html( "<i class='fa fa-plus'></i>  ADD NEW SIGN");
                            $addBtn.click ( AddSign);
                         
                        }
                    };

                    var getSignFeatures = function (feature) {
                        signKey = feature.attributes.GLOBALID;
                        
                        var rQuery = new RelationshipQuery();
                        currentSupportObId = feature.attributes.OBJECTID;
                        rQuery.objectIds = [currentSupportObId];
                        
                        if (isMeter) {
                            rQuery.relationshipId = 7;
                            rQuery.outFields = ["METER_ID","METERTYPE","ISPAYBYSPACE","ISADA","CREATED_USER","CREATED_DATE","LAST_EDITED_USER","LAST_EDITED_DATE","SUPPORT_ID"];
                            supportFeatureLayer.queryRelatedFeatures(rQuery, createMeterWidgets,
                                function (err) { alert(err.message) })
                        }
                        else {
                            rQuery.relationshipId = 0;
                            rQuery.definitionExpression = signDefine;
                            rQuery.outFields = ["MUTCD", "SIGNSTATUS", "SIGNTEXT", "SIGNARROWDIRECTION", "OBJECTID", "SIGNNUMBER","SIGNORDER", "SUPPORTID", "CREATED_USER", "CREATED_DATE", "LAST_EDITED_USER", "LAST_EDITED_DATE", "GLOBALID"];
                            supportFeatureLayer.queryRelatedFeatures(rQuery, createSignWidgets, function () { alert("error") });
                        }



                    };

                    //clicking of map initiates selection of support features and retrieval by query
                    supportFeatureLayer.selectFeatures(selectQuery, FeatureLayer.SELECTION_NEW, function (features) {
                        if (features.length > 0) {
                            if (features.length > 1) {
                                map.centerAndZoom(features[0].geometry, 20);
                            }
                            selectedFeatures = features;
                            createWidget( 0);
                        }

                    },
                    function (err) {
                        alert(err.message)
                    }
                    );

                   
           
                };
            }

        });


    });
