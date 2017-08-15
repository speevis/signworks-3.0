
/*  not currently used */
define(["dojo/_base/declare",
    "esri/tasks/query",
     "esri/layers/FeatureLayer",
   "myModules/MapUtilities",
   "myModules/SegmentAnalysisRenderer"
],
   function (declare,
       Query,
       FeatureLayer,
       MapUtilities,
       SegmentAnalysisRenderer) {

   
    return declare(null, {

        mapClick: null,
        constructor: function (args) {
            var myDiv = args.target;
            var segLayer = args.segLayer;
            var supClick = args.supClick;
            var selectQuery = new Query();
            var $button = $('<button/>', { text: "select segment", id: "segBut" }).appendTo(myDiv);
            $button.click(function () {
                clickTask = "segment";
            });
            var getAnalysis = function (features) {
                var bob = features[0];
                return { "1": { "SignIDs": "{6153DAFC-1943-4F0C-B1F8-11BA22376664}", "ErrorLevel": "Error", "ErrorType": "PointErrors", "MUTCD": "R-NS-056", "CheckName": "For time  restrictions, both start time and end time are required", "SupportIDs": "{A6993598-F2F0-4DF0-B780-25ED14646807}", "Y": 4707308.0, "X": -8574484.0 }, "2": { "SignIDs": 
                    "{7D2CD5B0-6F38-46CC-8863-4E7DB05730CF}", "ErrorLevel": "Warning", "ErrorType": "PointErrors", "MUTCD": "R-NS-056", "CheckName": "For time  restrictions, both start time and end time are required", "SupportIDs": "{DB0FEB51-7C9D-4769-97CD-38C9DD0D0B03}", "Y": 4707261.5, "X": -8574484.0
                }, "3": {
                    "SignIDs": "{678C9976-369A-4493-91FC-E5E9613997BE}",
                    "ErrorLevel": "Info", "ErrorType": "PointErrors", "MUTCD": "R-NS-056", "CheckName": "For time  restrictions, both start time and end time are required", "SupportIDs": "{949905A4-1772-487D-870F-3978382A2817}", "Y": 4707272.5, "X": -8574484.0
                }, "4": { "SignIDs": "{070ADDF7-824F-4AEA-9E08-216B1752957A}", "ErrorLevel": "Warning", "ErrorType": "PointErrors", "MUTCD": "R-NS-056", "CheckName": "For time  restrictions, both start time and end time are required", "SupportIDs": "{9BA6540C-7C03-44A9-81C0-B2437C51739B}", "Y": 4707241.0, "X": -8574484.0 }, "5":
                    { "SignIDs": "{B4D1E344-C380-498E-8589-DF5A89E713A7}", "ErrorLevel": "Warning", "ErrorType": "PointErrors", "MUTCD": "R-NS-007", "CheckName": "These parking sign types require a directional arrow", "SupportIDs": "{A3789962-7FCE-4EDB-AE35-410102815E19}", "Y": 4707280.5, "X": -8574503.0 }, "6": {
                        "SignIDs": "{691040E1-4AC8-4B93-9895-0719ABE9EC8E}",
                        "ErrorLevel": "Warning", "ErrorType": "PointErrors", "MUTCD": "R7-108", "CheckName": "These parking sign types require a directional arrow", "SupportIDs": "{DB0FEB51-7C9D-4769-97CD-38C9DD0D0B03}", "Y": 4707261.5, "X": -8574484.0
                    }, "7": { "SignIDs": "{A102A966-D9DC-4017-9FE8-2496E02D4911}", "ErrorLevel": "Warning", "ErrorType": "PointErrors", "MUTCD": "R7-108", "CheckName": "These parking sign types require a directional arrow", "SupportIDs": "{A3789962-7FCE-4EDB-AE35-410102815E19}", "Y": 4707280.5, "X": -8574503.0 }, "300003":
                        {
                            "SignIDs": ["{7D2CD5B0-6F38-46CC-8863-4E7DB05730CF}"], "ErrorLevel": "Warning", "ErrorType": "ZoneBuildErrors", "MUTCD": "R-NS-056", "CheckName": "Unexpected closing arrow, not at block corner", "SupportIDs": ["{DB0FEB51-7C9D-4769-97CD-38C9DD0D0B03}"], "Polyline": [[-8574494.288768971, 4706226.11721825, 0, 0],
                              [-8574494.149556391, 4706264.210147867, 0, 29.566]]
                        }, "300001": { "SignIDs": ["{874D3CE4-F464-4CC3-B496-C7EE3B2FB6C0}"], "ErrorLevel": "Warning", "ErrorType": "ZoneBuildErrors", "MUTCD": "R-NS-011", "CheckName": "Unexpected closing arrow, not at block corner", "SupportIDs": ["{949905A4-1772-487D-870F-3978382A2817}"], "Polyline": [[-8574494.288768971, 4706226.11721825, 0, 0], [-8574494.10937355, 4706275.205407183, 0, 38.1]] },
                        "300004": {
                            "SignIDs": ["{2DEAD583-0692-4B45-BF2C-D6C7DFAB9FFB}"], "ErrorLevel": "Warning", "ErrorType": "ZoneBuildErrors", "MUTCD": "R-NS-038", "CheckName": "Unexpected closing arrow, not at block corner", "SupportIDs": ["{DA45CAD9-5983-4073-8DF9-4DBC2EACC23C}"], "Polyline": [[-8574494.288768971, 4706226.11721825, 0, 0],
                                [-8574494.016087249, 4706300.731357992, 0, 57.912]]
                        }, "300005": { "SignIDs": ["{705AC11D-8B9C-4F9C-996F-DC031D145FAE}"], "ErrorLevel": "Warning", "ErrorType": "ZoneBuildErrors", "MUTCD": "R7-108", "CheckName": "Unexpected closing arrow, not at block corner", "SupportIDs": ["{0E8C820D-9552-445F-A59D-AC612FA7B79D}", "{DA45CAD9-5983-4073-8DF9-4DBC2EACC23C}"], "Polyline": [[-8574494.288768971, 4706226.11721825, 0, 0], [-8574493.990255918, 4706307.799578663, 0, 63.397999999999996]] }
                };
            };
            this.mapClick = function (evt) {

                selectQuery.geometry = MapUtilities.pointToExtent(map, evt.mapPoint, 12);
                segLayer.selectFeatures(selectQuery, FeatureLayer.SELECTION_NEW, function (features) {
                    if (features.length > 0) {
                   //     selectedFeatures = features;
                        var results = getAnalysis(features);
                        var segAnly = new SegmentAnalysisRenderer({"target":myDiv, "results":results, supLayer: args.supLayer, "supClick":supClick});
                    }

                },
                    function (err) {
                        alert(err.message)
                    }
                    );
            }
        }

    });


});
