import { transition } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import * as Highcharts from 'highcharts';
import { Chart } from 'highcharts';
import { AppServiceService } from '../app-service.service';
import { animate, state, style, trigger } from '@angular/animations';
declare var require: any;
declare var google: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');
let windbarb = require('highcharts/modules/windbarb.src');


Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
windbarb(Highcharts);


export class Tomorrow {
  constructor(
    public data: Data,
    public city: string,
    public state: string,
    public latInfo: number,
    public lngInfo: number,
  ) { }
}

export class Data {
  constructor(
    public timelines: Timelines[],
  ) { }
}

export class Timelines {
  constructor(
    public timestep: string,
    public startTime: string,
    public endTime: string,
    public intervals: Intervals[],
  ) { }
}


export class Intervals {
  constructor(
    public startTime: string,
    public values: Value,
    public formatstartTime: string,
  ) { }
}

export class Value {
  constructor(
    public temperature: number,
    public humidity: number,
    public temperatureApparent: number,
    public temperatureMin: number,
    public temperatureMax: number,
    public windSpeed: number,
    public windDirection: number,
    public pressureSeaLevel: number,
    public uvIndex: number,
    public weatherCode: number,
    public precipitationProbability: number,
    public precipitationType: number,
    public sunriseTime: string,
    public sunsetTime: string,
    public visibility: number,
    public moonPhase: number,
    public cloudCover: number,
    public url: string,
    public status: string
  ) { }
}


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  animations: [
    trigger(
      'deenter', [
      transition(':enter', [style({ transform: 'translateX(100%)' }),
      animate('0.5s')
      ]),
    ]
    ),
    trigger(
      'resenter', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }),
      animate('0.5s')
      ]),
    ]
    )
  ]
})
export class ResultComponent implements OnInit {
  tomorrowInfo!: Tomorrow;
  addressInfo: any;
  forcastAt: any;
  showDayView: boolean = false;
  showDe: boolean = false;
  curdetail!: Intervals;
  showRes: boolean = true;
  showFav: boolean = false;
  showThree: boolean = false;
  showMeteogram: boolean = false;
  showChart: boolean = false;
  favList: Tomorrow[] = [];
  cityInfo: string = "*";
  stateInfo: string = "*";
  nodata: boolean = false;
  tweetUrl: string = ""
  chart!: any;
  dayChartData: any[] = []
  showBar: boolean = false;
  backfromde: boolean = false;

  shape = "star_outline";
  yellow = false;

  json: Intervals[] = [];
  hum: any[] = [];
  precipitations: any[] = [];
  precipitationsError: any[] = [];
  winds: any[] = [];
  temperatures: any[] = [];
  pressures: any[] = [];
  meteogram!: any;
  loader = new Loader({
    apiKey: 'AIzaSyADITdIjoEx8cBGnOJFw2j3jhrCqilLAXw'
  })


  constructor(private appService: AppServiceService) { }

  ngOnInit(): void {
    this.appService.tomcurrentMessage.subscribe(message => {
      if (message !== "*" && message.city !== "*" && message.state !== "*") {
        this.tomorrowInfo = message;
        this.tomorrowInfo.city = this.cityInfo;
        this.tomorrowInfo.state = this.stateInfo;
        this.forcastAt = this.tomorrowInfo.city + "," + this.tomorrowInfo.state;
        console.log("tom", this.tomorrowInfo);
        this.cityInfo = "*"
        this.stateInfo = "*"


      }
    });

    this.appService.addcurrentMessage.subscribe(message => {
      if (message !== "*") {
        this.addressInfo = message;
        var arr = message.split(" + ");

        console.log("address", this.forcastAt);

        this.showDayviewFunc();
        //console.log("show", this.showDayView);
        this.cityInfo = arr[0];
        this.stateInfo = arr[1];
        this.showDayView = true;
        this.showRes = true;
        this.showThree = true;
        this.yellow = false;
      } else {
        this.showRes = false;
        this.showDayView = false;
        this.showDe = false;
        this.showFav = false;
        this.nodata = false;

      }

    });

    this.appService.curFav.subscribe(message => {

      if (message !== "") {
        this.favList = message;
      }

    });

  }

