
/*
commen issue: image.arraySlice(0, i, i + 1)
Tips:
You can't use "+" here, i is a server-side object: 
Cast to number (and then you'll also have to convert to int, because floats aren't allowed there)
please see the post in GEE forum:
https://groups.google.com/g/google-earth-engine-developers/c/JNqxL_kXrNM/m/mqIR4CtUCAAJ
https://code.earthengine.google.com/44c898593822410d1e2d1d8bf0fbab84
*/
/////The below code is from 
/////https://code.earthengine.google.com/44c898593822410d1e2d1d8bf0fbab84
/////Acknowledge Noel Gorelick's effort.
var n = 10;
var bandNames = ["first", "second", "third"];


// image with 2d array
var image = ee.Image(ee.Array(ee.List.repeat([0,1,2],n)));
print(image);
Map.addLayer(image, {}, 'image');


// want collection of images with bands
var collection = ee.ImageCollection(ee.List.sequence(0,n-1).map(function(i) {
  var img = image.arraySlice(0, ee.Number(i).int(), ee.Number(i).add(1).int());
  return img.arrayProject([1]).arrayFlatten([bandNames]);
}));

print(collection);
Map.addLayer(collection, {}, 'collection');
