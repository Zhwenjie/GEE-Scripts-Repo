
/*
Features union where their incircles along short side of 
the corresponding bounds’ rectangulars are intersected
*/
////----------add area ------
var addArea = function(feature) {
  return feature.set({areaSqM: feature.geometry().area(100).divide(1000 * 1000).int()});
}; 

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
 
////-----------intersected feature with overlapped circle-------- 
var IFOC/*intersected feature with overlapped circle*/ = function (feature) {
  var geometry = ee.Feature(feature).geometry()
  var PF = polygons.filterBounds(geometry)/* polygon boundfilter*/
  var PFNumS = PF.size()
  ////note that featurecollection.union() returns a new featurecollection instead of feature
  var featurereturn = ee.Algorithms.If(ee.Number(PFNumS).gt(1),PF.union(1).first(),PF.first())
  return featurereturn
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
         [[[-100.96328134588629, 36.93223191202292],
           [-100.19423837713629, 36.06676287988273],
           [-96.44765634588629, 35.1916666207897],
           [-95.60195322088629, 37.45732063341261],
           [-95.14003915838629, 38.95931331410087],
           [-99.62294931463629, 38.462095578329176],
           [-100.34804697088629, 37.840059867832736]]],
         [[[-106.20449228338629, 36.56250141385399],
           [-104.88613290838629, 36.56250141385399],
           [-102.74355478338629, 38.34155988759985],
           [-105.39150400213629, 38.9763970302102],
           [-108.64394540838629, 37.96142650553191]]],
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
print('polygonbound',polygonbound)
////get outline of bound on purpose of display
var polygonbl/* bound line*/ = polygonbound.map(f2l);
////draw incycle along short side of bound
var boundincycle = polygonbound.map(shortside);
var boundincyclel = boundincycle.map(f2l)
/////////////////////////************************//////////////////////////////
/////filter the intersected bounds and union them and result in a new feature collection
/////see the difference of polygonArea and AreaFilted
var polygonArea = boundincycle.map(addArea);
print('polygonArea',polygonArea);

////what if the number of uniquevalues is not equal 
var uniqueValues = polygonArea.distinct(['areaSqM']).aggregate_array('areaSqM');
var uniqueValues = polygonArea.aggregate_array('areaSqM');
print('uniqueValues',uniqueValues)

//var maxValue = ee.List(uniqueValues).length().subtract(1).getInfo();
var valuesList1 = ee.List.sequence(1, polygons.size());

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
print('polygonVector',polygonVector)
var unionbound/* bound line*/ = polygonVector.map(f2l);

var geo = ee.Feature(polygonVector.toList(5).get(0)).geometry()
var pl = polygons.filterBounds(geo)
print('pl',pl)
var plu = pl.union(1)
print('plu',plu)

var IFOCreturn =polygonVector.map(IFOC)
print('IFOCreturn',IFOCreturn)
var IFOCrl = IFOCreturn.map(f2l)

////-----------------------visualization---------------------------
//Map.addLayer(polygonsl,{color:'red'},'line of polygon');
//Map.addLayer(polygonbl,{color:'green'},'polygonbound');
//Map.addLayer(boundincyclel,{color:'blue'},'boundincycle');
//Map.addLayer(unionbound,{color:'black'},'union intersected rectagular');
Map.addLayer(IFOCrl,{color:'black'},'intersected feature with overlapped circle');

