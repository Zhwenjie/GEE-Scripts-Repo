/*
Tips:
Application on zip and distance function.
From GEE forum:
https://code.earthengine.google.com/c0367cc050aa0c917d87b10cad329f30
*/


var geometry1 = /* color: #d63000 */ee.Geometry.LineString(
        [[-121.025390625, 48.980216985374994],
         [-112.587890625, 52.32191088594773],
         [-95.888671875, 49.95121990866204],
         [-100.01953125, 46.619261036171515]]),
    geometry2 = /* color: #98ff00 */ee.Geometry.LineString(
        [[-122.431640625, 45.21300355599396],
         [-118.564453125, 40.04443758460856],
         [-109.6875, 38.8225909761771],
         [-101.25, 42.87596410238257]]);
         
var coordstart = geometry1.coordinates();
var coordend = geometry2.coordinates();
print(coordstart)
print(coordstart.zip(coordend).map(function(pts) {
  pts = ee.List(pts);  // a list of 2 lists.
  var p1 = pts.get(0);
  var p2 = pts.get(1);
  return ee.Geometry.Point(p1).distance(ee.Geometry.Point(p2))
}))
