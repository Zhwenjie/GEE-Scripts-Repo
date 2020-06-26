/* 
How to select the specific item from an imagecollection
*/
var point = ee.Geometry.Point(114.20, 22.2643);

var dataCollection = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
  .filterDate('2019-01-01', '2020-05-31').filterBounds(point)

//select the specific image from imagecollection
var listOfImages = dataCollection.toList(dataCollection.size());
// print(listOfImages);
var firstImage = ee.Image(listOfImages.get(0));
firstImage = firstImage.addBands(ee.Image(1));
Map.centerObject(firstImage)
Map.addLayer(firstImage)
var secondImage = ee.Image(listOfImages.get(1));
var lastImage = ee.Image(listOfImages.get(listOfImages.length().subtract(1)));
