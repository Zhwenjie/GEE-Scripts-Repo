/*
filter the polygon according to the area property
tips,
1.Properties is a key to select from each feature and pass into the reducer.
//1.Generally, we expect to use unique sequential number as a property to distinguish
the image catogory. The direct way is to iterate each feature and set new property (see the 32th syntax ).
But this would force GEE to run serially and might cause error if the feature collection
is magnitude. 
//2.Internatively,please reference the file of UnionIntersectedFsinFC to use aggregate_array and remap function
to generate the sequential id.
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

var polyfeatureC = ee.FeatureCollection(ee.List.sequence(0,polyfeatureC.size().subtract(1)).map(
  function(xi) {
  var feature = ee.Feature(polyfeatureC.toList(4).get(xi));
  return feature.set({ID: xi});
  }
));

print(polyfeatureC)
var polyfeatureCI  = polyfeatureC.reduceToImage(['ID'], ee.Reducer.first())
print(polyfeatureCI)
Map.addLayer(polyfeatureC);
Map.addLayer(polyfeatureCI,{},'polygonImage');

