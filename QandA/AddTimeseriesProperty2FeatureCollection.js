
///////////////////////////////////////////////////////////////////////////////////////////
//------------------------------------------------------------------
/*
Add time series statistical mean of each geometry to feature collection.
The clues of solution is from below link:
https://groups.google.com/g/google-earth-engine-developers/c/j93vEfHqZZg/m/BRjIa44vBwAJ
https://code.earthengine.google.com/a6bf26c531056ad75026137e7af7ea3a
https://code.earthengine.google.com/9c65f31233ae91461186dd392ac9f8d5
https://code.earthengine.google.com/e180e9aba6c75a33aaa55690a073ee75
https://code.earthengine.google.com/013e69974f5e9d68267c2ab75e2577ef
https://code.earthengine.google.com/2edfce62fbb87a2adfd32eca5d3afa56
*/

////////////////////////////////////////////////////////////////////////////
/////////////////*******************////////////////////////

var geometry = 
    /* color: #d63000 */
    /* locked: true */
    ee.Geometry.Polygon(
        [[[-74.72693060040476, 41.18655523835657],
          [-74.78186224102976, 40.58855765184462],
          [-74.68298528790476, 40.2036777832275],
          [-74.46325872540476, 39.825038388349206],
          [-73.94690130352976, 39.67299484879565],
          [-73.04602239727976, 39.99358189971981],
          [-72.65051458477976, 40.73023874605819],
          [-72.83728216290476, 41.020986997204936],
          [-73.56237981915476, 41.260924726720894],
          [-74.22155950665476, 41.30220455902787]]], null, false),
    geometry2 = 
    /* color: #98ff00 */
    /* locked: true */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-1.370059211893091, 51.91879961363832],
          [-1.370059211893091, 51.105183377495294],
          [0.662411491231909, 51.105183377495294],
          [0.662411491231909, 51.91879961363832]]], null, false),
    geometry3 = 
    /* color: #0b4a8b */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[115.69753125444679, 40.305868544440386],
          [115.69753125444679, 39.48830258306991],
          [117.11476758257179, 39.48830258306991],
          [117.11476758257179, 40.305868544440386]]], null, false),
    geometry4 = 
    /* color: #ffc82d */
    /* locked: true */
    ee.Geometry.Polygon(
        [[[118.19371710550537, 32.64336104646838],
          [121.21495733988037, 31.676112193685636],
          [121.02818976175537, 31.000503635325146],
          [121.56651983988037, 30.89685961900684],
          [121.88512335550537, 30.962827910971868],
          [121.87413702738037, 31.43270234913743],
          [121.23692999613037, 31.648058869708173]]], null, false),
    geometry5 = 
    /* color: #00ffff */
    /* locked: true */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[112.60167608988039, 23.51679826262916],
          [112.60167608988039, 22.078664891137834],
          [115.00768194925539, 22.078664891137834],
          [115.00768194925539, 23.51679826262916]]], null, false),
    geometry6 = 
    /* color: #bf04c2 */
    /* locked: true */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[139.0478778765148, 36.05530740538682],
          [139.0478778765148, 35.15314174382505],
          [140.4980731890148, 35.15314174382505],
          [140.4980731890148, 36.05530740538682]]], null, false);

var goalfeatures = [ee.Feature(geometry),ee.Feature(geometry2),ee.Feature(geometry3),
              ee.Feature(geometry4),ee.Feature(geometry5),ee.Feature(geometry6)]
var goalfc = ee.FeatureCollection(goalfeatures)


var year_Image = ee.ImageCollection(year_list.map(function(num){
  var time=ee.Date.fromYMD(num, 4, 1)
  var year_image=ee.ImageCollection('MODIS/006/MOD11A2')
                  .filterDate(time,ee.Date(time).advance(7,'month'))
                  .mean().multiply(0.02).add(-273.13);
  var year_LST=year_image.select('LST_Day_1km');
  var year_LSTc = year_LST.addBands(ee.Image.constant(num).toFloat())
  
  //return  year_ndvi.addBands(ee.Image.constant(num).toFloat());   
  return year_LSTc.set({'system:time_start': time.millis()})
}));

var meanValCol = function (fc, collection) {
  var newfc = fc.map(function(feature) {
    return collection.map(function(img) {
      var vals = img.reduceRegion({
        reducer: 'mean',
        geometry: feature.geometry(),
        scale: 1000
      });
      return feature.set({
          'date': img.date(),
          'image': img.id(),
          'LST': vals.get('LST_Day_1km')
      });
    });
  }).flatten();
  
  return newfc;
};


var meanNDVIs = meanValCol(goalfc,year_Image)
print('newfc',meanNDVIs)
Export.table.toDrive({
  collection: meanNDVIs,
  description: 'Drive',
  folder:'test',
  fileNamePrefix:'test_New',
  fileFormat: 'SHP'
});

