      var

        TimeReport = {

          __rows          : [],
          __rowIndex      : {},

          _hasHeaders     : false,
          _hasSummaryHeader : false,
          OUTPUT_STARTED : false,

          _reportheaders  : document.getElementById('reportheaders'),
          _reportbody     : document.getElementById('reportbody'),
          _reportdays     : {},


          DATA : null,


          addReportLine : function (el, idx, arr) {

            var
              day   = null,
              line  = {},
              self  = TimeReport;

            if(!!el.date) {
              day = self.sanitizeRowId(el.date);
            }

            // top line of report for this day, equals the number of total sessions started
            if(typeof el.avg_total !== "undefined" && Math.round(el.avg_total) === 0) {
              if(self.OUTPUT_STARTED) {
                self._addDateHeader(el);
              }
            }

            if(!self._hasHeaders) {
              self._hasHeaders = self._addSummaryHeaders(el);
            }

            // line = {date: el.date, title: "Time", chart: "", sum: el.sum, percentage: ""};
            self.OUTPUT_STARTED = true;
            return self._addReportLine(el, idx, arr);
          },


          _addReportLine  : function (row) {

            if(this.__rowIndex[this.sanitizeRowId(row.date)]) {
              console.log("updating row:", row);
              return this.updateRow(row);
            }
            this.__rowIndex[this.sanitizeRowId(row)] = this.__rows.push(row)-1;
            return this._addRow(row);
          },


          _addRow : function (row) {
            var
              cell      = null,
              chart     = null,
              trow      = document.createElement('tr'),
              fragment  = document.createDocumentFragment(),
              filter    = { 
                sum:  true,
                date: true,
                avg_total: true,
                avg_active: true,
                 };
              


            for( var idx in row ) {

              // if(idx==="sum") {

              //   // add visual progressbar
              //   chart = document.createElement('div');
              //   chart.setAttribute('class', 'progressbar')
              //   cell = document.createElement('td');
              //   cell.appendChild(chart);
              //   trow.appendChild(cell);
              // }

              cell = document.createElement('td');
              cell.classList.add(idx);
              trow.appendChild(cell);

              // leave cells empty for columns that aren't in the filter set
              if(!filter[idx]) {
                continue;
              }
              cell.appendChild(document.createTextNode(row[idx]));
            }


            var
              rowId = this.sanitizeRowId(row);

            trow.setAttribute('id', rowId);
            fragment.appendChild(trow);
            this.__rowIndex[rowId] = {element: trow};
            return this._reportbody.appendChild(fragment);
          },




          _addDateHeader : function (row) {
            var
              cell      = null,
              trow      = document.createElement('tr'),
              fragment  = document.createDocumentFragment(),
              filter    = { 
                sum:  false,
                date: true,
                avg_total: false,
                avg_active: false,
              };

            // add TDs to TR element
            for( var idx in row ) {
              cell = document.createElement('td');
              cell.classList.add(idx);
              trow.appendChild(cell);

              // leave cells empty for columns that aren't in the filter set
              if(!filter[idx]) {
                continue;
              }
              cell.appendChild(document.createTextNode(row[idx]));
            }

            trow.classList.add('dateline');

            // add all the TDs to docFrag
            fragment.appendChild(trow);

            console.log("adding date header:")

            // then add everything to the DOM in one go
            this._reportbody.appendChild(fragment);

          },


          _addSummaryHeaders : function (row) {
            var
              cell      = null,
              trow      = document.createElement('tr'),
              fragment  = document.createDocumentFragment(),
              result    = false,
              headers = ["date", "time", "", "sum", "percent"];


            for( var idx in row ) {
              cell = document.createElement('td');
              cell.appendChild(document.createTextNode(idx));
              trow.appendChild(cell);
            }

            fragment.appendChild(trow);
            result = this._reportheaders.appendChild(fragment) || false;

            console.log("adding summary headers");
            return result;
          },




          // sanitize dates to valid element ids
          sanitizeRowId : function (el, prefix) {
            var
              prefix  = prefix  || "r",
              el      = el      || false,
              result  = "";


            if(!el) {
              return "sanitizeError_noElement";
            }

            if(!el.date) {
              return "sanitizeError_noDate";
            }

            if(!el.avg_total) {
              return "sanitizeError_noAvgTotalTime";
            }

            result = prefix;
            result += el.date.replace('-','_');
            result += "_" + Math.floor(el.avg_total);

            return result;
          },




          setSummary : function (data) {
            var
              DATA = (typeof data === "string") ? JSON.parse(data) : data || false;


            console.log("Setting summary");

            if(DATA) {
              console.log("Setting summary");
              DATA.forEach(this.addReportLine);
             }
          },


          refresh : function (data) {

            this.DATA = (typeof data === "string") ? JSON.parse(data) : data || false;

            if(this.DATA) {
              this.DATA.forEach(this.addReportLine);
             }
          },


          __init : function (options) {
            return true;
          },


          run : function (options) {
            return this.__init(options);
          }

        };





