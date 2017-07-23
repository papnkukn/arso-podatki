var fs = require('fs');
var path = require('path');
var request = require('request');
var xml2js = require('xml2js').parseString;

try {
  var pkg = require('../package.json');
  var ua = pkg.name + "/" + pkg.version + " (Node.js " + process.version + ")";
  request.defaults({
    headers: {
      "User-Agent": ua
    }
  });
}
catch (e) {
  console.log("Warning: User-Agent failed to set up");
}

process.exit(0);

//2017-07-23 10:17
function parseDate(s) {
  var match = /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2})(:(\d{2}))?$/.exec(s);
  if (match) {
    var year = parseInt(match[1]);
    var month = parseInt(match[2]);
    var day = parseInt(match[3]);
    var hour = parseInt(match[4]);
    var minute = parseInt(match[5]);
    return new Date(year, month - 1, day, hour, minute, 0);
  }
}

function parseVoda(xml, callback) {
  xml2js(xml, function(error, data) {
    try {
      if (error) {
        throw error;
      }
      
      var result = {
        verzija: data.arsopodatki.$.verzija,
        vir: data.arsopodatki.vir[0],
        url: null,
        datum_priprave: parseDate(data.arsopodatki.datum_priprave[0]),
        datum_zahtevka: new Date(),
        podatki: [ ]
      };
      
      for (var i = 0; i < data.arsopodatki.postaja.length; i++) {
        var postaja = data.arsopodatki.postaja[i];
        var record = {
          id: postaja.$.sifra,
          lat: postaja.$.ge_dolzina ? parseFloat(postaja.$.ge_dolzina) : undefined,
          lng: postaja.$.ge_sirina ? parseFloat(postaja.$.ge_sirina) : undefined,
          kota: postaja.$.kota_0 ? parseFloat(postaja.$.kota_0) : undefined,
          reka: postaja.reka ? postaja.reka[0] : undefined,
          merilno_mesto: postaja.merilno_mesto ? postaja.merilno_mesto[0] : undefined,
          ime_kratko: postaja.ime_kratko ? postaja.ime_kratko[0] : undefined,
          datum: postaja.datum ? parseDate(postaja.datum[0]) : undefined,
          vodostaj: postaja.vodostaj ? parseFloat(postaja.vodostaj[0]) : undefined,
          pretok: postaja.pretok ? parseFloat(postaja.pretok[0]) : undefined,
          pretok_znacilni: postaja.pretok_znacilni ? postaja.pretok_znacilni[0] : undefined,
          temp_vode: postaja.temp_vode ? parseFloat(postaja.temp_vode[0]) : undefined
        };
        result.podatki.push(record);
      }
      
      if (typeof callback == "function") {
        callback(null, result);
      }
    }
    catch (e) {
      if (typeof callback == "function") {
        callback(e);
      }
    }
  });
}

function parseZrakUrni(xml, callback) {
  xml2js(xml, function(error, data) {
    try {
      if (error) {
        throw error;
      }
      
      var result = {
        verzija: data.arsopodatki.$.verzija,
        vir: data.arsopodatki.vir[0],
        url: null,
        datum_priprave: parseDate(data.arsopodatki.datum_priprave[0]),
        datum_zahtevka: new Date(),
        podatki: [ ]
      };
      
      for (var i = 0; i < data.arsopodatki.postaja.length; i++) {
        var postaja = data.arsopodatki.postaja[i];
        var record = {
          id: postaja.$.sifra,
          lat: postaja.$.ge_dolzina ? parseFloat(postaja.$.ge_dolzina) : undefined,
          lng: postaja.$.ge_sirina ? parseFloat(postaja.$.ge_sirina) : undefined,
          nadm_visina: postaja.$.nadm_visina ? parseFloat(postaja.$.nadm_visina) : undefined,
          merilno_mesto: postaja.merilno_mesto ? postaja.merilno_mesto[0] : undefined,
          datum_od: postaja.datum_od ? parseDate(postaja.datum_od[0]) : undefined,
          datum_do: postaja.datum_do ? parseDate(postaja.datum_do[0]) : undefined,
          pm10: postaja.pm10 ? parseFloat(postaja.pm10[0]) : undefined,
          so2: postaja.so2 ? parseFloat(postaja.so2[0]) : undefined,
          co: postaja.co ? parseFloat(postaja.co[0]) : undefined,
          o3: postaja.o3 ? parseFloat(postaja.o3[0]) : undefined,
          no2: postaja.no2 ? parseFloat(postaja.no2[0]) : undefined
        };
        result.podatki.push(record);
      }
      
      if (typeof callback == "function") {
        callback(null, result);
      }
    }
    catch (e) {
      if (typeof callback == "function") {
        callback(e);
      }
    }
  });
}

