import { Component } from '@angular/core';

//import xml2js from 'xml2js';  
declare const require;
const xml2js = require("xml2js");

import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent {

  public xmlItems: any;
  constructor(private _http: HttpClient) { this.loadXML(); }
  loadXML() {
    let arr = []
    this._http.get('http://localhost:8081/files/jacoco.xml',
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/xml')
          .append('Access-Control-Allow-Methods', 'GET')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
        responseType: 'text'
      })
      .subscribe((data) => {
        this.parseXML(data).then((data) => {
          this.xmlItems = data;
        });

      });
  }

  parseXML(data) {
    return new Promise(resolve => {
      var k: string | number,
        jacocoArray = [],
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      parser.parseString(data, function (err, result) {
        var obj = result.report;
        for (var i = 0; i < obj.counter.length; i++) {
          console.log(obj.counter[i].$.type)
        }

        for (k in obj.counter) {

          var item = obj.counter[k].$;

          var coveredNumber = Number(item.covered)
          var missedNumber = Number(item.missed)
          var sum = coveredNumber + missedNumber

          var percentage = (100 * coveredNumber) / sum

          jacocoArray.push({
            type: item.type,
            covered: item.covered,
            missed: item.missed,
            percentage: percentage.toFixed(2),

          });
        }
        resolve(jacocoArray);
      });
    });
  }


  /*   parseXML(data) {  
      return new Promise(resolve => {  
        var k: string | number,  
          arr = [],  
          parser = new xml2js.Parser(  
            {  
              trim: true,  
              explicitArray: true  
            });  
        parser.parseString(data, function (err, result) {  
          var obj = result.Employee;  
          for (k in obj.emp) {  
            var item = obj.emp[k];  
            arr.push({  
              id: item.id[0],  
              name: item.name[0],  
              gender: item.gender[0],  
              mobile: item.mobile[0]  
            });  
          }  
          resolve(arr);  
        });  
      });  
    }  
    */
} 