
/*
Find out the intersected features in feature collection and union it. We carry it our based on the mutual 
conversion  between vector and image.
*/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.MultiPolygon(
        [[[[-103.96328134588629, 36.93223191202292],
           [-103.19423837713629, 36.06676287988273],
           [-100.44765634588629, 35.1916666207897],
           [-98.60195322088629, 37.45732063341261],
           [-100.14003915838629, 38.95931331410087],
           [-102.62294931463629, 38.462095578329176],
           [-103.34804697088629, 37.840059867832736]]],
         [[[-106.20449228338629, 36.56250141385399],
           [-104.88613290838629, 36.56250141385399],
           [-100.74355478338629, 38.34155988759985],
           [-105.39150400213629, 38.9763970302102],
           [-106.64394540838629, 37.96142650553191]]],
         [[[-104.35878915838629, 39.62252036262193],
           [-103.56777353338629, 39.72399413784258],
           [-103.08437509588629, 39.19811019314299],
           [-101.76601572088629, 39.19811019314299],
           [-101.15078134588629, 40.66387973680807],
           [-102.84267587713629, 41.22815666809478],
           [-104.44667978338629, 40.229124444695785]]]]);

var polygons = ee.FeatureCollection(geometry.geometries().map(function(g) {
  g = ee.Geometry(g)
  return ee.Feature(ee.Geometry.Polygon(g.coordinates()))
}));
print('polygons',polygons);

/* 
question, how to convert ee.String to int. feature.id() would return an string,
but I expect an int type.
*/
// var polygonsid = polygons.toList(10).map(function(g) {
//   return ee.Number(ee.String(ee.Feature(g).id()));//ee.Number is invalid!
// });
// print('polygonsid',polygonsid);

var polygonsid = polygons.map(function(g){
  return g.set({'id': ee.Feature(g).id()});}
  );
print('polygonsid',polygonsid);


var addArea = function(feature) {
  return feature.set({areaSqM: feature.geometry().area().divide(1000 * 1000).int()});
}; 

/////see the difference of polygonArea and AreaFilted
var polygonArea = polygons.map(addArea);
print('polygonArea',polygonArea);

////what if the number of uniquevalues is not equal 
var uniqueValues = polygonArea.distinct(['areaSqM']).aggregate_array('areaSqM');
var uniqueValues = polygonArea.aggregate_array('areaSqM');
print('uniqueValues',uniqueValues)

//var maxValue = ee.List(uniqueValues).length().subtract(1).getInfo();
var valuesList1 = ee.List.sequence(0, polygons.size().subtract(1));

var polygonId = polygonArea.remap(uniqueValues,valuesList1, 'areaSqM');
print('polygonId',polygonId);

var polygonImage  = polygonId.reduceToImage(['areaSqM'], ee.Reducer.first());
print(polygonImage);
var polygonImage  = polygonImage.neq(0);
var polygonImage  = polygonImage.selfMask();

var polyrange = ee.Geometry.Polygon([
  [[-180, -60], [180, -60], [180, 90], [-180, 90], [-180, 90]]
],null,false);

var polygonVector = polygonImage.int().reduceToVectors({
  geometry: polyrange,
  crs: 'EPSG:4326',/*WGS84 would result in a fault return*/
  scale: 1000,
  geometryType: 'polygon',
  labelProperty: 'urbanvector',
  maxPixels: 1e13
});

print(polygonVector);
Map.addLayer(polygons,{},'myPoly');
Map.addLayer(polygonImage,{},'polygonImage');
Map.addLayer(polygonVector,{},'polygonVector');
