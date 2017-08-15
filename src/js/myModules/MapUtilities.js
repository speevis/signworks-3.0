define(["esri/geometry/webMercatorUtils","esri/SpatialReference", "esri/tasks/GeometryService", "esri/tasks/ProjectParameters"], function (webMercatorUtils,SpatialReference, GeometryService, ProjectParameters) {

    //this is a singleton object

    return {

        pointToExtent: function (map, point, toleranceInPixel) {
            //calculate map coords represented per pixel
            var pixelWidth = map.extent.getWidth() / map.width;
            //calculate map coords for tolerance in pixel
            var toleraceInMapCoords = toleranceInPixel * pixelWidth;
            //calculate & return computed extent
            return new esri.geometry.Extent(point.x - toleraceInMapCoords,
                         point.y - toleraceInMapCoords,
                         point.x + toleraceInMapCoords,
                         point.y + toleraceInMapCoords,
                         map.spatialReference);
        },

        webMercatorToGeographic: function (geometry) {

            return webMercatorUtils.webMercatorToGeographic(geometry);
        },

        geographicToWebMercator: function (geometry) {

            return webMercatorUtils.geographicToWebMercator(geometry);
        },
        
        calculateBearingPoints:function (point1, point2){
            if (point1.spatialReference.wkid == 102100 || point1.spatialReference.wkid == 3857){
                point1 = this.webMercatorToGeographic(point1);
            }
            if (point2.spatialReference.wkid == 102100 || point2.spatialReference.wkid == 3857) {
                point2 = webMercatorUtils.webMercatorToGeographic(point2);
            }
          return  this.calculateBearing(point1.y, point1.x, point2.y, point2.x);

        },

        calculateBearing: function (lat1, lon1, lat2, lon2) {

            var xscale = Math.cos(lat1 * Math.PI / 180);

            lon1 = lon1 * xscale;
            lon2 = lon2 * xscale;

            var dlon = lon2 - lon1;
            var dlat = lat2 - lat1;

            if (Math.abs(dlon) < 0.000000001) {

                if (dlat < 0)
                    return 180;
                else
                    return 0;
            }

            return Math.atan2(dlon, dlat) * 180 / Math.PI;
        },

        projectPoint: function (point, SR, callback){

            var params = new ProjectParameters();
            var gsvc = new GeometryService("https://arcgis.ddot.dc.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer");
            var errFunc = function (err) {

                alert(err);
            }
               params.geometries = [point];
           
            params.outSR = new SpatialReference(SR);
            gsvc.project(params, callback, errFunc);
    }

    }
});
