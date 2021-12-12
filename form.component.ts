import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppServiceService } from '../app-service.service';



export class Tomorrow {
  constructor(
    public latInfo: number,
    public lngInfo: number,
    public data: Data,
    //public warnings: object,
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
    public formatstartTime: string,
    public values: Value,
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



export class Geo {
  constructor(
    public results: GeoInfo[],
    public code: object,
  ) { }
}

export class GeoInfo {
  constructor(
    public geometry: GeometryInfo,
    public code: object,
  ) { }
}

export class GeometryInfo {
  constructor(
    public location: LocationInfo,
    public code: object,
  ) { }
}

export class LocationInfo {
  constructor(
    public lat: number,
    public lng: number,
  ) { }
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  geo: any;
  tomorrow!: Tomorrow;
  data: any;
  ipInfo: any;
  searchForm: FormGroup
  needDisable = false;
  showBar: boolean = false;

  constructor(private formBuilder: FormBuilder, public appService: AppServiceService, private http: HttpClient) {
    this.searchForm = new FormGroup({
      street: new FormControl(null, Validators.required),
      city: formBuilder.control(null, Validators.required),
      state: formBuilder.control(''),
      auto: formBuilder.control(false),
    })
    console.log(this.searchForm.valid)
  }



  // readonly url = 'https://weatherhw8-331017.wl.r.appspot.com/?lat=-73.98529171943665&lon=4.75872069597532&auto=false'
  post: any;
  streetInfo = '';
  cityInfo = '';
  stateInfo = '';
  autoInfo: boolean = false;
  lonInfo = 0;
  latInfo = 0;
  addressInfo = '';
  message: any;
  formatAddr = '';



  // public onSubmit() {
  //   console.log("search")
  //   this.appService.getData().subscribe(data => {
  //     this.post = data;
  //     console.log(data)
  //   })
  // }
  getng() {
    //console.log(this.streetInfo, this.cityInfo, this.stateInfo)

    //AIzaSyADITdIjoEx8cBGnOJFw2j3jhrCqilLAXw
    //https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyADITdIjoEx8cBGnOJFw2j3jhrCqilLAXw
    if (!this.needDisable) {
      var location = this.streetInfo + this.cityInfo + this.stateInfo;
      var geoUrl = "https://maps.googleapis.com/maps/api/geocode/json";
      this.http.get<any>(geoUrl, {
        params: {
          address: location,
          key: 'AIzaSyADITdIjoEx8cBGnOJFw2j3jhrCqilLAXw'
        }
      }).subscribe(response => {
        this.geo = response;
        //onsole.log(typeof (this.geo?.results[0].geometry.location.lat))
        this.latInfo = this.geo?.results[0].geometry.location.lat;
        this.lonInfo = this.geo?.results[0].geometry.location.lng;
        console.log("geo", this.latInfo, this.lonInfo);
        this.addressInfo = this.cityInfo + " + " + this.stateInfo;
        this.showBar = true;
        setTimeout(() => {
          this.showBar = false;
          this.appService.changeaddMessage(this.addressInfo);
        }, 2000);

        //console.log(this.latInfo, this.lonInfo)
        //console.log(this.geo?.results[0].geometry.location.lat, this.geo?.results[0].geometry.location.lng)
      })
    } else {
      this.addressInfo = this.ipInfo.city + " + " + this.ipInfo.region;
      this.showBar = true;
      setTimeout(() => {
        this.showBar = false;
        this.appService.changeaddMessage(this.addressInfo);
      }, 2000);
    }

    //this.http.get('https://weatherhw8-331017.wl.r.appspot.com/?lat=-73.98529171943665&lon=4.75872069597532&auto=false');
    // this.appService.getData().subscribe(data => {
    //   this.post = data;
    //   console.log(data)
    // })
    // lat = response["results"][0]["geometry"]["location"]["lat"]
    // lng = response["results"][0]["geometry"]["location"]["lng"]

    setTimeout(() => {
      var backUrl = "https://weatherhw8-331017.wl.r.appspot.com/";
      console.log("click", this.latInfo, this.lonInfo);
      this.http.get<Tomorrow>(backUrl, {
        params: {
          lat: this.latInfo,
          lon: this.lonInfo,
        }
      }).subscribe(response => {
        this.tomorrow = response;
        for (let index: number = 0; index < response.data.timelines.length; index++) {
          var curtl = response.data.timelines[index];
          for (let indexj: number = 0; indexj < curtl.intervals.length; indexj++) {
            var curSt = curtl.intervals[indexj].startTime;
            var dateInfo = curSt.split("-");
            var year = dateInfo[0];
            var month = dateInfo[1];
            var day = dateInfo[2].substring(0, 2);

            const weekday = new Array("Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            );
            const months = new Array("Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec");

            let date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            let dayOfWeekNumber = date.getDay();
            curSt = weekday[dayOfWeekNumber] + ", " + day + " " + months[parseInt(month) - 1] + " " + year;
            curtl.intervals[indexj].formatstartTime = curSt;

            if (curtl.intervals[indexj].values.weatherCode === 1000) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/clear_day.svg";
              curtl.intervals[indexj].values.status = "Clear"
            }
            if (curtl.intervals[indexj].values.weatherCode === 1100) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/mostly_clear_day.svg";
              curtl.intervals[indexj].values.status = "Mostly Clear"
            }
            if (curtl.intervals[indexj].values.weatherCode === 1101) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/partly_cloudy_day.svg";
              curtl.intervals[indexj].values.status = "Partly Cloudy"
            }
            if (curtl.intervals[indexj].values.weatherCode === 1102) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/mostly_cloudy.svg";
              curtl.intervals[indexj].values.status = "Mostly Cloudy"
            }
            if (curtl.intervals[indexj].values.weatherCode === 1001) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/cloudy.svg";
              curtl.intervals[indexj].values.status = "Cloudy"
            }
            if (curtl.intervals[indexj].values.weatherCode === 2000) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/fog.svg";
              curtl.intervals[indexj].values.status = "Fog"
            }
            if (curtl.intervals[indexj].values.weatherCode === 2100) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/fog_light.svg";
              curtl.intervals[indexj].values.status = "Light Fog"
            }
            if (curtl.intervals[indexj].values.weatherCode === 8000) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/tstorm.svg";
              curtl.intervals[indexj].values.status = "Thunderstorm"
            }
            if (curtl.intervals[indexj].values.weatherCode === 5001) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/flurries.svg";
              curtl.intervals[indexj].values.status = "Flurries"
            }
            if (curtl.intervals[indexj].values.weatherCode === 5100) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/snow_light.svg";
              curtl.intervals[indexj].values.status = "Light Snow"
            }
            if (curtl.intervals[indexj].values.weatherCode === 5000) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/snow.svg";
              curtl.intervals[indexj].values.status = "Snow"
            }
            if (curtl.intervals[indexj].values.weatherCode === 5101) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/snow_heavy.svg";
              curtl.intervals[indexj].values.status = "Heavy Snow"
            }
            if (curtl.intervals[indexj].values.weatherCode === 7102) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/ice_pellets_light.svg";
              curtl.intervals[indexj].values.status = "Light Ice Pellets"
            }
            if (curtl.intervals[indexj].values.weatherCode === 7000) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/ice_pellets.svg";
              curtl.intervals[indexj].values.status = "Ice Pellets"
            }
            if (curtl.intervals[indexj].values.weatherCode === 7101) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/ice_pellets_heavy.svg";
              curtl.intervals[indexj].values.status = "Heavy Ice Pellets"
            }
            if (curtl.intervals[indexj].values.weatherCode === 4000) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/drizzle.svg";
              curtl.intervals[indexj].values.status = "Drizzle"
            }
            if (curtl.intervals[indexj].values.weatherCode === 6000) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/freezing_drizzle.svg";
              curtl.intervals[indexj].values.status = "Freezing Drizzle"
            }
            if (curtl.intervals[indexj].values.weatherCode === 6200) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/freezing_rain_light.svg";
              curtl.intervals[indexj].values.status = "Light Freezing Rain"
            }
            if (curtl.intervals[indexj].values.weatherCode === 6001) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/freezing_rain.svg";
              curtl.intervals[indexj].values.status = "Freezing Rain"
            }
            if (curtl.intervals[indexj].values.weatherCode === 6201) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/freezing_rain_heavy.svg";
              curtl.intervals[indexj].values.status = "Heavy Freezing Rain"
            }
            if (curtl.intervals[indexj].values.weatherCode === 4200) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/rain_light.svg";
              curtl.intervals[indexj].values.status = "Light Rain"
            }
            if (curtl.intervals[indexj].values.weatherCode === 4001) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/rain.svg";
              curtl.intervals[indexj].values.status = "Rain"
            }
            if (curtl.intervals[indexj].values.weatherCode === 4201) {
              curtl.intervals[indexj].values.url = "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/d53e9d2ffc4d7e182f91d8fda333b189aaea7a13/color/rain_heavy.svg";
              curtl.intervals[indexj].values.status = "Heavy Rain"
            }
          }
        }
        this.send();
      })

    }, 1000);


    // this.data.geoInfo = this.geo;
    // this.data.tomInfo = this.tomorrow;


  }

  send() {
    this.tomorrow.latInfo = this.latInfo;
    this.tomorrow.lngInfo = this.lonInfo;
    console.log("get", this.tomorrow);
    this.showBar = true;
    setTimeout(() => {
      this.showBar = false;
      this.appService.changetomMessage(this.tomorrow);
    }, 1000);
  }

  //https://ipinfo.io/json?token=8dccb3b9c65547
  ngOnInit(): void {
    this.appService.tomcurrentMessage.subscribe(message => this.message = message);
    this.appService.addcurrentMessage.subscribe(message => this.message = message);
    this.appService.curFav.subscribe(message => this.message = message);
    this.http.get('https://ipinfo.io/json?token=8dccb3b9c65547').subscribe(response => {
      this.ipInfo = response;
      var loc = this.ipInfo.loc;
      const words = loc.split(',');
      this.latInfo = words[0];
      this.lonInfo = words[1];
    })
  }

  checkAuto() {
    this.needDisable = !this.needDisable;
    //this.form.controls['name'].disable();
    if (this.needDisable) {
      this.searchForm.controls["street"].setValue("");
      this.searchForm.controls["city"].setValue("");
      this.searchForm.controls["state"].setValue("");
      this.searchForm.controls["street"].disable();
      this.searchForm.controls["city"].disable();
      this.searchForm.controls["state"].disable();
      // this.http.get('https://ipinfo.io/json?token=8dccb3b9c65547').subscribe(response => {
      //   this.ipInfo = response;
      //   var loc = this.ipInfo.loc;
      //   const words = loc.split(',');
      //   this.latInfo = words[0];
      //   this.lonInfo = words[1];
      // })
    } else {
      this.searchForm.controls["street"].enable();
      this.searchForm.controls["city"].enable();
      this.searchForm.controls["state"].enable();
    }

  }

  resetView() {
    this.searchForm.controls["street"].enable();
    this.searchForm.controls["city"].enable();
    this.searchForm.controls["state"].enable();
    this.searchForm.controls["street"].setValue("");
    this.searchForm.controls["city"].setValue("");
    this.searchForm.controls["state"].setValue("Select your state");
    this.searchForm.controls["auto"].setValue("");
    this.needDisable = !this.needDisable;
    this.addressInfo = "*";
    this.appService.changeaddMessage(this.addressInfo);
    let inp = document.getElementById("streetInput")
    // if (inp) {
    //   (inp as HTMLFormElement).style.border = "1px solid grey";
    // }
    // let inp1 = document.getElementById("cityInput")
    // if (inp1) {
    //   (inp1 as HTMLFormElement).style.border = "1px solid grey";
    // }
    let small1 = document.getElementById("small1")
    if (small1) {
      (small1 as HTMLFormElement).style.display = "none";
    }
    let small2 = document.getElementById("small2")
    if (small2) {
      (small2 as HTMLFormElement).style.display = "none";
    }

    //this.searchForm.get('street')?.touched = false;
  }

  // options = {
  //   componentRestrictions: {
  //     country: ['US']
  //   }
  // }

  // public handleAddressChange(address: any) {
  //   this.formatAddr = address.formatted_address;
  // }

}


