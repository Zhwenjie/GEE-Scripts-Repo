
/*
genetic type issues:
Tips:
1.when create a feature collection from geometry list, each geometry will have a generic type of list. 
We must cast it back to a geometry and then filter out non-polygons.
2.when the region is pretty large, the unsuitable parameter of geometry.area would result in an internal error. 

The answer is from:
https://groups.google.com/forum/#!searchin/google-earth-engine-developers/Geometries$20cannot$20have$20their$20properties$20modified$20or$20be$20placed$20into$20collections.%7Csort:date/google-earth-engine-developers/YxKw3j6LH2Y/4M7Hh8qyBgAJ
*/
var polygon = ee.Geometry.Polygon([
  [[-5, 40], [65, 40], [65, 60], [-5, 60], [-5, 60]]
]);
print('Polygon area: ', polygon.area().divide(1000 * 1000));

var polygons = ee.Geometry.MultiPolygon([
  [[[-5, 40], [65, 40], [65, 60], [-5, 60], [-5, 60]]
  ]
,[
  [[-5, 30], [65, 30], [65, 60], [-5, 60], [-5, 60]]
]]);

print(polygons)

var polygonsgeo = polygons.geometries()

var polyfeatures = [
  ee.Feature(ee.Geometry(polygonsgeo.get(0))),
  ee.Feature(ee.Geometry(polygonsgeo.get(1)))
  ]
var polyfeatureC = ee.FeatureCollection(polyfeatures);
var fc = polyfeatureC.map(function(f) {
    return f.set('geoType', f.geometry().type())
  })
print('fc1')
