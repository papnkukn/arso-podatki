var fs = require('fs');
var path = require('path');
var request = require('request');

var Meteo = require('../lib/Meteo.js');

var meteo = new Meteo();

/*
meteo.getSloveniaLatest(function(error, data, xml) {
  if (error) return console.error(error);
  fs.writeFileSync("meteo_si_latest.xml", xml);
  fs.writeFileSync("meteo_si_latest.json", JSON.stringify(data, " ", 2));
  console.log("Done!");
});
*/

var xml = fs.readFileSync('../test/fixtures/fcast_slovenia_latest.xml', 'utf-8');
meteo.parseWeather(xml, function(error, data) {
  if (error) return console.error(error);
  fs.writeFileSync("meteo_fixture.json", JSON.stringify(data, " ", 2));
  console.log("Done!");
});
