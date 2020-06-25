/*
Finding the largest value and save it and its associated key
from a dictionary where the keys are strings, and the values are numbers.

The Question is from GEE forum link:https://groups.google.com/g/google-earth-engine-developers/c/T3j3cEq9pnE/m/cMaqIWc5CAAJ
The answer is from Noel Gorelick (https://code.earthengine.google.com/b32a9ee7e402da2f1cd7bc191d6d369c)
*/

var dict = ee.Dictionary({'one': 1, 'two': 2, 'three': 3, 'four': 4})

var lol = dict.map(function(key, value) {
  return [value, key]
});
print('lol will return a dictionary:')
print(lol)
var lol = dict.map(function(key, value) {
  return [value, key]
}).values()
print('lol will return a list:')
print(lol)

var top = lol.reduce(ee.Reducer.min(2))
print(top)

// error will return var top = lol.reduce(ee.Reducer.mean(4))
