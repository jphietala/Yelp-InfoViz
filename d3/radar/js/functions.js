// Global functions

var weekdays_data = [];
var heatmap_data = [];
var revs_year_data = [];
var selected = {'first': {'state': '', 'cuisine': ''}, 'second': {'state': '', 'cuisine': ''}};

// Load Data
Promise.all([
    d3.csv('data/heatmap.csv'),
    d3.csv('data/weekdays.csv'),
    d3.csv('data/dayofyear.csv'),
    d3.csv('data/histogram.csv')
]).then(data => {
    heatmap_data = data[0];
    weekdays_data = data[1];
    revs_year_data = data[2];
    histogram_data = data[3];
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

    const temp =  getFromRevs(selected.first);
    selected.first.weekdays = temp[0];
    selected.first.revs_year = temp[1];

    // Line Chart
    render(formatYear(selected));

    // Radar Chart
    formatYear(selected);
    updateRadarChart([selected.first.weekdays, selected.second.weekdays]);

    // Histogram
    updateHistogram(histogram_data, selected);
}

function whenLoaded() {
    let temp =  getFromRevs(selected.first);
    selected.first.weekdays = temp[0];
    selected.first.revs_year = temp[1];
    temp =  getFromRevs(selected.second);
    selected.second.weekdays = temp[0];
    selected.second.revs_year = temp[1];
    render(formatYear(selected));
    initHeatmap(heatmap_data);
    updateRadarChart([selected.first.weekdays, selected.second.weekdays])
    updateHistogram(histogram_data, selected);
}

function getFromRevs(sel){
    // TODO: Sum over all cuisines if only state is selected and vice versa
    let week_data = weekdays_data;
    let year_data = revs_year_data;
    let label = "Total";

    let weekdays_revs = Array(7).fill(0);
    let year_revs = Array(365).fill(0);

    if (sel.state !== '') {
        week_data = weekdays_data.filter(function (d) {
            return d.state === sel.state
        });
        year_data = revs_year_data.filter(function (d) {
            return d.state === sel.state
        });

        if (sel.cuisine !== '') {
            label = selected.first.state + " - " + selected.first.cuisine;
            weekdays_revs = eval(week_data.filter(function (d) {
                return d.cuisine === sel.cuisine
            })[0].weekdays)
            year_revs = eval(year_data.filter(function (d) {
                return d.cuisine === sel.cuisine
            })[0].revs_year)
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
            year_revs = Array(365).fill(0);
            year_data.forEach(function (d) {
                let wd = eval(d.revs_year)
                for (let i = 0; i < 365; i++) {
                    let day = (typeof (wd[i]) === 'number') ? wd[i] : 0;
                    year_revs[i] += day;
                }
            })
        }
    } else {
        if (sel.cuisine !== '') {
            label = selected.first.cuisine;
            week_data = weekdays_data.filter(function (d) {
                return d.cuisine === sel.cuisine
            });
            year_data = revs_year_data.filter(function (d) {
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
        year_revs = Array(365).fill(0);
        year_data.forEach(function (d) {
            let wd = eval(d.revs_year)
            for (let i = 0; i < 365; i++) {
                let day = (typeof (wd[i]) === 'number') ? wd[i] : 0;
                year_revs[i] += day;
            }
        });

    }
    if (weekdays_revs.length > 1){
        // Sum over all instances
    }
    return [[label, weekdays_revs], [label, year_revs]]
}

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