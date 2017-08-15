define(["dojo/_base/declare",
    "esri/tasks/query",
         "esri/layers/FeatureLayer",
     "myModules/FeatureUtilities"],
    function (
        declare,
        Query,
        FeatureLayer,
        FeatureUtilities) {


        return declare(null, {
            features: null,
            newFeatures:null,
            update: null,
            addTimeband: null,
            constructor: function (args) {
                var hourCodes = {_codedValue: [{code:.25, name:"15 min"},{code:.5, name:"30 min"},{code:1, name:"1 hour"},{code:1.5, name:"1.5 hour"},{code:2, name:"2 hour"},{code:2.5, name:"2.5 hour"},{code:3, name:"3 hour"},{code:3.5, name:"3.5 hour"},{code:4, name:"4 hour"},{code:4.5, name:"4.5 hour"},{code:5, name:"5 hour"}]};
                hourCodes.name = function (index) {
                    for (var i = 0; i < this._codedValue.length; i++) {

                        if (this._codedValue[i].code == index) {
                            return this._codedValue[i].name;
                        }
                    }
                };
    
                    newFeatures = [];
 
                var $mainNode = $("<div>", { id: "TB_" }).appendTo(args.target);
                var codedValues;               
                var layer = args.layer;
                var editMode = args.editMode;
                var originalFeatures;
                // this variable gives new timebands a unique number to create ids with since they dont have an objectID yet;
                var n = 1;
      
                var id = args.sign_id;
                var isAnytime = false;
                if (args.features == undefined)
                    features = null;
                else
                    features = originalFeatures = args.features.features;
              
             
                var checkTime = function (newFeat, feat) {
                    var check = function (feature) {

                        if (feature.attributes.STARTTIME == 49 || feature.attributes.ENDTIME == 49) {
                            feature.attributes.STARTTIME = 49;
                            feature.attributes.ENDTIME = null;

                        }
                    }

                    for (var feat in newFeatures) {
                        check(newFeatures[feat]);
                    }
                    for (var feat in features) {
                        check(features[feat]);
                    }
                };
                this.update = function (call, evt, feat) {
  
                    checkTime(newFeatures, features);
                    var fered = JSON.stringify(newFeatures);
                    // look up globalID here
                    if (evt) {
                        var qry = new Query();
                        qry.where = "OBJECTID ='" + evt[0].objectId + "'";
                        
                        args.signLayer.selectFeatures(qry, FeatureLayer.SELECTION_NEW,
                            function (features) {
                                for (var j = 0; j < newFeatures.length;j++) {

                                   newFeatures[j].attributes.SIGNID = features[0].attributes.GLOBALID;
                                }
                                layer.applyEdits(newFeatures, features, null, function () {

                                    call(feat);
                                }, function (err)
                                { call(); });
                            },
                            function () { });
                    }
                    layer.applyEdits(newFeatures, features, null, function () {

         

                        call(feat);
                    },
                    function (err)
                    { call(feat); });
                };



                var delBand = function (currentID) {

                  
                    var result = confirm("Do you want to retire the selected record?");
                    if (result) {

                        var id = this.id.substring(10);
                        var delFeature;
                        for (var i = 0; i < features.length; i++) {

                            if (features[i].attributes.OBJECTID == id)
                                delFeature = features[i];
                            else if (newFeatures[i] && newFeatures[i].attributes.OBJECTID == id) {
                                delFeature = newFeatures[i];
                                newFeatures.splice(i, 1);
                                break;
                            }
                        }

                        // this is the odious case of removing a timeband before the new sign record is saved
                        if (delFeature == undefined) {

                            var target = currentID.target.id;
                            target = target.split("_");
               
                            for (var i = 0; i < newFeatures.length; i++) {

                                if (newFeatures[i].attributes.OBJECTID == id)
                                    delFeature = newFeatures[i];
                            
                            }
                        }


                        delFeature.attributes.RESTRICTIONSTATUS = 5;
                        $("#timeDiv_" + delFeature.attributes.OBJECTID).remove();

                    }

                };

                var anytime = function (feature) {
           
                    var id = feature.attributes.OBJECTID;


                    var $start = $("#selStartDay_" + id);
                    var $end = $("#selEndDay_" + id);
                    var $stTime = $("#selStartTime_" + id);
                    var $ndTime = $("#selEndTime_" + id );
                    if ($start[0].value == "8" || $end[0].value == "8") {

                        $start[0].disabled = false;
                     
            
                        feature.attributes.STARTDAY = 8;

                        $end[0].disabled = true;
                        $end[0].selectedIndex = 0;
                        feature.attributes.ENDDAY = null;
                        $stTime[0].disabled = true;
                        $stTime[0].selectedIndex = 0;
                        feature.attributes.STARTTIME = null;
                        $ndTime[0].disabled = true;
                        $ndTime[0].selectedIndex = 0;
                        feature.attributes.ENDTIME = null;

                    }
                    else {

                        $start[0].disabled = false;
                        $end[0].disabled = false;
                        $stTime[0].disabled = false;
                        $ndTime[0].disabled = false;
                    }

                };

                var $timeDiv;
                var createWidget = function (selectedTimebandFeature) {

                    var id ;
                    if (selectedTimebandFeature.attributes.OBJECTID != undefined) {
                        id = selectedTimebandFeature.attributes.OBJECTID;
                    }
                   
                 
                    if (selectedTimebandFeature.attributes.STARTDAY == 8)
                        isAnytime = true;
                    if (editMode) {
                        $timeDiv = $("<div>", { id: "timeDiv_" + id }).appendTo($mainNode);
                    }
                    else {

                        $timeDiv = $("<div>", { id: "timeDiv_no_edit_" + id, class: "timeB" }).appendTo($mainNode);
                        $("<i class='fa fa-clock-o'></i>").appendTo($timeDiv);
                    }

                    var $startDay, $endDay, $startTime, $endTime;

                    codedValues = FeatureUtilities.getCodedValues(layer, "STARTDAY");
                    if (editMode) {

                        var $cancelButton = $("<button />", { id: "delButton_" + id, title: "Retire Timeband" }).appendTo($timeDiv);
                        $cancelButton.kendoButton({ spriteCssClass: "fa fa-times" });
                        $cancelButton.click( delBand);
                        var $startDay = $("<select />", { id: "selStartDay_" + id, class: "timeband" }).appendTo($timeDiv);
                        $startDay.change(function (evt) {
                            selectedTimebandFeature.attributes.STARTDAY = Number(this[this.selectedIndex].value);
                            anytime(selectedTimebandFeature);
                            isEdited = true;
                        });
                        FeatureUtilities.addOptionsToSelect($startDay[0], codedValues, selectedTimebandFeature.attributes.STARTDAY, false);
                        


                    }
                    else {
                        if (selectedTimebandFeature.attributes.STARTDAY == 8) {

                            isAnytime = true;
                            $startDay = $("<label/>", { html: codedValues.name(selectedTimebandFeature.attributes.STARTDAY) }).appendTo($timeDiv);
                        }
                        else {
                            isAnytime = false;
                            $startDay = $("<label/>", { html: codedValues.name(selectedTimebandFeature.attributes.STARTDAY) + " - " }).appendTo($timeDiv);
                        }

                    }

                    codedValues = FeatureUtilities.getCodedValues(layer, "ENDDAY");
                    if (editMode) {

                        $endDay = $("<select />",{ id: "selEndDay_" + id, class: "timeband" }).appendTo($timeDiv);
                        $endDay.change ( function (evt) {
                            selectedTimebandFeature.attributes.ENDDAY = Number(this[this.selectedIndex].value);
                            anytime(selectedTimebandFeature);
                            isEdited = true;
                        });
                        FeatureUtilities.addOptionsToSelect($endDay[0], codedValues, selectedTimebandFeature.attributes.ENDDAY, true);
                    }
                    else {
                        if (isAnytime) {
                            $endDay = $("<label/>", { html: "" }).appendTo($timeDiv);
                        }
                        else if(selectedTimebandFeature.attributes.ENDDAY == null){
                            $endDay = $("<label/>", { html: "" }).appendTo($timeDiv);
                        }
                        else {
                            $endDay = $("<label/>", { html: codedValues.name(selectedTimebandFeature.attributes.ENDDAY) + "  | " }).appendTo($timeDiv);
                        }
                    }


                    codedValues = FeatureUtilities.getCodedValues(layer, "STARTTIME");
                    if (editMode) {

                        $startTime = $("<select />", { id: "selStartTime_" + id, class: "timeband" }).appendTo($timeDiv);
                        $startTime.change ( function (evt) {
                            selectedTimebandFeature.attributes.STARTTIME = Number(this[this.selectedIndex].value);
                            isEdited = true;
                        });
                        FeatureUtilities.addOptionsToSelect($startTime[0], codedValues, selectedTimebandFeature.attributes.STARTTIME, true);
                    }
                    else {
                        if (isAnytime) {
                            $startTime = $("<label/>", { html: "" }).appendTo($timeDiv);
                        }
                        else if (selectedTimebandFeature.attributes.STARTTIME == null) {
                            $startTime = $("<label/>", { html: "" }).appendTo($timeDiv);
                        }
                        else if (selectedTimebandFeature.attributes.STARTTIME == 49) {
                            $startTime = $("<label/>", { html: codedValues.name(selectedTimebandFeature.attributes.STARTTIME) +  " - " }).appendTo($timeDiv);
                        }
                        else {
                           
                            $startTime = $("<label/>", { html: codedValues.name(selectedTimebandFeature.attributes.STARTTIME) + "M" + " - " }).appendTo($timeDiv);
                        }

                    }



                    codedValues = FeatureUtilities.getCodedValues(layer, "ENDTIME");

                    if (editMode) {

                        $endTime = $("<select />", { id: "selEndTime_" + id, class: "timeband" }).appendTo($timeDiv);
                        $endTime.change (function (evt) {
                            selectedTimebandFeature.attributes.ENDTIME = Number(this[this.selectedIndex].value);
                            isEdited = true;
                        });
                        FeatureUtilities.addOptionsToSelect($endTime[0], codedValues, selectedTimebandFeature.attributes.ENDTIME, true);

                    }
                    else {
                        if (isAnytime) {
                            $endTime = $("<label/>", { html: "" }).appendTo($timeDiv);
                        }
                        else if (selectedTimebandFeature.attributes.ENDTIME == null) {
                            $endTime = $("<label/>", { html: "" }).appendTo($timeDiv);
                        }
                        else if (selectedTimebandFeature.attributes.ENDTIME == 49) {
                            $endTime = $("<label/>", { html: codedValues.name(selectedTimebandFeature.attributes.ENDTIME) + " - " }).appendTo($timeDiv);
                        }
                        else {
                             $endTime = $("<label/>", { html: codedValues.name(selectedTimebandFeature.attributes.ENDTIME) + "M  " }).appendTo($timeDiv);
                        }
                    }
                    
                    codedValues = hourCodes;
                    if (editMode) {

                        $hours = $("<select />", { id: "hours_" + id, class: "timeband" }).appendTo($timeDiv);
                        $hours.change(function () {
                            selectedTimebandFeature.attributes.HOURLIMIT = Number(this[this.selectedIndex].value);
                            isEdited = true;
                        });
                        FeatureUtilities.addOptionsToSelect($hours[0], codedValues, selectedTimebandFeature.attributes.HOURLIMIT, true);
                    }
                    else {
                        if (isAnytime) {
                             $hours = $("<label/>", { html: "" }).appendTo($timeDiv);
                        }
                        else {
                             $hours = $("<label/>", { html: codedValues.name(selectedTimebandFeature.attributes.HOURLIMIT) }).appendTo($timeDiv);
                        }
                    }
                    $("<br>").insertAfter($hours);

                    if (selectedTimebandFeature.attributes.STARTDAY === null) {

                          $startDay[0].value = 8;
                        anytime(selectedTimebandFeature);
                    }
                    if (editMode) {
                        anytime(selectedTimebandFeature);
                    }
                   
                };
                //end
                
                



                this.addTimeband = function () {
                
                    // this removes the  "no time restrictions" div in editor panel
                    $("#timeDiv_001").remove();
                
                   
                    newFeature = { "attributes": { "OBJECTID": n++,  "LINKID": null, "HOURLIMIT": null, "RESTRICTIONORDER": null, "STARTDAY": 8, "ENDDAY": null, "STARTTIME": null, "ENDTIME": null, "EXCEPTION": null, "SIGNID": args.sign_id, "RESTRICTIONSTATUS": 1 } };
                    if (features.length > 0) {
                        newFeature.attributes.SIGNID = features[0].attributes.SIGNID;
                    }
                    newFeatures.push(newFeature);
                    createWidget(newFeature);
                    anytime(newFeature);
                  
                };


                if (features === null) {
                    if (editMode) {
                        $timeDiv = $("<div>", { id: "timeDiv_001", html: "No Time Restrictions", class: "" }).appendTo($mainNode);
                        features = [];
                    }
                    else {
                         $timeDiv = $("<div>", { id: "timeDiv_000", html: "No Time Restrictions", class: "timeB" }).appendTo($mainNode);
                        features = [];
                    }
                }
                for (var i = 0; i < features.length; i++) {

                    createWidget(features[i]);

                }
            }
        });


    });
