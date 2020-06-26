/*
 5. array operation applied in the explore of MK test 
*/

// mk test on the artifical case 
// Load a Landsat 5 image, select the bands of interest.

//create several array on behalf on image 
var a = ee.Array([[1,2,3,4],[5,6,7,8]]);
var b = ee.Array([[1,4,3,5],[2,3,4,6]]);
var c = ee.Array([[1,4,3,7],[2,3,6,8]]);
var d = ee.Array([[2,5,7,9],[1,6,8,6]]);
var e = ee.Array([[2,8,9,3],[4,7,1,6]]);
print(a.get([0,1]))
print(a.length())
var m = ee.Array(5)
print(m);
print(m.length());
//print(m.get([0]))

var image_artifical = ee.Image(a)
var image_artifical_ = image_artifical.addBands(m)
print(image_artifical)
print(image_artifical_)
Map.addLayer(image_artifical,{},"image_artifical")
Map.addLayer(image_artifical_,{},"image_artifical_")
//print(c.first(0))

//print(ee.Image(a));

print(a.subtract(b))

var array1D = ee.Array([1,2,3]);
print(array1D)
print(ee.Array.cat([array1D],0))
print(ee.Array.cat([array1D],1))
print(ee.Array.cat([array1D,array1D],0))
print(ee.Array.cat([array1D,array1D],1))
var eps = 1e-6;
// refer the below function from 
var annualmax = ee.List([a,b,c,d,e]);
print(annualmax.size());
print("getarray")
print(ee.Array(annualmax.get(0)))
print(ee.Array(annualmax.get(0)).neq(1));
var Diff_01 = ee.List.sequence(0,
    // i = 0, n - 1
    annualmax.size().subtract(2)).map(
        function (xi) {
            // for each image xi subtract another xj. Applied for the external sum
            return ee.List.sequence(ee.Number(xi).add(1),
                    // j = i + 1, n
                    annualmax.size().subtract(1)).map(
                        function (xj) {
                          
                            // Applied for the internal sum where the signum function is computed
                            var diff_ij = ee.Array(annualmax.get(xi)).subtract(ee.Array(annualmax.get(xj)));
                            
                           
                            var diff = diff_ij.neq(0)
                            // replace positives and negatives with ones and -ones
                            return diff;
                        });
        });
        
print("Diff_01:")
print(Diff_01)

var Diff_10 = ee.List.sequence(0,
    // i = 0, n - 1
    annualmax.size().subtract(2)).map(
        function (xi) {
            // for each image xi subtract another xj. Applied for the external sum
            return ee.List.sequence(ee.Number(xi).add(1),
                    // j = i + 1, n
                    annualmax.size().subtract(1)).map(
                        function (xj) {
                          
                            // Applied for the internal sum where the signum function is computed
                            var diff_ij = ee.Array(annualmax.get(xi)).subtract(ee.Array(annualmax.get(xj)));
                            
                            var diff = diff_ij.eq(0)
                            // replace positives and negatives with ones and -ones
                            return diff;
                        });
        });
        
print("Diff_10:")
print(Diff_10)

print(ee.List(Diff_10.get(0)).get(0));

var coef_a = ee.Array(ee.List(Diff_10.get(0)).get(0)).add(
  ee.Array(ee.List(Diff_10.get(0)).get(1)).add(
    ee.Array(ee.List(Diff_10.get(0)).get(2))).add(
      ee.Array(ee.List(Diff_10.get(0)).get(3))));
      
      
var coef_a1 = coef_a.add(coef_a.neq(0));

var coef_a_ = ee
print(coef_a1);
var coef_a_ = coef_a1.eq(0);
print(coef_a_);

var coef_b = ee.Array(ee.List(Diff_10.get(1)).get(0)).multiply(
             ee.Array(ee.List(Diff_01.get(0)).get(1))).add(
             ee.Array(ee.List(Diff_10.get(1)).get(1)).multiply(
             ee.Array(ee.List(Diff_01.get(0)).get(2)))).add(
             ee.Array(ee.List(Diff_10.get(1)).get(2)).multiply(
             ee.Array(ee.List(Diff_01.get(0)).get(3))));
print(coef_b);
var coef_b1 = coef_b.add(coef_b.neq(0));
print(coef_b1);
var coef_b_ = coef_b1.eq(0);
print(coef_b_);

