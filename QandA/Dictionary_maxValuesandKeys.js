/*
Finding the largest value and save it and its associated key
from a dictionary where the keys are strings, and the values are numbers.

Implementation approach: 
  total: Use the 'ee.List.reduce' method of 'ee.List' And dictionary key value swap.
  detail: 
    1. Convert to list
    2. Redece maximum of dictionary.
  note:
    1. Be aware that dictionary key-value swapping exists in the process of being converted to list 
       and that the order of zip does not change. 
       This is the core of the implementation and is based on reduce features.
  
Related Links: 
The Question is from GEE forum link:https://groups.google.com/g/google-earth-engine-developers/c/T3j3cEq9pnE/m/cMaqIWc5CAAJ
The answer is from Noel Gorelick (https://code.earthengine.google.com/b32a9ee7e402da2f1cd7bc191d6d369c)
*/


// Test Module
//// 1. The data structure
var dict = ee.Dictionary({'one': 1, 'two': 2, 'three': 3, 'four': 4});

//// 2. Convert to list
var list = dict.values().zip(dict.keys());
print("list", list);

//// 3. Print result
var max = list.reduce(ee.Reducer.max(2));
print("maximum of dict", max);


// Function realization
var printDict_max = function(dict){
  
  var list = dict.values().zip(dict.keys());
  
  return list.reduce(ee.Reducer.max(2));
  };

print("Result of Function", printDict_max(dict));
