// Global functions
var weekdays_data = [];
var heatmap_data = [];
var revs_year_data = [];
var histogram_data = [];
var heatmap_data_w = [];
var revs_year_data_w = [];
var histogram_data_w = [];
var hm_data = [];
var lc_data = [];
var hg_data = [];
var rc_data = [];
var selected = {'first': {'state': '', 'cuisine': ''}, 'second': {'state': '', 'cuisine': ''}};

// Load Data
Promise.all([
    d3.csv('data/heatmap.csv'),
    d3.csv('data/weekdays.csv'),
    d3.csv('data/y_days_all.csv'),
    d3.csv('data/histogram.csv'),
    d3.csv('data/hm_0.csv'),
    d3.csv('data/hm_1.csv'),
    d3.csv('data/hm_2.csv'),
    d3.csv('data/hm_3.csv'),
    d3.csv('data/hm_4.csv'),
    d3.csv('data/hm_5.csv'),
    d3.csv('data/hm_6.csv'),
    d3.csv('data/y_days_0.csv'),
    d3.csv('data/y_days_1.csv'),
    d3.csv('data/y_days_2.csv'),
    d3.csv('data/y_days_3.csv'),
    d3.csv('data/y_days_4.csv'),
    d3.csv('data/y_days_5.csv'),
    d3.csv('data/y_days_6.csv'),
    d3.csv('data/histo_0.csv'),
    d3.csv('data/histo_1.csv'),
    d3.csv('data/histo_2.csv'),
    d3.csv('data/histo_3.csv'),
    d3.csv('data/histo_4.csv'),
    d3.csv('data/histo_5.csv'),
    d3.csv('data/histo_6.csv')
]).then(data => {
    heatmap_data = data[0];
    weekdays_data = data[1];
    revs_year_data = data[2];
    histogram_data = data[3];
    heatmap_data_w = data.slice(4,11);
    revs_year_data_w = data.slice(11,18);
    histogram_data_w = data.slice(18,25);
    var hm_data = histogram_data;
    var lc_data = revs_year_data;
    var hg_data = heatmap_data;
    var rc_data = weekdays_data;

}).then(function() {
    whenLoaded();
});

function updateIdioms(state = "", cuisine = "") {
    // Set new selected:
    if (selected.first === selected.second){

    }else {
        selected.second = selected.first;
        selected.first = {'state': state, 'cuisine': cuisine};
    }

    // Update Legend in the top bar
    updateLegends(selected);

    selected.first.weekdays = getFromRevs(selected.first);

    // Line Chart
    //render(formatYear(selected));

    //updateLinechart(somedata, selected);


    // Radar Chart
    updateRadarChart([selected.first.weekdays, selected.second.weekdays]);

    // Histogram
    updateHistogram(histogram_data, selected);
}

function whenLoaded() {

    selected.first.weekdays = getFromRevs(selected.first);
    selected.second.weekdays = getFromRevs(selected.second);
    //render(formatYear(selected));
    initHeatmap(hm_data);
    updateRadarChart([selected.first.weekdays, selected.second.weekdays])
    updateHistogram(hg_data, selected);

    //updateLinechart(somedata, selected);
}

function getFromRevs(sel){
    let week_data = rc_data;
    let label = "Total";

    let weekdays_revs = Array(7).fill(0);

    if (sel.state !== '') {
        week_data = weekdays_data.filter(function (d) {
            return d.state === sel.state
        });


        if (sel.cuisine !== '') {
            label = selected.first.state + " - " + selected.first.cuisine;
            weekdays_revs = eval(week_data.filter(function (d) {
                return d.cuisine === sel.cuisine
            })[0].weekdays)
        } else {
            label = selected.first.state;
            weekdays_revs = Array(7).fill(0);
            week_data.forEach(function (d) {
                let wd = eval(d.weekdays)
                for (let i = 0; i < 7; i++) {
                    let day = (typeof (wd[i]) === 'number') ? wd[i] : 0;
                    weekdays_revs[i] += day;
                }
            })
        }
    } else {
        if (sel.cuisine !== '') {
            label = selected.first.cuisine;
            week_data = week_data.filter(function (d) {
                return d.cuisine === sel.cuisine
            });
        }
        weekdays_revs = Array(7).fill(0);
        week_data.forEach(function (d) {
            let wd = eval(d.weekdays)
            for (let i = 0; i < 7; i++) {
                let day = (typeof (wd[i]) === 'number') ? wd[i] : 0;
                weekdays_revs[i] += day;
            }
        });
    }
    if (weekdays_revs.length > 1){
        // Sum over all instances
    }
    return [label, weekdays_revs]
}
/*
function formatYear(sel) {
    let data_list = []
    for (let i = 0; i < 365; i++) {
        let row = {day: i+1,state: sel.first.revs_year[0], review: sel.first.revs_year[1][i]};
        data_list.push(row);
        let row2 = {day: i+1,state: sel.second.revs_year[0], review: sel.second.revs_year[1][i]};
        data_list.push(row2);
    }
    data_list.forEach(d => {
        d.review = +d.review;
        d.day = +d.day;
      });

    return data_list
}
*/
function updateLegends(selected) {
    // Update Legend 1
    if (selected.first.state !== "" && selected.first.cuisine !== "") {
        document.getElementById("p1").innerHTML = selected.first.state + ", " + selected.first.cuisine;
    } else if (selected.first.state !== "" && selected.first.cuisine === "") {
        document.getElementById("p1").innerHTML = selected.first.state;
    } else if (selected.first.state === "" && selected.first.cuisine !== "") {
        document.getElementById("p1").innerHTML = selected.first.cuisine;
    } else {
        document.getElementById("p1").innerHTML = "Total";
    }

    // Update Legend 2
    if (selected.second.state !== "" && selected.second.cuisine !== "") {
        document.getElementById("p2").innerHTML = selected.second.state + ", " + selected.second.cuisine;
    } else if (selected.second.state !== "" && selected.second.cuisine === "") {
        document.getElementById("p2").innerHTML = selected.second.state;
    } else if (selected.second.state === "" && selected.second.cuisine !== "") {
        document.getElementById("p2").innerHTML = selected.second.cuisine;
    } else {
        document.getElementById("p2").innerHTML = "Total";
    }
}