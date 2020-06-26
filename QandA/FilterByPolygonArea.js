/*
filter the polygon according to area property
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

var addArea = function(feature) {
  return feature.set({areaSqM: feature.geometry().area().divide(1000 * 1000)});
}; 
/////see the difference of polygonArea and AreaFilted
var polygonArea = polyfeatureC.map(addArea);
print(polygonArea)

var AreaFilted = polygonArea.filterMetadata('areaSqM', 'greater_than', 9918986)
print(AreaFilted)
Map.centerObject(polyfeatureC.first());
Map.addLayer(AreaFilted,{},'vectorsareafilted')

