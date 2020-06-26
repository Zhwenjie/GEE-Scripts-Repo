/*
filter polygon from feature collection or geometry collection
Tips:
1.look at the json structure such as geometry1 is helpful.
2.the type of polygon is geometry collection, slightly different with point still in type of point
please see the fc1 and fc2
The turorial is from:
https://groups.google.com/forum/#!searchin/google-earth-engine-developers/Geometries$20cannot$20have$20their$20properties$20modified$20or$20be$20placed$20into$20collections.%7Csort:date/google-earth-engine-developers/YxKw3j6LH2Y/4M7Hh8qyBgAJ
https://code.earthengine.google.com/3079aa56b4670accf633f67b1f26cc6f
https://code.earthengine.google.com/fef64e7d2f35166786412d9df65de9c5
*/

var geometry1 = /* color: #d63000 */ee.Geometry({
      "type": "GeometryCollection",
      "geometries": [
        {
          "type": "Point",
          "coordinates": [
            -117.421875,
            44.826656308843
          ]
        },
        {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -122.607421875,
                44.57677385713505
              ],
              [
                -118.388671875,
                44.63934558051711
              ],
              [
                -120.673828125,
                46.42460580983505
              ]
            ]
          ],
          "geodesic": true,
          "evenOdd": true
        }
      ],
      "coordinates": []
    }),
    geometry2 = /* color: #98ff00 */ee.Geometry.Point([-114.78515625, 44.88895839978044]);
    
var fc = ee.FeatureCollection([ee.Feature(geometry1), ee.Feature(geometry2)])
  .map(function(f) {
    return f.set('geoType', f.geometry().type())
  })
print(fc)
print(fc.filter(ee.Filter.eq('geoType', 'GeometryCollection')))

var fc1 = ee.FeatureCollection([ee.Feature(geometry1), 
ee.Feature(geometry2)])
print(fc1)  
print(fc1.filter(ee.Filter.eq('geoType', 'GeometryCollection')))

//this will still be GeometryCollection as union of point and polygon will still be GeometryCollection
var fc2 = ee.FeatureCollection([ee.Feature(geometry1), ee.Feature(geometry2)]).union()
print(fc2) 

// Now try to get one polyong (or multipolygon?) out of this
var geometry1_2 = geometry1.geometries().map(function(g) {
  var tg = ee.Geometry(g)
  return ee.Feature(tg).set('geoType', tg.type())
})

var polygons = ee.FeatureCollection(geometry1_2).filter(ee.Filter.eq('geoType', 'Polygon'))
print(polygons)
