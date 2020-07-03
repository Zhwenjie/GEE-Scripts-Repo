
/*
Find out the intersected features in feature collection and union it. We carry it our based on the mutual 
conversion  between vector and image.
reference:
https://code.earthengine.google.com/21e29f828c76f31f203db31e04bbdf97
https://groups.google.com/forum/#!searchin/google-earth-engine-developers/intersected$20feature%7Csort:date/google-earth-engine-developers/SBX0TCA8yAQ/XHnssyMPAQAJ
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
