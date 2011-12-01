/*
Copyright (c) 2011 LectureTools Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

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

jQuery.fn.bar_graph = function(options) {
    var options = jQuery.extend({
        data:[],
        labels:[],
	labelStyle:'split', /*Other choices are 'text','value','split' */
	labelDisplay:'scale', /*Other choices are 'hover','scale' */
	labelPos:"inside", /*Other choices are 'outside' */
	colorByCorrect:false,
	correct:[],
	barStyle:'fancy', /* Other choices are 'plain' */
	colors:['#00FF00','#0066FF','#E33B26','#38B0B3','#EC41FF','#2A8E00','#2549A3','#BB7F2C','#B3FF00'],
        style:'horizontal', /* Other choices are 'vertical' */
	vAxis:false,
	vAxisStepDivisor:5,
	vAxisSteps:10,
    },
    options);
    if (options.data.length != options.labels.length) {
	return;
    }
/*    if (options.labelStyle == "split") {
	options.labelPos = "outside";
    }
*/
    var correctArray = new Array();
    for (var i=0;i<options.labels.length;i++) {
	for (var o=0;o<options.correct.length;o++) {
	    if (options.correct[o] == options.labels[i]) {
		correctArray[i] = options.correct[o];
	    }
	}
    }
    var percentArray = new Array();
    var dataMax = options.data.max();

    if (options.style == 'horizontal') {
        for (var i=0;i<options.data.length;i++) {
            percentArray[i] = (options.data[i] / dataMax) * jQuery(this).width();
        }
	var barH = (jQuery(this).height() / options.data.length -5);
        for (var i=0;i<options.data.length;i++) {
	    jQuery(this).append("<div class='hbar-chart-bar' id='hbar-"+i+"'></div>");
            jQuery(this).children("#hbar-"+i).width(percentArray[i]);
            jQuery(this).children("#hbar-"+i).height(barH);
	    if (options.colorByCorrect == true) {
		if (i in correctArray) {
		    jQuery(this).children("#hbar-"+i).css('background-color',options.colors[0]);
		} else {
		    jQuery(this).children("#hbar-"+i).css('background-color',options.colors[1]);
		}
	    } else {
		jQuery(this).children("#hbar-"+i).css('background-color',options.colors[i % options.colors.length]);
	    }
	    if (options.barStyle == 'fancy') {
		jQuery(this).children("#hbar-"+i).css("border-top-right-radius",barH/4);
		jQuery(this).children("#hbar-"+i).css("border-bottom-right-radius",barH/4);
	    }

	    if (options.labelStyle == 'text') {
		if (options.labelDisplay == 'static') {
		    jQuery(this).children("#hbar-"+i).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.labels[i]+"</div>");
		} else if (options.labelDisplay == 'hover') {
	            jQuery(this).children("#hbar-"+i).attr('title',options.labels[i]);
		} else if (options.labelDisplay == 'scale') {
		    jQuery(this).children("#hbar-"+i).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.labels[i]+"</div>");
		    jQuery(this).children("#hbar-"+i).children("#hlabel-"+i).css('font-size',jQuery(this).children("#hbar-"+i).height()/3);
		} else {
			console.log("labelDisplay with value '"+options.labelDisplay+"' is meaningless");
		}
	    } else if (options.labelStyle == 'value') {
		if (options.labelDisplay == 'static') {
		    jQuery(this).children("#hbar-"+i).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.data[i]+"</div>"); 
		} else if (options.labelDisplay == 'hover') {
		    jQuery(this).children("#hbar-"+i).attr('title',options.data[i]);
		} else if (options.labelDisplay == 'scale') {
		    jQuery(this).children("#hbar-"+i).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.data[i]+"</div>");
		    jQuery(this).children("#hbar-"+i).children("#hlabel-"+i).css('font-size',jQuery(this).children("#hbar-"+i).height()/3);
		} else {
			console.log("labelDisplay with value '"+options.labelDisplay+"' is meaningless");
		}
	    } else if (options.labelStyle == 'full') {
		if (options.labelDisplay == 'static') {
		    jQuery(this).children("#hbar-"+i).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.labels[i]+" ("+options.data[i]+")</div>");
		} else if (options.labelDisplay == 'hover') {
		    jQuery(this).children("#hbar-"+i).attr('title',options.labels[i]+" ("+options.data[i]+")");
		} else if (options.labelDisplay == 'scale') {
		    jQuery(this).children("#hbar-"+i).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.labels[i]+" ("+options.data[i]+")</div>");
		    jQuery(this).children("#hbar-"+i).children("#hlabel-"+i).css('font-size',jQuery(this).children("#hbar-"+i).height()/3);
		} else { 
			console.log("labelDisplay with value '"+options.labelDisplay+"' is meaningless");
		}
	    } else {
		console.log("labelStyle with value '"+options.labelStyle+"' is meaningless");
	    }
        }
    } else if (options.style == "vertical") {
	var barHOffset = 0;
	var barW = options.vAxis ? (jQuery(this).width() / (options.data.length + 2))  : (jQuery(this).width() / options.data.length - 5); // 5 for margin-left 
	console.log("barW = "+barW);
        for (var i=0;i<options.data.length;i++) {
            percentArray[i] = (options.data[i] / dataMax) * jQuery(this).height();
        }
	var dataMaxDisplayHeight = percentArray.max();
	if (options.vAxis) {
	    if (dataMax % options.vAxisStepDivisor == 0) {
		var vAxisMax = dataMax;
	    } else {
		var vAxisMax = dataMax + options.vAxisStepDivisor - (dataMax % options.vAxisStepDivisor);
	    }
            for (var i=0;i<options.data.length;i++) {
		percentArray[i] = (options.data[i] / vAxisMax) * jQuery(this).height();
            }    
	    barHOffset = Math.floor(percentArray.max()-dataMaxDisplayHeight);
	    var vStepSizeNumber = vAxisMax / (options.vAxisSteps);
	    if (options.labelPos == "inside") {
		var vStepSizePixels = Math.round(jQuery(this).height() / (options.vAxisSteps));
	    } else {
		var vStepSizePixels = Math.round((jQuery(this).height() - (barW/2) ) / (options.vAxisSteps));
	    }
	    var vAxisLinePos = [];
	    var vAxisLineValue = [];
	    for (var i=0;i<=options.vAxisSteps;i++) {
		if (options.labelStyle == "inside") {
		    vAxisLinePos[i] = i * vStepSizePixels;
		} else {
		    vAxisLinePos[i] = i * vStepSizePixels;
		}
		vAxisLineValue[i] = parseInt(vAxisMax - (i * vStepSizeNumber));
		jQuery(this).append("<hr class='vAxis-line' id='vAxis-line-"+i+"' />");
		jQuery(this).children("#vAxis-line-"+i).width(jQuery(this).width());
		jQuery(this).append("<div class='vAxis-line-label' id='vAxis-line-label-"+i+"'>"+vAxisLineValue[i]+"</div>");
		jQuery(this).children("#vAxis-line-label-"+i).width(jQuery(this).width() - 2);
		console.log(options);
		if ((options.labelPos != "outside") && (i==options.vAxisSteps)) {
		    jQuery(this).children("#vAxis-line-"+i).hide();
		    jQuery(this).children("#vAxis-line-label-"+i).hide();
		}
	    }
	    console.log("dataMax = " +dataMax);
	    console.log("vAxisMax = " +vAxisMax);
	    console.log("barHOffset = " +barHOffset);
	    console.log("vAxisSteps = " +options.vAxisSteps);
	    console.log("vStepSizeNumber = " +vStepSizeNumber);
	    console.log("total Height = "+jQuery(this).height());
	    console.log("vStepSizePixels = " +vStepSizePixels);
	}
	for (var i=0;i<options.data.length;i++) {
	    jQuery(this).append("<div class='vbar-chart-bar' id='vbar-"+i+"'></div>");
	    jQuery(this).children("#vbar-"+i).width(barW);
	    jQuery(this).children("#vbar-"+i).height(percentArray[i]);
	    if (options.colorByCorrect == true) {
		if (i in correctArray) {
		    jQuery(this).children("#vbar-"+i).css('background-color',options.colors[0]);
		} else {
		    jQuery(this).children("#vbar-"+i).css('background-color',options.colors[1]);
		}
	    } else {
		jQuery(this).children("#vbar-"+i).css('background-color',options.colors[i % options.colors.length]);
	    }
	    if (options.barStyle == 'fancy') {
		jQuery(this).children("#vbar-"+i).css("border-top-left-radius",barW/4);
		jQuery(this).children("#vbar-"+i).css("border-top-right-radius",barW/4);
	    }

	    if (options.labelStyle == 'text') {
		if (options.labelDisplay == 'static') {
		    jQuery(this).children("#vbar-"+i).append("<div class='vbar-chart-bar-label' id='vlabel-"+i+"'>"+options.labels[i]+"<div>");
		} else if (options.labelDisplay == 'hover') {
		    jQuery(this).children("#vbar-"+i).attr('title',options.labels[i]);
		} else if (options.labelDisplay == 'scale') {
		    jQuery(this).children("#vbar-"+i).append("<div class='vbar-chart-bar-label' id='vlabel-"+i+"'>"+options.labels[i]+"<div>");
		    jQuery(this).children("#vbar-"+i).children("#vlabel-"+i).css('font-size',jQuery(this).children("#vbar-"+i).width()/4);
		    if (options.labelPos == 'outside') {
			jQuery(this).children("#vbar-"+i).height(percentArray[i] - jQuery(this).children("#vbar-"+i).width()/4);
			jQuery(this).children("#vbar-"+i).children("#vlabel-"+i).css('bottom',-1*(jQuery(this).children("#vbar-"+i).children("#vlabel-"+i).height()-2));
		    }
		} else {
		    console.log("labelDisplay with value '"+options.labelDisplay+"' is meaningless");
		}
	    } else if (options.labelStyle == 'value') {
		if (options.labelDisplay == 'static') {
		    jQuery(this).children("#vbar-"+i).append("<div class='vbar-chart-bar-label' id='vlabel-"+i+"'>"+options.data[i]+"<div>");
		} else if (options.labelDisplay == 'hover') {
		    jQuery(this).children("#vbar-"+i).attr('title',options.data[i]);
		} else if (options.labelDisplay == 'scale') {
		    jQuery(this).children("#vbar-"+i).append("<div class='vbar-chart-bar-label' id='vlabel-"+i+"'>"+options.data[i]+"<div>");
		    jQuery(this).children("#vbar-"+i).children("#vlabel-"+i).css('font-size',jQuery(this).children("#vbar-"+i).width()/4);
		    if (options.labelPos == 'outside') {
			jQuery(this).children("#vbar-"+i).height(percentArray[i] - jQuery(this).children("#vbar-"+i).width()/4);
			jQuery(this).children("#vbar-"+i).children("#vlabel-"+i).css('bottom',-1*(jQuery(this).children("#vbar-"+i).children("#vlabel-"+i).height()-2));
		    }
		} else {
		    console.log("labelDisplay with value '"+options.labelDisplay+"' is meaningless");
		}
	    } else if (options.labelStyle == 'full') {
		if (options.labelDisplay == 'static') {
		    jQuery(this).children("#vbar-"+i).append("<div class='vbar-chart-bar-label' id='vlabel-"+i+"'>"+options.labels[i]+" ("+options.data[i]+")<div>");
		} else if (options.labelDisplay == 'hover') {
		    jQuery(this).children("#vbar-"+i).attr('title',options.labels[i]+" ("+options.data[i]+")");
		} else if (options.labelDisplay == 'scale') {
		    jQuery(this).children("#vbar-"+i).append("<div class='vbar-chart-bar-label' id='vlabel-"+i+"'>"+options.labels[i]+" ("+options.data[i]+")<div>");
		    jQuery(this).children("#vbar-"+i).children("#vlabel-"+i).css('font-size',jQuery(this).children("#vbar-"+i).width()/4);
		    if (options.labelPos == 'outside') {
			jQuery(this).children("#vbar-"+i).height(percentArray[i] - jQuery(this).children("#vbar-"+i).width()/4);
			jQuery(this).children("#vbar-"+i).children("#vlabel-"+i).css('bottom',-1*(jQuery(this).children("#vbar-"+i).children("#vlabel-"+i).height()-2));
		    }
		} else {
		    console.log("labelDisplay with value '"+options.labelDisplay+"' is meaningless");
		}

	    }  else if (options.labelStyle == "split") {
		jQuery(this).children("#vbar-"+i).append("<div class='vbar-chart-bottom-label' id='vblabel-"+i+"'>"+options.labels[i]+"</div>");
		jQuery(this).children("#vbar-"+i).append("<div class='vbar-chart-top-label' id='vtlabel-"+i+"'>"+options.data[i]+"</div>");
		jQuery(this).children("#vbar-"+i).children("#vblabel-"+i).css('font-size',jQuery(this).children("#vbar-"+i).width()/4);
		jQuery(this).children("#vbar-"+i).children("#vtlabel-"+i).css('font-size',jQuery(this).children("#vbar-"+i).width()/4);
		if (options.labelPos == "outside") {
		    jQuery(this).children("#vbar-"+i).height(percentArray[i] - jQuery(this).children("#vbar-"+i).width()/2);
		    jQuery(this).children("#vbar-"+i).children("#vblabel-"+i).css('bottom',-1*(jQuery(this).children("#vbar-"+i).children("#vblabel-"+i).height()-2));
		    jQuery(this).children("#vbar-"+i).children("#vtlabel-"+i).css('top',-1*(jQuery(this).children("#vbar-"+i).children("#vtlabel-"+i).height()-2));
		    barHOffset = -1*(jQuery(this).children("#vbar-"+i).children("#vtlabel-"+i).height()-2);
		} else if (options.labelPos == "inside") {
		    jQuery(this).children("#vbar-"+i).children("#vblabel-"+i).css('bottom',0);
		    jQuery(this).children("#vbar-"+i).children("#vtlabel-"+i).css('top',0);
		}
	    } else {
		console.log("labelStyle with value'"+options.labelStyle+"' is meaningless");
	    }
	    jQuery(this).children("#vbar-"+i).css("bottom",barHOffset);
	}
	if (options.vAxis) {
	    var barBottom = jQuery(this).children("#vbar-0").css("bottom");
	    barBottom = parseInt(barBottom.substring(0,barBottom.length - 2));
	    for (var i=0;i<=options.vAxisSteps;i++) {
		//jQuery(this).children("#vAxis-line-"+i).width(jQuery(this).width());
		jQuery(this).children("#vAxis-line-"+i).css("top",vAxisLinePos[i]);
		if (options.labelStyle != "split") {
		    var fontSize = jQuery(this).children("#vbar-0").children("#vlabel-0").css("font-size");
		} else {
		    var fontSize = jQuery(this).children("#vbar-0").children("#vtlabel-0").css("font-size");
		}
		fontSize = parseInt(fontSize.substring(0,fontSize.length -2 ));
		jQuery(this).children("#vAxis-line-label-"+i).css("top",vAxisLinePos[i] + fontSize);
		jQuery(this).children("#vAxis-line-label-"+i).css("font-size",fontSize*1.5);
	    }
	    if (options.labelStyle == "split") {
		
	    }
	}
    } 
};

