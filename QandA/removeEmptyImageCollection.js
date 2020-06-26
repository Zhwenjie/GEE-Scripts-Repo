/*
The question is from the GEE forum link:https://groups.google.com/g/google-earth-engine-developers/c/2bXM-383kIE/m/eIJ39RrnBQAJ
The answer is from the link:https://code.earthengine.google.com/13385feec59c52950c2ee27f33157b7c
*/

// This script is designed to have the 1999 Image Collection be empty to serve as an example;
var testLocation = ee.Geometry.Point(-68.7, 45.2);
var keys = ['1999', '2000', '2001'];
var values = [
  ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
    .filterBounds(testLocation)
    .filterDate('1999-01-01', '1999-01-02'), 
  ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
    .filterBounds(testLocation)
    .filterDate('2000-01-01', '2000-03-02'), 
  ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
    .filterBounds(testLocation)
    .filterDate('2001-01-01', '2001-03-02')];
print('keys')
print(keys)
print('values')
print(values)
var dict = ee.Dictionary.fromLists(keys, values);

// Return null for the value of the dictionary key-value pair if the 
// ImageCollection size is less than one 
function remove_empty_collections (k, v) {
  return ee.Algorithms.If(ee.ImageCollection(v).size().lt(1), null, v)
}

// Print the size of the 1999 image collection, the value is less than 1
print (ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
    .filterBounds(testLocation)
    .filterDate('1999-01-01', '1999-01-02').size());
print (ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
    .filterBounds(testLocation)
    .filterDate('2000-01-01', '2000-03-02').size());
    print (ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
    .filterBounds(testLocation)
    .filterDate('2001-01-01', '2001-03-02').size());
    
var updatedDict = dict.map(remove_empty_collections);

///////The file of Dictionary_maxValuesandKeys can be referred
print(updatedDict);
print(ee.ImageCollection(updatedDict.values().get(0)))
