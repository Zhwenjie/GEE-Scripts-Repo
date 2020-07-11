/* 
The solution is from the below link:
https://stackoverflow.com/questions/56195985/can-i-map-a-function-with-more-then-one-argument
At the same time, thanks for the hint provide by qq group member submarine
*/

///////-----------------the first method---------------------------
var listOfNumbers = [0, 1, 1, 2, 3, 5];
var add_x = function(n, x) {
  var m = n + x;
  return m;
}

var add_10 = add_x.bind(null, 10);

var listOfNumbers_ = listOfNumbers.map(add_10);

console.log(listOfNumbers_);

//////------------------the second method-----------------------
var listOfNumbers = [0, 1, 1, 2, 3, 5];
var add_x = function(n) {
  return function (x){
    var m = n + x;
    return m;
  }
}

var add_10 = add_x(10);

var listOfNumbers_ = listOfNumbers.map(add_x);
console.log(listOfNumbers_);

//////------------------the third method-----------------------
var listOfNumbers = [0, 1, 1, 2, 3, 5];
var add_x = function(x) {
    var m = n + x;
    return m
}

var n = 9
var listOfNumbers_ = listOfNumbers.map(add_x);
console.log(listOfNumbers_);
