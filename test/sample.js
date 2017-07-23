var fs = require('fs');
var path = require('path');
var request = require('request');

var Arso = require('../lib/Arso.js');

var arso = new Arso();

arso.getVodaDnevni(function(error, data, xml) {
  if (error) return console.error(error);
  fs.writeFileSync("arso_voda_dnevni.xml", xml);
  fs.writeFileSync("arso_voda_dnevni.json", JSON.stringify(data, " ", 2));
  console.log("Opravljeno: voda dnevni");
});

arso.getVodaZadnji(function(error, data, xml) {
  if (error) return console.error(error);
  fs.writeFileSync("arso_voda_zadnji.xml", xml);
  fs.writeFileSync("arso_voda_zadnji.json", JSON.stringify(data, " ", 2));
  console.log("Opravljeno: voda zadnji");
});

arso.getZrakDnevni(function(error, data, xml) {
  if (error) return console.error(error);
  fs.writeFileSync("arso_zrak_dnevni.xml", xml);
  fs.writeFileSync("arso_zrak_dnevni.json", JSON.stringify(data, " ", 2));
  console.log("Opravljeno: zrak dnevni");
});

arso.getZrakUrni(function(error, data, xml) {
  if (error) return console.error(error);
  fs.writeFileSync("arso_zrak_urni.xml", xml);
  fs.writeFileSync("arso_zrak_urni.json", JSON.stringify(data, " ", 2));
  console.log("Opravljeno: zrak urni");
});