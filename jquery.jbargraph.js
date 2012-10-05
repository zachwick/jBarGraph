//Copyright (c) 2011 LectureTools Inc.
//
//Permission is hereby granted, free of charge, to any person obtaining a copy of
//this software and associated documentation files (the "Software"), to deal in
//the Software without restriction, including without limitation the rights to
//use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
//of the Software, and to permit persons to whom the Software is furnished to do
//so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
//WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
//CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


(function ($) {
		// An easy-to-use Array.max function
		// Simply returns the max value in the array
    Array.prototype.max = function() {
				var max=this[0];
				var len = this.length;
				for (var i=1;i<len;i++) {
						if (this[i] > max) {
								max = this[i];
            }
				}
				return max;
    };
    
		// An easy-to-use Array.min function
		// Simply returns the minimum value in the array
    Array.prototype.min = function() {
				var min = this[0];
				var len = this.length;
				for (var i=1;i<len;i++) {
						if (this[i] < min) {
								min = this[i];
            }
				}
				return min;
    };

    var labelArray = new Array();
    var dataLength = 0;
    var methods = {
				// Creates the HTML DOM elements and styles them
				init : function(options) {
						var options = $.extend({

								// Numbers to use as data to graph
								data:[],

								// Strings to use as labels for the graph data
								labels:[],

								// A string that determines whether the bars' labels should be
								// <u>text</u> only, <u>value</u> only, or <u>split</u> with the 
								// text label on the bottom of the bar and numerical value at the
								// top of the bar.
								labelStyle:'split',

								// A string that determines whether the label's size <u>scale</u> with
								// the size of the bars or if the labels are HTML title attributes that
								// show on <u>hover</u>.
								labelDisplay:'scale',

								// A string that determines if the labels on the bars appear on the
								// <u>outside</u> of the bars or <u>inside</u> them.
								labelPos:"inside",

								// A boolean value that if <u>truthy</u>, colors all bars that do not
								// correspond to values the <em>correct</em> option array one color, and
								// colors all other bars a second color.
								// If <em>colorByCorrect</em> is <u>falsey</u>, the bars are colored the
								// values in <em>colors</em> array
								colorByCorrect:false,

								// An array made up of a subset of the elements of the <em>labels</em> array
								// The bars corresponding to these labels will have a green box drawn around
								// them when the <b>showCorrect</b> method of the <b>bar_graph</b> object is
								// called.
								correct:[],

								// A string that determines if the bars have <u>fancy</u> rounded tops, or 
								// <u>plain</u> square tops.
								barStyle:'fancy', /* Other choices are 'plain' */

								// An array of hex values to use to color the bars. If there are more bars
								// than colors, then the colors are cycled through.
								// N.B. If <u>colorByCorrect</u> is <em>truthy</em>, then only the first two
								// elements of <u>color</u> are used.
								colors:['#00FF00','#0066FF','#E33B26','#38B0B3','#EC41FF','#2A8E00','#2549A3','#BB7F2C','#B3FF00'],

								// A string that determines if a <u>horizontal</u> or <u>vertical</u> bar graph
								// is to be made
								style:'horizontal', /* Other choices are 'vertical' */

								// A boolean value that determines if a vertical scale is to be drawn
								// N.B. <em>vAxis</em> will not behave as expected with a <u>horizontal</u>
								// <em>style</em>
								vAxis:false,
								
								// A number to use a common divisor of all vertical scale values.
								vAxisStepDivisor:5,

								// A number that determines how many vertical scale steps to use.
								vAxisSteps:10,

						}, options);

						// The <b>data</b> array and the <b>labels</b> array must be the same length
						if (options.data.length != options.labels.length) {
								return;
						} else {
								dataLength = options.data.length;
								labelArray = options.labels;
						}

						// Here we are matching up keys in the <b>correct</b> array and the <b>labels</b> array
						// TODO: I am sure that this could be more efficiently done
						var correctArray = new Array();
						for (var i=0;i<options.labels.length;i++) {
								for (var o=0;o<options.correct.length;o++) {
										if (options.correct[o] == options.labels[i]) {
												correctArray[i] = options.correct[o];
										}
								}
						}

						// Some useful values for styling the bars of the graph
						var percentArray = new Array();
						var dataMax = options.data.max();
						
						// Horizontal bar graph construction
						if (options.style == 'horizontal') {

								// Calculating the values to graph as a percentage of the largest value.
								// This makes it much easier to graph the values, since the largest value
								// can be used as a control of sorts.
								for (var i=0;i<options.data.length;i++) {
										percentArray[i] = (options.data[i] / dataMax) * $(this).width();
								}

								var barH = ($(this).height() / options.data.length -5);
								for (var i=0;i<options.data.length;i++) {
										// Constructing the DOM for each bar
										$(this).append("<div class='hbar-chart-bar' id='hbar-"+i+"'></div>");
										$(this).children("#hbar-"+i).width(percentArray[i]);
										$(this).children("#hbar-"+i).height(barH);
										
										// Coloring the bar
										if (options.colorByCorrect == true) {
												if (i in correctArray) {
														$(this).children("#hbar-"+i).css('background-color',options.colors[0]);
												} else {
														$(this).children("#hbar-"+i).css('background-color',options.colors[1]);
												}
										} else {
												$(this).children("#hbar-"+i).css('background-color',options.colors[i % options.colors.length]);
										}

										// Styling the top of the bar
										if (options.barStyle == 'fancy') {
												$(this).children("#hbar-"+i).css("border-top-right-radius",barH/4);
												$(this).children("#hbar-"+i).css("border-bottom-right-radius",barH/4);
										}
										
										// Creating and styling the label
										if (options.labelStyle == 'text') {
												if (options.labelDisplay == 'static') {
														$(this).children("#hbar-"+i).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.labels[i]+"</div>");
												} else if (options.labelDisplay == 'hover') {
														$(this).children("#hbar-"+i).attr('title',options.labels[i]);
												} else if (options.labelDisplay == 'scale') {
														$(this).children("#hbar-"+i).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.labels[i]+"</div>");
														$(this).children("#hbar-"+i).children("#hlabel-"+i).css('font-size',$(this).children("#hbar-"+i).height()/3);
												} else {
														console.log("labelDisplay with value '"+options.labelDisplay+"' is meaningless");
												}
										} else if (options.labelStyle == 'value') {
												if (options.labelDisplay == 'static') {
														$(this).children("#hbar-"+i).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.data[i]+"</div>"); 
												} else if (options.labelDisplay == 'hover') {
														$(this).children("#hbar-"+i).attr('title',options.data[i]);
												} else if (options.labelDisplay == 'scale') {
														$(this).children("#hbar-"+i).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.data[i]+"</div>");
														$(this).children("#hbar-"+i).children("#hlabel-"+i).css('font-size',jQuery(this).children("#hbar-"+i).height()/3);
												} else {
														console.log("labelDisplay with value '"+options.labelDisplay+"' is meaningless");
												}
										} else if (options.labelStyle == 'full') {
												if (options.labelDisplay == 'static') {
														$(this).children("#hbar-"+i).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.labels[i]+" ("+options.data[i]+")</div>");
												} else if (options.labelDisplay == 'hover') {
														$(this).children("#hbar-"+i).attr('title',options.labels[i]+" ("+options.data[i]+")");
												} else if (options.labelDisplay == 'scale') {
														$(this).children("#hbar-"+i).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.labels[i]+" ("+options.data[i]+")</div>");
														$(this).children("#hbar-"+i).children("#hlabel-"+i).css('font-size',$(this).children("#hbar-"+i).height()/3);
												} else { 
														console.log("labelDisplay with value '"+options.labelDisplay+"' is meaningless");
												}
										} else {
												// Throw an error if <b>labelStyle</b> is set to an supported value.
												console.log("labelStyle with value '"+options.labelStyle+"' is meaningless");
										}
								}
						// Vertical bar graph creation
						} else if (options.style == "vertical") {
								// A graph with all 0 data is pretty boring... (also, it breaks some CSS)
								if (dataMax == 0) {
										$(this).append("<div class='no-data-span'>No data to display</div>");
								} else {
										// The horizontal offset of the bars in order to make room for the labels
										var barHOffset = 0;
										
										// The width of each bar
										var barW = options.vAxis ? ($(this).width() / (options.data.length + 2)) -5 : ($(this).width() / options.data.length - 15); // 5 for margin-left 

										// Calculating each data point as a percentage of the largest data point
										for (var i=0;i<options.data.length;i++) {
												percentArray[i] = (options.data[i] / dataMax) * $(this).height();
										}

										// This value is used in calculating the barHOffset variable
										var dataMaxDisplayHeight = percentArray.max();

										// Creating the vertical axis (if <b>vAxis</b> is <em>truthy</em>)
										if (options.vAxis) {
												
												// If all of the data is less than 5, only use 5 steps in the vertical scale
												if (dataMax <= 5) {
														options.vAxisSteps = 5;
												}
												
												// If the largest data point is a multiple of the common divisor of each scale division,
												// then use the largest data point as 100%. Otherwise, use a value <em>vAxisMax</em> as 100%
												// that is greater than the largest data point to graph and a multiple of <b>vAxisStepDivisor</b>
												if (dataMax % options.vAxisStepDivisor == 0) {
														var vAxisMax = dataMax;
												} else {
														var vAxisMax = dataMax + options.vAxisStepDivisor - (dataMax % options.vAxisStepDivisor);
												}

												// Calculate each data point as a percent of the value that we are using as 100% from above
												for (var i=0;i<options.data.length;i++) {
														percentArray[i] = (options.data[i] / vAxisMax) * $(this).height() | 0;
												}    

												// Recalculate the horizontal offset of the bars to take into consideration that the largest bar
												// might not be 100% of the height of the graph.
												barHOffset = Math.floor(percentArray.max()-dataMaxDisplayHeight);

												// Calculate to numbers to use (and display) for the vertical scale divisions
												var vStepSizeNumber = vAxisMax / (options.vAxisSteps);

												// Calculate the pixel value of each vertical axis step
												if (options.labelPos == "inside") {
														var vStepSizePixels = Math.round($(this).height() / (options.vAxisSteps));
												} else {
														if (options.labelStyle != "split") {
																var vStepSizePixels = Math.round(($(this).height() - (barW/4)) / (options.vAxisSteps));
														} else {
																var vStepSizePixels = Math.round(($(this).height() - (barW/2)) / (options.vAxisSteps));
														}
												}

												var vAxisLinePos = [];
												var vAxisLineValue = [];

												// Create the DOM tree for each vertical axis division line
												for (var i=0;i<=options.vAxisSteps;i++) {
														vAxisLinePos[i] = i * vStepSizePixels;
														vAxisLineValue[i] = parseInt(vAxisMax - (i * vStepSizeNumber));
														$(this).append("<hr class='vAxis-line' id='vAxis-line-"+i+"' />");
														$(this).children("#vAxis-line-"+i).width($(this).width());
														$(this).append("<div class='vAxis-line-label' id='vAxis-line-label-"+i+"'>"+vAxisLineValue[i]+"</div>");
														$(this).children("#vAxis-line-label-"+i).width($(this).width() - 2);
														if ((options.labelPos != "outside") && (i==options.vAxisSteps)) {
																$(this).children("#vAxis-line-"+i).hide();
																$(this).children("#vAxis-line-label-"+i).hide();
														}
												}
										}
										
										// Create the DOM tree for each bar
										for (var i=0;i<options.data.length;i++) {
												$(this).append("<div class='vbar-chart-correct-bar-wrapper' id='correct-wrapper-"+i+"'></div>");
												$(this).children("#correct-wrapper-"+i).width(barW + 8);
												$(this).children("#correct-wrapper-"+i).append("<div class='vbar-chart-bar' id='vbar-"+i+"'></div>");
												var currentBar = $(this).children("#correct-wrapper-"+i).children("#vbar-"+i);
												currentBar.width(barW);
												currentBar.height(percentArray[i]);
												
												// Color the bar
												if (options.colorByCorrect == true) {
														if (i in correctArray) {
																currentBar.css('background-color',options.colors[0]);
														} else {
																currentBar.css('background-color',options.colors[1]);
														}
												} else {
														currentBar.css('background-color',options.colors[i % options.colors.length]);
														if (i in correctArray) {
																currentBar.attr("correct",true);
														}
												}
												
												// Set the height of a bar of 0 value so that the labels still 'look right.'
												if (currentBar.height() == 0) {
														currentBar.height(barW*.5);
														currentBar.css('background-color','');
												}

												// Style the top of the bar
												if (options.barStyle == 'fancy') {
														currentBar.css("border-top-left-radius",barW/4);
														currentBar.css("border-top-right-radius",barW/4);
												}
												
												// Create, place, and style each bar's label
												if (options.labelStyle == 'text') {
														if (options.labelDisplay == 'static') {
																currentBar.append("<div class='vbar-chart-bar-label' id='vlabel-"+i+"'>"+options.labels[i]+"<div>");
														} else if (options.labelDisplay == 'hover') {
																currentBar.attr('title',options.labels[i]);
														} else if (options.labelDisplay == 'scale') {
																currentBar.append("<div class='vbar-chart-bar-label' id='vlabel-"+i+"'>"+options.labels[i]+"<div>");
																currentBar.children("#vlabel-"+i).css('font-size',currentBar.width()/4);
																if (options.labelPos == 'outside') {
																		currentBar.height(percentArray[i] - currentBar.width()/4);
																		currentBar.children("#vlabel-"+i).css('bottom',-1*(currentBar.children("#vlabel-"+i).height()-2));
																}
														} else {
																console.log("labelDisplay with value '"+options.labelDisplay+"' is meaningless");
														}
												} else if (options.labelStyle == 'value') {
														if (options.labelDisplay == 'static') {
																currentBar.append("<div class='vbar-chart-bar-label' id='vlabel-"+i+"'>"+options.data[i]+"<div>");
														} else if (options.labelDisplay == 'hover') {
																currentBar.attr('title',options.data[i]);
														} else if (options.labelDisplay == 'scale') {
																currentBar.append("<div class='vbar-chart-bar-label' id='vlabel-"+i+"'>"+options.data[i]+"<div>");
																currentBar.children("#vlabel-"+i).css('font-size',currentBar.width()/4);
																if (options.labelPos == 'outside') {
																		currentBar.height(percentArray[i] -currentBar.width()/4);
																		currentBar.children("#vlabel-"+i).css('bottom',-1*(currentBar.children("#vlabel-"+i).height()-2));
																}
														} else {
																console.log("labelDisplay with value '"+options.labelDisplay+"' is meaningless");
														}
												} else if (options.labelStyle == 'full') {
														if (options.labelDisplay == 'static') {
																currentBar.append("<div class='vbar-chart-bar-label' id='vlabel-"+i+"'>"+options.labels[i]+" ("+options.data[i]+")<div>");
														} else if (options.labelDisplay == 'hover') {
																currentBar.attr('title',options.labels[i]+" ("+options.data[i]+")");
														} else if (options.labelDisplay == 'scale') {
																currentBar.append("<div class='vbar-chart-bar-label' id='vlabel-"+i+"'>"+options.labels[i]+" ("+options.data[i]+")<div>");
																currentBar.children("#vlabel-"+i).css('font-size',currentBar.width()/4);
																if (options.labelPos == 'outside') {
																		currentBar.height(percentArray[i] - currentBar.width()/4);
																		currentBar.children("#vlabel-"+i).css('bottom',-1*(currentBar.children("#vlabel-"+i).height()-2));
																}
														} else {
																console.log("labelDisplay with value '"+options.labelDisplay+"' is meaningless");
														}
														
												}  else if (options.labelStyle == "split") {
														currentBar.append("<div class='vbar-chart-bottom-label' id='vblabel-"+i+"'>"+options.labels[i]+"</div>");
														currentBar.append("<div class='vbar-chart-top-label' id='vtlabel-"+i+"'>"+options.data[i]+"</div>");
														currentBar.children("#vblabel-"+i).css('font-size',currentBar.width()/4);
														currentBar.children("#vtlabel-"+i).css('font-size',currentBar.width()/4);
														if (options.labelPos == "outside") {
																currentBar.height(percentArray[i] - currentBar.width()/2);
																currentBar.children("#vblabel-"+i).css('bottom',-1*(currentBar.children("#vblabel-"+i).height()-2));
																currentBar.children("#vtlabel-"+i).css('top',-1*(currentBar.children("#vtlabel-"+i).height()-2));
																barHOffset = -1*($(this).children("#vbar-"+i).children("#vtlabel-"+i).height()-2);
														} else if (options.labelPos == "inside") {
																if (currentBar.height() < barW) {
																		if ($("#vtlabel-"+i).length != 0) {
																				$("#vtlabel-"+i).css("top",-1 * barW/2);
																		} else {
																				$("#vlabel-"+i).css("top",-1 * barW/2);
																		}
																} else {
																		currentBar.children("#vblabel-"+i).css('bottom',3);
																		currentBar.children("#vtlabel-"+i).css('top',3);
																}
														}
												} else {
														console.log("labelStyle with value'"+options.labelStyle+"' is meaningless");
												}
												currentBar.parent().css("bottom",barHOffset);
										}
										if (options.vAxis) {
												// Position each vertical scale divider line
												var barBottom = $(this).children("#correct-wrapper-0").children("#vbar-0").css("bottom");
												barBottom = parseInt(barBottom.substring(0,barBottom.length - 2));
												for (var i=0;i<=options.vAxisSteps;i++) {
														$(this).children("#vAxis-line-"+i).css("top",vAxisLinePos[i]);
														if (options.labelStyle != "split") {
																var fontSize = $(this).children("#correct-wrapper-0").children("#vbar-0").children("#vlabel-0").css("font-size");
														} else {
																var fontSize = $(this).children("#correct-wrapper-0").children("#vbar-0").children("#vtlabel-0").css("font-size");
														}
														fontSize = parseInt(fontSize.substring(0,fontSize.length -2 ));
														$(this).children("#vAxis-line-label-"+i).css("top",vAxisLinePos[i] + fontSize);
														$(this).children("#vAxis-line-label-"+i).css("font-size",fontSize*1.5);
												}
										}	    
								}
						} 
				},
				
				// Hide the bar_graph object
				hide : function() {
						$(this).hide();
				},

				// Show a box around each bar that corresponds to a correct key
				showCorrect : function() {
						$(".vbar-chart-bar").each(function() {
								if ($(this).attr("correct") == "true") {
										$(this).parent().css("border","solid 2px #01CC01").css("background-color","#B6EDA8");
								}
						});
				},

				// Hide the box around each bar that corresponds to a correct key
				hideCorrect: function() {
						$(".vbar-chart-bar").each(function() {
								if ($(this).attr("correct") == "true") {
										$(this).parent().css("border","none").css("background-color","white");
								}
						});
				},
				
				// Draw a box around an arbitrary bar or set of bars
				markChoice:function(keyToMark) {
						var barIndex = labelArray.indexOf(keyToMark);
						$(this).children("#correct-wrapper-"+barIndex).css("border","solid 2px #45B3FF");
						$(this).children("#correct-wrapper-"+barIndex).css("background-color","#AED1E9");
				}
    };

    $.fn.bar_graph =  function(method) {
				if (methods[method]) {
						return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
				} else if (typeof method === 'object' || !method) {
						return methods.init.apply(this,arguments);
				} else {
						$.error("Method " + method + " does not exist on jQuery.bar_graph");
				}
    };

})(jQuery);

