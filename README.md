## ARSO podatki

Neuradna Node.js knjižnica za pridobivanje javnih merilnih podatkov iz Agencije RS za okolje.

## Uporaba

Namestitev
```
npm install arso-podatki
```

Uporaba
```javascript
//Voda in zrak
var Arso = require('arso-podatki').Arso;
var arso = new Arso();
arso.getZrakUrni(function(error, json, xml) {
  var postaja = json.data[0];
  //Če vrednost delcev prekorači 50 µg/m³
  if (postaja.pm10 > 50) {
    obvesti("Prekoračena mejna vrednost delcev v zraku");
  }
  //Če vrednost krepko preraste omejitev
  else if (postaja.pm10 > 500) {
    evakuacija(postaja.merilno_mesto);
  }
});
arso.getVodaZadnji(function(error, json, xml) {
  var postaja = json.data[0];
  if (postaja.vodostaj > 160) {
    obvesti("Nevarnost poplav");
  }
});

//Vremenski podatki
var Meteo = require('arso-podatki').Meteo;
var meteo = new Meteo();
meteo.getSloveniaLatest(function(error, json, xml) {
  ...
});
```

## Voda

[ARSO: Hidrološki podatki](http://www.arso.gov.si/vode/podatki/hidro_podatki_xml.html)

Pridobivanje dnevnih podatkov
```javascript
arso.getVodaDnevni(function(error, data, xml) {
  if (error) return console.error(error);
  fs.writeFileSync("arso_voda_dnevni.xml", xml);
  fs.writeFileSync("arso_voda_dnevni.json", JSON.stringify(data, " ", 2));
  console.log("Opravljeno: voda dnevni");
});
```

Pridobivanje zadnjih zabeleženih podatkov z merilnih postaj
```javascript
arso.getVodaZadnji(function(error, data, xml) {
  if (error) return console.error(error);
  fs.writeFileSync("arso_voda_zadnji.xml", xml);
  fs.writeFileSync("arso_voda_zadnji.json", JSON.stringify(data, " ", 2));
  console.log("Opravljeno: voda zadnji");
});
```

Rezultat
```javascript
{
  "verzija": "1.0",
  "vir": "Agencija RS za okolje",
  "url": "http://www.arso.gov.si/xml/vode/hidro_podatki_dnevno_porocilo.xml",
  "datum_priprave": "2017-07-23T09:49:00.000Z",
  "datum_zahtevka": "2017-07-23T09:59:01.399Z",
  "podatki": [
    {
      "id": "1060",
      "lat": 16.000253,
      "lng": 46.68151,
      "kota": 202.34,
      "reka": "Mura",
      "merilno_mesto": "Gornja Radgona",
      "ime_kratko": "Mura - Gor. Radgona",
      "datum": "2017-07-23T06:00:00.000Z",
      "vodostaj": 85,
      "pretok": 90,
      "pretok_znacilni": "mali pretok",
      "temp_vode": 20.9
    },
    ...
  ]
}
```

## Zrak

[ARSO: Kakovost zraka](http://www.arso.gov.si/zrak/kakovost%20zraka/podatki/kakovost_zraka_xml.html)

Pridobivanje dnevnih podatkov
```javascript
arso.getZrakDnevni(function(error, data, xml) {
  if (error) return console.error(error);
  fs.writeFileSync("arso_zrak_dnevni.xml", xml);
  fs.writeFileSync("arso_zrak_dnevni.json", JSON.stringify(data, " ", 2));
  console.log("Opravljeno: zrak dnevni");
});
```

Rezultat
```javascript
{
  "verzija": "1.0",
  "vir": "Agencija RS za okolje",
  "url": "http://www.arso.gov.si/xml/zrak/ones_zrak_dnevni_podatki_zadnji.xml",
  "datum_priprave": "2017-07-23T09:35:00.000Z",
  "datum_zahtevka": "2017-07-23T09:57:58.121Z",
  "podatki": [
    {
      "id": "E21",
      "lat": 14.512704,
      "lng": 46.065497,
      "nadm_visina": 299,
      "merilno_mesto": "Ljubljana Bežigrad",
      "pm10_dnevna": 26,
      "so2_dnevna": 4,
      "so2_max_urna": 5,
      "co_max_8urna": null,
      "o3_max_urna": 135,
      "o3_max_8urna": 125,
      "no2_max_urna": 42
    },
    ...
  ]
}
```

Pridobivanje zadnjih zabeleženih podatkov z merilnih postaj
```javascript
arso.getZrakUrni(function(error, data, xml) {
  if (error) return console.error(error);
  fs.writeFileSync("arso_zrak_urni.xml", xml);
  fs.writeFileSync("arso_zrak_urni.json", JSON.stringify(data, " ", 2));
  console.log("Opravljeno: zrak urni");
});
```

Rezultat
```javascript
{
  "verzija": "1.1",
  "vir": "Agencija RS za okolje",
  "url": "http://www.arso.gov.si/xml/zrak/ones_zrak_urni_podatki_zadnji.xml",
  "datum_priprave": "2017-07-23T09:35:00.000Z",
  "datum_zahtevka": "2017-07-23T09:58:25.453Z",
  "podatki": [
    {
      "id": "E21",
      "lat": 14.512704,
      "lng": 46.065497,
      "nadm_visina": 299,
      "merilno_mesto": "Ljubljana Bežigrad",
      "datum_od": "2017-07-23T08:00:00.000Z",
      "datum_do": "2017-07-23T09:00:00.000Z",
      "pm10": 35,
      "so2": 5,
      "co": null,
      "o3": 123,
      "no2": 8
    },
    ...
  ]
}
```

## Vreme

[Meteo: podatki o vremenu](http://www.meteo.si/met/sl/service/)

Pridobivanje podatkov
```javascript
var url = "http://www.meteo.si/uploads/probase/www/fproduct/text/sl/fcast_SLOVENIA_latest.xml";
arso.getWeatherData(url, function(error, data, xml) {
  if (error) return console.error(error);
  fs.writeFileSync("meteo_si_latest.xml", xml);
  fs.writeFileSync("meteo_si_latest.json", JSON.stringify(data, " ", 2));
  console.log("Opravljeno: 5 dnevna napoved vremena za Slovenijo");
});
```

Rezultat
```javascript
{
  "url": "http://www.meteo.si/uploads/probase/www/fproduct/text/sl/fcast_SLOVENIA_latest.xml",
  "language": "sl",
  "credit": "meteo.si - ARSO",
  "generator": "AutoPro/ProCreator",
  "request_date": "2017-07-27T19:15:23.253Z",
  "data": [
    {
      "title": "METEO_FCAST",
      "domain_meteosiId": "SLOVENIA_",
      "domain_id": "64764800",
      "domain_countryIsoCode2": "SI",
      "domain_lat": 46.05,
      "domain_lon": 14.68,
      "domain_altitude": 400,
      "domain_title": "SLOVENIA",
      "domain_longTitle": "Slovenija",
      "domain_shortTitle": "Slovenija",
      "sunset": "2017-07-27T18:37:00.000Z",
      "tsValid_issued_day": "Cetrtek CEST",
      "tsValid_issued_RFC822": "27 Jul 2017 03:00:00 +0000",
      "tsUpdated_day": "Cetrtek CEST",
      "tsUpdated_RFC822": "27 Jul 2017 03:10:00 +0000",
      "valid_day": "Cetrtek CEST",
      "valid": "2017-07-27T12:00:00.000Z",
      "valid_UTC": "2017-07-27T10:00:00.000Z",
      "nn_icon": "partCloudy",
      "nn_shortText": "delno oblacno",
      "nn_decodeText": "DO",
      "wwsyn_icon": "RA",
      "wwsyn_shortText": "dež",
      "wwsyn_longText": "dežuje",
      "wwsyn_decodeText": "RA",
      "rr_icon": "light",
      "rr_decodeText": "light",
      "ts_icon": "",
      "tsDeg_icon": "",
      "ts_icon_tsDegree_gt0": "",
      "ts_decodeText": "",
      "ts_shortText": "",
      "fog_icon": "",
      "fogDeg_icon": "",
      "fog_decodeText": "",
      "fog_shortText": "",
      "tn_var_desc": "Minimalna terminska temperatura",
      "tn_var_unit": "°C",
      "tn": 14,
      "tn_degreesC": 14,
      "tx_var_desc": "Maksimalna terminska temperatura",
      "tx_var_unit": "°C",
      "tx": 26,
      "tx_degreesC": 26,
      "tw_var_desc": "Temperatura vode",
      "tw_var_unit": "°C",
      "tw": null,
      "tw_degreesC": null,
      "windchill": "",
      "vis_var_desc": "Vidnost",
      "vis_unit": "km",
      "vis_decodeText": "",
      "dd_var_desc": "Smer vetra",
      "dd_var_unit": "°",
      "dd_icon": "",
      "dd_shortText": "",
      "dd_longText": "",
      "dd_decodeText": "",
      "ddff_icon": "",
      "ff_var_desc": "Hitrost vetra",
      "ff_var_unit": "m/s",
      "ff_val": null,
      "ff_val_kmh": null,
      "ff_value": 0,
      "ff_value_kmh": 0,
      "ff_minimum": 0,
      "ff_minimum_kmh": 0,
      "ff_maximum": 0,
      "ff_maximum_kmh": 0,
      "ff_decodeText": "0                    ",
      "ff_decodeText_kmh": "0                    ",
      "ff_icon": "",
      "ffmax_var_desc": "Sunki vetra",
      "ffmax_var_unit": "m/s",
      "ffmax_val": null,
      "ffmax_val_kmh": null,
      "waterWave_icon": "",
      "waterWave_shortText": "",
      "waterWave_decodeText": "",
      "note": ""
    },
    ...
  ]
}
```

## Beleženje v datoteke

Glej primer `test/scheduled.js`