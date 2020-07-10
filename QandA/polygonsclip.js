
/* 
polygon clips.
Reference link:https://groups.google.com/forum/#!searchin/google-earth-engine-developers/clip$20feature$20collection%7Csort:date/google-earth-engine-developers/CEihG3qy5YA/G3h70ljqCwAJ
*/

///////////////////////////*****function****///////////////////////////////
////----------transter polygon to line----------//for display purpose
var f2l = function(feature){
  //var f2g = ee.Geometry(feature.geometry());
  var latlon = ee.Geometry(feature).coordinates().flatten();
  var lines = ee.Geometry.LineString(latlon);
  return ee.Feature(lines);
 };

////-----------polygon clip---------------------           
function clipTo(clip) {
  return function(feature) {
    return ee.Feature(feature).intersection(clip,1)
  }
}

///////////////////////////*****data****///////////////////////////////
var poly = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-114.096484375, 39.7956206925268],
                  [-114.096484375, 34.40210376572467],
                  [-106.62578125, 34.40210376572467],
                  [-106.62578125, 39.7956206925268]]], null, false),
            {
              "system:index": "0"
            })]),
    ftCollection = 
    /* color: #98ff00 */
    /* displayProperties: [
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.MultiPolygon(
        [[[[-115.06328125, 37.74005100886954],
           [-115.06328125, 33.892942066471825],
           [-111.54765625, 33.892942066471825],
           [-111.54765625, 37.74005100886954]]],
         [[[-108.73515625, 40.065206850954304],
           [-108.73515625, 37.32185660148094],
           [-105.04375, 37.32185660148094],
           [-105.04375, 40.065206850954304]]]], null, false);
           
///////////////////////////*****function application****///////////////////////////////
var res = ee.FeatureCollection(ftCollection).map(clipTo(poly.geometry()))
print(res)
var ftCollectionl = ee.FeatureCollection(ftCollection.geometries().map(f2l))

var polyl = f2l(poly.geometry())

Map.addLayer(polyl,{color:'red'},'poly');
Map.addLayer(ftCollectionl,{color:'blue'},'ftCollection');
Map.addLayer(res,{},'res') 
  
