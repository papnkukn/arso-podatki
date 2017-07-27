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

function parseDate(s) {
  //2017-07-23 10:17
  var match = /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2})(:(\d{2}))?$/.exec(s);
  if (match) {
    var year = parseInt(match[1]);
    var month = parseInt(match[2]);
    var day = parseInt(match[3]);
    var hour = parseInt(match[4]);
    var minute = parseInt(match[5]);
    return new Date(year, month - 1, day, hour, minute, 0);
  }
  
  //23.07.2017 10:17 CET/CEST/UTC
  match = /^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})(:(\d{2}))?/.exec(s);
  if (match) {
    var year = parseInt(match[3]);
    var month = parseInt(match[2]);
    var day = parseInt(match[1]);
    var hour = parseInt(match[4]);
    var minute = parseInt(match[5]);
    return new Date(year, month - 1, day, hour, minute, 0);
  }
}

function parseWeather(xml, callback) {
  xml2js(xml, function(error, data) {
    try {
      if (error) {
        throw error;
      }
      
      var root = data.data;
      
      var result = {
        url: null,
        language: root.language[0],
        credit: root.credit[0],
        generator: root.generator[0],
        request_date: new Date(),
        data: [ ]
      };
      
      for (var i = 0; i < root.metData.length; i++) {
        var md = root.metData[i];
        
        var record = { };
        record.title = md.title ? md.title[0] : undefined;
        record.domain_meteosiId = md.domain_meteosiId ? md.domain_meteosiId[0] : undefined;
        record.domain_id = md.domain_id ? md.domain_id[0] : undefined;
        record.domain_countryIsoCode2 = md.domain_countryIsoCode2 ? md.domain_countryIsoCode2[0] : undefined;
        record.domain_lat = md.domain_lat ? parseFloat(md.domain_lat[0]) : undefined;
        record.domain_lon = md.domain_lon ? parseFloat(md.domain_lon[0]) : undefined;
        record.domain_altitude = md.domain_altitude ? parseFloat(md.domain_altitude[0]) : undefined;
        record.domain_title = md.domain_title ? md.domain_title[0] : undefined;
        record.domain_longTitle = md.domain_longTitle ? md.domain_longTitle[0] : undefined;
        record.domain_shortTitle = md.domain_shortTitle ? md.domain_shortTitle[0] : undefined;
        record.sunrise = md.sunrise ? parseDate(md.sunrise[0]) : undefined;
        record.sunset = md.sunset ? parseDate(md.sunset[0]) : undefined;
        record.tsValid_issued = md.tsValid_issued ? parseDate(md.tsValid_issued[0]) : undefined;
        record.tsValid_issued_day = md.tsValid_issued_day ? md.tsValid_issued_day[0] : undefined;
        record.tsValid_issued_UTC = md.tsValid_issued_UTC ? parseDate(md.tsValid_issued_UTC[0]) : undefined;
        record.tsValid_issued_RFC822 = md.tsValid_issued_RFC822 ? md.tsValid_issued_RFC822[0] : undefined;
        record.tsUpdated = md.tsUpdated ? parseDate(md.tsUpdated[0]) : undefined;
        record.tsUpdated_day = md.tsUpdated_day ? md.tsUpdated_day[0] : undefined;
        record.tsUpdated_UTC = md.tsUpdated_UTC ? parseDate(md.tsUpdated_UTC[0]) : undefined;
        record.tsUpdated_RFC822 = md.tsUpdated_RFC822 ? md.tsUpdated_RFC822[0] : undefined;
        record.valid_day = md.valid_day ? md.valid_day[0] : undefined;
        record.valid = md.valid ? parseDate(md.valid[0]) : undefined;
        record.valid_UTC = md.valid_UTC ? parseDate(md.valid_UTC[0]) : undefined;
        record.nn_icon = md.nn_icon ? md.nn_icon[0] : undefined;
        record.nn_shortText = md.nn_shortText ? md.nn_shortText[0] : undefined;
        record.nn_decodeText = md.nn_decodeText ? md.nn_decodeText[0] : undefined;
        record.wwsyn_icon = md.wwsyn_icon ? md.wwsyn_icon[0] : undefined;
        record.wwsyn_shortText = md.wwsyn_shortText ? md.wwsyn_shortText[0] : undefined;
        record.wwsyn_longText = md.wwsyn_longText ? md.wwsyn_longText[0] : undefined;
        record.wwsyn_decodeText = md.wwsyn_decodeText ? md.wwsyn_decodeText[0] : undefined;
        record.rr_icon = md.rr_icon ? md.rr_icon[0] : undefined;
        record.rr_decodeText = md.rr_decodeText ? md.rr_decodeText[0] : undefined;
        recordnn_icon_wwsyn_icon = md["nn_icon-wwsyn_icon"] ? md["nn_icon-wwsyn_icon"][0] : undefined;
        record.ts_icon = md.ts_icon ? md.ts_icon[0] : undefined;
        record.tsDeg_icon = md.tsDeg_icon ? md.tsDeg_icon[0] : undefined;
        record.ts_icon_tsDegree_gt0 = md["ts_icon_tsDegree-gt0"] ? md["ts_icon_tsDegree-gt0"][0] : undefined;
        record.ts_decodeText = md.ts_decodeText ? md.ts_decodeText[0] : undefined;
        record.ts_shortText = md.ts_shortText ? md.ts_shortText[0] : undefined;
        record.fog_icon = md.fog_icon ? md.fog_icon[0] : undefined;
        record.fogDeg_icon = md.fogDeg_icon ? md.fogDeg_icon[0] : undefined;
        record.fog_decodeText = md.fog_decodeText ? md.fog_decodeText[0] : undefined;
        record.fog_shortText = md.fog_shortText ? md.fog_shortText[0] : undefined;
        record.tn_var_desc = md.tn_var_desc ? md.tn_var_desc[0] : undefined;
        record.tn_var_unit = md.tn_var_unit ? md.tn_var_unit[0] : undefined;
        record.tn = md.tn ? parseFloat(md.tn[0]) : undefined;
        record.tn_degreesC = md.tn_degreesC ? parseFloat(md.tn_degreesC[0]) : undefined;
        record.tx_var_desc = md.tx_var_desc ? md.tx_var_desc[0] : undefined;
        record.tx_var_unit = md.tx_var_unit ? md.tx_var_unit[0] : undefined;
        record.tx = md.tx ? parseFloat(md.tx[0]) : undefined;
        record.tx_degreesC = md.tx_degreesC ? parseFloat(md.tx_degreesC[0]) : undefined;
        record.tw_var_desc = md.tw_var_desc ? md.tw_var_desc[0] : undefined;
        record.tw_var_unit = md.tw_var_unit ? md.tw_var_unit[0] : undefined;
        record.tw = md.tw ? parseFloat(md.tw[0]) : undefined;
        record.tw_degreesC = md.tw_degreesC ? parseFloat(md.tw_degreesC[0]) : undefined;
        record.windchill = md.windchill ? md.windchill[0] : undefined;
        record.vis_var_desc = md.vis_var_desc ? md.vis_var_desc[0] : undefined;
        record.vis_unit = md.vis_unit ? md.vis_unit[0] : undefined;
        record.vis_decodeText = md.vis_decodeText ? md.vis_decodeText[0] : undefined;
        record.dd_var_desc = md.dd_var_desc ? md.dd_var_desc[0] : undefined;
        record.dd_var_unit = md.dd_var_unit ? md.dd_var_unit[0] : undefined;
        record.dd_icon = md.dd_icon ? md.dd_icon[0] : undefined;
        record.dd_shortText = md.dd_shortText ? md.dd_shortText[0] : undefined;
        record.dd_longText = md.dd_longText ? md.dd_longText[0] : undefined;
        record.dd_decodeText = md.dd_decodeText ? md.dd_decodeText[0] : undefined;
        record.ddff_icon = md.ddff_icon ? md.ddff_icon[0] : undefined;
        record.ff_var_desc = md.ff_var_desc ? md.ff_var_desc[0] : undefined;
        record.ff_var_unit = md.ff_var_unit ? md.ff_var_unit[0] : undefined;
        record.ff_val = md.ff_val ? parseFloat(md.ff_val[0]) : undefined;
        record.ff_val_kmh = md.ff_val_kmh ? parseFloat(md.ff_val_kmh[0]) : undefined;
        record.ff_value = md.ff_value ? parseFloat(md.ff_value[0]) : undefined;
        record.ff_value_kmh = md.ff_value_kmh ? parseFloat(md.ff_value_kmh[0]) : undefined;
        record.ff_minimum = md.ff_minimum ? parseFloat(md.ff_minimum[0]) : undefined;
        record.ff_minimum_kmh = md.ff_minimum_kmh ? parseFloat(md.ff_minimum_kmh[0]) : undefined;
        record.ff_maximum = md.ff_maximum ? parseFloat(md.ff_maximum[0]) : undefined;
        record.ff_maximum_kmh = md.ff_maximum_kmh ? parseFloat(md.ff_maximum_kmh[0]) : undefined;
        record.ff_decodeText = md.ff_decodeText ? md.ff_decodeText[0] : undefined;
        record.ff_decodeText_kmh = md.ff_decodeText_kmh ? md.ff_decodeText_kmh[0] : undefined;
        record.ff_icon = md.ff_icon ? md.ff_icon[0] : undefined;
        record.ffmax_var_desc = md.ffmax_var_desc ? md.ffmax_var_desc[0] : undefined;
        record.ffmax_var_unit = md.ffmax_var_unit ? md.ffmax_var_unit[0] : undefined;
        record.ffmax_val = md.ffmax_val ? parseFloat(md.ffmax_val[0]) : undefined;
        record.ffmax_val_kmh = md.ffmax_val_kmh ? parseFloat(md.ffmax_val_kmh[0]) : undefined;
        record.waterWave_icon = md.waterWave_icon ? md.waterWave_icon[0] : undefined;
        record.waterWave_shortText = md.waterWave_shortText ? md.waterWave_shortText[0] : undefined;
        record.waterWave_decodeText = md.waterWave_decodeText ? md.waterWave_decodeText[0] : undefined;
        record.note = md.note ? md.note[0] : undefined;
        result.data.push(record);
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

function Meteo(options) {
  var self = this;
  
  var defaults = {
    meteoSloveniaLatestUrl: "http://meteo.arso.gov.si/uploads/probase/www/fproduct/text/sl/fcast_SLOVENIA_latest.xml"
  };
  
  //Merge defaults and options (options overwrite defaults)
	self.options = Object.assign({ }, defaults, options || { });
  
  self.request = function(url, callback) {
    request(url, function(error, response, body) {
      if (error) return callback(error);
      callback(null, body);
    });
  };
  
  //Used for unit test
  self.parseWeather = parseWeather;
}

Meteo.prototype.getWeatherData = function(url, callback) {
  if (typeof callback != "function") {
    callback = function(error, data, xml) { };
  }
  
  if (typeof url != "string" || !url || url.length == 0) {
    return callback(new Error("Missing url argument!"));
  }
  
  this.request(url, function(error, xml) {
    if (error) return callback(error);
    parseWeather(xml, function(error, data) {
      if (error) return callback(error);
      data.url = url;
      callback(null, data, xml);
    });
  });
};

Meteo.prototype.getSloveniaLatest = function(callback) {
  if (typeof callback != "function") {
    callback = function(error, data, xml) { };
  }
  
  var url = this.options.meteoSloveniaLatestUrl;
  this.request(url, function(error, xml) {
    if (error) return callback(error);
    parseWeather(xml, function(error, data) {
      if (error) return callback(error);
      data.url = url;
      callback(null, data, xml);
    });
  });
};

module.exports = Meteo;