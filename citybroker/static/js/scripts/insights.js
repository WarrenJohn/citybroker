const market = ["new-seven","cond-seven", "sold-seven", "city-avg", "city-avg-dom", "time-cond", "avg-lsr"];
const market_data = [insightsJSON.seven.new, insightsJSON.seven.cond, insightsJSON.seven.sold, insightsJSON.city_avg.toLocaleString("en"), insightsJSON.city_avg_dom,
                     insightsJSON.market.time_cond, insightsJSON.market.avg_lsr];

const today = ["today-active", "today-cond", "today-sold"];
const today_data = [insightsJSON.today.active, insightsJSON.today.cond, insightsJSON.today.sold];

const yday = ["yday-active", "yday-cond", "yday-sold"];
const yday_data = [insightsJSON.yesterday.active, insightsJSON.yesterday.cond, insightsJSON.yesterday.sold];

const north = ["north-avg", "north-active", "yday-north-active", "north-avg-dom", "north-avg-cdom"];
const north_data = [insightsJSON.north.avg.toLocaleString("en"), insightsJSON.north.today.active, insightsJSON.north.yday.active, insightsJSON.north.avg_dom.dom,
                    insightsJSON.north.avg_dom.cdom];

const south = ["south-avg", "south-active", "yday-south-active", "south-avg-dom", "south-avg-cdom"];
const south_data = [insightsJSON.south.avg.toLocaleString("en"), insightsJSON.south.today.active, insightsJSON.south.yday.active, insightsJSON.south.avg_dom.dom,
                    insightsJSON.south.avg_dom.cdom];

const east = ["east-avg", "east-active", "yday-east-active", "east-avg-dom", "east-avg-cdom"];
const east_data = [insightsJSON.east.avg.toLocaleString("en"), insightsJSON.east.today.active, insightsJSON.east.yday.active, insightsJSON.east.avg_dom.dom,
                    insightsJSON.east.avg_dom.cdom];

const graphs = ["northAvg", "southAvg", "eastAvg", "cityAvg", "cityAvgDOM", "cityAvgCdom", "cityAvgLSR"];
const graph_data = [insightsJSON.graph.north, insightsJSON.graph.south, insightsJSON.graph.east, insightsJSON.graph.city_avg,
                    insightsJSON.graph.city_avg_dom, insightsJSON.graph.cond_dom, insightsJSON.graph.avg_lsr];


function insertData(id, data){
    const to_change = document.getElementById(id);
    to_change.textContent += data;
}

const numDiff = (newNum, oldNum, id) =>{
    let dollarDifferential = newNum - oldNum;
    let differential = (((newNum / oldNum)-1)*100).toFixed(2);
    let selector = document.getElementById(id);
    if (id.search("dom") !== -1 && differential > 0){
        selector.style.color = "#CD5C5C";
        selector.style.fontWeight = "bold";
        selector.textContent = "+" + Math.abs(differential) + "%" + "(+"+Math.abs(dollarDifferential)+")"+" 2 wks";
    }
    else if (id.search("dom") !== -1 && differential < 0){
        selector.style.color = "#85bb65";
        selector.style.fontWeight = "bold";
        selector.textContent = "-" + Math.abs(differential) + "%" + "(-"+Math.abs(dollarDifferential)+")"+" 2 wks";
    }
    else if (differential > 0){
        selector.style.color = "#85bb65";
        selector.style.fontWeight = "bold";
        selector.textContent = "+" + Math.abs(differential) + "%" + "(+$"+Math.abs(dollarDifferential)+")"+" 2 wks";
    }
    else if (differential < 0){
        selector.style.color = "#CD5C5C";
        selector.style.fontWeight = "bold";
        selector.textContent = "-" + Math.abs(differential) + "%" + "(-$"+Math.abs(dollarDifferential)+")"+" 2 wks";
    }
    else {
        selector.style.fontWeight = "bold";
        selector.textContent = Math.abs(differential) + "%" + " 2 wks";
    }

};

function marketOutlook(newSeven, soldSeven){
    let selector = document.getElementById("market");
    let marketType = "";
    let marketRatio = soldSeven / newSeven;

    if (marketRatio > 0.55){
        marketType = "Seller's Market";
    }
    else if (marketRatio < 0.55 && marketRatio > 0.45){
        marketType = "Balanced Market";
    }
    else{
        marketType = "Buyer's Market";
    }
    selector.textContent = marketType;
// TODO
// Dynamically generated blurb talking about the different market types. Who is it good for, etc..
// Talk about the list to sale ratio (150 listings 150 sales), the length of time listings are conditional for,
// how many are going conditional (and how these affect the market). How much the average price has increased in
// the last week (percent amount and dollar amount). Whether the average time to sell a home (dom) is increasing or
// decreasing, and what is going on with the average list sell price ratio (%)
//
// Talk about months of inventory left: "At the current rate, in X months there will be no homes remaining on the market"
// One for buyers market and balanced market
}

