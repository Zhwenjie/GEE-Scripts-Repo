///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
/*
 4.qq user Candy, Kernel usility
 Simultaneosly, It is also a good material for leaning remap function.
 Another remap application link (section 2):
 https://gis.stackexchange.com/questions/344428/neighbourhood-statistics-in-google-earth-engine-after-reclassifying-remap
*/
/////////////////////////////////
/////////////////////////////////
////section 1
// var year = 2018
// var water=ee.Image(ee.ImageCollection("JRC/GSW1_1/YearlyHistory").filterMetadata('year','equals',year).first());
// var reIsa = water.remap(ee.List([1,2,3]),ee.List([0,1,1]),0,'waterClass');

// //focal
// var focalreIsa=reIsa.reduceNeighborhood({
//   reducer: ee.Reducer.sum(),
//   kernel: ee.Kernel.rectangle(1,1,"pixels",false,1),
//   inputWeight:'kernel',
// });
// Map.addLayer(water,{},'water')
// Map.addLayer(focalreIsa,{},'focalreIsa')
// Map.addLayer(reIsa,{},'reIsa')

/////////////////////////////////
/////////////////////////////////
////section 2

// // import image (image with multiple bands)
// var image = ee.Image('projects/mapbiomas-workspace/public/collection3_1/mapbiomas_collection31_integration_v1');
// // xMin, yMin, xMax, yMax.
// var testArea = ee.Geometry.Rectangle([-60,-20,-40,0])
// // Get information about the bands as a list.
// var bandNames = image.bandNames();
// print('Band names: ', bandNames); 
// // select single band
// var v1985 = image
//   .select("classification_1985")
//   .clip(testArea);
// print(v1985)
// Map.addLayer(v1985,{},'v1985')
// // do what I want with one image as a trial.
// var rc_1985 = v1985.remap([2,3], [1,1],0);
// Map.addLayer(rc_1985,{},'rc_1985')

// /////////////////////////////////
// /* 
// k1_1985 would return abnormal value because:
// The kernel produce a floating value [0-1] image when normalize is true (default). 
// Thus, before applying the reduceNeighbourhood, make sure you: 
// 1) cast to a floating value when normalize in the kernel true, 
// 2) set normalize to false. I think the latter is most straightforward:
// */
// //// apply the reduce neighbourhood
// ////wrong way
// var k1_1985 = rc_1985.reduceNeighborhood({
//   reducer: ee.Reducer.sum(),
//   kernel: ee.Kernel.square(15, 'pixels')
//   });
// ////correct way
// // var k1_1985 = rc_1985.reduceNeighborhood({
// //   reducer: ee.Reducer.sum(),
// //   kernel: ee.Kernel.square({radius: 15, 
// //                             units: 'pixels', 
// //                             normalize: false})
// //   });
// print(k1_1985)
// Map.centerObject(testArea)
// Map.addLayer(testArea,{},'testArea')
// Map.addLayer(k1_1985,{},'k1_1985')
