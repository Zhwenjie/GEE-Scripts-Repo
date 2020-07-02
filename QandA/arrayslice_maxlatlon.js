/* 
calculate the maximum longitude and latitude from the bound of polygon.
Thanks for the help of Qianshuiting(submarine) who is from qq group.
*/


///////////////////////////////////////////////////////////////////////////////////
////----------------------------function------------------------------------------
var boundrange = function(feature){
  var geometry = ee.Geometry(feature)
  var list = geometry.bounds().coordinates().get(0);
  var lonList = ee.Array(list).slice(0).length();
  var lonList = ee.Array(list).slice({
    axis: 1,
    start: 0, 
    end: 1
  })
  var latList = ee.Array(list).slice({
    axis: 1,
    start: 1, 
    end: 2
  });
  var minlon = lonList.sort().get([0,0]);
  var minlat = latList.sort().get([0,0]);
  var maxlon = lonList.get(lonList.argmax());
  var maxlat = latList.get(latList.argmax());
  var coordinate = ee.Array([[minlon,minlat,maxlon,maxlat]]);
  //var coordinate = ee.Array.cat([coordinate,coordinate],0)
  return ee.Feature(coordinate);
 }


///////////////////////////////////////////////////////////////////////////////
////----------------------------applications on polygons------------------------------------------


{
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-103.96328134588629, 36.93223191202292],
           [-103.19423837713629, 36.06676287988273],
           [-100.44765634588629, 35.1916666207897],
           [-98.60195322088629, 37.45732063341261],
           [-100.14003915838629, 38.95931331410087],
           [-102.62294931463629, 38.462095578329176],
           [-103.34804697088629, 37.840059867832736]]]),
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

var boundrange = function(feature){
  var geometry = ee.Geometry(feature)
  var list = geometry.bounds().coordinates().get(0);
  //var lonList = ee.Array(list).slice(0).length();
  var lonList = ee.Array(list).slice({
    axis: 1,
    start: 0, 
    end: 1
  })
  var latList = ee.Array(list).slice({
    axis: 1,
    start: 1, 
    end: 2
  });
  var minlon = lonList.sort().get([0,0]);
  var minlat = latList.sort().get([0,0]);
  var maxlon = lonList.get(lonList.argmax());
  var maxlat = latList.get(latList.argmax());
  var coordinate = ee.Array([[minlon,minlat,maxlon,maxlat]]);
  //var coordinate = ee.Array.cat([coordinate,coordinate],0)
  return coordinate;
 }
 
///////////////////////////////////////////////////////////////////////////////
////----------------------------export array------------------------------------------
 
var fc = [geometry,geometry2, geometry3]
var polybound = fc.map(boundrange)
print(polybound)

var cat = ee.Array.cat(polybound,0)

print('cat',cat)

var y1 = cat.slice({
    axis: 1,
    start: 0, 
    end: 1
  })
print('y1',y1);
var y2 = cat.slice({
    axis: 1,
    start: 2, 
    end: 3
  })
print('y2',y2);

var x1 = cat.slice({
    axis: 1,
    start: 1, 
    end: 2
  })
print('x1',x1);
var x2 = cat.slice({
    axis: 1,
    start: 3, 
    end: 4
  })
print('x2',x2);

var yValues = ee.Array.cat([y1, y2, x1], 1);

// The band data to plot on the x-axis is a List.
var xValues = x2;

// Make a band correlation chart.
var chart = ui.Chart.array.values(yValues, 0, xValues)
    .setSeriesNames(['lon1', 'lon2','lat'])
    .setOptions({
      title: 'bound of polygons',
      hAxis: {'title': 'lat2'},
      vAxis: {'title': '{lons,lat}'},
      pointSize: 3,
});
print(chart);


///////////////////////////////////////////////////////////////////////////////
////----------------------------test on one polygon------------------------------------------

// var geometry = /* color: #d63000 */ee.Geometry.Polygon(
//         [[[-112.99725074768067, 47.027166638737945],
//           [-111.15154762268067, 42.990680370506574],
//           [-103.50506324768067, 42.668395616393155],
//           [-102.97771949768067, 46.54572785386271],
//           [-111.32732887268067, 48.21194882598343]]]);

// var list = geometry.bounds().coordinates().get(0);
// print(list)

// var lonList = ee.Array(list).slice(0).length();
// //print(lonList.sort())

// var lonList = ee.Array(list).slice({
//   axis: 1,
//   start: 0, 
//   end: 1
// })

// var latList = ee.Array(list).slice({
//   axis: 1,
//   start: 1, 
//   end: 2
// });

// print('lonlist',lonList.sort());
// print('latlist',latList.sort());

// var minlon = lonList.sort().get([0,0]);
// var minlat = latList.sort().get([0,0]);
// var maxlon = lonList.get(lonList.argmax());
// var maxlat = latList.get(latList.argmax());
// var coordinate = ee.Array([[minlon,minlat,maxlon,maxlat]])
// print(coordinate);
// var coordinate = ee.Array.cat([coordinate,coordinate],0)
// print(coordinate);
// Map.addLayer(ee.Geometry.Polygon(list));
