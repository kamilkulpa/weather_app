const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

const apiKey = 'a1847d80938a86782840f99b9947c203';
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.render('index');
    var today = new Date();
    var d = today.getUTCDate();
    console.log(d);
});

app.post('/', (req, res) => {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    request(url, function (err, response, body) {
        if (response) console.log(response)
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
                let k = 0;
                let date = [];
                for (let i = 0; i < weather.list.length; i++) {
                    let dateUTC = new Date(weather.list[i].dt_txt);
                    var dateGMT = new Date();
                    dateGMT.setTime(dateUTC - (dateGMT.getTimezoneOffset() * 60000));
                    let j = date.length;
                    if (date[j - 1] != dateGMT.toLocaleDateString()) {
                        date[j] = dateGMT.toLocaleDateString();
                        weatherTextAll[j - 1] = weatherText;
                        k = 0;
                        weatherText = [];
                    }
                   
                    weatherText[k] = `${dateGMT.toLocaleTimeString()}: ${weather.list[i].main.temp} \u00B0 C `
                    k++;
                }
                let j = date.length;
                weatherTextAll[j - 1] = weatherText;

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