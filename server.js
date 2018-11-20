const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

require('dotenv').config();
const weatherApiKey = process.env.weatherApiKey
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.render('index');
    var today = new Date();
    var d = today.getUTCDate();
});

app.post('/', (req, res) => {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${weatherApiKey}`
    request(url, function (err, response, body) {
        if (response)
            if (err) {
                res.render('index', {
                    weather: null,
                    error: 'Error, please try again!'
                });
            } else {
                let weather = JSON.parse(body)
                if (weather.cnt == undefined) {
                    res.render('index', {
                        weather: null,
                        error: 'Error, please try again1'
                    });
                } else {
                    let cityText = weather.city.name;
                    let weatherText = [];
                    let weatherTextAll = [];
                    let weatherTextIndex = 0;
                    let date = [];
                    for (let i = 0; i < weather.list.length; i++) {
                        let dateUTC = new Date(weather.list[i].dt_txt);
                        var dateGMT = new Date();
                        dateGMT.setTime(dateUTC - (dateGMT.getTimezoneOffset() * 60000));
                        let dateLength = date.length;
                        if (date[dateLength - 1] != dateGMT.toLocaleDateString()) {
                            date[dateLength] = dateGMT.toLocaleDateString();
                            weatherTextAll[dateLength - 1] = weatherText;
                            weatherTextIndex = 0;
                            weatherText = [];
                        }

                        weatherText[weatherTextIndex] = `${dateGMT.toLocaleTimeString()}: ${weather.list[i].main.temp} \u00B0 C,  `
                        weatherTextIndex++;
                    }
                    let dateLength = date.length;
                    weatherTextAll[dateLength - 1] = weatherText;

                    res.render('index', {
                        city: cityText,
                        weather: weatherTextAll,
                        dates: date,
                        error: null
                    });
                }
            }
    })
});

app.set('view engine', 'pug')
app.use(express.static('public'));
app.listen(3010, function () {
    console.log('App listening on port 3010!');
});