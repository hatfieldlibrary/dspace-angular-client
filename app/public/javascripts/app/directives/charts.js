/**
 * D3 chart directives for dashboard overview.
 */
(function () {

  'use strict';

  /*globals taggerDirectives*/
  /*jshint quotmark: false */

  /**
   * This comparison function looks for inequality in
   * the inputs and returns true if found.  The input
   * values can be arrays or objects.  If the inputs are
   * two arrays of equal length, the objects within the two
   * arrays are compared.
   * @param newValue first array or object.
   * @param oldValue  second array or object.
   * @returns {boolean}  true if the two inputs are NOT equal.
   */
  function checkForNewValues(newValue, oldValue) {

    var oldValueIsArray = (oldValue instanceof Array);
    var newValueIsArray = (newValue instanceof Array);

    // If the newValue is null, return false and do no further
    // comparison.
    if (newValue === null) {
      return false;
    }

    // New value is an array.
    if (newValueIsArray) {

      // But the old value is not an array.
      if (!oldValueIsArray) {

        // The oldValue is null, so return inequality.
        if (oldValue === null) {
          return true;
        }
        // This should be unreachable, but if it is reached, log it.
        console.log("Something is amiss in the comparison for d3 pie charts");
      }

      // The oldValue is an array, but the two array lengths are not equal.
      if (newValue.length !== oldValue.length) {

        // The array lengths do not match, so return inequality.
        return true;

      } else {
        // Two arrays of equal length. Evaluate the array of objects.
        // Return return inequality if anything does not match.
        for (var i = 0; i < newValue.length; i++) {
          if (newValue[i].title !== oldValue[i].title || newValue[i].value !== oldValue[i].value) {
            return true;
          }
        }
      }

      // The newValue is an object, not an array.
    } else {
      // But the oldValue is an array, so return inequality.
      if (oldValueIsArray) {
        return true;
      }
      // Otherwise, compare the contents of two objects and return inequality
      // if they do not match.
      return (newValue.title !== oldValue.title && newValue.value !== oldValue.value);

    }

  }


  taggerDirectives.directive('d3Bar', [

    '$window',
    '$timeout',
    'd3Service',

    /*globals d3*/
    /* jshint unused:false */

    function ($window, $timeout, d3Service) {
      return {
        restrict: 'A',
        template: '',
        // creating scope object isolates
        scope: {
          data: '='      // bi-directional binding of data

        },
        // Angular link function
        link: function (scope, ele, attrs) {

          var margin,
            width,
            height,
            container,
            svg,
            xAxis,
            yAxis,
            x,
            y;


          // initialize on data change
          scope.$watch(function (scope) {
              return scope.data;
            },
            function (newValue) {

              if (newValue !== undefined) {
                if (newValue.length > 0) {
                  //scope.data;
                  ele.ready(function () {
                    prepareContainer();
                    setDimens();
                  });
                } else {
                  prepareContainer();
                }
              }
            });

          var containerEl = document.getElementById(attrs.id);

          /**
           * Clear the chart.  This will be called when an empty
           * data array is passed to the directive.
           */
          function prepareContainer() {
            if (svg !== undefined) {
              svg = container.select('svg');
              svg.selectAll('g').remove();
              svg.select('circle').remove();
              containerEl.innerHTML = '';
            }
          }


          var setDimens = function () {


            margin = {top: 20, right: 20, bottom: 30, left: 40};

            width = (containerEl.offsetWidth - margin.left - margin.right);

            height = (containerEl.offsetHeight - margin.top - margin.bottom);

            x = d3.scale.ordinal()
              .rangeRoundBands([0, width], 0.1);

            y = d3.scale.linear()
              .range([height, 0]);

            xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");

            /**
             * The top level d3 node.
             * @type {Object}
             */
            container = d3.select(containerEl);


            svg = container.append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            drawBarChart(scope.data);
          };


          // d3.tsv("data.tsv", type, function(error, data) {
          //   if (error) throw error;
          var drawBarChart = function (data) {

            yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .ticks(10)
              .tickFormat(d3.format("d"))
              .tickSubdivide(0);

            x.domain(data.map(function (d) {
              return d.name;
            }));
            y.domain([0, d3.max(data, function (d) {
              return d.count;
            })]);

            svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

            svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Frequency");

            svg.selectAll(".bar")
              .data(data)
              .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function (d) {
                return x(d.name);
              })
              .attr("width", x.rangeBand())
              .attr("y", function (d) {
                return y(d.count);
              })
              .attr("height", function (d) {
                return height - y(d.count);
              });
          };

          // });

          function type(d) {
            d.frequency = +d.frequency;
            return d;
          }
        }
      };
    }
  ]);

  /**
   * Pie chart directive.
   */
  taggerDirectives.directive('d3Pie', [
    '$window',
    '$timeout',
    'd3Service',
    function ($window, $timeout, d3Service) {

      return {
        // attribute only
        restrict: 'A',
        template: '<svg id="{{label}}" style="overflow: visible;"> ' +
        '           <defs> ' +
        '             <filter id=\'pieChartInsetShadow\'> ' +
        '              <feOffset dx=\'0\' dy=\'0\'/> ' +
        '                 <feGaussianBlur stdDeviation=\'3\' result=\'offset-blur\' /> ' +
        '                 <feComposite operator=\'out\' in=\'SourceGraphic\' in2=\'offset-blur\' result=\'inverse\' /> ' +
        '                 <feFlood flood-color=\'black\' flood-opacity=\'1\' result=\'color\' />  ' +
        '                 <feComposite operator=\'in\' in=\'color\' in2=\'inverse\' result=\'shadow\' /> ' +
        '                 <feComposite operator=\'over\' in=\'shadow\' in2=\'SourceGraphic\' />  ' +
        '             </filter> ' +
        '             <filter id="pieChartDropShadow"> ' +
        '               <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" /> ' +
        '                 <feOffset in="blur" dx="0" dy="3" result="offsetBlur" /> ' +
        '                 <feMerge> <feMergeNode /> ' +
        '                 <feMergeNode in="SourceGraphic" /> </feMerge> ' +
        '             </filter> ' +
        '           </defs> ' +
        '         </svg>' +
        '         <div class="chart-data"></div>',
        // creating scope object isolates
        scope: {
          data: '=',      // bi-directional binding of data
          label: '@'
        },
        // Angular link function
        link: function (scope, ele, attrs) {

          var data = [];
          var DURATION = 800;
          var DELAY = 200;

          /**
           * Array of colors used by class attributes.
           * @type {Array<string> }*/
          var colors = ['seagreen', 'blue', 'skyblue', 'red', 'indigo', 'yellow', 'orange', 'green', 'maroon', 'coffee'];
          /**
           * The parent element
           * @type {Element}
           */
          var containerEl = document.getElementById(attrs.id),
            /**
             * The top level d3 node.
             * @type {Object}
             */
            container = d3.select(containerEl),
            labelsEl = container.select('.chart-data');

          /**
           * Calculates percentage from integer counts
           * @param values   count by type
           * @param total     count of all types
           * @returns {Array}
           */
          function ratios(values, total) {

            var data = [];
            for (var i = 0; i < values.length; i++) {
              data[i] = {
                title: values[i].title,
                value: values[i].value / total,
                count: values[i].value
              };
            }

            return data;
          }

          /**
           * Return the color name from the colors array.
           * @param i  the index of the array element
           * @returns {string}
           */
          function colorWheel(i) {
            return colors[i];
          }


          // waiting for the d3 object promise
          d3Service.d3().then(function (d3) {

            var total = 0;

            // initialize on data change
            scope.$watch(function (scope) {
                return scope.data;
              },
              function (newValue, oldValue) {
                if (newValue !== oldValue) {
                  if (newValue !== undefined && oldValue !== undefined) {
                    if (newValue.data !== undefined) {
                      if (checkForNewValues(newValue.data, oldValue.data)) {
                        if (newValue.data.length > 0) {
                          total = newValue.total;
                          // calculate percentages
                          data = ratios(newValue.data, total);
                          // Make sure element is ready
                          ele.ready(function () {
                            clearChart();
                            drawPieChart();
                          });
                        } else {
                          clearChart();
                        }
                      }
                    }
                  }
                }
              });


            // d3 code begins here.

            /**
             * Clear the chart.  This will be called when an empty
             * data array is passed to the directive.
             */
            function clearChart() {

              var svg = container.select('svg');
              svg.selectAll('g').remove();
              svg.select('circle').remove();
              labelsEl.selectAll('.item-info').remove();
            }


            /**
             * Draws the pie chart
             */
            function drawPieChart() {

              var width = containerEl.clientWidth / 2,
                height = width * 0.8,
                radius = Math.min(width, height) / 2,
                svg = container.select('svg')
                  .attr('width', width)
                  .attr('height', height);
              var pie = svg.append('g')
                .attr(
                  'transform',
                  'translate(' + width / 2 + ',' + height / 2 + ')'
                );

              var detailedInfo = svg.append('g')
                .attr('class', 'pieChart--detailedInformation');

              var twoPi = 2 * Math.PI;
              var pieData = d3.layout.pie()
                .value(function (d) {
                  return d.value;
                });

              var arc = d3.svg.arc()
                .outerRadius(radius - 10)
                .innerRadius(0);


              var pieChartPieces = pie.datum(data)
                .selectAll('path')
                .data(pieData)
                .enter()
                .append('path')
                .attr('class', function (d, i) {
                  return 'pieChart__' + colorWheel(i);
                })
                .attr('filter', 'url(#pieChartInsetShadow)')
                .attr('d', arc)
                .each(function () {
                  this._current = {
                    startAngle: 0,
                    endAngle: 0
                  };
                })
                .transition()
                .duration(DURATION)
                .attrTween('d', function (d) {
                  var interpolate = d3.interpolate(this._current, d);
                  this._current = interpolate(0);

                  return function (t) {
                    return arc(interpolate(t));
                  };
                })
                .each('end', function handleAnimationEnd(d) {
                  drawDetailedInformation(d.data, labelsEl);
                });

              function drawChartCenter() {
                var centerContainer = pie.append('g')
                  .attr('class', 'pieChart--center');

                centerContainer.append('circle')
                  .attr('class', 'pieChart--center--outerCircle')
                  .attr('r', 0)
                  .attr('filter', 'url(#pieChartDropShadow)')
                  .transition()
                  .duration(DURATION)
                  .delay(DELAY)
                  .attr('r', radius - 52);

                centerContainer.append('circle')
                  .attr('id', 'pieChart-clippy')
                  .attr('class', 'pieChart--center--innerCircle')
                  .attr('r', 0)
                  .transition()
                  .delay(DELAY)
                  .duration(DURATION)
                  .attr('r', radius - 65)
                  .attr('fill', '#fff');
              }

              drawChartCenter();

              /**
               * This counter variable provides the index
               * used to request colors.
               * @type {number}
               */
              var currentColor = 0;

              /**
               * Adds color key, title, and count information for a single item to the DOM.
               * @param @type {Object} the item information
               * @param element the parent element
               */
              function drawDetailedInformation(data, element) {

                var listItem = element.append('div').attr('class', 'item-info');
                if (data.title === null) {
                  data.title = '<span style="color: red;">No value selected</span>';
                }
                listItem.data([data])
                  .html(
                    '       <div style="float:left;width: 10%;" class="pieChart__' + colorWheel(currentColor) + '">' +
                    '          <i class="material-icons">brightness_1</i>' +
                    '       </div>' +
                    '       <div style="float:left; width:75%;padding-left: 20px;color: #999;">' +
                    data.title + ' (' + data.count + ')' +
                    '       </div>' +
                    '       <div style="clear:left;"></div>');
                currentColor++;

              }
            }
          });
        }
      };

    }]);

})();
