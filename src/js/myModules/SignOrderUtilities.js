define(function () {
    // was under the impression this was unused , but nope, alive and well 7/26/2017
    //this is a singleton object
    return {

    //    someVar:null,
    //    someFunction:function(args){

    //      DON'T FORGET TO ASSIGN AN INDEX TO NEW SIGNS!!!!
    //    AND DO SOMETHING TO RETIRED SIGNS  (MAKE THEM ZERO?)
        
        SortSigns: function (layer,features, key ) {
           
            // also assign them an order if key attribute is null
            var indexChange = false;

            for (var i = 1; i < features.length + 1; i++) {

                var myKey = features[i - 1].attributes[key];

                if (myKey == null) {
                    features[i - 1].attributes[key] = i ;
                    indexChange = true;
                }

            }
            if (indexChange)
                layer.applyEdits(null, features, null, function () { }, function () { } );
            //gonna take an array of features and make sure they are in order based on the key attribute

            features.sort(function (a, b) {
                return a.attributes[key] - b.attributes[key];
            });

            return features;
            
        },

        RetireFeature:function (layer,features,key, index){
           
            // also assign the
            features[index].attributes[key] = -1;

            for (var i = index + 1; i < features.length; i++) {
                features[i].attributes[key] -= 1;
            }
            features = this.SortSigns(layer, features, key);
            return features;
        },

        UnretireFeature: function (layer, features, key, index) {
            
            // also assign the
            features = this.SortSigns(layer, features, key);
            //reduce this to one line when it's finished
            var topFeature = features[features.length - 1].attributes[key];

            if (topFeature < 1)
                topFeature = 0;
            features[index].attributes[key] = topFeature + 1;
            features = this.SortSigns(layer, features, key);
            return features;

        },
        ChangeOrder: function (layer, features,key, index, direction) {
         
            // also assign the
            // feature array will be passed in 

            // item to be moved will swap index with neighboring record depending on direction (1 or -1)

            var bob = features[index].attributes[key];


        }

    }
});
