/*

references:
https://groups.google.com/forum/#!searchin/google-earth-engine-developers/polygon$20hole$20%7Csort:date/google-earth-engine-developers/Lpg4akYaGGM/K7dFfG29AAAJ
https://code.earthengine.google.com/303f6be0524cb4480f44b11ce0124ba0
https://groups.google.com/forum/#!searchin/google-earth-engine-developers/Feature$20collection$20union%7Csort:date/google-earth-engine-developers/g_S0-wnq6kA/1PPEMfyJAAAJ
https://code.earthengine.google.com/4f84bfdf88d32d3fa73cb954370e68fe

main function: polygons.merge(holes).geometry().dissolve();
*/
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

Map.addLayer(geometry,{},'geometry');
Map.addLayer(geometry2,{},'geometry2');
Map.addLayer(geometry3,{},'geometry3');
Map.addLayer(myMultiPoly,{},'myMultiPoly');

print ('My MultiPolygon',myMultiPoly, 'My multipolygon area', myMultiPolyArea)
//I want to find the area of the holes from MultiPolygon Geometry. not by writing geometry2.area(1)
//this is a simplified version of my problem. In real problem threre are thousands of polygons
// I know the first list item of a polygon is the outer shell and all the rest list items are hollow

print('myMultiPoly geometries',myMultiPoly.geometries());
print(ee.Geometry(myMultiPoly.geometries().get(0)).coordinates().size());
print(ee.Geometry(myMultiPoly.geometries().get(1)).coordinates().size());
print(ee.Geometry(myMultiPoly.geometries().get(2)).coordinates().size());

var polygons = ee.FeatureCollection(myMultiPoly.geometries().map(function(g) {
  g = ee.Geometry(g)
  return ee.Feature(ee.Geometry.Polygon(g.coordinates()))
}))

var polygonsWithHoles = polygons.map(function(f) {
  return f.set({ hasHoles: f.geometry().coordinates().size().gt(1) })
}).filter(ee.Filter.eq('hasHoles', 1))
print ('polygonsWithHoles',polygonsWithHoles)

var holes = polygonsWithHoles.map(function(f) {
  var g = ee.Geometry.MultiPolygon(f.geometry().coordinates().slice(1))
  return f.setGeometry(g)
})
print(holes)
var polygonholesUnion = polygons.merge(holes).geometry().dissolve();
 
Map.addLayer(holes, {color: 'green' },'hole');
Map.addLayer(polygons, {color: 'red' },'polygons');
Map.addLayer(polygonsWithHoles, {color: 'blue' },'polygonsWithHoles');
Map.addLayer(polygonholesUnion, {color: 'blue' },'polygonholesUnion');

print('Geometry without holes area: ', geometry.area(1))
print('Polygons area: ', polygons.geometry().area(1))
print('Holes area: ', holes.geometry().area(1))
