## ARSO podatki

Neuradna Node.js knjižnica za pridobivanje javnih merilnih podatkov iz Agencije RS za okolje.

## Uporaba

Namestitev
```
npm install arso-podatki
```

Uporaba
```
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

## Beleženje v datoteke

Glej primer `test/scheduled.js`