  showDetail(cur: Intervals) {
    this.showRes = false;
    this.showDe = true;
    this.curdetail = cur;
    this.nodata = false;

    let data = {
      text: "The temperature in " + this.tomorrowInfo.city + " " + this.tomorrowInfo.state + " on " + cur.formatstartTime + "  is " + cur.values.temperature + " °F. The weather conditions are " + cur.values.status,
      hashtags: "CSCI571WeatherForecast",
    };
    const searchParams = new URLSearchParams(data);
    this.tweetUrl = "https://twitter.com/intent/tweet?" + searchParams.toString();


    var latInfo: number = this.tomorrowInfo.latInfo;
    var lngInfo: number = this.tomorrowInfo.lngInfo;
    this.loader.load().then(() => {
      var a = Number(latInfo);
      var b = Number(lngInfo);
      console.log(a, b)
      let t = document.getElementById("googlemap")
      if (t) {
        console.log("here");
        let map = new google.maps.Map(t, {
          center: { lat: a, lng: b },
          zoom: 16
        })
        const marker = new google.maps.Marker({
          position: { lat: a, lng: b },
          map: map,
        });
      }
    })

  }

  backRes() {
    this.showRes = true;
    this.showDayView = true;
    this.showDe = false;
    this.nodata = false;
    this.backfromde = true;
  }

  showResFunc() {
    this.showRes = true;
    this.showFav = false;
    this.nodata = false;
    this.backfromde = false;
    this.showDayviewFunc();
    this.nodata = false;

  }

  showFavFunc() {
    // this.appService.curFav.subscribe(message => {
    //   console.log("fav", this.favList);
    // });
    this.backfromde = false;
    if (this.favList.length == 0) {
      this.nodata = true;
      this.showFav = false;
      this.showRes = false;
      this.showDe = false;
    } else {
      this.nodata = false;
      this.showRes = false;
      this.showFav = true;
      this.showDe = false;
    }


  }

  addToFav() {
    this.backfromde = false;

    let dayviewLink = document.getElementById("favstar")
    if (dayviewLink) {
      console.log((dayviewLink as HTMLFormElement).style.color);
      (dayviewLink as HTMLFormElement).innerHTML = "star";
      if ((dayviewLink as HTMLFormElement).style.color !== "rgb(248, 213, 86)") {
        this.shape = "star";
        this.yellow = true;

        this.favList.push(this.tomorrowInfo)
        //console.log("add", this.favList);
        this.appService.changeFav(this.favList);
      } else {
        this.shape = "star-outline";
        this.yellow = false;
        this.favList = this.favList.filter(obj => obj.city !== this.tomorrowInfo.city);
      }
    }
  }

  deleteFav(cur: Tomorrow) {
    this.backfromde = false;
    this.favList = this.favList.filter(obj => obj.city !== cur.city);
    if (this.favList.length == 0) {
      this.nodata = true;
      this.showFav = false;
      this.showRes = false;
    }
  }

  directFav(cur: Tomorrow) {
    this.showFav = false;
    this.tomorrowInfo = cur;
    this.forcastAt = this.tomorrowInfo.city + "," + this.tomorrowInfo.state;
    this.showDayviewFunc();
  }

  showDayviewFunc() {
    this.backfromde = false;
    this.showDayView = true;
    this.showChart = false;
    this.showMeteogram = false;
    this.nodata = false;
    this.showDe = false;
    this.showRes = true;
    this.showThree = true;
    console.log(this.backfromde);
    let dayviewLink = document.getElementById("dayviewLink")
    if (dayviewLink) (dayviewLink as HTMLFormElement).className = "nav-link active";
    let DailyTempLink = document.getElementById("DailyTempLink")
    if (DailyTempLink) (DailyTempLink as HTMLFormElement).className = "nav-link";
    let Meteogram = document.getElementById("MeteogramLink")
    if (Meteogram) (Meteogram as HTMLFormElement).className = "nav-link";
  }

