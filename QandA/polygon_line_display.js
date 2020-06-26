/*
question and solution from below links.
https://groups.google.com/forum/?oldui=1#!searchin/google-earth-engine-developers/polygon$20only$20outline$20%7Csort:date/google-earth-engine-developers/xF1H68n-jSc/7jIUVTn3BAAJ
https://code.earthengine.google.com/fd8c3a5a11ff9e83dceeb1fd05e4e4be
*/
var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-0.07741051977687707,52.87376799262601],
[0.0693599575180448,52.87376799262601],
[0.0693599575180448,52.93899330429123],
[-0.07741051977687707,52.93899330429123],
[-0.07741051977687707,52.87376799262601]]]);

var coords = geometry.coordinates().flatten()
print(coords)
var ls = ee.Geometry.LineString(coords)
Map.addLayer(ls)

Map.centerObject(geometry);
Map.addLayer(geometry, {color: 'FF0000'}, 'geodesic polygon');
