
/* 
conservative for loop and map in GEE.
extract time band from TOA composited data and 

*/

var maskClouds = function(image) {
  var scored = ee.Algorithms.Landsat.simpleCloudScore(image);
  return image.updateMask(scored.select(['cloud']).lt(20));
  //return image.addBands(scored.select(['cloud']).lt(20));
};
// This function masks clouds and adds quality bands to Landsat 8 images.
var addQualityBands = function(image) {
  return maskClouds(image)
    // NDVI
    .addBands(image.normalizedDifference(['B5', 'B4']))
    // time in days
    .addBands(image.metadata('system:time_start'));
};
// Load a 2014 Landsat 8 ImageCollection.
// Map the cloud masking and quality band function over the collection.

var point = ee.Geometry.Point(114.20, 22.2643);

var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
  .filterDate('2019-01-01', '2020-05-31').filterBounds(point)
  .map(addQualityBands);
  
var recentValueComposite = collection.qualityMosaic('system:time_start');
print(recentValueComposite)

print('recentValueComposite');
print(recentValueComposite);
var recentValueCompositeArray1D = recentValueComposite.toArray()
//Map.addLayer(recentValueCompositeArray1D,{},'recentValueCompositeArray1D');

var recentValueCompositeArray2D = recentValueComposite.toArray().toArray(1)
//Map.addLayer(recentValueCompositeArray2D,{},'recentValueCompositeArray2D');


var timeBand = recentValueCompositeArray2D.arraySlice(0, -1)
//Map.addLayer(timeBand ,{},'timeBand');
var timeBand_ = timeBand.arrayGet([0,0]);
//Map.addLayer(timeBand_ ,{},'timeBand_');

var collection_RS = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
  .filterDate('2020-01-01', '2020-05-31').filterBounds(point)
print('collection_RS');
print(collection_RS.toList(100).size());
print(collection_RS.first());

var collectionRS_R = collection_RS.map(
  function(image){
    return image.addBands(image.metadata('system:time_start'))
  });
  

var collectionRS_RArray = collectionRS_R.toArray();
var axis0coll = collectionRS_RArray.arrayLength(0); // N (Image axis)
var axis1coll = collectionRS_RArray.arrayLength(1); 
//Map.addLayer(axis0coll,{},'axis0coll');
//Map.addLayer(axis1coll,{},'axis1coll');
//Map.addLayer(collectionRS_RArray,{},'collectionRS_RArray');
var bands = collectionRS_RArray.arraySlice(1, 0, -1);
var time_ = collectionRS_RArray.arraySlice(1, -1)

/////////////////////////////////////////////
////////////////////////////////////////////
var timeBand_a = timeBand_.eq(0);
for (var i=0;i<8;i++)
{
  timeBand_a = timeBand_a.addBands(timeBand_.subtract(time_.arrayGet([i,0])));
}

Map.addLayer(timeBand_a ,{},'timeBand_a');


var PositionIndex = ee.List.sequence(0,7).map(
    function (xi) {
        var timeBand_b = timeBand_.eq(0);
        timeBand_b = timeBand_b.addBands(timeBand_.subtract(time_.arrayGet([ee.Number(xi).toInt(),0])));
        return timeBand_b
    });
       
print('PositionIndex');
print(PositionIndex);    
Map.addLayer(ee.Image(PositionIndex.get(0)) ,{},'PositionIndex');

var vizParams = {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.5, gamma: 1.3};
Map.setCenter(114.20, 22.2643, 12);
Map.addLayer(recentValueComposite, vizParams, 'recent value composite');    