  showChartFunc() {
    this.backfromde = false;
    this.showDayView = false;
    this.showChart = true;
    this.showMeteogram = false;
    this.nodata = false;
    this.showDe = false;
    let dayviewLink = document.getElementById("dayviewLink")
    if (dayviewLink) (dayviewLink as HTMLFormElement).className = "nav-link";
    let DailyTempLink = document.getElementById("DailyTempLink")
    if (DailyTempLink) (DailyTempLink as HTMLFormElement).className = "nav-link active";
    let Meteogram = document.getElementById("MeteogramLink")
    if (Meteogram) (Meteogram as HTMLFormElement).className = "nav-link";

    for (let i = 0; i < this.tomorrowInfo.data.timelines[1].intervals.length; i++) {
      var cur = this.tomorrowInfo.data.timelines[1].intervals[i];
      var date = new Date(cur.formatstartTime);
      let temp = [];
      temp.push(date.getTime());
      temp.push(cur.values.temperatureMin)
      temp.push(cur.values.temperatureMax)
      this.dayChartData.push(temp)
    }
    //console.log(this.dayChartData)
    this.chart = {

      chart: {
        width: 1200,
        type: 'arearange',
        zoomType: 'x',
        scrollablePlotArea: {
          minWidth: 500,
          scrollPositionX: 1
        }
      },

      title: {
        text: 'Temperature Ranges (Min, Max)'
      },

      xAxis: {
        type: 'datetime',
        labels: {
          format: '{value:%e %b}'
        },
      },

      yAxis: {
        title: {
          text: null
        }
      },

      tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: '°C',
        xDateFormat: '%b %e, %Y'
      },

      legend: {
        enabled: false
      },

      series: [{
        name: 'Temperatures',
        data: this.dayChartData,
        lineColor: '#f7aa30',
        marker: {
          fillColor: '#7cb4ec',
        },
        color: {
          linearGradient: {
            x1: 0,
            y1: 1,
            x2: 0,
            y2: 0
          },
          stops: [
            [0, new Highcharts.Color('#f7aa30').setOpacity(1).get('rgba')],
            [1, new Highcharts.Color('#d9e6f2').setOpacity(1).get('rgba')],
          ]
        },
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, new Highcharts.Color('#f7aa30').setOpacity(1).get('rgba')],
            [1, new Highcharts.Color('#d9e6f2').setOpacity(0.2).get('rgba')],
          ]
        }
      }]
    };
    // Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0.25).get()

    Highcharts.chart('container1', this.chart);
    this.dayChartData = [];
  }

  showMeteogramFunc() {
    this.backfromde = false;
    this.nodata = false;
    let dayviewLink = document.getElementById("dayviewLink")
    if (dayviewLink) (dayviewLink as HTMLFormElement).className = "nav-link";
    let DailyTempLink = document.getElementById("DailyTempLink")
    if (DailyTempLink) (DailyTempLink as HTMLFormElement).className = "nav-link";
    let Meteogram = document.getElementById("MeteogramLink")
    if (Meteogram) (Meteogram as HTMLFormElement).className = "nav-link active";
    this.showDayView = false;
    this.showChart = false;
    this.showMeteogram = true;
    this.showDe = false;
    this.json = this.tomorrowInfo.data.timelines[0].intervals;
    this.parseData();
  }




  parseData() {
    let pointStart;
    this.json.forEach((node, i) => {
      const timeformat = node.startTime.substring(0, 19);
      const x = Date.parse(timeformat) - 7 * 36e5,
        to = x + 36e5;

      // Populate the parallel arrays
      this.temperatures.push({
        x,
        y: node.values["temperature"],
        // custom options used in the tooltip formatter
        to,
        format: timeformat
      });


      if (i % 2 === 0) {
        this.winds.push({
          x,
          value: node.values["windSpeed"],
          direction: node.values["windDirection"],
          format: timeformat
        });
      }
      this.hum.push({
        x,
        y: Math.floor(node.values["humidity"]),
        format: timeformat
      });
      this.pressures.push({
        x,
        y: node.values["pressureSeaLevel"],
        format: timeformat
      });

      if (i === 0) {
        pointStart = (x + to) / 2;
      }
    });


    this.meteogram = {
      chart: {
        width: 1100,
        height: 400,
        renderTo: "containter2",
        marginBottom: 70,
        marginRight: 40,
        marginTop: 50,
        plotBorderWidth: 1,
        alignTicks: false,
        scrollablePlotArea: {
          minWidth: 720
        }
      },

      defs: {
        patterns: [{
          id: 'precipitation-error',
          path: {
            d: [
              'M', 3.3, 0, 'L', -6.7, 10,
              'M', 6.7, 0, 'L', -3.3, 10,
              'M', 10, 0, 'L', 0, 10,
              'M', 13.3, 0, 'L', 3.3, 10,
              'M', 16.7, 0, 'L', 6.7, 10
            ].join(' '),
            stroke: '#68CFE8',
            strokeWidth: 1
          }
        }]
      },

      title: {
        text: 'Hourly Weather (For Next 5 Days)',
        align: 'center',
        style: {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }
      },


      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat:
          '<small>{point.x:%A, %b %e, %H:%M}</small><br>' +
          '<b>{point.point.symbolName}</b><br>'

      },

      xAxis: [{ // Bottom X axis
        type: 'datetime',
        tickInterval: 4 * 36e5, // two hours
        minorTickInterval: 36e5, // one hour
        tickLength: 0,
        gridLineWidth: 1,
        gridLineColor: 'rgba(128, 128, 128, 0.1)',
        startOnTick: false,
        endOnTick: false,
        minPadding: 0,
        maxPadding: 0,
        offset: 30,
        showLastLabel: true,
        labels: {
          format: '{value:%H}'
        },
        crosshair: true
      }, { // Top X axis
        linkedTo: 0,
        type: 'datetime',
        tickInterval: 24 * 3600 * 1000,
        labels: {
          format: '{value:<span style="font-size: 10px; font-weight: bold">%a</span> %b %e}',
          align: 'left',
          x: 3,
          y: -5,
          style: {
            fontSize: '10px',
          }
        },
        opposite: true,
        tickLength: 20,
        gridLineWidth: 1
      }],

      yAxis: [{ // temperature axis
        title: {
          text: null
        },
        labels: {
          format: '{value}°',
          style: {
            fontSize: '10px'
          },
          x: -3
        },
        plotLines: [{ // zero plane
          value: 0,
          color: '#BBBBBB',
          width: 1,
          zIndex: 2
        }],
        maxPadding: 0.3,
        minRange: 8,
        tickInterval: 1,
        gridLineColor: 'rgba(128, 128, 128, 0.1)'

      }, { // precipitation axis
        title: {
          text: null
        },
        labels: {
          enabled: false
        },
        gridLineWidth: 0,
        tickLength: 0,
        minRange: 10,
        min: 0

      }, { // Air pressure
        allowDecimals: false,
        title: { // Title on top of axis
          text: 'inHg',
          offset: 0,
          align: 'high',
          rotation: 0,
          style: {
            fontSize: '10px',
            color: '#deaf54'
          },
          textAlign: 'left',
          x: 3,
        },
        labels: {
          style: {
            fontSize: '8px',
            color: '#deaf54',
          },
          y: 2,
          x: 3
        },
        gridLineWidth: 0,
        opposite: true,
        showLastLabel: false
      }],

      legend: {
        enabled: false
      },

      plotOptions: {
        series: {
          pointPlacement: 'between'
        }
      },


      series: [
        {
          name: 'Temperature',
          data: this.temperatures,
          type: 'spline',
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true
              }
            }
          },
          tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
              '{series.name}: <b>{point.y}°F</b><br/>'
          },
          zIndex: 1,
          color: '#FF3333',
          negativeColor: '#48AFE8'
        }, {

          type: 'column',
          pointWidth: 7,
          data: this.hum,
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '8px',
              fontWeight: 'normal'
            }
          },
          tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
              'Humidity: <b>{point.y}%</b><br/>'

          },
          //colorByPoint: true
        },
        {
          name: 'Air pressure',
          data: this.pressures,
          marker: {
            enabled: false
          },
          color: '#deaf54',
          shadow: false,
          tooltip: {
            valueSuffix: ' inHg'
          },
          dashStyle: 'shortdot',
          yAxis: 2
        }, {
          name: 'Wind',
          type: 'windbarb',
          id: 'windbarbs',
          lineWidth: 1.5,
          data: this.winds,
          vectorLength: 10,
          color: '#000',
          yOffset: -15,
          xOffset: -5,
        }]
    };
    Highcharts.chart('container2', this.meteogram);
    this.json = [];
    this.hum = [];
    this.precipitations = [];
    this.precipitationsError = [];
    this.winds = [];
    this.temperatures = [];
    this.pressures = [];
  }






}

