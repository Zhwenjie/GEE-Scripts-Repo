/* 
More details can refer to GEE tutorial PPT.
section one 
Solves for x in the matrix equation A*x=B, 
finding a least-squares solution if A is overdetermined for each matched pair of bands in image1 and image2.
tips:
A*x = B,
A corresponds ee.Image(endmembers)
ee.Image(endmembers).matrixSolve(arrayImage)
*/


var bands = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6']

var image = ee.Image('LANDSAT/LC8_L1T/LC80440342014077LGN00')
    .select(bands);

// var arrayImage = image.toArray().toArray(1);

// var axis0 = arrayImage.arrayLength(0);  // 6
// var axis1 = arrayImage.arrayLength(1);  // 1
// //print([axis0,axis1])
// Map.centerObject(axis0, 9)
// //Map.addLayer(axis0,{},'axis0');
// //Map.addLayer(axis1,{},'axis1');


var arrayImage = image
.select(bands).toArray().toArray(1); // 6x1

var spectra = ee.Array([ 
  [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],					// bare spectrum
  [0.1, 0.3, 0.3, 0.4, 0.5, 0.6], 					// vegetation spectrum
  [0.1, 0.5, 0.3, 0.4, 0.5, 0.6]  					// water spectrum
]); // 3x6

var endmembers = spectra.transpose(); // 6x3
var unmixed = ee.Image(endmembers).matrixSolve(arrayImage); // 3x1

var fractions = unmixed.arrayProject([0]).arrayFlatten([['bare', 'veg', 'water']]);
var fractions_P = unmixed.arrayProject([0]);

// print(arrayImage);
// Map.addLayer(fractions_P ,{},'fractions_P');
// Map.addLayer(arrayImage ,{},'arrayImage');
// Map.addLayer(unmixed ,{},'unmixed');
// Map.addLayer(fractions ,{},'fractions');


/*section 2
testing for the funtion:
If either image1 or image2 has only 1 band, then it is used against all the bands in the other image. 
*/

var bands = ['B1']
var image = ee.Image('LANDSAT/LC8_L1T/LC80440342014077LGN00')
    .select(bands);
var arrayImage = image
    .select(bands).toArray().toArray(1); // 1x1

var spectra = ee.Array([ 
  [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]
]); // 1x6
var endmembers = spectra.transpose(); // 6x1
var unmixed = ee.Image(arrayImage).matrixSolve(spectra );
Map.addLayer(unmixed ,{},'unmixed');
Map.addLayer(image ,{},'image');
///////////////////////////////////////////////////////////
//error happened
//var unmixed2 = ee.Image(endmembers ).matrixSolve(arrayImage);
//Map.addLayer(unmixed2 ,{},'unmixed2');
///////////////////////////////////////////////////////////