function parseZrakDnevni(xml, callback) {
  xml2js(xml, function(error, data) {
    try {
      if (error) {
        throw error;
      }
      
      var result = {
        verzija: data.arsopodatki.$.verzija,
        vir: data.arsopodatki.vir[0],
        url: null,
        datum_priprave: parseDate(data.arsopodatki.datum_priprave[0]),
        datum_zahtevka: new Date(),
        podatki: [ ]
      };
      
      for (var i = 0; i < data.arsopodatki.postaja.length; i++) {
        var postaja = data.arsopodatki.postaja[i];
        var record = {
          id: postaja.$.sifra,
          lat: postaja.$.ge_dolzina ? parseFloat(postaja.$.ge_dolzina) : undefined,
          lng: postaja.$.ge_sirina ? parseFloat(postaja.$.ge_sirina) : undefined,
          nadm_visina: postaja.$.nadm_visina ? parseFloat(postaja.$.nadm_visina) : undefined,
          merilno_mesto: postaja.merilno_mesto ? postaja.merilno_mesto[0] : undefined,
          datum: postaja.datum ? parseDate(postaja.datum[0]) : undefined,
          pm10_dnevna: postaja.pm10_dnevna ? parseFloat(postaja.pm10_dnevna[0]) : undefined,
          so2_dnevna: postaja.so2_dnevna ? parseFloat(postaja.so2_dnevna[0]) : undefined,
          so2_max_urna: postaja.so2_max_urna ? parseFloat(postaja.so2_max_urna[0]) : undefined,
          co_max_8urna: postaja.co_max_8urna ? parseFloat(postaja.co_max_8urna[0]) : undefined,
          o3_max_urna: postaja.o3_max_urna ? parseFloat(postaja.o3_max_urna[0]) : undefined,
          o3_max_8urna: postaja.o3_max_8urna ? parseFloat(postaja.o3_max_8urna[0]) : undefined,
          no2_max_urna: postaja.no2_max_urna ? parseFloat(postaja.no2_max_urna[0]) : undefined
        };
        result.podatki.push(record);
      }
      
      if (typeof callback == "function") {
        callback(null, result);
      }
    }
    catch (e) {
      if (typeof callback == "function") {
        callback(e);
      }
    }
  });
}

function Arso(options) {
  var self = this;
  
  var defaults = {
    arsoZrakUrniUrl: "http://www.arso.gov.si/xml/zrak/ones_zrak_urni_podatki_zadnji.xml",
    arsoZrakDnevniUrl: "http://www.arso.gov.si/xml/zrak/ones_zrak_dnevni_podatki_zadnji.xml",
    arsoVodaZadnjiUrl: "http://www.arso.gov.si/xml/vode/hidro_podatki_zadnji.xml",
    arsoVodaDnevniUrl: "http://www.arso.gov.si/xml/vode/hidro_podatki_dnevno_porocilo.xml"
  };
  
  //Merge defaults and options (options overwrite defaults)
	self.options = Object.assign({ }, defaults, options || { });
  
  self.request = function(url, callback) {
    request(url, function(error, response, body) {
      if (error) return callback(error);
      callback(null, body);
    });
  };
}

Arso.prototype.getZrakUrni = function(callback) {
  var url = this.options.arsoZrakUrniUrl;
  this.request(url, function(error, xml) {
    if (error) return callback(error);
    parseZrakUrni(xml, function(error, data) {
      if (error) return callback(error);
      data.url = url;
      callback(null, data, xml);
    });
  });
};

Arso.prototype.getZrakDnevni = function(callback) {
  var url = this.options.arsoZrakDnevniUrl;
  this.request(url, function(error, xml) {
    if (error) return callback(error);
    parseZrakDnevni(xml, function(error, data) {
      if (error) return callback(error);
      data.url = url;
      callback(null, data, xml);
    });
  });
};

Arso.prototype.getVodaZadnji = function(callback) {
  var url = this.options.arsoVodaZadnjiUrl;
  this.request(url, function(error, xml) {
    if (error) return callback(error);
    parseVoda(xml, function(error, data) {
      if (error) return callback(error);
      data.url = url;
      callback(null, data, xml);
    });
  });
};

Arso.prototype.getVodaDnevni = function(callback) {
  var url = this.options.arsoVodaDnevniUrl;
  this.request(url, function(error, xml) {
    if (error) return callback(error);
    parseVoda(xml, function(error, data) {
      if (error) return callback(error);
      data.url = url;
      callback(null, data, xml);
    });
  });
};

module.exports = Arso;