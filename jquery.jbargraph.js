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
	correct:[],
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
    if (options.style == 'horizontal') {
	var barH = (jQuery(this).height() / options.data.length -15);
    } else {
	var barW = (jQuery(this).width() / options.data.length- 15);
    }
    var percentArray = new Array();
    var dataMax = options.data.max();
    for (var i=0;i<options.data.length;i++) {
        percentArray[i] = (options.data[i] / dataMax) * jQuery(this).width();
    }
    if (options.style = 'horizontal') {
        for (var i=0;i<options.data.length;i++) {
	    jQuery(this).append("<div class='hbar-chart-bar' id='hbar-"+i+"'></div>");
            jQuery("#hbar-"+i).width(percentArray[i]);
            jQuery("#hbar-"+i).height(barH);
	    if (i in correctArray) {
		jQuery("#hbar-"+i).css('background-color',options.colors[0]);
	    } else {
		jQuery("#hbar-"+i).css('background-color',options.colors[1]);
	    }
	    /*if (jQuery("#hbar-"+i).prev().hasClass('hbar-chart-bar-label')) {
		jQuery("#hbar-"+i).css('top',-1*(jQuery("#hbar-"+i).prev().height()));
	    }*/
	    if (options.labelStyle == 'text') {
		jQuery(this).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.labels[i]+"</div>");
		jQuery("#hlabel-"+i).css('top',-1*(barH/1.45));
	    } else if (options.labelStyle == 'value') {
		jQuery(this).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.data[i]+"</div>");
		jQuery("#hlabel-"+i).css('top',-1*(barH/1.45));	
	    } else if (options.labelStyle == 'full') {
		jQuery(this).append("<div class='hbar-chart-bar-label' id='hlabel-"+i+"'>"+options.labels[i]+" ("+options.data[i]+")</div>");
		jQuery("#hlabel-"+i).css('top',-1*(barH/1.45));
	    }
        }
    } else if (options.style = 'vertical') {

    }
};
/*
function create_hbar_graph(selector,data,labels) {
    // Count number of data points
    // Make sure that # of data points == # labels
    // Determine width of each bar (container.height / # data points)
    // Determine Length of each bar:
       // Find each data point as a % of the largest data point
    // Create the divs that will serve as the bars
    // Set attributes of the divs
       // div.height = bar.width
       // div.width = length
    if (data.length != labels.length) {
	return;
    
    var containerH = jQuery(selector).height();
    var containerW = jQuery(selector).width();
    var percentArray = new Array();
    var barH = (containerH / data.length) - 5;
    var dataMax = data.max();
    console.log(dataMax);
    for (var i=0;i<data.length;i++) {
	percentArray[i] = (data[i] / dataMax) * containerW;
    }
    console.log(percentArray);
    for (var i=0;i<data.length;i++) {
	jQuery(selector).append("<div class='hbar-chart-bar' id='bar-"+i+"'></div>");
	jQuery("#bar-"+i).width(percentArray[i]);
	jQuery("#bar-"+i).height(barH);
	jQuery"#bar-"+i).css('background-color','blue');
        jQuery(selector).append("<div class='hbar-chart-bar-label' id='label-"+i+"'>"+labels[i]+"</div>");
        jQuery("#label-"+i).css('top',-1*(barH/2));
    }
}*/

