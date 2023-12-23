/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 0.0, "KoPercent": 100.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://baskino.re/boeviki/"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "https://baskino.re/biografiya/"], "isController": false}, {"data": [0.0, 500, 1500, "https://baskino.re/novinki-v2/"], "isController": false}, {"data": [0.0, 500, 1500, "https://baskino.re/voennye/"], "isController": false}, {"data": [0.0, 500, 1500, "https://baskino.re/vesterny/"], "isController": false}, {"data": [0.0, 500, 1500, "https://baskino.re/films/"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 30, 30, 100.0, 43162.666666666664, 38649, 64584, 38707.0, 59835.900000000016, 64115.95, 64584.0, 0.09917191451380969, 0.3133987454752814, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://baskino.re/boeviki/", 5, 5, 100.0, 38684.0, 38668, 38710, 38681.0, 38710.0, 38710.0, 38710.0, 0.07936633914824044, 0.2508100326989317, 0.0], "isController": false}, {"data": ["Test", 5, 5, 100.0, 258976.0, 232212, 291898, 255514.0, 291898.0, 291898.0, 291898.0, 0.017106181489743133, 0.32434923809067645, 0.0], "isController": true}, {"data": ["https://baskino.re/biografiya/", 5, 5, 100.0, 46547.8, 38816, 63733, 39561.0, 63733.0, 63733.0, 63733.0, 0.07828646583578631, 0.24739746430137158, 0.0], "isController": false}, {"data": ["https://baskino.re/novinki-v2/", 5, 5, 100.0, 46139.6, 38683, 64584, 38760.0, 64584.0, 64584.0, 64584.0, 0.051031864296066466, 0.16126866490436628, 0.0], "isController": false}, {"data": ["https://baskino.re/voennye/", 5, 5, 100.0, 38697.4, 38689, 38714, 38690.0, 38714.0, 38714.0, 38714.0, 0.07932604591391537, 0.2506826997826466, 0.0], "isController": false}, {"data": ["https://baskino.re/vesterny/", 5, 5, 100.0, 43182.2, 38649, 49971, 38682.0, 49971.0, 49971.0, 49971.0, 0.07934996508601537, 0.25075828810385326, 0.0], "isController": false}, {"data": ["https://baskino.re/films/", 5, 5, 100.0, 45725.0, 38651, 60723, 38725.0, 60723.0, 60723.0, 60723.0, 0.06564264145989235, 0.20744100367598792, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to baskino.re:443 [baskino.re/104.21.51.7, baskino.re/172.67.216.39] failed: Read timed out", 30, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 30, 30, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to baskino.re:443 [baskino.re/104.21.51.7, baskino.re/172.67.216.39] failed: Read timed out", 30, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://baskino.re/boeviki/", 5, 5, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to baskino.re:443 [baskino.re/104.21.51.7, baskino.re/172.67.216.39] failed: Read timed out", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://baskino.re/biografiya/", 5, 5, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to baskino.re:443 [baskino.re/104.21.51.7, baskino.re/172.67.216.39] failed: Read timed out", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://baskino.re/novinki-v2/", 5, 5, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to baskino.re:443 [baskino.re/104.21.51.7, baskino.re/172.67.216.39] failed: Read timed out", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://baskino.re/voennye/", 5, 5, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to baskino.re:443 [baskino.re/104.21.51.7, baskino.re/172.67.216.39] failed: Read timed out", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://baskino.re/vesterny/", 5, 5, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to baskino.re:443 [baskino.re/104.21.51.7, baskino.re/172.67.216.39] failed: Read timed out", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://baskino.re/films/", 5, 5, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to baskino.re:443 [baskino.re/104.21.51.7, baskino.re/172.67.216.39] failed: Read timed out", 5, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
