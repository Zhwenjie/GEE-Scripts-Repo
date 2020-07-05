/* 
It is worth to keep an eye on the functions return in GEE
*/


////---------------------------------functions---------------------------------------------
function flattenGeometryCollection(f) {
  return ee.FeatureCollection(f.geometry().geometries().map(function(g) {
    return f.setGeometry(g)
  }))
}

function flattenMultiPolygon(f) {
  return ee.FeatureCollection(f.geometry().coordinates().map(function(coords) {
    return f.setGeometry(ee.Geometry.Polygon(coords))
  }))
}

function fillPolygon(f) {
  return f.setGeometry(ee.Geometry.Polygon(f.geometry().coordinates().get(0)))
}


function fillPolygons(features) {
  features = features.map(function(f) { return f.set({ geomType: f.geometry().type() }) })
  
  // flatten GeometryCollection and MultiPolygon
  var dataGeometryCollection = features.filter(ee.Filter.eq('geomType', 'GeometryCollection'))
    .map(flattenGeometryCollection).flatten()
  
  var dataMultiPolygon = features.filter(ee.Filter.eq('geomType', 'MultiPolygon'))
    .map(flattenMultiPolygon).flatten()
    
  features = features.filter(ee.Filter.and(
    ee.Filter.neq('geomType', 'GeometryCollection'),
    ee.Filter.neq('geomType', 'MultiPolygon')
    ))
    .merge(dataGeometryCollection)
    .merge(dataMultiPolygon)
    
  features = features.map(function(f) { return f.set({ geomType: f.geometry().type() }) })
  
  // take only polygons and fill holes
  features = features.filter(ee.Filter.eq('geomType', 'Polygon')).map(fillPolygon)
  
  return features.geometry().dissolve()
}

 
////---------------------------------application in polygon with holes---------------------------------------------
{
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
           [-103.74355478338629, 38.34155988759985],
           [-105.39150400213629, 38.9763970302102],
           [-106.64394540838629, 37.96142650553191]]],
         [[[-104.35878915838629, 39.62252036262193],
           [-103.56777353338629, 39.72399413784258],
           [-103.08437509588629, 39.19811019314299],
           [-101.76601572088629, 39.19811019314299],
           [-101.15078134588629, 40.66387973680807],
           [-102.84267587713629, 41.22815666809478],
           [-104.44667978338629, 40.229124444695785]]]]),
    geometry2 = 
    /* color: #98ff00 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-101.21669931463629, 36.66832043067396],
          [-100.77724618963629, 38.013379491134565],
          [-101.98574228338629, 37.787984347489854],
          [-102.49111337713629, 36.93223191202292]]]),
    geometry3 = 
    /* color: #0b4a8b */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-100.46962900213629, 36.61542907542775],
          [-99.87636728338629, 36.879522387714594],
          [-99.63466806463629, 37.49219657488507],
          [-100.40371103338629, 37.1952327730167]]]);
} 
          
var myMultiPoly = geometry.difference(geometry2).difference(geometry3)
var myMultiPolyArea = myMultiPoly.area(1);

var geom = fillPolygons(ee.FeatureCollection(myMultiPoly));

geom = fillPolygons(ee.FeatureCollection(geom));//not sure the function of this syntax


////--------------------feature collection union and area calculation ---------------------------------------------
////it indicates that the polygon without the intersection can also be fused.
var FC = ee.FeatureCollection(geom.geometries().
      map(function(geom){return ee.Feature(ee.Geometry(geom))}));
var FC_area = FC.toList(10).map(function(feature){
  var feature = ee.Feature(feature);
  return feature.area();
  });     
print('FC',FC)
print('FC',FC_area)

var FCUnion = FC.union()
var FCUnion_area = FCUnion.toList(10).map(function(feature){
  var feature = ee.Feature(feature);
  return feature.area();
  });
print('FCUnion',FCUnion)
print('FCUnion_area',FCUnion_area)

