/* 
monthly mean of multiple years;
Help Necolas who is from QQ group
*/

var dataCollection2013 = ee.ImageCollection('JRC/GSW1_1/MonthlyHistory')
    .filterDate('2013-12-01');
var dataCollection2014 = ee.ImageCollection('JRC/GSW1_1/MonthlyHistory')
    .filterDate('2014-12-01');
var dataCollection2015 = ee.ImageCollection('JRC/GSW1_1/MonthlyHistory')
    .filterDate('2015-12-01');
    
var dataCollection = ee.ImageCollection('JRC/GSW1_1/MonthlyHistory')
    .filterDate('2013-01-01', '2015-01-01');
    
print('original data',dataCollection);  

var monthlymean = ee.List.sequence(1, 12).map(
    function (month) {
        // map the time series into monthly means
        return ee.ImageCollection(
            ee.List.sequence(2013, 2018).map(
                function (year) {
                    var date = ee.Date.fromYMD(year, month, 1);
                    var monthMeanImage = dataCollection
                        .filterDate(date, date.advance(1, 'month'))
                        .first()
         
                    return monthMeanImage;
                })).mean()
    });
                
print('monthly mean',monthlymean)  
var visualization = {
  bands: ['water'],
  min: 0.0,
  max: 2.0,
  palette: ['ffffff', 'fffcb8', '0905ff']
};
 
Map.addLayer(dataCollection2013,visualization,'2013');
Map.addLayer(dataCollection2014,visualization,'2014');
Map.addLayer(dataCollection2015,visualization,'2015');
Map.addLayer(ee.Image(monthlymean.get(11)),visualization,'resultDec');
 
var date1 = ee.Date.fromYMD(2018, 12, 1) 
var date2 = date1.advance(1, 'month') 
print(date1) 
print(date2)                 
