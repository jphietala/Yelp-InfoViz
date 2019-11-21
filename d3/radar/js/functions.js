// Global functions

var heatmap_data = [];
var weekdays_data = [];
var revs_year_data = [];
var selected = {'first': {'state': 'NV', 'cuisine': 'Diners'}, 'second': {'state': 'ON', 'cuisine': 'Diners'}};

// All data is loaded here
Promise.all([
    d3.csv('data/heatmap.csv'),
    d3.csv('data/weekdays.csv'),
    d3.csv('data/dayofyear.csv')
]).then(data => {
    heatmap_data = data[0];
    weekdays_data = data[1];
    revs_year_data = data[2];
    console.log("loaded heatmap data", heatmap_data);
    console.log("loaded revs year", revs_year_data);
    console.log("loaded revsweek", weekdays_data);
    whenLoaded();
});

function updateIdioms(state = "", cuisine = "") {
    // Set new selected:
    if (selected.first === selected.second){

    }else {
        selected.second = selected.first;
        selected.first = {'state': state, 'cuisine': cuisine};
    }

    // Histogram

    // Line Chart

    // Radar Chart
    const temp =  getFromRevs(selected.first);
    selected.first.weekdays = temp[0];
    selected.first.revs_year = temp[1];
    formatYear(selected);

    updateRadarChart([selected.first.weekdays, selected.second.weekdays]);
}

function whenLoaded() {
    let temp =  getFromRevs(selected.first);
    selected.first.weekdays = temp[0];
    selected.first.revs_year = temp[1];
    temp =  getFromRevs(selected.second);
    selected.second.weekdays = temp[0];
    selected.second.revs_year = temp[1];    //console.log("selected",selected)
    console.log("selected",selected);
    formatYear(selected);
    initHeatmap(heatmap_data);
    updateRadarChart()
    //Render();

}

function getFromRevs(sel){
    // TODO: Sum over all cuisines if only state is selected and vice versa
    let week_data = weekdays_data.forEach(function (data) {
        eval(data.weekdays)
    });
    let year_data = revs_year_data.forEach(function (data) {
        eval(data.revs_year)
    });
    if (sel.state !== ''){
        week_data = weekdays_data.filter(function(d){ return d.state === sel.state })
        year_data = revs_year_data.filter(function(d){ return d.state === sel.state })

    }
    let weekdays_revs = eval(week_data.weekdays);
    let year_revs = eval(year_data.revs_year);

    if (sel.cuisine !== ''){
        weekdays_revs = eval(week_data.filter(function(d){ return d.cuisine === sel.cuisine })[0].weekdays)
        year_revs = eval(year_data.filter(function(d){ return d.cuisine === sel.cuisine })[0].revs_year)

    }
    if (weekdays_revs.length > 1){
        // Sum over all instances
    }

    return [[selected.first.state + " - " + selected.first.cuisine, weekdays_revs], [selected.first.state + " - " + selected.first.cuisine, year_revs]]
}

function formatYear(sel) {
    let data_list = []
    for (let i = 0; i < 365; i++) {
        let row = {day: i+1,state: sel.first.revs_year[0], review: sel.first.revs_year[1][i]};
        data_list.push(row);
        let row2 = {day: i+1,state: sel.second.revs_year[0], review: sel.second.revs_year[1][i]};
        data_list.push(row2);
    }
    console.log("datalist",data_list)
    return data_list
}
