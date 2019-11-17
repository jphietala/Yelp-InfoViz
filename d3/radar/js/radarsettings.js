var weekdays_list = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function updateRadarChart(infodicts = [["Nevada - Burgers", [35,324,23,33,54,42,43]],["Nevada - Pizza", [345,34,234,336,534,432,432]]]) {

	let first_vals = [];
	let second_vals = [];
	for (let i = 0; i < 7; i++) {
		first_vals.push({axis: weekdays_list[i],value:infodicts[0][1][i]});
		second_vals.push({axis: weekdays_list[i],value:infodicts[1][1][i]});

	}
	let indata = [{name: infodicts[0][0], axes: first_vals, color: '#26AF32'},{name: infodicts[1][0], axes: second_vals, color: '#762712'}];

	let svg_radar = RadarChart(".radarChart2", indata, radarChartOptions2);
	//writeLegend([infodicts[0][0], infodicts[1][0]]);
}

//////////////////////////////////////////////////////////////
//////////////////////// Set-Up //////////////////////////////
//////////////////////////////////////////////////////////////

var radarmargin = { top: 50, right: 80, bottom: 50, left: 80 },
	width = Math.min(700, window.innerWidth / 4) - radarmargin.left - radarmargin.right,
	height = Math.min(width, window.innerHeight - radarmargin.top - radarmargin.bottom);



//////////////////////////////////////////////////////////////
////// First example /////////////////////////////////////////
///// (not so much options) //////////////////////////////////
//////////////////////////////////////////////////////////////
var radarChartOptions = {
	w: 290,
	h: 350,
	margin: radarmargin,
	levels: 5,
	roundStrokes: true,
	color: d3.scaleOrdinal().range(["#26AF32", "#762712", "#2a2fd4"]),
	format: '.0f'
};

			// Draw the chart, get a reference the created svg element :
			//let svg_radar1 = RadarChart(".radarChart", data, radarChartOptions);

//////////////////////////////////////////////////////////////
///// Second example /////////////////////////////////////////
///// Chart legend, custom color, custom unit, etc. //////////
//////////////////////////////////////////////////////////////
var radarChartOptions2 = {
	w: 290,
	h: 350,
	margin: radarmargin,
	maxValue: 60,
	levels: 6,
	roundStrokes: false,
	color: d3.scaleOrdinal().range(["#AFC52F", "#ff6600", "#2a2fd4"]),
	format: 's',
	legend: { title: 'Organization XYZ', translateX: 100, translateY: 40 },
	unit: ''
};




//////////////////////////////////////////////////////////////
////////////////////////// Data //////////////////////////////
//////////////////////////////////////////////////////////////
/*
var data = [
				{ name: 'Allocated budget',
					axes: [
						{axis: 'Sales', value: 42},
						{axis: 'Marketing', value: 20},
						{axis: 'Development', value: 60},
						{axis: 'Customer Support', value: 26},
						{axis: 'Information Technology', value: 35},
						{axis: 'Administration', value: 20}
					],
         color: '#26AF32'
				},
				{ name: 'Actual Spending',
					axes: [
						{axis: 'Sales', value: 50},
						{axis: 'Marketing', value: 45},
						{axis: 'Development', value: 20},
						{axis: 'Customer Support', value: 20},
						{axis: 'Information Technology', value: 25},
						{axis: 'Administration', value: 23}
					],
         color: '#762712'
				},
        { name: 'Further Test',
					axes: [
						{axis: 'Sales', value: 32},
						{axis: 'Marketing', value: 62},
						{axis: 'Development', value: 35},
						{axis: 'Customer Support', value: 10},
						{axis: 'Information Technology', value: 20},
						{axis: 'Administration', value: 28}
					],
         color: '#2a2fd4'
				}
			];
						var data2 = [
				{ name: 'Allocated budget',
					axes: [
						{axis: 'Sales', value: 120},
						{axis: 'Marketing', value: 2},
						{axis: 'Development', value: 2},
						{axis: 'Customer Support', value: 2},
						{axis: 'Information Technology', value: 35},
						{axis: 'Administration', value: 20}
					],
         color: '#26AF32'
				},
				{ name: 'Actual Spending',
					axes: [
						{axis: 'Sales', value: 50},
						{axis: 'Marketing', value: 45},
						{axis: 'Development', value: 20},
						{axis: 'Customer Support', value: 20},
						{axis: 'Information Technology', value: 25},
						{axis: 'Administration', value: 23}
					],
         color: '#762712'
				},
        { name: 'Further Test',
					axes: [
						{axis: 'Sales', value: 32},
						{axis: 'Marketing', value: 62},
						{axis: 'Development', value: 35},
						{axis: 'Customer Support', value: 10},
						{axis: 'Information Technology', value: 20},
						{axis: 'Administration', value: 28}
					],
         color: '#2a2fd4'
				}
			];
*/

