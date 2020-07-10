/*
Calculate the mathematical statistics of all pixels in the image, 
taking the mean value of all pixels as an example.

Implementation idea:
1. Calculate the mean value with the help of the mathematical and statistical properties of Reduce.
2. Scope all pixels, ee.image.reduceregion ().
Related links: 
1. The official example: 
https://code.earthengine.google.com/?scriptPath=Examples%3AImage%2FReduce%20Region
2. Python Api of geemap:
https://github.com/giswqs/geemap/blob/master/geemap/utils.py#L168
*/

var image = ee.Image("CGIAR/SRTM90_V4"),
    poly = /* color: #0b4a8b */ee.Geometry.Polygon(
        [[[-109.05, 37],
          [-109.05, 41],
          [-102.05, 41],
          [-102.05, 37]]]);

var mean = image.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: poly,
  scale: 200
});

// Print the result (a Dictionary) to the console.
print(mean);