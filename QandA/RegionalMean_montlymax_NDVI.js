/* 
plot monthly max mean ndvi of year at some specific region
*/

/////******************************function section*******************************
function maskL8sr(image) {
  // Bits 3 and 5 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = (1 << 3);
  var cloudsBitMask = (1 << 5);
  // Get the pixel QA band.
  var qa = image.select('pixel_qa');
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
                 .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
  return image.updateMask(mask);
}

var addNDVI = function(image) {
	
	return image.addBands(
        image.normalizedDifference(['B5', 'B4'])
        .rename('NDVI')
		);
	};

/////---------------------------appointted regions----------------------------------
var forest = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[116.38290105720586, 40.01976298965542],
          [116.38290105720586, 40.01496445151945],
          [116.39749227424687, 40.01496445151945],
          [116.39749227424687, 40.01976298965542]]], null, false),
    factory = 
    /* color: #98ff00 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[116.36885373964293, 40.020563215828076],
          [116.36885373964293, 40.013792657290445],
          [116.37348859682066, 40.013792657290445],
          [116.37348859682066, 40.020563215828076]]], null, false);
var forest = ee.Feature(   
    forest, {label: 'forest park'});
var factory = ee.Feature(
    factory, {label: 'factory'});
var Regions = new ee.FeatureCollection([forest, factory]);

//////---------------------------landsat data load and filter---------------------
var dataset = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
                  .filterDate('2017-01-01', '2019-12-31')
                  .filterBounds(Regions).map(maskL8sr);
                  
var landsat_ndvi = dataset.map(addNDVI);
// var yearlymax_ndvi = landsat_ndvi
//               .filterDate('2017-01-01', '2017-02-01')
//               .max();

// var date = ee.Date.fromYMD(2017, 1, 1);
// var monthMaxImage = landsat_ndvi
//                     .filterDate(date, date.advance(1, 'month'))
//                     .select('NDVI')
//                     .max()
//print(monthMaxImage)
//////---------------------------dominant fuction---------------------------------
var monthlymax = ee.List.sequence(2017, 2019).map(
    function (year) {
        // map the time series into monthly means
        return ee.Image(ee.List.sequence(1,12).map(
                function (month) {
                    var date = ee.Date.fromYMD(year, month, 1);
                    var monthMaxImage = landsat_ndvi
                        .filterDate(date, date.advance(1, 'month'))
                        .select('NDVI')
                        .max()
                    return monthMaxImage.set({'system:time_start': date.millis()});
                }))
    });
                
print('monthly max',monthlymax) 

var monthlymax_ =ee.ImageCollection.fromImages(monthlymax.get(0)).merge(
                  ee.ImageCollection.fromImages(monthlymax.get(1))).merge(
                    ee.ImageCollection.fromImages(monthlymax.get(2)))
print(monthlymax_)

// var yearlymax_mean = year_ndvic.map(function(img){
//   return img.select('NDVI').reduceRegions({
//       collection: Regions,
//       reducer: ee.Reducer.mean()
//       crs: 'EPSG:4326',
//       scale: 30,
//       });
//     }
//   );
/////-------------------------------plot-------------------------------------  
var ndviTimeSeries = ui.Chart.image.seriesByRegion({
  imageCollection: monthlymax_,
  regions: Regions,
  reducer: ee.Reducer.mean(),
  band: 'NDVI',
  scale: 30,
  xProperty: 'system:time_start',
  seriesProperty: 'label'
});

print(ndviTimeSeries)
Map.addLayer(dataset)
Map.addLayer(yearlymax_ndvi,{},'yearlymax_ndvi')
Map.addLayer(monthMaxImage,{},'monthMaxImage')
