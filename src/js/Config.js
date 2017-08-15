var productionConfig = {
    hideButton:true,
    layers: {
      
        timeband: "https://arcgis.ddot.dc.gov/arcgis/rest/services/Signs/Signs_prod/FeatureServer/2",
    meters: "https://arcgis.ddot.dc.gov/arcgis/rest/services/Test/DCSignsAndMeters/FeatureServer/9",
    signs: "https://arcgis.ddot.dc.gov/arcgis/rest/services/Signs/Signs_prod/FeatureServer/1",
    streetSegment: "https://rh.dcgis.dc.gov/dcgis/rest/services/DDOT/DDOTLRS/FeatureServer/4",
    support: "https://arcgis.ddot.dc.gov/arcgis/rest/services/Signs/Signs_prod/FeatureServer/0",
    marWsUrl: "https://citizenatlas.dc.gov/newwebservices/locationverifier.asmx",
    proxy: "/signworks/Proxy/proxy.ashx"
    }
    
};

var devConfig = {

    hideButton: false,
    layers: {
        timeband: "https://arcgis.ddot.dc.gov/arcgis/rest/services/Signs/Signs_Dev/FeatureServer/2",
        meters: "https://arcgis.ddot.dc.gov/arcgis/rest/services/Test/DCSignsAndMeters/FeatureServer/9",
        signs: "https://arcgis.ddot.dc.gov/arcgis/rest/services/Signs/Signs_Dev/FeatureServer/1",
        streetSegment: "https://rh.dcgis.dc.gov/dcgis/rest/services/DDOT/DDOTLRS/FeatureServer/4",
        support: "https://arcgis.ddot.dc.gov/arcgis/rest/services/Signs/Signs_Dev/FeatureServer/0",
        marWsUrl: "https://citizenatlas.dc.gov/newwebservices/locationverifier.asmx",
        proxy: "/signworksdev/Proxy/proxy.ashx"
    }

};


var localConfig = {

    hideButton:false,
    layers: {
        timeband: "https://arcgis.ddot.dc.gov/arcgis/rest/services/Test/Signs/FeatureServer/2",
        meters: "https://arcgis.ddot.dc.gov/arcgis/rest/services/Test/DCSignsAndMeters/FeatureServer/9",
        signs: "https://arcgis.ddot.dc.gov/arcgis/rest/services/Test/Signs/FeatureServer/1",
        streetSegment: "https://rh.dcgis.dc.gov/dcgis/rest/services/DDOT/DDOTLRS/FeatureServer/4",
        support: "https://arcgis.ddot.dc.gov/arcgis/rest/services/Test/Signs/FeatureServer/0",
        marWsUrl: "https://citizenatlas.dc.gov/newwebservices/locationverifier.asmx",
        proxy: "../../Proxy/proxy.ashx"
    }

};
