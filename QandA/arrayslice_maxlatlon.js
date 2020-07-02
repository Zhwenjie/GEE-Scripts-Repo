/* 
calculate the maximum longitude and latitude from the bound of polygon.
Thanks for the help of Qianshuiting(submarine) who is from qq group.
*/
var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-112.99725074768067, 47.027166638737945],
          [-111.15154762268067, 42.990680370506574],
          [-103.50506324768067, 42.668395616393155],
          [-102.97771949768067, 46.54572785386271],
          [-111.32732887268067, 48.21194882598343]]]);

var list = geometry.bounds().coordinates().get(0);
print(list)

var lonList = ee.Array(list).slice(0).length();
//print(lonList.sort())

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

print('lonlist',lonList.sort());
print('latlist',latList.sort());

var minlon = lonList.sort().get([0,0]);
var minlat = latList.sort().get([0,0]);
var maxlon = lonList.get(lonList.argmax());
var maxlat = latList.get(latList.argmax());
print(minlon,minlat,maxlon,maxlat);
//print(lonList.get(lonList.argmax()));
//print(latList.get(latList.argmax()));
Map.addLayer(ee.Geometry.Polygon(list));
