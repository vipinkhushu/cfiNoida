var lost = {
  x: ['India', 'UK', 'Russia', 'Belarus'],
  y: [20, 14, 23, 24],
  name: 'Lost',
  type: 'bar'
};

var found = {
   x: ['India', 'UK', 'Russia', 'Belarus'],
  y: [12, 18, 29, 19],
  name: 'Found',
  type: 'bar'
};

var data = [lost, found];

var layout = {barmode: 'stack'};

Plotly.newPlot('location', data, layout);