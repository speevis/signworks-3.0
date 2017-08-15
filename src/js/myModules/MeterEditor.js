/*  not currently used */
//parameters -
//selLayer is the layer that is providing the features to edit
//selFeature is the feature to edit
//cancel is an optional callback function that can be used for additional cleanup
//success is an optional callback function that can be used for additional actions

//check 12/16/2016




define(["dojo/_base/declare",

    "myModules/FeatureUtilities",
   "esri/tasks/RelationshipQuery",
   "myModules/TimebandWidget"
], function (declare,
   
     FeatureUtilities,
     RelationshipQuery,
     TimebandWidget) {


    return declare(null, {




        
        constructor: function (args) {
            var layer = args.selLayer;
            var feature = args.selFeature;
            var widgetTimeBand;
            var cancelCall = args.cancel;
            var successCall = args.success;
            var order = args.index;
            var id = feature.attributes.OBJECTID;
            var isNew = args.isNew;
            var speedCodes = {
                _codedValue: [{ code: 5, name: "5" }, { code: 10, name: "10" }, { code: 15, name: "15" }, { code: 20, name: "20" },
                    { code: 25, name: "25" }, { code: 30, name: "30" }, { code: 35, name: "35" }, { code: 40, name: "40" },
                    { code: 45, name: "45" }, { code: 50, name: "50" }, { code: 55, name: "55" }, { code: 60, name: "60" }, { code: 65, name: "65" }, { code: 70, name: "70" }]
            };

            var graphics = args.graphicsLayer;
         
            var getTimebandFeatures = function (feature, id) {
               
                if (feature === null) {

                    if (widgetTimeBand === undefined) {

                        widgetTimeBand = new TimebandWidget({ "features":null, "target": $bandDiv[0], "layer": args.timebandLayer, "signLayer": args.selLayer,"editMode": true, "sign_id": id });
                    }
                    widgetTimeBand.addTimeband();
                    return;
                }
                var rQuery = new RelationshipQuery();
                var SignObId = feature.attributes.OBJECTID;
                rQuery.objectIds = [SignObId];
                rQuery.relationshipId = 2;
                rQuery.definitionExpression = "STATUS = 1";
                rQuery.outFields = ["OBJECTID", "HOURLIMIT", "RESTRICTIONORDER","SIGNID", "STARTDAY", "ENDDAY", "STARTTIME", "ENDTIME", "EXCEPTION", "STATUS"];
                layer.queryRelatedFeatures(rQuery, function (relatedRecords) {
                    widgetTimeBand = new TimebandWidget({ "features": relatedRecords[SignObId], "target": $bandDiv[0], "layer": args.timebandLayer, "signLayer": args.selLayer, "editMode": true, "sign_id": id
                });
                }
                    , function () { alert("error retrieving timebands"); });
            };
    
            var sideInternal = args.target;
             $("<div>", { class: "ButtonDiv" }).appendTo(sideInternal);
             var $editButton = $("<button/>", { id: "editButton_" + id }).appendTo(sideInternal);
             var $dialogDiv =  $("<div>", { id: "editSignDialog_" + id, class: "dialog" }).appendTo(sideInternal);
            var $arrDirDiv = $("<div>", { id: "dirDiv_" + id }).appendTo($dialogDiv);
            var $mutSelDiv = $("<div>", { id: "mutSelDiv" + id }).appendTo($dialogDiv);
           
            var dirSel = function (evt) {
                var myId = evt.target.id;
                feature.attributes.SIGNARROWDIRECTION = Number(myId.charAt(4));
                signURL = "./img/" + feature.attributes.SIGNARROWDIRECTION + ".png";
                $imgArrow[0].src = signURL;
                $arrDirDiv.dialog("close");

            };

            var successChange = function (feature) {

                if (widgetTimeBand != undefined)
                    widgetTimeBand.update(call, feature);
                else  //does the code ever reach here?
                    call();
                
            };

            var call = function () {

                if (successCall)
                    successCall();
            }

            $arrDirDiv.html('<table>    <tr><td><img src="img/6.png" class="dirSign" id="dir_6" /></td> <td><img src="img/4.png" class="dirSign"  id="dir_4" /></td><td><img src="img/8.png" class="dirSign"  id="dir_8" /> </td></tr>    <tr><td><img src="img/1.png"  class="dirSign" id="dir_1" /></td> <td><img src="img/3.png"  class="dirSign" id="dir_3" /></td><td><img src="img/2.png" class="dirSign"  id="dir_2" /> </td></tr>    <tr><td><img src="img/7.png" class="dirSign"  id="dir_7" /></td> <td><img src="img/5.png"  class="dirSign" id="dir_5" /></td><td><img src="img/9.png" class="dirSign"  id="dir_9" /> </td></tr></table>');
        
            $(".dirSign").click(dirSel);

            //INTERNAL DIALOG FIELDS AND CONTROLS

            //MTCD image

            var url = "img/MUTCD/" + feature.attributes.MUTCD + ".png" + "?timestamp=" + new Date().getTime();
            var $imgDIV = $("<div>", { id: "img_signDIV_" + id, class: "imgDiv" }).appendTo($dialogDiv);
            var $mutImage = $("<IMG />", { src: url, id: "mutSign_" + id, 'width': '100%', 'max-height': '100%' }).appendTo($imgDIV);

            $mutImage.error(function () {
                $(this).unbind("error").attr("src", "img/MUTCD/PR-OTHER.png")
            });

            //MUTCD
            var MutcdReturn = function (rtrn) {

                $mutt.html( rtrn.code);
                feature.attributes.MUTCD = rtrn.code;
                $mutt2.html(rtrn.text);
                $mutImage[0].src = "img/MUTCD/" + rtrn.code + ".png" + "?timestamp=" + new Date().getTime();
                $mutImage.error(function () {
                    $(this).unbind("error").attr("src", "img/MUTCD/PR-OTHER.png")
                });
                $mutSelDiv.dialog("close");
            };
            if (feature.attributes.MUTCD != null)
                var muttcode = muttValues.name(feature.attributes.MUTCD).split(":");
            else
                var muttcode = ["Enter MUTCD", ""];
            var $mutt = $("<label />", { id: "lblMutcd", class: "MuttLabel", html: muttcode[0], size: 35 }).appendTo($dialogDiv);
            $mutt.click(function () { $mutSelDiv.dialog("open"); });
            //         var $mutt = $("<a/>", { id: "lblMutcd", class: "MuttLabel", text: muttcode[0], href:"" }).appendTo($dialogDiv);;
             var $mutt2 = $("<label>", { id: "lblMutcd2", class: "MuttLabel2", html: muttcode[1], size: 35 }).appendTo($dialogDiv);
            $("<br>").insertAfter($mutt);
            $("<br>").insertAfter($mutt2);
            var mutGuts = new MutcdSelectorWidget({ layer: layer, target: $mutSelDiv, values: muttValues, callback: MutcdReturn, oId:id,signID:feature.attributes.MUTCD });

            //MPH 
            $("<label>", { for: "selMPH" + id, class: "status", html: "MPH:" }).appendTo($dialogDiv);
          
            var $speed = $("<select/>", { id: "selMPH" + id, class: "mph" }).appendTo($dialogDiv);
            
            $speed.change(function (evt) {
                feature.attributes.SIGNNUMBER = Number(this[this.selectedIndex].value);
            });
            FeatureUtilities.addOptionsToSelect($speed[0], speedCodes, feature.attributes.SIGNNUMBER, true);
            $("<br>").insertAfter($speed);

            //STATUS
             $("<label>", { for: "selStatus" + id, class: "status", html: "Status:" }).appendTo($dialogDiv);
            var codedValues = FeatureUtilities.getCodedValues(layer,"STATUS");
             var $stat = $("<select/>", { id: "selStatus" + id, class: "status" }).appendTo($dialogDiv);
            $stat.change(function (evt) {
                feature.attributes.STATUS = Number(this[this.selectedIndex].value);
            });

            FeatureUtilities.addOptionsToSelect($stat[0], codedValues, feature.attributes.STATUS, true);

            
            //ARROW DIRECTION
            var signURL = "./img/" + feature.attributes.SIGNARROWDIRECTION + ".png";
            var $imgArrow = $("<img />", { src: signURL, height: '40px', width: '60px', id: "dirArr_" + id, class: "editArrow", title: "Click To Edit Arrow Direction" }).appendTo($dialogDiv);
            $imgArrow.error(function () { $(this).unbind("error").attr("src", "img/10.png") });
  
            //timebands
            var $bandDiv = $("<div>", { id: "bandDiv_" + id, class: "editBandDiv", style: "min-width:50px" }).appendTo($dialogDiv);
            $("<div>", {
                id: "tld_" + id, class: "", html: "Time Restrictions for this Sign:" }).appendTo($bandDiv);
                    $("<div>", { id: "tmc_" +id, class: "timeColumn", html: "<pre> START DAY      END DAY      START TIME    END TIME      HOUR LIMIT </pre>" }).appendTo($bandDiv);
            var $addTimebandButton = $("<button />", { id: "btnAdd_", class: "editField", title: "Add Timeband" }).appendTo($dialogDiv);
            $addTimebandButton.signId = feature.attributes.GLOBALID;
            $addTimebandButton.click(function () {
                this.signId;
                getTimebandFeatures(null, this.signId);
            });
            $addTimebandButton.kendoButton({ spriteCssClass: "fa fa-plus" });
            getTimebandFeatures(feature, feature.attributes.GLOBALID);

            //BOTTOM BUTTONS

            var $bottomButtonDiv = $("<div>", { style: "float:right" }).appendTo($dialogDiv);
       //     var $editMUTCDButton = $("<button/>", { id: "editmButton_" + id, title: "Edit Sign Type" }).appendTo($bottomButtonDiv);
            var $saveButton = $("<button/>", { id: "saveButton_" + id, title: "Save Record" }).appendTo($bottomButtonDiv);
            var $cancelButton = $("<button/>", { id: "cancelButton_" + id, title: "Cancel Edits" }).appendTo($bottomButtonDiv);
            $saveButton.click (function (evt) {
                if (isNew) {
                    layer.applyEdits([feature],null, null, function (evt) {
                        if (graphics)
                            graphics.refresh();
                        successChange(evt);
                    }, function (err) {
                        alert(err.message)
                    });
                    $dialogDiv.dialog("close");
                }
                else {
                    layer.applyEdits(null, [feature], null, function (evt) {
                        if (graphics)
                            graphics.refresh();
                        successChange();
                    }, function (err) {
                        alert(err.message)
                    });
                    $dialogDiv.dialog("close");
                }
            });

            $cancelButton.click(function () { $dialogDiv.dialog("close"); });

            //JQUERY UI MADNESS
            $editButton.order = order;
           
            $editButton.kendoButton({ spriteCssClass: "fa fa-pencil" });
      //      $editMUTCDButton.kendoButton({ spriteCssClass: "fa fa-pencil" });
            $saveButton.kendoButton({ spriteCssClass: "fa fa-floppy-o" });
            $cancelButton.kendoButton({ spriteCssClass: "fa fa-times" });

           $arrDirDiv.dialog({ autoOpen: false, modal:true, width:300, title:"Edit Arrow Direction" });
           $imgArrow.click(function () { $arrDirDiv.dialog("open"); });
            $mutSelDiv.dialog({ autoOpen: false, modal: true, width: 500, title:"Select MUTCD code" });
    //        $editMUTCDButton.click(function () { $mutSelDiv.dialog("open"); });

            $dialogDiv.dialog({ autoOpen: false, modal: true, title: "Edit Sign Attributes", width: 525 });
            $editButton.click(function () {
                $dialogDiv.dialog("open");
            });
            
            

            
        

            //this isn't strictly necessary but it does flag incomplete Sign Divs for editing
            if (feature.attributes.MUTCD == null)
                $dialogDiv.dialog("open");
     

        }

    });


});
