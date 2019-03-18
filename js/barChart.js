BarChart = function(_parentElement){
  this.parentElement = _parentElement;

  this.initVis();
};

BarChart.prototype.initVis = function(){
  let vis = this;

  vis.margin = { top: 10, right: 10, bottom: 150, left: 100 };

  vis.width = 900 - vis.margin.right - vis.margin.left;
  vis.height = 460 - vis.margin.top - vis.margin.bottom;

  vis.svg = d3.select(vis.parentElement)
    .append('svg')
    .attr('width', vis.width + vis.margin.right + vis.margin.left)
    .attr('height', vis.height + vis.margin.top + vis.margin.bottom);

  vis.g = vis.svg.append('g')
    .attr('transform', 'translate(' + vis.margin.left + ', ' + vis.margin.top + ')');

  // Tooltip
  vis.tip = d3.tip().attr('class', 'd3-tip')
    .html(function(d) {
      
      let quarter;

      if(d.date.includes('-01-')){
        quarter = 'Q1';
      }else if(d.date.includes('-04-')){
        quarter = 'Q2';
      }else if(d.date.includes('-07-')){
        quarter = 'Q3';
      }else{
        quarter = 'Q4';
      }

      let text = "<span style='color:white'>" + formatTooltipDate(parseDate(d.date)) + ' ' + quarter + "</span><br>";
      text += "<span style='color:white'>" + d3.format("$,.1f")(d.gdp) + ' Billion' + "</span><br>";
      return text;
  });

  vis.g.call(vis.tip);

  // X Label
  vis.g.append('text')
    .attr('class', 'x axis-label')
    .attr('x', vis.width / 2 + 225)
    .attr('y', vis.height + 50)
    .attr('font-size', '12px')
    .attr('text-anchor', 'middle')
    .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf');

  // Y Label
  vis.g.append('text')
    .attr('class', 'y axis-label')
    .attr('x', -(vis.height / 3))
    .attr('y', 30)
    .attr('font-size', '15px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Gross Domestic Product');

  vis.x = d3.scaleTime()
    .domain([parseDate(fromDate), parseDate(toDate)])
    .range([0, vis.width]);

  vis.y = d3.scaleLinear()
    .domain([0, d3.max(gdpData, (item) => {
      return item.gdp
    })])
    .range([vis.height, 0]);

  vis.xAxisCall = d3.axisBottom(vis.x);

  vis.g.append('g')
    .attr('class', 'x axis-bottom')
    .attr('transform', 'translate(0, ' + vis.height + ')')
    .call(vis.xAxisCall)
    .selectAll('text')
    .attr('text-anchor', 'middle');

  vis.yAxisCall = d3.axisLeft(vis.y);

  vis.g.append('g')
    .attr('class', 'y axis-left')
    .call(vis.yAxisCall);

  vis.g.selectAll('rect')
    .data(gdpData)
    .enter()
    .append('rect')
    .attr('x', function(d){
      return vis.x(parseDate(d.date));
    })
    .attr('y', function(d){
      return vis.y(d.gdp);
    })
    .attr('width', 3)
    .attr('height', function(d){
      return vis.height - vis.y(d.gdp);
    })
    .attr('fill', '#33adff')
    .on('mouseover', vis.tip.show)
    .on('mouseout', vis.tip.hide);
};