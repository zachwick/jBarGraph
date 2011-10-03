Array.prototype.max = function() {
    var max=this[0];
    var len = this.length;
    for (var i=1;i<len;i++) {
	if (this[i] > max) {
            max = this[i];
        }
    }
    return max;
}

Array.prototype.min = function() {
    var min = this[0];
    var len = this.length;
    for (var i=1;i<len;i++) {
	if (this[i] < min) {
            min = this[i];
        }
    }
    return min;
}

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
    }
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
}