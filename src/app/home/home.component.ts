import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';
import { TableStats, TableStatsResult } from '@app/home/tableStatsResult';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  quote: string;
  isLoading: boolean;
  tableStatsResult: TableStatsResult;
  title: string;

  constructor(private quoteService: QuoteService) { }

  ngOnInit() {
    // this.title = "ori";
    this.isLoading = true;
    this.quoteService.getRandomQuote({ category: 'dev' })
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe((quote: string) => { this.quote = quote; });

    $.ajax({
       url: "https://eventguests-server-us.herokuapp.com/wizelyapi1/gettablesstats?event_id=1",
//      url: "http://212.179.232.90:1337/wizelyapi1/gettablesstats?event_id=1",
      data: null,
      async: false,
      contentType: 'application/json',
      type: 'GET',
      success: function (data: any) {
        this.tableStatsResult = JSON.parse(data);
        var eventData = this.tableStatsResult.eventData[0];
        this.title = "סיכום האירוע " + "(" + eventData.name + " " + eventData.event_date + ")";
        $(".header").html(this.title + "&rlm;");// "&#x200F")
        $("#totalApproved").html("סך הכל אישרו הגעה : " + this.tableStatsResult.overallStats[0].approved)
        $("#totalArrived").html("סך הכל הגיעו בפועל : " + this.tableStatsResult.overallStats[0].arrived)
        $("#totalPercentage").html("אחוז הגעה : " + Math.round(this.tableStatsResult.overallStats[0].percentage * 100) / 100 + "%");
        // var allTablesStats = this.tableStatsResult.tableStats;
        // allTablesStats.forEach((element: any) => {
        //   //console.log(element.table_number);
        // });
        // alert('success');
        //alert('now1');
        CreateTableFromJSON(this.tableStatsResult);
      },
      error: function (data: any) {
        alert('error!');
      }
    });


    function CreateTableFromJSON(tableStatsResult: any) {

      // var myBooks = [
      //   {
      //     "Book ID": "1",
      //     "Book Name": "Computer Architecture",
      //     "Category": "Computers",
      //     "Price": "125.60"
      //   },
      //   {
      //     "Book ID": "2",
      //     "Book Name": "Asp.Net 4 Blue Book",
      //     "Category": "Programming",
      //     "Price": "56.00"
      //   },
      //   {
      //     "Book ID": "3",
      //     "Book Name": "Popular Science",
      //     "Category": "Science",
      //     "Price": "210.40"
      //   }
      // ]

      // EXTRACT VALUE FOR HTML HEADER. 
      // ('Book ID', 'Book Name', 'Category' and 'Price')
      // alert('now2');
      var myBooks = tableStatsResult.tableStats;
      var colNamesDict = []; // create an empty array

      colNamesDict.push({
        key: "table_number",
        value: "מספר שולחן"
      });
      colNamesDict.push({
        key: "approved",
        value: "אורחים שאישרו"
      });
      colNamesDict.push({
        key: "arrived",
        value: "אורחים שהגיעו"
      });
      colNamesDict.push({
        key: "percentage",
        value: "אחוז הגעה"
      });
      colNamesDict.push({
        key: "guests",
        value: "רשימת האורחים"
      });

      var col: any[] = [];
      for (var i = 0; i < myBooks.length; i++) {
        //myBooks[i].guests = "<span>+</span>";
        for (var key in myBooks[i]) {
          if (col.indexOf(key) === -1) {
            col.push(key);
          }
        }
      }

      // CREATE DYNAMIC TABLE.
      var table = document.createElement("table");
      table.className = "eventTables";

      // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

      var tr = table.insertRow(-1);                   // TABLE ROW.

      for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        var colVisualName = colNamesDict.filter(function (element) {
          return element.key == col[i];
        })[0].value;
        th.innerHTML = colVisualName;// col[i];
        tr.appendChild(th);
      }

      // ADD JSON DATA TO THE TABLE AS ROWS.
      for (var i = 0; i < myBooks.length; i++) {

        tr = table.insertRow(-1);
        tr.className = "header";

        for (var j = 0; j < col.length; j++) {
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = myBooks[i][col[j]];
          if (j == 4)
            tabCell.innerHTML = "<span>+</span>";

          //custom formatting:
          if (j == 3) {
            var val = myBooks[i][col[j]];
            tabCell.innerHTML = String(Math.round(val * 100) / 100) + " %";
          }
        }

        //guests row
        tr = table.insertRow(-1);
        tr.className = "allGuests";
        tr.style.display = 'none';

        var colNamesDict2 = []; // create an empty array

        colNamesDict2.push({
          key: "guest_id",
          value: "מספר אורח"
        });
        colNamesDict2.push({
          key: "event_id",
          value: "מספר אירוע"
        });
        colNamesDict2.push({
          key: "name",
          value: "שם האורח"
        });
        colNamesDict2.push({
          key: "table_number",
          value: "מספר השולחן"
        });
        colNamesDict2.push({
          key: "num_guests",
          value: "אורחים שאישרו"
        });
        colNamesDict2.push({
          key: "new_table_number",
          value: "מספר שולחן חדש"
        });
        colNamesDict2.push({
          key: "new_num_guests",
          value: "אורחים שהגיעו"
        });
        colNamesDict2.push({
          key: "new_arrival_time",
          value: "שעת הגעה"
        });
        colNamesDict2.push({
          key: "new_handled_by",
          value: "טופל על ידי"
        });
        colNamesDict2.push({
          key: "comments",
          value: "הערות"
        });
        colNamesDict2.push({
          key: "phone",
          value: "מספר טלפון"
        });
        colNamesDict2.push({
          key: "side",
          value: "צד"
        });
        colNamesDict2.push({
          key: "category",
          value: "קבוצה"
        });

        let col2: any[] = [];
        var myBooks2 = myBooks[i].guests;
        for (var j = 0; j < myBooks2.length; j++) {
          for (var key in myBooks2[j]) {
            if (col2.indexOf(key) === -1) {
              col2.push(key);
            }
          }
        }

        // CREATE DYNAMIC TABLE.
        let tableInner = document.createElement("table");
        tableInner.className="tableGuests";


        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        let tr2 = tableInner.insertRow(-1);                   // TABLE ROW.

        for (var j = 0; j < col2.length; j++) {
          let th2 = document.createElement("th");      // TABLE HEADER.
          var colVisualName2 = colNamesDict2.filter(function (element) {
            return element.key == col2[j];
          })[0].value;
          th2.innerHTML = colVisualName2;// col[i];
          tr2.appendChild(th2);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var j = 0; j < myBooks2.length; j++) {

          tr2 = tableInner.insertRow(-1);
          // tr.className = "header";

          for (var k = 0; k < col2.length; k++) {
            var tabCell2 = tr2.insertCell(-1);
            tabCell2.innerHTML = myBooks2[j][col2[k]];
            // if (j == 4)
            //   tabCell.innerHTML = "<span>+</span>";

            // //custom formatting:
            // if (j == 3) {
            //   var val = myBooks2[i][col[j]];
            //   tabCell.innerHTML = String(Math.round(val * 100) / 100) + " %";
            // }
          }
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var tabCell2 = tr.insertCell(-1);
        tabCell2.innerHTML = "";
        tabCell2.appendChild(tableInner);
        
        //var divContainer = document.getElementsByClassName("eventTables")[0];
        //divContainer.innerHTML = "";
        //divContainer.appendChild(tableInner)

      }

      // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
      var divContainer = document.getElementsByClassName("eventTablesDiv")[0];
      divContainer.innerHTML = "";
      divContainer.appendChild(table)


      //Register to toggle guests event
      var toggle = function () {
        $(this).find('span').text(function (_: any, value: any) { return value == '-' ? '+' : '-' });
        $(this).nextUntil('tr.header').slideToggle(50, function () {
        });
      };
      $('.header').click(toggle);
    };

  }


}
