//

define(function () {

    var jsonData;
    var getLocation2Callback;


    var processAddressResult = function (result) {
        //the meat and potatoes are buried a few layers deep in the returning JSON

        if (result.returnDataset === null) {

            getLocation2Callback(null);
        }
        else {
            var srcType = result.sourceOperation;
            getLocation2Callback(result.returnDataset.Table1, srcType);
        }
    };


    return {

        getLocation2: function (inParameters,srcType,  callback) {

            getLocation2Callback = callback;
            var url = esriConfig.defaults.io.proxyUrl + '?' + config.layers.marWsUrl;

           
            if (srcType.toLocaleLowerCase() === "address") {
                url += '/findLocation2?f=json&str=' + inParameters;
            }
            else if (srcType.toLocaleLowerCase() === "roadway") {
                url += '/getStreetSegIDFromRoadwaySegID2?f=json&roadwaysegid=' + inParameters;
            }
            else  //streetsegment
            {
                url += '/getRoadwaySegIDFromStreetSegID2?f=json&streetsegid=' + inParameters;
            }


            return $.ajax({
                url: url,
                type: "POST",
                contentType: 'application/x-www-form-urlencoded',
                error: function (xhr, status, error) {

                    alert(error);
                }
            }).done(function (rst) {



                processAddressResult(rst);
            }
            );

        },

    }
});