var coef_c = ee.Array(ee.List(Diff_10.get(2)).get(0)).multiply(
             ee.Array(ee.List(Diff_01.get(1)).get(1))).multiply(
             ee.Array(ee.List(Diff_01.get(0)).get(2))).add(
               ee.Array(ee.List(Diff_10.get(2)).get(1)).multiply(
               ee.Array(ee.List(Diff_01.get(1)).get(2))).multiply(
               ee.Array(ee.List(Diff_01.get(0)).get(3))));
print(coef_c);
var coef_c1 = coef_c.add(coef_c.neq(0));
print(coef_c1);
var coef_c_ = coef_c1.eq(0);
print(coef_c_);


var coef_d = ee.Array(ee.List(Diff_10.get(3)).get(0)).multiply(
             ee.Array(ee.List(Diff_01.get(2)).get(1))).multiply(
             ee.Array(ee.List(Diff_01.get(1)).get(2))).multiply(
               ee.Array(ee.List(Diff_01.get(0)).get(3)));
print("coef_d:")
print(coef_d);
var coef_d1 = coef_d.add(coef_d.neq(0));
print(coef_d1);
var coef_d_ = coef_d1.eq(0);
print(coef_d_);

var coef_e = coef_a1.add(coef_b1).add(coef_c1).add(coef_d1).subtract(5);
var coef_e1 = coef_e.neq(0) 
print("coef_e1:");
print(coef_e1);


var layer_a_f = coef_a1.add(coef_a_);
print(layer_a_f)

var layer_b = coef_b1.add(coef_a_.multiply(coef_b_))
print(layer_b)
var layer_b_tail = layer_b.eq(0);
print(layer_b_tail);
var layer_b_f = layer_b.add(layer_b_tail)

var layer_c = coef_c1.add(coef_a_.multiply(coef_b_).multiply(coef_c_))
print(layer_c)
var layer_c_tail = layer_c.eq(0);
print(layer_c_tail);
var layer_c_f = layer_c.add(layer_c_tail)

var layer_d = coef_d1.add(coef_a_.multiply(coef_b_).multiply(coef_c_).multiply(coef_d_));
print(layer_d)
var layer_d_tail = layer_d.eq(0);
print(layer_d_tail);
var layer_d_f = layer_d.add(layer_d_tail)

var layer_e = coef_e1;
print(layer_e)
var layer_e_tail = layer_e.eq(0);
var layer_e_f = layer_e.add(layer_e_tail)


var a_relvant = layer_a_f.multiply(layer_a_f.subtract(1)).multiply(layer_a_f.multiply(2).add(5));
var b_relvant = layer_b_f.multiply(layer_b_f.subtract(1)).multiply(layer_b_f.multiply(2).add(5));
var c_relvant = layer_c_f.multiply(layer_c_f.subtract(1)).multiply(layer_c_f.multiply(2).add(5));
var d_relvant = layer_d_f.multiply(layer_d_f.subtract(1)).multiply(layer_d_f.multiply(2).add(5));
var e_relvant = layer_e_f.multiply(layer_e_f.subtract(1)).multiply(layer_e_f.multiply(2).add(5));

var var_s =  ee.Array(5*(5-1)*(2*5+5)).subtract(a_relvant.add(b_relvant).add(c_relvant).add(d_relvant).add(e_relvant)).divide(18);

print("var_s");
//print(typeof(var_s ));
print(var_s);
print(ee.Array([[1, 2, 3]]).length());        
print(var_s.length());

print("array accumulation")
print(a.length());
//var sumArea = ee.Array([[],[]],ee.PixelType.double());
var sumArea = ee.Array(0);
//sumArea = sumArea.add(a);
print(sumArea.length());
print(sumArea);

//var sumArea = ee.Array([[],[]],ee.PixelType.double());
for (var i=0;i<2;i++)
{
  var filledSumAreai = a; // 26x1;
  print("filledSumAreai:");
  print(filledSumAreai);
  print(filledSumAreai.length());
  //sumArea = ee.Array.cat([sumArea,filledSumAreai],1);
  var sumArea = sumArea.add(filledSumAreai);
  print(sumArea)
}
print(sumArea);
print(sumArea.length());
// var sum = sumArea.accum(0,"mean");
print("sum:")
// print(sum)
