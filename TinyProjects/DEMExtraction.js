////assets link:https://code.earthengine.google.com/?asset=users/wenjie/TibetShp/ChinaGauges
/* 
help zhangtao;
extract the elevation from 30m srtm at meterological stations.
Tips:
1. when we export the raster data with range more than 10 degree, GEE would 
automatically store them in multiple pieces. What's more, they would fill 
masked areas with zero instead of null.
2. we can use at least two approaches to extract the elevation information
of points by interation add properties and reduceRegion function.
3.we might fail to get desired export result after union feature collection.
*/
var Gauges = table;
print(Gauges)

var dataset = ee.Image('USGS/SRTMGL1_003');
var elevation = dataset.select('elevation');
var slope = ee.Terrain.slope(elevation);
//Map.setCenter(92.41, 34.3, 10);

//////the first method
var addProp = function(point)
{
  //var g = feat.geometry().coordinates();
  var k = elevation.reduceRegion(ee.Reducer.first(),point.geometry(),30);
  return point.set({'elev':k.get('elevation')});
}
//////the second method
// var stations_mean = elevation.reduceRegions({
//   collection:bufferedFluxsite,
//   reducer:ee.Reducer.mean(),
//   scale:30
// })
var newGauges = Gauges.map(addProp);
print(newGauges);

// Export.table.toDrive({
//   collection: newGauges,
//   description: 'ChineseGaugeswithelevation',
//   fileFormat: 'CSV',
//   folder:'GEE'

// });

var buffer = function(feature) {
  return feature.buffer(3200);
};

var bufferedFluxsite = Gauges.map(buffer);  
print(bufferedFluxsite)

// var bufferedFluxsiteU = bufferedFluxsite.union()
// print(bufferedFluxsiteU)

var DEMClip = elevation.clip(bufferedFluxsite)

Export.image.toDrive({
  image: DEMClip,
  description: 'Drive',
  fileNamePrefix:'DEMinGaugesBufferedArea',
  folder:'DEM',
  scale:30,
  region:bufferedFluxsite,
  crs:'EPSG:4326',
  maxPixels:1e13
  });
  
//Map.addLayer(elevation, {min: 0, max: 5000}, 'elevation');
Map.addLayer(Gauges,{},'gauges');
//Map.addLayer(bufferedFluxsiteU,{},'buffered');
Map.addLayer(DEMClip,{},'bufferedDEM');
