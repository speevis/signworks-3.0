
//parameters -
//selLayer is the layer that is providing the features to edit
//selFeature is the feature to edit
//cancel is an optional callback function that can be used for additional cleanup
//success is an optional callback function that can be used for additional actions

//check 12/16/2016




define(["dojo/_base/declare",
    "dojo/dom",
    "dojo/dom-construct",
    "myModules/FeatureUtilities",
   "esri/tasks/RelationshipQuery",
   "myModules/TimebandWidget",
"myModules/MutcdSelectorWidget"], function (declare,
     dom,
     domConstruct,
     FeatureUtilities,
     RelationshipQuery,
     TimebandWidget,
     MutcdSelectorWidget) {


    return declare(null, {




        
        constructor: function (args) {
            var layer = args.selLayer;
            var updateFeature = args.selFeature;
            var cancelCall = args.cancel;
            var successCall = args.success;
            var order = args.index;
            var id = updateFeature.attributes.OBJECTID;

            var graphics = args.graphicsLayer;
         
        
            var mainNode = args.target;
            var editButtonDiv = domConstruct.create("div", { class: "ButtonDiv" }, mainNode);
            var editButton = domConstruct.create("button", { id: "editButton_" + id }, mainNode);
            var dialogDiv = domConstruct.create("div", { id: "editDialog_" + id }, mainNode);
            var arrDirDiv = domConstruct.create("div", { id: "dirDiv_" + id }, dialogDiv);
            var mutSelDiv = domConstruct.create("div", { id: "mutSelDiv" + id }, dialogDiv);

           
            var dirSel = function (evt) {
                var myId = evt.target.id;
                feature.attributes.SIGNARROWDIRECTION = Number(myId.charAt(4));
                signURL = "./img/" + feature.attributes.SIGNARROWDIRECTION + ".png";
                imgArrow.src = signURL;
                $("#dirDiv_" + id).dialog("close");

            };

            var successChange = function () {
                var retired = false;
                if (updateFeature.attributes.SUPPORTSTATUS == "5")
                     retired =true;
                    call(retired);
                
            };

            var call = function (retired) {

                if (successCall)
                    successCall(order,retired);
            }

          
            

            //INTERNAL DIALOG FIELDS AND CONTROLS
            var codedValues = FeatureUtilities.getCodedValues(supportFeatureLayer, "SUPPORTTYPE");
            domConstruct.create("label", { for: "selSuptype", class: "supportLabel", innerHTML: "Support Type" }, dialogDiv);
            var stat = domConstruct.create("select", { id: "selSuptype" }, dialogDiv);
            stat.onchange = function (evt) {
                updateFeature.attributes.SUPPORTTYPE = this[this.selectedIndex].value;
            };
            FeatureUtilities.addOptionsToSelect(stat, codedValues, updateFeature.attributes.SUPPORTTYPE);

            codedValues = FeatureUtilities.getCodedValues(supportFeatureLayer, "SUPPORTSTATUS")
            domConstruct.create("label", { for: "selStatus", class: "supportLabel", innerHTML: "Status" }, dialogDiv);
            stat = domConstruct.create("select", { id: "selStatus" }, dialogDiv);
            stat.onchange = function (evt) {
                updateFeature.attributes.SUPPORTSTATUS = this[this.selectedIndex].value;
            };
            FeatureUtilities.addOptionsToSelect(stat, codedValues, updateFeature.attributes.SUPPORTSTATUS);


            //BOTTOM BUTTONS
            var bottomButtonDiv = domConstruct.create("div", {style:"float:right"}, dialogDiv);
            var saveButton = domConstruct.create("button", { id: "saveButton_" + id , title:"Save Record"}, bottomButtonDiv)
            var cancelButton = domConstruct.create("button", { id: "cancelButton_" + id, title:"Cancel Edits" }, bottomButtonDiv);


            //JQUERY UI MADNESS
            editButton.order = order;
           
            $("#editButton_" + id).kendoButton({ spriteCssClass: "fa fa-pencil" });
            $("#saveButton_" + id).kendoButton({ spriteCssClass: "fa fa-floppy-o" });
            $("#cancelButton_" + id).kendoButton({ spriteCssClass: "fa fa-times" });

            $("#dirDiv_" + id).dialog({ autoOpen: false, modal:true, width:300, title:"Edit Arrow Direction" });
            $("#dirArr_" + id).click(function () { $("#dirDiv_" + id).dialog("open"); });
            $("#mutSelDiv" + id).dialog({ autoOpen: false, modal: true, width: 400, title:"Select MUTCD code" });
            $("#mutSign_" + id).click(function () { $("#mutSelDiv" + id).dialog("open"); });

            $("#" + dialogDiv.id).dialog({ autoOpen: false, modal:true,title:"Edit Support Attributes", width:350 });
            $("#editButton_" + id).click(function () {
                $("#editDialog_" + id).dialog("open");
            });
            saveButton.onclick = function (evt) {
               
                layer.applyEdits(null, [updateFeature], null, function () {
                    if (graphics)
                        graphics.refresh();
                    successChange();

                }, function (err) { alert(err.message) });
                $("#editDialog_" + id).dialog("close");
            };
          


            cancelButton.onclick = function () {

                $("#editDialog_" + id).dialog("close");
            };
        

            
            DeleteFeature = function (evt) {
                var result = confirm("Do you want to retire the selected record?");
                if (result) {
                    layer.applyEdits(null, null, [feature], function () { graphics.refresh() }, function (err) {
                        if (err.code === 500)
                            alert(err.message + " Ensure that layer service has delete capability enabled.");
                        else
                            alert(err.message);
                    });
                }
            };
     

        }

    });


});
