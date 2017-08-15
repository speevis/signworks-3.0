//Jon Jones
//October 6, 2015
//MAR widget is a simple widget that queries the MAR web service and returns an address, and marks it on the map

define(["esri/geometry/Point",
    "esri/geometry/Polygon",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/graphic",
    "esri/Color",
    "esri/SpatialReference",
    "dojo/_base/declare",
    "myModules/MAR",
"myModules/MapUtilities",
 "esri/dijit/BasemapToggle", ],
    function (Point,
        Polygon,
        SimpleMarkerSymbol,
        SimpleLineSymbol,
        SimpleFillSymbol,
        Graphic,
        Color,
        SpatialReference,
        declare,
        MAR,
        MapUtilities, BasemapToggle) {


        return declare(null, {

            //     searchButton: null,
            //this table holds the return values from the geolocator service
            MAR_Table: null,

            map: null,

            //takes and args object that has a target attribute for the div that will receive the widget, and a map attribute that is a reference to the ESRI map object
            constructor: function (args) {

                var controls = '<input type="button" id="btnSearch" value="Search" class="navButton" /></div>';
                var $mainNode = $("<div>", { html: controls });
                var basemapToggle = new BasemapToggle({
                 
                    map: map,
                    visible: true,
                    basemap: "satellite"
                }, "toggle");
                basemapToggle.startup();
                
   
                //MAR dialog
                var $MAR_dialog = $("<div>").appendTo($mainNode);
                var help_info = "This lookup can take a variety of inputs. \x0A Enter an address like '5 Main' " + 
                    "\x0A Intersections like '7th and H' \x0A Street blocks like '500 block 7th' \x0A Place names like 'White House'  ";
                var $MAR_info = $("<div>", { id: "marhelp",title:help_info, class: 'mar_info' }).appendTo($MAR_dialog);
                $MAR_info.html('<i class="fa fa-question-circle" aria-hidden="true"></i>');
                var $srcInstructions = $('<label >Type an address and press Enter</label> <br>').appendTo($MAR_dialog);

                //srcType: address / roadway / streetsegment
                //inParameter: address(str) / roadwaysegid / streetsegmentid
                var $searchEntry = $("<input >", { id: "txtSearch" }).appendTo($MAR_dialog);
                $("<br>").insertAfter($searchEntry);

                $searchEntry.keypress(function (e) {
                    if (e.which == 13) {
                        AddressSearch();
                    }
                });
                var $candidates = $('<br><select multiple id="ddbCandidates"><option>Candidates appear here...</option></select>').appendTo($MAR_dialog);

                $MAR_dialog.dialog({ autoOpen: false, modal: true, width: 450, height: 250, title: "Edit Arrow Direction" });

                $MAR_dialog.dialog({
                    close: function (event, ui) {

                        map.graphics.clear();
                        $MAR_dialog.empty();
                        $MAR_dialog.dialog("close");
                  
                    }
                });
                //activate dialog
                var $btnSearch = $("#btnMAR");
                $btnSearch.on("click", function () {
                    $MAR_dialog.dialog("open");
                });

                map = args.map;
                var polyProjectCallback = function (result) {
                    var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                              new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                 new Color([255, 0, 0]), 6), new Color([255, 255, 0, 0.25])
                          );

                    graphic = new Graphic(result[0], sfs);
                    map.graphics.clear();
                    map.graphics.add(graphic);
                    var point = result[0].getCentroid();
                    map.centerAndZoom(point, 18);
                }

                var AddressSearch = function () {
                    var graphic;
                    var searchText = $("#txtSearch")[0].value;
                    if (!searchText)
                        return;
                    //this is the change event handler for the results dropdown
                    var SelectCandidateChange = function () {
                        //get candidate info
                        $("body").css("cursor", "default");
                        var marSelect = MAR_Table[$("#ddbCandidates")[0].selectedIndex];
                        var lat = marSelect.LATITUDE;
                        var lon = marSelect.LONGITUDE;
                        // create point



                        if (marSelect.BLOCKNAME) {
                            var maxX = marSelect.EXTENTMAXX;
                            var maxY = marSelect.EXTENTMAXY;
                            var minX = marSelect.EXTENTMINX;
                            var minY = marSelect.EXTENTMINY;
                            var spatRef = new SpatialReference({ wkid: 26985 });
                            var blockGeom = new Polygon(spatRef);                           
                            blockGeom.addRing([[minX, maxY], [maxX, maxY], [maxX, minY], [minX, minY]]);
                            MapUtilities.projectPoint(blockGeom, new SpatialReference(4326), polyProjectCallback);
                           
                        }
                        else {
                            var point = new Point(lon, lat, new SpatialReference({ wkid: 4326 }));
                            var simpleMarkerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10,
                               new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                               new Color([255, 0, 0]), 1),
                               new Color([0, 255, 0, 0.25]));
                            graphic = new Graphic(point, simpleMarkerSymbol);
                            // add point
                            map.graphics.clear();
                            map.graphics.add(graphic);
                            map.centerAndZoom(point, 19);
                        }


                    };
                    //this is the callback function that is passed to the MAR module to return address lookup results
                    var call = function (table1, srcType) {

                        if (!table1) {
                            alert('no results found.');
                            return;
                        }
                        if (srcType == "DC Address") {
                        }
                        else if (srcType == "DC Intersection") {
                        }
                        else if (srcType == "DC Block Address") {
                        }
                        MAR_Table = table1;

                        var selectDDB = document.getElementById("ddbCandidates");
                        $('#ddbCandidates').empty();
                   
                        selectDDB.innerHTML = "";
            
                        //populate dropdown
                        for (var i = 0; i < table1.length; i++) {

                            var opt = document.createElement("option"); if (srcType == "DC Address") {
                                opt.appendChild(document.createTextNode(table1[i].FULLADDRESS + " (" + table1[i].WARD + ")" ));
                            }
                            else if (srcType == "DC Intersection") {
                                opt.appendChild(document.createTextNode(table1[i].FULLINTERSECTION + " (" + table1[i].WARD + ")"));

                            }
                            else if (srcType == "DC Block Address") {
                                opt.appendChild(document.createTextNode(table1[i].BLOCKNAME + " (" + table1[i].WARD + ")"));
                            }
                            else if (srcType == "DC Place") {
                                opt.appendChild(document.createTextNode(table1[i].ALIASNAME + " (" + table1[i].WARD + ")"));
                            }

                            selectDDB.appendChild(opt);
                        }
                        selectDDB.onchange = SelectCandidateChange;

                    };

                    var srcType = "address";
                    MAR.getLocation2(searchText, srcType, call);
                    $("body").css("cursor", "progress");
                }

                
            }



        });


    });
