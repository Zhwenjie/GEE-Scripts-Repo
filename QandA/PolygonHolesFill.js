/* 
please reference to the file of Multipolygon2One and the following link:
https://groups.google.com/forum/#!searchin/google-earth-engine-developers/Feature$20collection$20union%7Csort:date/google-earth-engine-developers/g_S0-wnq6kA/1PPEMfyJAAAJ
https://code.earthengine.google.com/4f84bfdf88d32d3fa73cb954370e68fe
Tips:
When error as below is returned, it perhaps caused by data type.
Geometries cannot have their properties modified or be placed into collections
For example, if we return line rather than ee.Feature(line), we would be unable to
create ee.FeatureCollection().
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
////polygine to line display
var f2l = function(feature){
  var f2g = ee.Geometry(feature);
  var latlon = f2g.coordinates().flatten();
  var lines = ee.Geometry.LineString(latlon);
  return ee.Feature(lines);
 };
 
 
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
print('myMultiPoly',myMultiPoly);
Map.addLayer(myMultiPoly, {}, 'Orgininal');
Map.centerObject(myMultiPoly);

var geom = fillPolygons(ee.FeatureCollection(myMultiPoly));
print('geom dissolve1',geom )
// repeat to fill polygons after dissolve
geom = fillPolygons(ee.FeatureCollection(geom));//not sure the function of this syntax
print('geom dissolve2',geom )
var geomm = geom.geometries()
print('geomm',geomm )

Map.addLayer(geom, {color: 'red'})

var geomline = ee.FeatureCollection(geomm.map(f2l));

print('geomline',geomline)
Map.addLayer(geomline, {color: 'blue'});

/*
deeply understanding on the above functions
*/
////---------------------------------functions dissolve---------------------------------------------

var Features = ee.FeatureCollection(myMultiPoly).map(function(f) { return f.set({ geomType: f.geometry().type() }) });
var dataGeometryCollection = Features.filter(ee.Filter.eq('geomType', 'GeometryCollection'))
    .map(flattenGeometryCollection).flatten();
  
var dataMultiPolygon = Features.filter(ee.Filter.eq('geomType', 'MultiPolygon'))
    .map(flattenMultiPolygon).flatten();
print('flatten myMultiPoly',dataMultiPolygon);

Features = Features.filter(ee.Filter.and(
    ee.Filter.neq('geomType', 'GeometryCollection'),
    ee.Filter.neq('geomType', 'MultiPolygon')
    ))
    .merge(dataGeometryCollection)
    .merge(dataMultiPolygon);
    
print('Features first',Features);    
Features = Features.map(function(f) { return f.set({ geomType: f.geometry().type() }) });
print('Features second',Features);  

print('set type',Features);

var FeaturesFP = Features.filter(ee.Filter.eq('geomType', 'Polygon')).map(fillPolygon);
print('fillPolygon',FeaturesFP);
print('fillPolygon',FeaturesFP.geometry().dissolve());
print('fillPolygon',FeaturesFP.geometry().dissolve().geometries());


