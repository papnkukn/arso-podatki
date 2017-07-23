var fs = require('fs');
var path = require('path');

var Arso = require('../lib/Arso.js');

var arso = new Arso();

var config = {
  dir: path.resolve('.', 'archive'), //Mapa za shranjevanje podatkov
  daily: '0 0 1 * * *', //Vsak dan ob 01:00:00
  hourly: '0 20 * * * *' //20 min čez vsako uro 
};

if (!fs.existsSync(config.dir)) {
  fs.mkdirSync(config.dir);
}

function filebase(folder, date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  
  var dir = path.join(config.dir, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  
  dir = path.join(dir, "" + year);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  
  var name = "" + year + (month < 10 ? "0" : "") + month + (day < 10 ? "0" : "") + day;
  name += "_" + (hour < 10 ? "0" : "") + hour + (min < 10 ? "0" : "") + min + (sec < 10 ? "0" : "") + sec;
  
  var file = path.resolve(dir, name);
  return file;
}

var CronJob = require('cron').CronJob;

//Zajem podatkov enkrat dnevno
new CronJob(config.daily, function() {
  var now = new Date();
  console.log("Dnevni interval " + new Date().toLocaleDateString())
  arso.getVodaDnevni(function(error, data, xml) {
    if (error) return console.error(error);
    var f = filebase("voda_dnevni", now);
    fs.writeFileSync(f + "_arso_voda_dnevni.xml", xml);
    fs.writeFileSync(f + "_arso_voda_dnevni.json", JSON.stringify(data, " ", 2));
    console.log("Opravljeno: voda dnevni");
  });
  arso.getZrakDnevni(function(error, data, xml) {
    if (error) return console.error(error);
    var f = filebase("zrak_dnevni", now);
    fs.writeFileSync(f + "_arso_zrak_dnevni.xml", xml);
    fs.writeFileSync(f + "_arso_zrak_dnevni.json", JSON.stringify(data, " ", 2));
    console.log("Opravljeno: zrak dnevni");
  });
}, null, true, 'Europe/Ljubljana');

//Zajem podatkov vsako uro
new CronJob(config.hourly, function() {
  var now = new Date();
  console.log("Urni interval " + new Date().toLocaleDateString())
  arso.getVodaZadnji(function(error, data, xml) {
    if (error) return console.error(error);
    var f = filebase("voda_urni", now);
    fs.writeFileSync(f + "_arso_voda_urni.xml", xml);
    fs.writeFileSync(f + "_arso_voda_urni.json", JSON.stringify(data, " ", 2));
    console.log("Opravljeno: voda zadnji");
  });
  arso.getZrakUrni(function(error, data, xml) {
    if (error) return console.error(error);
    var f = filebase("zrak_urni", now);
    fs.writeFileSync(f + "_arso_zrak_urni.xml", xml);
    fs.writeFileSync(f + "_arso_zrak_urni.json", JSON.stringify(data, " ", 2));
    console.log("Opravljeno: zrak urni");
  });
}, null, true, 'Europe/Ljubljana');