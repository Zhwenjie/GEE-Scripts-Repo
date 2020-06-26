//////// asset is shared by the below links.
////https://code.earthengine.google.com/?asset=users/wenjie/TibetShp/Tibet
////https://code.earthengine.google.com/?asset=users/wenjie/MCD12Q1

/* 
The question description:
The second display (B) is weird. We can know by the third display (C)
that it is caused by projection and scale in GEE. My confusion is 
Why we have to explicitly reproject it in order to display normally?

The picture can be seen on this website of 
https://www.instagram.com/p/CBv3uWJDQ92/?igshid=111sfw49jnm1l

////////////////////////////////
answer by Wu qiusheng:
section 1,
Below can be seen in the tutorial:https://developers.google.com/earth-engine/scale
Understanding how Earth Engine handles scale is crucial to interpreting scientific results obtained from Earth Engine. 
Here, scale means pixel resolution. Unlike other GIS and image processing platforms, 
the scale of analysis is determined from the output, rather than the input. 
Specifically, when you make a request for results, an image to display or a statistic, 
for example, you specify the scale at which data is input to the analysis.  

section 2,
The GEE would operate according to your current scale instead of the original resolution of image. 
It indicates that the different result would return under your current scale. 
Only explicitly setting the scale can fix the showing result, 
especially for some methods involving the edge region calculation such as kernel reducer.

section 3,
Note it is normal when you clip and download to your drive. So we do not need care too much it in GEE.
It can be proven by downloading them to your your lap and compare them.
*/

var roi = table;
var image = ee.Image("users/wenjie/MCD12Q1/MCD12Q1_A2016_LC_Type1");
var mcd12Q1 = image
print(mcd12Q1);
print('original projection with about 560m')
print('Scale in meters:', mcd12Q1.projection());
print('Scale in meters:', mcd12Q1.projection().nominalScale());

var mcd12Q1_r = mcd12Q1.reproject({crs:"EPSG:4326", scale:500});
print('reprojection with 500m')
print('Scale in meters:', mcd12Q1_r.projection());
print('Scale in meters:', mcd12Q1_r.projection().nominalScale());

var visualization = {
  bands: ['b1'],
  min: 0,
  max: 17,
  Palette:[
  'aec3d4', // water
  '152106', '225129', '369b47', '30eb5b', '387242', // forest
  '6a2325', 'c3aa69', 'b76031', 'd9903d', '91af40',  // shrub, grass
  '111149', // wetlands
  'cdb33b', // croplands
  'cc0013', // urban
  '33280d', // crop mosaic
  'd7cdcc', // snow and ice
  'f7e084', // barren
  '6f6f6f'  // tundra
  ]
};
Map.addLayer(mcd12Q1_r,visualization,'mcd12Q1_r');

var mcd12Q1Focal = mcd12Q1_r.focal_mean(1, 'square', 'pixels', 1)
Map.addLayer(mcd12Q1Focal,visualization,'mcd12Q1Focalbasedonmcd12Q1_r');
print('mcd12Q1Focal')
print('Scale in meters:', mcd12Q1Focal.projection());
print('Scale in meters:', mcd12Q1Focal.projection().nominalScale());

var mcd12Q1Focal_r = mcd12Q1Focal.reproject({crs:"EPSG:4326", scale:500});
Map.addLayer(mcd12Q1Focal_r,visualization,'mcd12Q1Focal_rbasedonmcd12Q1_r');
print('mcd12Q1Focal_r')
print('Scale in meters:', mcd12Q1Focal_r.projection());
print('Scale in meters:', mcd12Q1Focal_r.projection().nominalScale());

var roi = ee.Geometry.Polygon(  // region of interest
        [[126.25, 36],
          [126.25, 35.5],
          [127.05, 35.5],
          [127.05, 36]], null, false);

          
Map.centerObject(roi);
Map.addLayer(roi,{},'geometry');

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
////export to google drive for examine purpose
var mcd12Q1FocalClip = mcd12Q1Focal.clip(roi)
Export.image.toDrive({
  image: mcd12Q1FocalClip,
  description: 'Drive',
  fileNamePrefix:'MCD12Q1FocalClipWithoutReprojection_geodesticfalse',
  folder:'GEE',
  scale:500,
  region:roi,
  crs:'EPSG:4326',
  maxPixels:1e13
  });

var mcd12Q1Focal_r_Clip = mcd12Q1Focal_r.clip(roi)
Export.image.toDrive({
  image: mcd12Q1Focal_r_Clip,
  description: 'Drive',
  fileNamePrefix:'MCD12Q1FocalClipWithReprojection_geodesticfalse',
  folder:'GEE',
  scale:500,
  region:roi,
  crs:'EPSG:4326',
  maxPixels:1e13
  });