function parseDates(graphDates){
    for (let i = 0; i < graphDates.length; i++){
        let year = "";
        let month = "";
        let day = "";
        year = graphDates[i].toString().slice(0,4);
        month = graphDates[i].toString().slice(4,6);
        day = graphDates[i].toString().slice(6,8);
        graphDates[i] = year + "-" + month + "-" + day;
    }
    return graphDates;
}

function dataChart(dates, data, chartLabel){
    let selector;
    let sugMin;
    let sugMax;
    let bgCol = "";
    let brdCol = "";
    let atZero = false;

    switch (chartLabel){
        case "Average sale price":
            selector = document.getElementById("cityAvg").getContext('2d');
            bgCol = 'rgba(255, 99, 132, 0.2)';
            brdCol = 'rgba(255,99,132,1)';
            break;
        case "Average days on market":
        selector = document.getElementById("cityAvgDOM").getContext('2d');
            bgCol = 'rgba(54, 162, 235, 0.2)';
            brdCol = 'rgba(54, 162, 235, 1)';
            atZero = true;
            break;
        case "List to sale price %":
            selector = document.getElementById("cityAvgLSR").getContext('2d');
            bgCol = 'rgba(0, 100, 25, 0.2)';
            brdCol = 'rgba(0, 100, 25, 1)';
            sugMax = 105; // Take highest number from the array and add 1
            sugMin = 100; // Take lowest number from the array and add 1
            break;
        case "Average sales price in north London":
            selector = document.getElementById("northAvg").getContext('2d');
            bgCol = 'rgba(75, 192, 192, 0.2)';
            brdCol = 'rgba(75, 192, 192, 1)';
            break;
        case "Average sales price in south London":
            selector = document.getElementById("southAvg").getContext('2d');
            bgCol = 'rgba(153, 102, 255, 0.2)';
            brdCol = 'rgba(153, 102, 255, 1)';
            break;
        case "Average sales price in east London":
            selector = document.getElementById("eastAvg").getContext('2d');
            bgCol = 'rgba(255, 159, 64, 0.2)';
            brdCol = 'rgba(255, 159, 64, 1)';
            break;
        case "Average days conditionally sold":
            selector = document.getElementById("cityAvgCdom").getContext('2d');
            bgCol = 'rgba(125, 150, 255, 0.2)';
            brdCol = 'rgba(125, 150, 255, 1)';
            atZero = true;
            break;
    }

    let cityAvgChart = new Chart(selector, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: chartLabel,
                data: data,
                backgroundColor: [
                    bgCol
                ],
                borderColor: [
                    brdCol
                ],
                borderWidth: 1
            }]
        },
        options: {
            title:{
                display: true,
                text: chartLabel,
                fontSize: 25,
                padding:30
            },
            legend:{
                display:false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: atZero,
                        suggestedMin: sugMin,
                        suggestedMax: sugMax
                    }
                }]
            }
        }
    });
    return cityAvgChart;
}

market.forEach(id => insertData(id, market_data[market.indexOf(id)]));
today.forEach(id => insertData(id, today_data[today.indexOf(id)]));
yday.forEach(id => insertData(id, yday_data[yday.indexOf(id)]));
north.forEach(id => insertData(id, north_data[north.indexOf(id)]));
south.forEach(id => insertData(id, south_data[south.indexOf(id)]));
east.forEach(id => insertData(id, east_data[east.indexOf(id)]));

marketOutlook(insightsJSON.seven.new, insightsJSON.seven.sold);
numDiff(insightsJSON.city_avg, insightsJSON.graph.city_avg.reverse()[13], "last14price");
numDiff(insightsJSON.city_avg_dom, insightsJSON.graph.city_avg_dom.reverse()[13],"last14dom");
numDiff(insightsJSON.north.avg, insightsJSON.graph.north.reverse()[13],"last14north");
numDiff(insightsJSON.south.avg, insightsJSON.graph.south.reverse()[13],"last14south");
numDiff(insightsJSON.east.avg, insightsJSON.graph.east.reverse()[13],"last14east");
numDiff(insightsJSON.market.time_cond, insightsJSON.graph.cond_dom.reverse()[13],"last14cdom");
numDiff(insightsJSON.market.avg_lsr, insightsJSON.graph.avg_lsr.reverse()[13],"last14lsr");

let graphDates = parseDates(insightsJSON.graph.dates);
dataChart(graphDates, insightsJSON.graph.city_avg.reverse(), "Average sale price");
dataChart(graphDates, insightsJSON.graph.city_avg_dom.reverse(), "Average days on market");
dataChart(graphDates, insightsJSON.graph.avg_lsr.reverse(), "List to sale price %");
dataChart(graphDates, insightsJSON.graph.cond_dom.reverse(), "Average days conditionally sold");
dataChart(graphDates, insightsJSON.graph.north.reverse(), "Average sales price in north London");
dataChart(graphDates, insightsJSON.graph.south.reverse(), "Average sales price in south London");
dataChart(graphDates, insightsJSON.graph.east.reverse(), "Average sales price in east London");
