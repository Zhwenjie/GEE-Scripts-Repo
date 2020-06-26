/*
section1,
As we known, there are several methods to pair the TOA image and SR image which having the same systematic 
start time. However, here we intend to practice interation as well as other algotithm,
so we adopt a relatively complicated method.
Practices:
1.ee.Algorithms.IsEqual
2.ee.Algorithms.If
combine the above to function can remove null in list.
3.for loop come true by ee.list.sequence()

section2,
The alternative way! progress with join
*/

///function section
var maskClouds = function(image) {
  var scored = ee.Algorithms.Landsat.simpleCloudScore(image);
  return image.updateMask(scored.select(['cloud']).lt(20))
        .addBands(scored.select('cloud'));
  //return image.addBands(scored.select(['cloud']).lt(20));
};

/////////////////////////////////////////////////////////////////

var geometry = 
    ee.Geometry.Polygon(
        [[110, 20.5],
          [110, 15],
          [120, 15],
          [120, 20.5]], null, true);
// too many pixels error return,
var region = ee.Geometry.Polygon(
        [[100, 30],
          [100, 0],
          [120, 0],
          [120, 30]], null, true);          
//var point = ee.Geometry.Point(115, 22.2643);
var collectionTOA = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
  .filterDate('2020-02-01', '2020-05-31').filterBounds(geometry)

var collectionTOA_R = collectionTOA.map(
  function(image){
    return image.addBands(image.metadata('system:time_start'))
  });
  

var collection_SR = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
  .filterDate('2020-01-01', '2020-05-31').filterBounds(geometry)



var collectionSR_R = collection_SR.map(
  function(image){
    return image.addBands(image.metadata('system:time_start'))
  });


var collectionSR_R_list = collectionSR_R.toList(1000);
var collectionTOA_R_list = collectionTOA_R.toList(1000);
print('size of collestion SR and TOA:')
print(collectionSR_R.size());
print(collectionTOA_R.size());
var ifeq = ee.Image(collectionSR_R_list.get(0)).select('system:time_start')
                        .eq(ee.Image(collectionTOA_R_list.get(0)).select('system:time_start'));

var TOAImage1 = ee.Image(collectionTOA_R_list.get(0))
var SRImage1 = ee.Image(collectionSR_R_list.get(0))
Map.centerObject(geometry);
Map.addLayer(TOAImage1,{},'TOAImage1');
Map.addLayer(SRImage1,{},'SRImage1');
Map.addLayer(ifeq,{},'ifeq');
var imagemax = ifeq.reduceRegion({
  reducer: ee.Reducer.max(),
  geometry: region,
  scale: 30000
});
print(ee.Number(imagemax.values().get(0)))
print('trueorfalse')
print(ee.Number(imagemax.values().get(0)).eq(0)); 
         

var collectionTOA_R_list = collectionTOA_R.toList(1000)

var SREqualTOA = ee.List.sequence(0,ee.Number(collectionSR_R.size()).subtract(1)).map(
    function (xi) {
        var collectionSR_R_list = collectionSR_R.toList(1000);
        
        return ee.List.sequence(0,ee.Number(collectionTOA_R.size()).subtract(1)).map(
          function(xj){
            var collectionTOA_R_list = collectionTOA_R.toList(1000);
            var ifeq = ee.Image(collectionSR_R_list.get(xi)).select('system:time_start')
                        .eq(ee.Image(collectionTOA_R_list.get(xj)).select('system:time_start'));
        
            var imagemax = ifeq.reduceRegion({
              reducer: ee.Reducer.max(),
              geometry: region,
              scale: 30000
            });
            
            //return ee.Image(collectionSR_R_list.get(xi));
            return  ee.Algorithms.If(ee.Number(imagemax.values().get(0)).eq(1),ee.Image(collectionSR_R_list.get(xi)),null);
            // if (imagemax.values().get(0).getInfo()===0) {
            //   return ee.Image(collectionSR_R_list.get(xi))
            // }
            
          //return null
        })
    });
print(ee.List(SREqualTOA.get(10)).sort().get(-1));
print('size of SREqualTOA')
print(SREqualTOA.size())
//var hasNulls = ee.Algorithms.IsEqual(typeof(ee.List(SREqualTOA.get(10)).sort().get(-1)), 'object')
//print(hasNulls)

/*
inspiration is from:
https://groups.google.com/g/google-earth-engine-developers/c/Tq5vP6xirrg/m/jbs-THCMDwAJ
https://code.earthengine.google.com/fd6ee27b0c5e2fe35001365c7340c57c
*/
var ImageCollectionFilted = ee.ImageCollection(ee.List.sequence(0,64).map(function listremoveIfNull(xi) {
  var listImage = SREqualTOA.get(xi)
  var hasNulls = ee.Algorithms.IsEqual(typeof(ee.List(listImage).sort().get(-1)), 'object');
  return ee.Algorithms.If(hasNulls, ee.Image(ee.List(listImage).sort().get(-1)))
}));
print(ImageCollectionFilted);


/*
section2,
The alternative way! progress with join.
Please see the document.
*/

var geometry = 
    ee.Geometry.Polygon(
        [[110, 20.5],
          [110, 15],
          [120, 15],
          [120, 20.5]], null, true);
          
var collectionTOA = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
  .filterDate('2020-02-01', '2020-05-31').filterBounds(geometry)

print(collectionTOA.first());
print(collectionTOA.size());
var collection_SR = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
  .filterDate('2020-01-01', '2020-05-31').filterBounds(geometry)

print(collection_SR.first());
print(collection_SR.size());

//// Use an equals filter to define how the collections match.
var filter = ee.Filter.equals({
  leftField: 'system:index',
  rightField: 'system:index'
});
// Create the join.
var simpleJoin = ee.Join.simple();

// Apply the join.
var simpleJoined = simpleJoin.apply(collection_SR, collectionTOA, filter);

// Display the result.
print('Simple join: ', simpleJoined);
