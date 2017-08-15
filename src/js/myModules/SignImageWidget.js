define(["dojo/_base/declare", "dojo/dom-construct", "dojo/dom"], function (declare, domConstruct, dom) {

    //we will leave this in here for now but the image button is going away 7/26/2017
    return declare(null, {

        Click: null,
        constructor: function (args) {

            var featID = args.objectID;
            var layer = args.layer;
            var target = args.target;

            //     target.innerHTML += '<button type="button" id="btnImage" title="Photo" ><i class="fa fa-picture-o"></i></button>';
            var btn = domConstruct.create("button", { id: "btnImage", title: "Photo", innerHTML: '<i class="fa fa-picture-o"></i>' }, target);

            var rotate = function (cnv,img) {

                var cContext = cnv.getContext('2d');
                var cw = img.width, ch = img.height, cx = 0, cy = 0;
                cw = img.height;
                ch = img.width;
                cy = img.height * (-1);
                cnv.setAttribute('width', cw);
                cnv.setAttribute('height', ch);
                cContext.rotate(90 * Math.PI / 180);
                cContext.drawImage(img, cx, cy, ch,cw);

            };

            this.Click = function (evt) {
                var stall = 750;
                layer.queryAttachmentInfos(featID, function (info) {
                    if (info.length === 0)
                    { alert('no image found'); return; };
                    var imgWindow = window.open('', "Bob", "width=700, height=900,resizable=yes,scrollbars=yes");
                    for (var i = 0; i < 1; i++) {
                       
                        var imgDIV = imgWindow.document.createElement("DIV");
                        imgDIV.id = "imgDiv" + i;
                        imgWindow.document.body.appendChild(imgDIV);
                        var cnvs = imgWindow.document.createElement("CANVAS");
                        cnvs.id = "cnvs" + i;
                        imgDIV.appendChild(cnvs);

                        var imgSign = imgWindow.document.createElement("IMG");
                        imgSign.id = "img" + i;
                        imgSign.src = info[i].url;
                        var factor = 5;
                        //there is some latency problem here where to image seems to need half a second to get its ducks in a row, if not, width and height get set to zero
                        // if it still occurs, I warn the user and increase the timeout
                        setTimeout(function () {
                            imgSign.width /= factor;
                            imgSign.height /= factor;
                            if (imgSign.height === 0 || imgSign.width === 0) {
                                stall += 250;
                                alert("Something went wrong.  Please try again.");
                                return;
                            }
                            imgWindow.resizeTo(imgSign.height, imgSign.width);
                            rotate(cnvs, imgSign);

                        }, stall);

                    }

                },
                function (err) { alert(err.message) });
            }

             
         //   var btnImage = dom.byId("btnImage");
            btn.onclick = this.Click;

        }

    });


});
