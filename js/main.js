let fromDate;
let toDate;
let gdpData;
let barChart;
let parseDate = d3.timeParse('%Y-%m-%d');
let formatTooltipDate = d3.timeFormat('%Y');

d3.json('data/us_gdp.json').then((data) => {

  fromDate = data['from_date'];
  toDate = data['to_date'];
  gdpData = data['data'];
  gdpData = gdpData.map((arr) => {
    return {
      date: arr[0],
      gdp: arr[1]
    };
  });

  barChart = new BarChart('#chart-area');

}).catch(error => console.log(error));