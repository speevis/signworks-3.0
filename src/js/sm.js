var init = function () {
    StreetSmartApi.init({
        targetElement: document.getElementById('streetSmartContainer'),
        username: ptpConfig.smusername,
        password: ptpConfig.smpassword,
        apiKey: ptpConfig.smapiKey,
        srs: ptpConfig.smsrs,
        locale: ptpConfig.smlocale,
        addressSettings: ptpConfig.smaddressSettings
    })
     .then(
         function () {
             openPanoramaViewer();
         },
         function (err) {
             console.log('Api: init: failed. Error: ', err);
         }
     );
});

var openPanoramaViewer = function () {
    var viewerType = [];
    viewerType.push(StreetSmartApi.ViewerType.PANORAMA);
    StreetSmartApi.open("1301943.5178303814,451635.512788599", {
        viewerType: viewerType,
        srs: ptpConfig.smsrs
    }).then( function (result) {
        if (result) {
            for (let i = 0; i < result.length; i++) {
                if (result[i].getType() === StreetSmartApi.ViewerType.PANORAMA)
                    panoramaViewer = result[i];
            }
        }
    }).catch(
        function (reason) {
            console.log('Error opening panorama viewer: ' + reason);
        }
    )
}
