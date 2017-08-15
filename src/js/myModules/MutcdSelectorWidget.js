define(["dojo/_base/declare",
"myModules/FeatureUtilities"],
    function (declare,
        FeatureUtilities) {


        return declare(null, {

            selectedValue:null,
            constructor: function (args) {
                
                selectedValue = null;
                var layer = args.layer;
                var div = args.target;
                $(div).empty();
                var values = [];
                var oId = args.oId;
                var callback = args.callback;
                // the complete array of MUTCD values
                values[0] = args.values;
             
                var $signImage = $('<img />', { id: 'signImg_' + oId, height: '120px', width: '100px' });

                $signImage.appendTo($(div));
                $signImage[0].src = "img/MUTCD/" + args.signID + ".png";
               
                var $selectionLabel = $('<div/>').appendTo(div);
                $('<div/>', { html: "Selected MUTCD:", class: 'selLeft' }).appendTo($selectionLabel);
                var selValDiv = $('<div/>').appendTo($selectionLabel);
                $("<br>").insertAfter($selectionLabel);
                var $input = $('<input/>').attr({ type: 'text', id: 'txtMutQuery', class: "typeahead", placeholder: "Type in MUTCD or keyword" }).appendTo(div);
                $input.typeahead({
                    source: values[0]._codedValue,    //source format: [{name: namevalue, code:codevalue},{}]
                    autoSelect: true,
                    showHintOnFocus: false,
                    minLength: 1,
                    items: 10
                });

                $input.change(function () {
                   selectedValue = $input.typeahead("getActive");
                 
                });

              
                var $saveButton = $('<button/>', { id: "mutSave_" + oId, class: "navButton", title: "Select" }).appendTo(div);
                var $cancelButton = $('<button/>', { id: "mutCancel_" + oId, class: "navButton", title: "Cancel" }).appendTo(div);
                $saveButton.kendoButton({ spriteCssClass: "fa fa-floppy-o" });
                $cancelButton.kendoButton({ spriteCssClass: "fa fa-times" });
                $cancelButton.click(function () { $(div).dialog("close"); });
                
                $saveButton.click(function () {
                    if (selectedValue) {
                        callback(selectedValue);
                       
                    }
                    else {
                        alert('no value selected');
                    }
                });
               
      
               
                $signImage.on("error", function () {

                    $signImage[0].src = "img/MUTCD/PR-OTHER.png";
                });
               
          
               
          

             

            }
           
        });


    });
