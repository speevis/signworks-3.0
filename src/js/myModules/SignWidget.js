define(["esri/layers/FeatureLayer",
    "esri/tasks/RelationshipQuery",
    "dojo/_base/declare",
    "dojo/dom",
    "dojo/dom-construct",
    "myModules/FeatureUtilities",
    "myModules/TimebandWidget",
 "myModules/SignEditor",
 "myModules/MutcdSelectorWidget"
],
    function (FeatureLayer,
        RelationshipQuery,
        declare,
        dom,
        domConstruct,
        FeatureUtilities,
        TimebandWidget,
       SignEditor,
        MutcdSelectorWidget
      ) {


        return declare(null, {

         
           
            constructor: function (args) {
            
                var signUpdateFeature = args.feature;

                var target = args.target;
                var signLayer = args.layer;
                var order = args.order;
                var codedValues;
                var mainNode, bandDiv;
                var timebandArray;             

                var getTimebandFeatures = function (feature) {

                    var rQuery = new RelationshipQuery();
                    var SignObId = feature.attributes.OBJECTID;
                    rQuery.objectIds = [SignObId];
                    rQuery.relationshipId = 1;
                    rQuery.definitionExpression = "RESTRICTIONSTATUS = 1";
                    rQuery.outFields = ["OBJECTID", "HOURLIMIT", "LINKID", "SIGNID", "ORIGIN_ID", "RESTRICTIONORDER", "STARTDAY", "ENDDAY", "STARTTIME", "ENDTIME", "EXCEPTION", "RESTRICTIONSTATUS"];
                    signLayer.queryRelatedFeatures(rQuery, function (relatedRecords) {
                       
                
                           timebandArray = new TimebandWidget({ "features": relatedRecords[SignObId], "target": bandDiv, "layer": args.timebandLayer, "editMode": false, "sign_id": SignObId });
  

                    }
                        , function () { alert("error retrieving timebands"); });
                };

                var imgError = function (image) {
                    image.onerror = "";
                    image.src = "img/MUTCD/PR-OTHER.png";
                    return true;
                }

                var getSignSymbol = function (img, mutt) {
                  
                    img.src = "img/MUTCD/" + mutt + ".png";
            
                };

                var EnableEdit = function () {

     
                    var bttn = $("#saveButton_" + this.order).data("kendoButton");
                    bttn.enable(true);
                    bttn = $("#cancelButton_" + this.order).data("kendoButton");
                    bttn.enable(true);


                
                    var stat = dom.byId("lblStatus_" + order);
                    var selStat = domConstruct.create("select", {});
                    stat = domConstruct.place(selStat, stat, "replace");
                    stat.onchange = function (evt) {

                    };
                }

                var successChange = function () {

                    for (var i = 0; i < timebandArray.length; i++) {
                        timebandArray[i].update();
                    }
                };

           

                var statusColor = function (code, panel) {

                    var newColor;
                    switch (code) {

                        case 1: //active
                            newColor = "#79DD79";
                            break;
                        case 2: //prospective
                            newColor = "#FFFF00";
                            break;
                        case 3: // temp out of Service
                            newColor = "#FFA731";
                            break;
                        case 4: //temporary
                            newColor = "#FFA731";
                            break;
                        case 5:  //retired - should be hidden
                            newColor= "#b5aa96";
                            break;
                        case 6:  //requested
                            newColor = "#FFFF00";
                            break;


                    }
                    $("#" + panel).css("background-color", newColor);
                    $("#img_" + panel).css("background-color", newColor);
                  
                }

                var createWidget = function (feature) {
                    

                    if (feature) {

                        signUpdateFeature = feature;
                    }
                    //replace nodes if edited or added
                    var testNode = dom.byId("signDIV_" + order);
                    if(testNode === null){
                        mainNode = domConstruct.create("div", { id: "signDIV_" + order, class: "signDIV" }, target);
                    }
                    else {
                        mainNode = domConstruct.create("div", { id: "signDIV_" + order, class: "signDIV" }, target);
                        mainNode = domConstruct.place(mainNode, testNode, "replace");
                    }
                    //why do I care about resetting testnode?  Isn't it finished here?
                    testNode = dom.byId("signDIV_" + order);

                    var topDiv = domConstruct.create("div", { class: "topDiv" }, mainNode);
                    var imgDIV = domConstruct.create("div", { id: "img_signDIV_" + order, class: "imgDiv" }, topDiv);
                    var imgSign = domConstruct.create("img", { id: "img_" + signUpdateFeature.attributes.OBJECTID, 'width': '100%', 'max-height': '100%' }, imgDIV);
                   
                    $("#img_" + signUpdateFeature.attributes.OBJECTID).error(function () { $(this).unbind("error").attr("src", "img/MUTCD/PR-OTHER.png") });
                    getSignSymbol(imgSign, signUpdateFeature.attributes.MUTCD);


                    var MutcdDiv = domConstruct.create("div", { class: "MutcdDiv" }, topDiv);
                    if (signUpdateFeature.attributes.MUTCD != null)
                        var muttcode = muttValues.name(signUpdateFeature.attributes.MUTCD.toLowerCase()).split(":");
                    else
                        var muttcode = ["", ""];
                    

                    var mutt = domConstruct.create("label", { id: "lblMutcd", class: "MuttLabel", innerHTML: muttcode[0], size: 35 }, MutcdDiv);
                    var mutt2 = domConstruct.create("label", { id: "lblMutcd2", class: "MuttLabel2", innerHTML: muttcode[1], size: 35 }, MutcdDiv);
                    var mutt3 = domConstruct.create("label", { id: "lblMutcdText", class: "MuttLabel3", innerHTML: signUpdateFeature.attributes.SIGNTEXT, size: 70 }, MutcdDiv);
                    if (mutt3.innerHTML = "null") {
                        mutt3.innerHTML = "";
                    }
                    domConstruct.place("<br>", mutt, "after");
                    domConstruct.place("<br>", mutt2, "after");

                    statusColor(signUpdateFeature.attributes.SIGNSTATUS, mainNode.id);

                    var signURL;
                    if (signUpdateFeature.attributes.SIGNARROWDIRECTION != 0) {
                        signURL = "./img/" + signUpdateFeature.attributes.SIGNARROWDIRECTION + ".png";
                    }
                    var imgArrow = domConstruct.create("img", { src: signURL, height: '40px', width: '60px', class:"arrowDir" }, topDiv);
                    $(imgArrow).error(function () { $(this).unbind("error").attr("src", "") });


                    bandDiv = domConstruct.create("div", {id:"read_only", class: "bandDiv" , innerHTML:"Time Restrictions for this Sign:"}, mainNode);

                    getTimebandFeatures(signUpdateFeature);

                    var lstEdtdDiv = domConstruct.create("div", { class: "lastEdited" }, mainNode);

                    lstEdtdDiv.innerHTML = "Last Edited By: ";
                    lstEdtdDiv.innerHTML += signUpdateFeature.attributes.LAST_EDITED_USER + " (" + new Date(signUpdateFeature.attributes.LAST_EDITED_DATE).toISOString().replace(/T/, ' ').replace(/\..+/, '') + ") <BR> ";
                    lstEdtdDiv.innerHTML += "Created By: " + signUpdateFeature.attributes.CREATED_USER + " (" + new Date(signUpdateFeature.attributes.CREATED_DATE).toISOString().replace(/T/,' ').replace(/\..+/, '') + ") ";
                    
                    var $signGUID = $("<div>", { id: "signGUID_" + order, class: "lastEdited" }).appendTo(mainNode);
                    $signGUID.html("ID:" + signUpdateFeature.attributes.GLOBALID);
                    $("<br>").insertAfter($signGUID);


                    var eButtons = new SignEditor({ target: mainNode, selFeature: signUpdateFeature,features:args.features, selLayer: signLayer, graphicsLayer: null, index: order, success: createWidget, cancel: createWidget, id: "_sign", timebandLayer: args.timebandLayer, isNew:false});


                };
                          
                createWidget();
               
         

            }

        });


    });
