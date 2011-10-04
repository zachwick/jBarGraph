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
	labelStyle:'full', /*Other choices are 'text','value' */
	labelDisplay:'static', /*Other choices are 'hover','scale' */
	correct:[],
	barStyle:'plain', /* Other choices are 'fancy' */
	colors:['#3BC400','#999'],
        style:'horizontal' /* Other choices are 'vertical' */
    },
    options);
    if (options.data.length != options.labels.length) {
	return;
    }
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
    for (var i=0;i<options.data.length;i++) {
        percentArray[i] = (options.data[i] / dataMax) * jQuery(this).width();
    }
    if (options.style = 'horizontal') {
	var barH = (jQuery(this).height() / options.data.length -15);
        for (var i=0;i<options.data.length;i++) {
	    jQuery(this).append("<div class='hbar-chart-bar' id='hbar-"+i+"'></div>");
            jQuery("#hbar-"+i).width(percentArray[i]);
            jQuery("#hbar-"+i).height(barH);
	    if (i in correctArray) {
		jQuery("#hbar-"+i).css('background-color',options.colors[0]);
	    } else {
		jQuery("#hbar-"+i).css('background-color',options.colors[1]);
	    }
	    if (options.barStyle == 'fancy') {
		jQuery("#hbar-"+i).css("border-top-right-radius",barH/4);
		jQuery("#hbar-"+i).css("border-bottom-right-radius",barH/4);
	    }
	    /*if (jQuery("#hbar-"+i).prev().hasClass('hbar-chart-bar-label')) {
		jQuery("#hbar-"+i).css('top',-1*(jQuery("#hbar-"+i).prev().height()));
	    }*/

	    if (options.labelStyle == 'text') {
		if (options.labelDisplay == 'static') {
			jQuery(this).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.labels[i]+"</div>");
			jQuery("#hlabel-"+i).css('top',-1*(barH/1.45));
		} else if (options.labelDisplay == 'hover') {
			jQuery("#hbar-"+i).attr('title',options.labels[i]);
		} else if (options.labelDisplay == 'scale') {

		} else {
			console.log("labelDisplay with value "+options.labelDisplay+" is meaningless");
		}
	    } else if (options.labelStyle == 'value') {
		if (options.labelDisplay == 'static') {
			jQuery(this).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.data[i]+"</div>");
			jQuery("#hlabel-"+i).css('top',-1*(barH/1.45)); 
		} else if (options.labelDisplay == 'hover') {
			jQuery("#hbar-"+i).attr('title',options.data[i]);
		} else if (options.labelDisplay == 'scale') {

		} else {
			console.log("labelDisplay with value "+options.labelDisplay+" is meaningless");
		}
	    } else if (options.labelStyle == 'full') {
		if (options.labelDisplay == 'static') {
			jQuery(this).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.labels[i]+" ("+options.data[i]+")</div>");
			jQuery("#hlabel-"+i).css('top',-1*(barH/1.45));
		} else if (options.labelDisplay == 'hover') {
			jQuery("#hbar-"+i).attr('title',options.labels[i]+" ("+options.data[i]+")");
		} else if (options.lableDiplay == 'scale') {

		} else {
			console.log("labelDisplay with value "+options.labelDisplay+" is meaningless");
		}
	    }
        }
    } else if (options.style = 'vertical') {
	var barW = (jQuery(this).width() / options.data.length- 15);
    }
};

