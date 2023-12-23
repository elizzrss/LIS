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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 60, 60, 100.0, 44716.31666666667, 38650, 130771, 38711.5, 60526.099999999984, 65918.79999999999, 130771.0, 0.1667685807993774, 0.5270147729167826, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://baskino.re/boeviki/", 10, 10, 100.0, 51736.5, 38674, 107634, 44438.0, 103274.00000000001, 107634.0, 107634.0, 0.0929074456026906, 0.2936020448928777, 0.0], "isController": false}, {"data": ["Test", 10, 10, 100.0, 268297.9, 232643, 348707, 257952.0, 344033.4, 348707.0, 348707.0, 0.028604200812931385, 0.5423624638514413, 0.0], "isController": true}, {"data": ["https://baskino.re/biografiya/", 10, 10, 100.0, 40485.6, 38941, 51003, 39359.5, 49867.8, 51003.0, 51003.0, 0.19302038295243978, 0.609974569564546, 0.0], "isController": false}, {"data": ["https://baskino.re/novinki-v2/", 10, 10, 100.0, 42299.0, 38666, 62517, 38704.5, 61348.100000000006, 62517.0, 62517.0, 0.06445250816935541, 0.20367999651956456, 0.0], "isController": false}, {"data": ["https://baskino.re/voennye/", 10, 10, 100.0, 52893.8, 38667, 130771, 38708.0, 124295.70000000003, 130771.0, 130771.0, 0.06992860289644273, 0.22098531149696163, 0.0], "isController": false}, {"data": ["https://baskino.re/vesterny/", 10, 10, 100.0, 42192.0, 38679, 61490, 38693.0, 60429.600000000006, 61490.0, 61490.0, 0.0928806947475967, 0.2935175080109599, 0.0], "isController": false}, {"data": ["https://baskino.re/films/", 10, 10, 100.0, 38691.0, 38650, 38724, 38695.5, 38723.9, 38724.0, 38724.0, 0.06991833538427117, 0.22095286455420068, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to baskino.re:443 [baskino.re/104.21.51.7, baskino.re/172.67.216.39] failed: Read timed out", 60, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 60, 60, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to baskino.re:443 [baskino.re/104.21.51.7, baskino.re/172.67.216.39] failed: Read timed out", 60, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://baskino.re/boeviki/", 10, 10, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to baskino.re:443 [baskino.re/104.21.51.7, baskino.re/172.67.216.39] failed: Read timed out", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://baskino.re/biografiya/", 10, 10, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to baskino.re:443 [baskino.re/104.21.51.7, baskino.re/172.67.216.39] failed: Read timed out", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://baskino.re/novinki-v2/", 10, 10, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to baskino.re:443 [baskino.re/104.21.51.7, baskino.re/172.67.216.39] failed: Read timed out", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://baskino.re/voennye/", 10, 10, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to baskino.re:443 [baskino.re/104.21.51.7, baskino.re/172.67.216.39] failed: Read timed out", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://baskino.re/vesterny/", 10, 10, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to baskino.re:443 [baskino.re/104.21.51.7, baskino.re/172.67.216.39] failed: Read timed out", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://baskino.re/films/", 10, 10, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to baskino.re:443 [baskino.re/104.21.51.7, baskino.re/172.67.216.39] failed: Read timed out", 10, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
