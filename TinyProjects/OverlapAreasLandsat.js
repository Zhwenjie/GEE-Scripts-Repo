/*
project,
How to get the area that more than 7 images transitted within your
filter date and bounds.
by wenjie, at 24th June 2020
*/

/*
Tips, 
1.the masked image is an augument of arraySlice. Hence if it is masked in start argument in arraySlice
meaning no data in that pixel, the arrayslice would take all arrayvalues at that pixel.
2.the masked image in arrayGet represents the position info, so if it 
encounters no data pixel and nothing will be return.
*/

/////////////////////////////////////////////////////////////////
var geometry = 
    ee.Geometry.Polygon(
        [[110, 20.5],
          [110, 15],
          [120, 15],
          [120, 20.5]], null, true);
        
var collection_SR = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
  .filterDate('2020-01-01', '2020-05-31').filterBounds(geometry)


var collectionSR_R = collection_SR.map(
  function(image){
    return image.addBands(image.metadata('system:time_start'))
  });
  
var collectionSR_array = collectionSR_R.select('system:time_start').toArray();
var arrayLength0 = collectionSR_array.arrayLength(0);

var collectionSR_array_ = collectionSR_R.toArray();
//Map.addLayer(collectionSR_array_,{},'collectionSR_array_');
//Map.addLayer(collectionSR_array ,{},'collectionarray');
var imageAxis = 0;

/*
The following is dubious!
Note that the imageCountfirst and imageCount has different range. It can be found
when you zoom in pixel scale at the margin area. It would cause the error if you
mix to use them in your image array calculation. It isn't easily visible!!!
Inspiration: hence if you want to select the SR data accroding to TOA, you have to 
keep them is the same size!!!
*/
var imageCountfirst = collectionSR_array.arrayLengths().arrayGet(imageAxis);
var imageCount = collectionSR_array_.arrayLengths().arrayGet(imageAxis);
//Map.addLayer(imageCount,{},'imageCount');

/* 
Enlarge the region to guarantee the entirely coverage, then we 
can get the max and min value by region reducer
*/
var region = 
    ee.Geometry.Polygon(
        [[100, 30],
          [100, 0],
          [130, 0],
          [130, 30]], null, true);
          
var imagemax = imageCount.reduceRegion({
  reducer: ee.Reducer.max(),
  geometry: region,
  scale: 30000
});
print('imagemax');
print(imagemax.values().get(0));

//////////////////////////////////////////////////////////////////////////////////////////////////////
var allimage = collectionSR_array_.arraySlice(0)

var imagearrayaxis0 = imageCount.subtract(8)
//Map.addLayer(imagearrayaxis0,{},'imagearrayaxis0');

var imagearrayaxis0_ = imagearrayaxis0.gte(0)//if F return 0, if T return 1
//Map.addLayer(imagearrayaxis0_,{},'imagearrayaxis0_');
//var firstimage = collectionSR_array.arrayGet(imageCount.subtract(64).addBands(0));
var imagearrayaxis0_mask = imagearrayaxis0_.updateMask(imagearrayaxis0_)
/////////////////////////////////////////////////////////////////////////
/////we might be able to find out the overlap area.
var imagearrayaxis0_mask_ = imagearrayaxis0_mask.where(ee.Image(7),7)
Map.addLayer(imagearrayaxis0_mask_,{},'imagearrayaxis0_mask');
/////////////////////////////////////////////////////////////////////////

var collectionSR_arrayFirstbandAdds_1 = collectionSR_array_.arraySlice(0,imagearrayaxis0_mask_,imagearrayaxis0_mask_.add(1));
Map.addLayer(collectionSR_arrayFirstbandAdds_1,{},'collectionSR_arrayFirstbandAdds_1');

/*
Tips, 
1.the masked image is an augument of arraySlice. Hence if it is masked in start argument in arraySlice
meaning no data in that pixel, the arrayslice would take all arrayvalues at that pixel.
2.the masked image in arrayGet represents the position info, so if it 
encounters no data pixel and nothing will be return.

*/
var collectionSR_arrayFirstbandAdds_2 = collectionSR_array_.updateMask(imagearrayaxis0_mask_).arraySlice(0,imagearrayaxis0_mask_,imagearrayaxis0_mask_.add(1));
Map.addLayer(collectionSR_arrayFirstbandAdds_2,{},'collectionSR_arrayFirstbandAdds_2');

var collectionSR_arrayFirstbandAdds_3 = collectionSR_array_.updateMask(imagearrayaxis0_mask_)
Map.addLayer(collectionSR_arrayFirstbandAdds_3,{},'collectionSR_arrayFirstbandAdds_3');

var bandnames = [['B1','B2','B3','B4','B5','B6','B7','B10','B11','sr_aerosol','pixel_qa','radsat_qa','start_time']];
var collectionSR_arrayFirstbandAdds_2flat = collectionSR_arrayFirstbandAdds_2.arrayProject([1]).arrayFlatten(bandnames);
print(collectionSR_arrayFirstbandAdds_2flat)
var vizParams = {bands: ['B4', 'B3', 'B2'], min: 500, max: 5000, gamma: 1.3};
Map.centerObject(collectionSR_R.first());
Map.addLayer(collectionSR_arrayFirstbandAdds_2flat,vizParams,'collectionSR_arrayFirstbandAdds_2flat');

/////////////////////////////////////////////////////////////////////////
////how to generate a new imagecollection that more than 7 landsat
////images scanned the area in the filter date.
var collectionSR_array_mask = collectionSR_array_.updateMask(imagearrayaxis0_mask_)
//print(imagemax.get([0]))

//print(ee.List.sequence(ee.Number(0),ee.Number(imagemax)));
var collectionSR_array_mask_0 = collectionSR_array_mask.arraySlice(0,0,1)
var collectionSR_array_mask_0flat = collectionSR_array_mask_0.arrayProject([1]).arrayFlatten(bandnames);
print('collectionSR_array_mask_0flat')
print(collectionSR_array_mask_0flat);
print(ee.List.sequence(0,7));
print(ee.List.sequence(0,7).get(1));
var listImage = ee.Image(ee.Number(ee.List.sequence(0,7).get(1)));
//Map.addLayer(listImage,{},'listImage');

var newcollection = ee.ImageCollection(ee.List.sequence(0,imagemax.values().get(0)).map(
        function (xi) {
            // for each image xi subtract another xj. Applied for the external sum
            //print(xi)
            var collectionSR_array_mask_1 = collectionSR_array_mask.arraySlice(0,ee.Number(xi).int(),ee.Number(xi).add(1).int())
            var collectionSR_array_mask_1flat = collectionSR_array_mask_1.arrayProject([1]).arrayFlatten(bandnames);
            return collectionSR_array_mask_1flat;
        }));
        
print(newcollection.first());     
        
