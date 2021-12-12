


const express = require('express')
const request = require('request')
const app = express();
const cors = require("cors");

app.use(
    cors({
        origin: "*",
    })
)

//https://weatherhw8-331017.wl.r.appspot.com/?lat=-73.98529171943665&lon=40.75872069597532&auto=false
//https://weatherhw8-331017.wl.r.appspot.com/
//http://localhost:4200/?street=770%20S%20Grand%20Ave,%20Apt%207069&city=Los%20Angeles&state=California
// http://localhost:4600/api/?lat=-73.98529171943665&lon=40.75872069597532&auto=false

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
    //console.log(req.originalUrl);
    var baseUrl = "https://api.tomorrow.io/v4/timelines?location=";
    var urltail = '&fields=temperature&fields=humidity&fields=temperatureApparent&fields=temperatureMin&fields=temperatureMax&fields=windSpeed&fields=windDirection&fields=pressureSeaLevel&fields=uvIndex&fields=weatherCode&fields=precipitationProbability&fields=precipitationType&fields=sunriseTime&fields=sunsetTime&fields=visibility&fields=moonPhase&fields=cloudCover&units=imperial&timesteps=1h&timesteps=1d&timesteps=current&timezone=America/Los_Angeles&apikey=mlKq38WsS2gQpTXtHtucSDc4D5zZhpaJ';
    
    const url = baseUrl + req.query.lat + ',' + req.query.lon + urltail;
    console.log("url", url);
    var data;
    request({url: url}, (error, response) => {
        data = JSON.parse(response.body)
        console.log(data.data)
        res.json(data) 
    })
})



const port = process.env.PORT || 4600;

app.listen(port, (req, res) => {
    console.log('RUNNING');
})


module.exports = app;


