/* 
explore the resample method applied in scale in GEE, referring to the continuos values.
The following script is from GEE document. Please see the schematic diagram in PPT.
*/
var image = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318').select('B4');

var printAtScale = function(scale) {
  print('Pixel value at '+scale+' meters scale',
    image.reduceRegion({
      reducer: ee.Reducer.first(),
      geometry: image.geometry().centroid(),
      // The scale determines the pyramid level from which to pull the input
      scale: scale
  }).get('B4'));
};

printAtScale(10); // 8883
printAtScale(30); // 8883
printAtScale(50); // 8337
printAtScale(60); //9080
printAtScale(70); // 9215
printAtScale(90); // 9080
printAtScale(120); // 8775
printAtScale(200); // 8775
printAtScale(500); // 8300

Map.addLayer(image,{},'image')
Map.addLayer(ee.Feature(image.geometry().centroid()),{color: 'red'},'centroid')
