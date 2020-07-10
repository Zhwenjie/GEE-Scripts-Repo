
/*
draw incircle of a rectagular
*/
////----------transter polygon to line----------//for display purpose
var f2l = function(feature){
  var f2g = ee.Geometry(feature.geometry());
  var latlon = f2g.coordinates().flatten();
  var lines = ee.Geometry.LineString(latlon);
  return ee.Feature(lines);
 };
 
////-----------bound transfer------------------------
var boundtransfer = function(feature){
  var geometry = ee.Geometry(feature.geometry());
  return ee.Feature(geometry.bounds());
  }
////-----------bounds centroid-----------------------
var boundcentroid = function(feature){
  var geometry = feature
  return geometry.centroid(100);
  }

////-----------bound max and min coordination--------
var shortside = function(feature){
  
  var centroidF = boundcentroid(feature)
  var geometry = ee.Feature(feature).geometry();
  var list = geometry.bounds().coordinates().get(0);
  //var lonList = ee.Array(list).slice(0).length();
  var lonList = ee.Array(list).slice({
    axis: 1,
    start: 0, 
    end: 1
  });
  var latList = ee.Array(list).slice({
    axis: 1,
    start: 1, 
    end: 2
  });
  var minlon = lonList.sort().get([0,0]);
  var minlat = latList.sort().get([0,0]);
  var maxlon = lonList.get(lonList.argmax());
  var maxlat = latList.get(latList.argmax());
  var pointld = ee.Geometry.Point([ minlon,minlat])
  var pointlu = ee.Geometry.Point([ minlon,maxlat])
  var pointrd = ee.Geometry.Point([ maxlon,minlat])
  var distance1 = pointld.distance(pointlu)
  var distance2 = pointld.distance(pointrd)
  var distancefinal = ee.Algorithms.If(distance1.lt(distance2), distance1, distance2);
  //return ee.Number(distancefinal).divide(2)
  return centroidF.buffer(ee.Number(distancefinal).divide(2),100)
 }
 
/////---------------------create polygons---------------------------
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

////convert geometry to feature and feture collection
var polygons = ee.FeatureCollection(geometry.geometries().map(function(g) {
  g = ee.Geometry(g)
  return ee.Feature(ee.Geometry.Polygon(g.coordinates()))
}));
print('polygons',polygons);
////get outline of polygon on purpose of display
var polygonsl = polygons.map(f2l)
////get the bounds of each polygon
var polygonbound = polygons.map(boundtransfer);
////get outline of bound on purpose of display
var polygonbl/* bound line*/ = polygonbound.map(f2l);
////draw incycle along short side of bound
var boundincycle = polygonbound.map(shortside);

Map.addLayer(polygonsl,{color:'red'},'line of polygon');
Map.addLayer(polygonbl,{color:'green'},'polygonbound');
Map.addLayer(boundincycle,{color:'blue'},'boundincycle');
