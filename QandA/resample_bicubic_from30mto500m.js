/* 
resample from landsat 30m resolution to 500m. This is useful when comparing image datasets at different scales, 
for example 30-meter pixels from a Landsat-based product to coarse pixels (higher scale) from a MODIS-based product.
reference link:https://gis.stackexchange.com/questions/316596/how-can-i-resample-a-image-or-imagecollection-to-a-higher-resolution-in-google-e
*/

var landsat = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20160323');
var crs = landsat.select('B4').projection()
// Set display and visualization parameters.
Map.setCenter(-122.37383, 37.6193, 15);
var visParams = {bands: ['B4', 'B3', 'B2'], max: 0.3};

// Display the Landsat image using the default nearest neighbor resampling.
// when reprojecting to Mercator for the Code Editor map.
Map.addLayer(landsat, visParams, 'original image');

// Force the next reprojection on this image to use bicubic resampling.
var resampled1 = landsat.reproject({
'crs': crs,
'scale': 500.0});

var resampled2 = landsat.resample('bicubic').reproject({
'crs': crs,
'scale': 500.0});

// Display the Landsat image using bicubic resampling.
Map.addLayer(resampled1, visParams, 'nearest neighbor resampled');
Map.addLayer(resampled2, visParams, 'cubic resampled');
