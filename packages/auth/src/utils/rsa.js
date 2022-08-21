function startsWith(c, d) {
  return c.indexOf(d) === 0;
}

export const DomDataCollection = (n) => {
  const SUCCESS = 0;
  const FAIL = 1;
  const PARTIAL = 2;
  const NOT_STARTED = 3;

  function o() {}
  function k(a) {
    return typeof a == 'function';
  }
  function h(a) {
    return a.length;
  }

  const l = new Hashtable();

  const j = {};
  j.config = {
    recursion_level: 1,
    collection_mode: 'partial',
    functionsToExclude: [],
    function_list_size: 1024,
    json_script: n ? n : 'json2.js'
  };
  j.emptyDomData = function() {
    j.dom_data = {
      functions: {
        names: [],
        excluded: { size: 0, count: 0 },
        truncated: false
      },
      inputs: [],
      iFrames: [],
      scripts: [],
      collection_status: NOT_STARTED
    };
  };
  j.initFunctionsToExclude = function() {
    if (l) {
      l.clear();
    }
    var a = j.config.functionsToExclude;
    var b = a.length;
    while (b--) {
      l.put(a[b], '');
    }
  };
  j.functionShouldBeCollected = function m(a, b) {
    if (j.config.collection_mode == 'full') {
      return true;
    } else {
      if (l.size() === 0) {
        j.initFunctionsToExclude();
      }
      if (l.containsKey(b)) {
        return false;
      } else {
        return true;
      }
    }
  };
  j.recursiveGetAllFunctionNamesUnderElement = function(B, e, A) {
    var C;
    var d;
    var g;
    var x = j.config;
    var D = x.recursion_level;
    var a = x.collection_mode;
    if (
      j.dom_data.functions === undefined ||
      j.dom_data.functions.names === undefined
    ) {
      j.dom_data.functions = {
        names: [],
        excluded: { size: 0, count: 0 },
        truncated: false
      };
    }
    var f = j.dom_data.functions;
    var c = f.excluded;
    for (var E in e) {
      try {
        var F = e[E];
        C = '' + F;
        if (B.length > 0) {
          prefix = B + '.';
        } else {
          prefix = '';
        }
        d = prefix + E;
        if (k(F)) {
          if (j.functionShouldBeCollected(F, E)) {
            var G = f.names;
            g = G.length;
            G[g] = d;
          } else {
            if (a == 'partial') {
              c.size += C.length;
              c.count++;
            }
          }
        }
        if (A + 1 < D) {
          j.recursiveGetAllFunctionNamesUnderElement(d, F, A + 1);
        } else {
          f.names.sort();
        }
      } catch (b) {
        if (!window.console) {
          window.console = {};
          window.console.info = o;
          window.console.log = o;
          window.console.warn = o;
          window.console.error = o;
        }
        if (console && console.log) {
          console.log('error counting functions: ' + b.toString());
        }
      }
    }
  };
  j.inspectJSFunctions = function() {
    j.dom_data.functions = [];
    j.recursiveGetAllFunctionNamesUnderElement('', window, 0);
  };
  j.inspectFrames = function() {
    j.countElements('iframe');
  };
  j.inspectScripts = function() {
    var b = document.getElementsByTagName('script');
    j.dom_data.scripts = [];
    for (var a = 0; a < b.length; a++) {
      j.dom_data.scripts[a] = b[a].text.length;
    }
  };
  j.inspectInputFields = function() {
    j.collectFields('input');
    j.collectFields('textarea');
    j.collectFields('select');
    j.collectFields('button');
  };
  j.handleSizeLimit = function() {
    var x = j.dom_data;
    var g = j.config;
    var v = g.function_list_size;
    var e = x.functions;
    e.names.sort();
    var b = JSON.stringify(x);
    if (v < 0) {
      v = 0;
    }
    var a = 0;
    if (g.colllection_mode != 'full' && b.length > v) {
      var c = e.names;
      var d = c.toString();
      var y = b.length - JSON.stringify(c).length + '[]'.length;
      var f = false;
      var w = c.length;
      while (!f) {
        if (a++ == 1000) {
          f = true;
        }
        lastComma = d.lastIndexOf(',');
        if (lastComma >= 0 && w > 0) {
          if (y + lastComma > v) {
            d = d.substring(0, lastComma - 1);
            w--;
          } else {
            f = true;
          }
        } else {
          f = true;
        }
      }
      if (w > 1) {
        e.truncated = true;
        e.names = e.names.slice(0, w - 1);
        x.functions.truncated = true;
      } else {
        j.emptyDomData();
        x = j.dom_data;
        x.collection_status = PARTIAL;
        x.functions.truncated = true;
      }
    }
  };
  j.startInspection = function() {
    var b = false;
    var c = true;
    try {
      j.inspectJSFunctions();
      c = false;
    } catch (a) {
      b = b || true;
    }
    try {
      j.inspectFrames();
      c = false;
    } catch (a) {
      b = b || true;
    }
    try {
      j.inspectScripts();
      c = false;
    } catch (a) {
      b = b || true;
    }
    try {
      j.inspectInputFields();
      c = false;
    } catch (a) {
      b = b || true;
    }
    if (b) {
      if (c) {
        j.dom_data.collection_status = FAIL;
      } else {
        j.dom_data.collection_status = PARTIAL;
      }
    } else {
      j.dom_data.collection_status = SUCCESS;
    }
    j.handleSizeLimit();
  };
  j.domDataAsJSON = function() {
    return stripIllegalChars(JSON.stringify(j.dom_data));
  };
  j.countElements = function(e) {
    var d;
    var c = document.getElementsByTagName(e);
    if (j.dom_data.iFrames === undefined) {
      j.dom_data.iFrames = [];
    }
    var b = j.dom_data.iFrames;
    var a = b.length;
    // for (i = 0; i < c.length; i++) {
    for (let i = 0; i < c.length; i++) {
      b[a + i] = '' + c[i].src;
    }
    b.sort();
  };
  j.collectFields = function(b) {
    var r = document.getElementsByTagName(b);
    if (j.dom_data.inputs === undefined) {
      j.dom_data.inputs = [];
    }
    var e = j.dom_data.inputs;
    var g = e.length;
    var a = r.length;
    while (a--) {
      var c = r[a];
      var d = c.name;
      var f = c.id;
      if (d && d.length > 0) {
        element_name = d;
      } else {
        if (f && f.length > 0) {
          element_name = f;
        } else {
          element_name = 'NO_NAME';
        }
      }
      e[g + a] = element_name;
    }
    e.sort();
  };

  const loadJSON = () => {
    if (!window.JSON) {
      var a = document.getElementsByTagName('head')[0];
      var b = document.createElement('script');
      b.type = 'text/javascript';
      b.src = j.config.json_script;
      a.appendChild(b);
    }
  };

  j.emptyDomData();
  loadJSON();

  return j;
}

function Timer() {
  this.startTime = new Date().getTime();
}

Timer.prototype.start = function() {
  this.startTime = new Date().getTime();
};
Timer.prototype.duration = function() {
  return new Date().getTime() - this.startTime;
};

function getRandomPort() {
  return Math.floor(Math.random() * 60000 + 4000);
}

var ProxyCollector = {};
ProxyCollector.internalIP = '127.0.0.1';
ProxyCollector.externalIP;
ProxyCollector.internalPingTime;
ProxyCollector.externalPingTime;
ProxyCollector.setInternalPingTime = function(b) {
  ProxyCollector.internalPingTime = b;
};
ProxyCollector.setExternalPingTime = function(b) {
  ProxyCollector.externalPingTime = b;
};
ProxyCollector.PROXY_DETECTION_TIMEOUT = 4000;
ProxyCollector.TIMEOUT_CHECK_FREQUENCY = 1000;
ProxyCollector.isTimedOut = function(d, e, f) {
  e -= ProxyCollector.TIMEOUT_CHECK_FREQUENCY;
  if (
    e <= 0 &&
    ((!ProxyCollector.internalPingTime &&
      String(d).indexOf('internalPingTimeToSet') != -1) ||
      (!ProxyCollector.externalPingTime &&
        String(d).indexOf('externalPingTimeToSet') != -1))
  ) {
    d.call(this, -1);
    if (f) {
      f.abort();
    }
  } else {
    if (
      (!ProxyCollector.internalPingTime &&
        String(d).indexOf('internalPingTimeToSet') != -1) ||
      (!ProxyCollector.externalPingTime &&
        String(d).indexOf('externalPingTimeToSet') != -1)
    ) {
      setTimeout(function() {
        ProxyCollector.isTimedOut(d, e, f);
      }, ProxyCollector.TIMEOUT_CHECK_FREQUENCY);
    }
  }
};
ProxyCollector.doAjax = function(k, l) {
  var h =
    document.location.protocol +
    '//' +
    k +
    ':' +
    getRandomPort() +
    '/NonExistentImage' +
    getRandomPort() +
    '.gif';
  var m;
  var n;
  if (typeof XDomainRequest == 'object') {
    m = new window.XDomainRequest();
    n = new Timer();
    try {
      m.timeout = ProxyCollector.PROXY_DETECTION_TIMEOUT;
      m.ontimeout = function() {
        l.call(this, -1);
        m.abort();
      };
      m.onprogress = function() {
        l.call(this, n.duration());
        m.abort();
      };
      m.onerror = function() {
        l.call(this, n.duration());
      };
      m.open('GET', h, true);
      m.send();
    } catch (o) {
      var j = ProxyCollector.PROXY_DETECTION_TIMEOUT - n.duration();
      ProxyCollector.doAjaxViaImage(j, l, h);
    }
  } else {
    m = new XMLHttpRequest();
    n = new Timer();
    try {
      m.onreadystatechange = function() {
        if (m.readyState == 4) {
          l.call(this, n.duration());
        }
      };
      m.timeout = ProxyCollector.PROXY_DETECTION_TIMEOUT;
      m.ontimeout = function() {
        l.call(this, -1);
        m.abort();
      };
      m.open('GET', h, true);
      m.send();
      setTimeout(function() {
        ProxyCollector.isTimedOut(
          l,
          ProxyCollector.PROXY_DETECTION_TIMEOUT - n.duration(),
          m
        );
      }, ProxyCollector.TIMEOUT_CHECK_FREQUENCY);
    } catch (o) {
      var j = ProxyCollector.PROXY_DETECTION_TIMEOUT - n.duration();
      ProxyCollector.doAjaxViaImage(j, l, h);
    }
  }
};
ProxyCollector.doAjaxViaImage = function(h, j, f) {
  var g = new Image();
  var k = new Timer();
  g.onerror = function() {
    j.call(this, k.duration());
  };
  g.src = f;
};
ProxyCollector.collect = function() {
  ProxyCollector.doAjax(
    ProxyCollector.externalIP,
    ProxyCollector.setExternalPingTime
  );
  if (typeof XDomainRequest == 'object') {
    if (!ProxyCollector.externalPingTime) {
      forceIE89Synchronicity();
    }
  } else {
    ProxyCollector.doAjax(
      ProxyCollector.internalIP,
      ProxyCollector.setInternalPingTime
    );
  }
  if (
    ProxyCollector.externalPingTime == -1 ||
    ProxyCollector.internalPingTime == -1
  ) {
    ProxyCollector.setExternalPingTime(-1);
    ProxyCollector.setInternalPingTime(-1);
  }
};

const forceIE89Synchronicity = () => {
  if (!ProxyCollector.externalPingTime) {
    setTimeout(forceIE89Synchronicity, 100);
  } else {
    ProxyCollector.doAjax(
      ProxyCollector.internalIP,
      ProxyCollector.setInternalPingTime
    );
  }
};

ProxyCollector.isValidIPAddress = function(h) {
  var e = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  if (e.test(h)) {
    var g = h.split('.');
    if (parseInt(parseFloat(g[0])) == 0) {
      return false;
    }
    for (var f = 0; f < g.length; f++) {
      if (parseInt(parseFloat(g[f])) > 255) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
};
ProxyCollector.initProxyCollection = function() {
  if (
    ProxyCollector.isValidIPAddress(ProxyCollector.externalIP) &&
    ProxyCollector.isValidIPAddress(ProxyCollector.internalIP)
  ) {
    ProxyCollector.collect();
  }
};
function BlackberryLocationCollector() {
  var m = this;
  var q = null;
  this.getGeolocationWatchId = function() {
    return q;
  };
  var n = null;
  this.getGeolocationLastPosition = function() {
    return n;
  };
  var r = 4;
  this.getGeolocationStatusCode = function() {
    return r;
  };
  var l = '';
  this.getGeolocationErrorMessage = function() {
    return l;
  };
  var k = {
    aidMode: 2,
    timeout: 180,
    relevancy: 120,
    expiration: 48,
    alertDebug: false
  };
  var o = -1;
  var j = 0;
  this.getInvokeCount = function() {
    return j;
  };
  this.handleBlackBerryLocationTimeout = function() {
    if (o != -1) {
      m.stopWatch();
      r = 3;
      if (j === 0 && k.aidMode !== 0) {
        j++;
        m.startLocationWatch();
      }
    }
  };
  this.handlePosition = function() {
    clearTimeout(o);
    o = -1;
    var c = false;
    if (
      blackberry.location.latitude === 0 &&
      blackberry.location.longitude === 0
    ) {
      if (k.alertDebug) {
        console.log('Got empty position');
      }
      if (n === null) {
        r = 2;
      }
    } else {
      var a = null;
      if (blackberry.location.timestamp) {
        a = getTimestampInMillis(blackberry.location.timestamp);
      } else {
        a = new Date().getTime();
      }
      var b = new Date().getTime();
      if (b - a <= k.expiration * 60 * 60 * 1000) {
        if (n === null || a > n.timestamp) {
          var d = n === null ? 0 : n.timestamp;
          if (k.alertDebug) {
            console.log(
              'Saved new position. New timestamp: ' + a + ' Old: ' + d
            );
          }
          n = {
            timestamp: a,
            coords: {
              latitude: blackberry.location.latitude,
              longitude: blackberry.location.longitude
            }
          };
          r = 0;
        } else {
          if (k.alertDebug) {
            console.log(
              'New position is not saved. New timestamp: ' +
                a +
                ' Old: ' +
                n.timestamp
            );
          }
        }
      } else {
        if (k.alertDebug) {
          console.log(
            'New position is not saved. It is expired: ' +
              (b - a) * 1000 * 60 * 60 +
              ' hours old'
          );
        }
      }
    }
    if (n !== null) {
      var b = new Date().getTime();
      c = b - n.timestamp < k.relevancy * 1000;
    }
    m.stopWatch();
    if (k.alertDebug) {
      console.log('Relevant position? ' + c);
    }
    if ((j === 0 && k.aidMode !== 0) || !c) {
      j++;
      m.startLocationWatch();
    }
  };
  this.init = function(a, b, d, c) {
    if (a >= 0 && a <= 2) {
      k.aidMode = a;
    }
    if (b !== null && b >= 90 && b <= 300) {
      k.timeout = b;
    }
    if (d !== null && d >= 60 && d <= 240) {
      k.relevancy = d;
    }
    if (c !== null && c >= 24 && c <= 60) {
      k.expiration = c;
    }
  };
  this.startLocationWatch = function() {
    if (j === 0) {
      blackberry.location.setAidMode(0);
    } else {
      blackberry.location.setAidMode(k.aidMode);
    }
    var a = k.timeout * 1000;
    o = setTimeout('geoLocator.handleBlackBerryLocationTimeout()', a);
    blackberry.location.onLocationUpdate(m.handlePosition);
    blackberry.location.refreshLocation();
    q = 1;
    return true;
  };
  this.stopWatch = function() {
    try {
      blackberry.location.removeLocationUpdate(m.handlePosition);
    } catch (a) {}
    q = -2;
  };
  this.generateGeolocationJSONStruct = function() {
    var b = null;
    if (n !== null) {
      var a = convertTimestampToGMT(n.timestamp);
      b = {
        GeoLocationInfo: [
          {
            Status: r,
            Longitude: n.coords.longitude,
            Latitude: n.coords.latitude,
            Timestamp: a
          }
        ]
      };
    } else {
      b = { GeoLocationInfo: [{ Status: r }] };
    }
    return JSON.stringify(b);
  };
}
function detectFields() {
  var u = 'form';
  var n = 'input';
  var j = document.getElementsByTagName('form');
  var w = j.length;
  var m;
  var v;
  var q = [];
  q.push('url=' + window.location.href);
  for (var r = 0; r < w; r++) {
    q.push(u + '=' + j[r].name);
    m = j[r].getElementsByTagName('input');
    v = m.length;
    for (var s = 0; s < v; s++) {
      if (m[s].type != 'hidden') {
        q.push(n + '=' + m[s].name);
      }
    }
  }
  var o = q.join('|');
  return o;
}
const SEP = '|';
const PAIR = '=';
const DEV = '~';

function post_fingerprints(b) {
  b.deviceprint.value = encode_deviceprint();
}

function form_add_data(d, e, f) {
  if (d && d.length > 0) {
    d += '&';
  } else {
    d = '';
  }
  d += e + '=' + escape(f.toString());
  return d;
}
function form_add_deviceprint(d, e, f) {
  d = form_add_data(d, e + 'd', f);
  return d;
}
var HTML5 = 'HTML5';
var BLACKBERRY = 'blackberry';
var UNDEFINED = 'undefined';
var GEO_LOCATION_DEFAULT_STRUCT = '{"GeoLocationInfo":[{"Status":4}]}';
var geoLocator = null;
var geoLocatorStatus = false;
function detectDeviceCollectionAPIMode() {
  if (typeof navigator.geolocation != UNDEFINED) {
    return HTML5;
  } else {
    if (
      typeof window.blackberry != UNDEFINED &&
      blackberry.location.GPSSupported
    ) {
      return BLACKBERRY;
    } else {
      return UNDEFINED;
    }
  }
}
function init(j, k, h, g, l) {
  var m = detectDeviceCollectionAPIMode();
  if (m == HTML5) {
    geoLocator = new HTML5LocationCollector();
    geoLocator.init(j, k, h, g);
    return true;
  } else {
    if (m == BLACKBERRY) {
      geoLocator = new BlackberryLocationCollector();
      geoLocator.init(l, k, h, g);
      return true;
    }
  }
  return false;
}
function startCollection(h, j, g, f, k) {
  geoLocatorStatus = init(h, j, g, f, k);
  if (geoLocatorStatus) {
    return geoLocator.startLocationWatch();
  } else {
    return false;
  }
}

function stopCollection() {
  if (geoLocatorStatus) {
    geoLocator.stopWatch();
  }
}

export const getGeolocationStruct = () => {
  if (geoLocatorStatus) {
    return geoLocator.generateGeolocationJSONStruct();
  } else {
    return GEO_LOCATION_DEFAULT_STRUCT;
  }
}

function HTML5LocationCollector() {
  var k = this;
  var m = -1;
  this.getGeolocationWatchId = function() {
    return m;
  };
  var l = null;
  this.getGeolocationLastPosition = function() {
    return l;
  };
  var g = 4;
  this.getGeolocationStatusCode = function() {
    return g;
  };
  var j = '';
  this.getGeolocationErrorMessage = function() {
    return j;
  };
  var h = { accuracy: 100, timeout: 180, relevancy: 120, expiration: 48 };
  this.getGeolocationConfig = function() {
    return h;
  };
  this.startLocationWatch = function() {
    var a = {
      enableHighAccuracy: true,
      timeout: h.timeout * 1000,
      maximumAge: h.expiration
    };
    if (navigator.geolocation) {
      m = navigator.geolocation.watchPosition(
        this.handlePosition,
        this.handleError,
        a
      );
      return true;
    } else {
      g = 4;
    }
    return false;
  };
  this.init = function(a, b, d, c) {
    if (a !== null && a >= 0 && a <= 200) {
      h.accuracy = a;
    }
    if (b !== null && b >= 90 && b <= 300) {
      h.timeout = b;
    }
    if (d !== null && d >= 60 && d <= 240) {
      h.relevancy = d;
    }
    if (c !== null && c >= 24 && c <= 60) {
      h.expiration = c;
    }
  };
  this.handlePosition = function(d) {
    var c = new Date().getTime();
    var b = getTimestampInMillis(d.timestamp);
    if (c - b <= h.expiration * 60 * 60 * 1000) {
      if (
        l === null ||
        d.timestamp > l.timestamp ||
        d.coords.accuracy < l.coords.accuracy
      ) {
        l = d;
        g = 0;
      }
    }
    if (l !== null) {
      var a = c - l.timestamp;
      if (a <= h.relevancy * 1000 && l.coords.accuracy <= h.accuracy) {
        k.stopWatch();
      }
    }
  };
  this.generateGeolocationJSONStruct = function() {
    var b = null;
    if (l !== null) {
      var a = convertTimestampToGMT(l.timestamp);
      b = {
        GeoLocationInfo: [
          {
            Status: g,
            Longitude: l.coords.longitude,
            Latitude: l.coords.latitude,
            Altitude: Math.round(l.coords.altitude),
            HorizontalAccuracy: Math.round(l.coords.accuracy),
            AltitudeAccuracy: Math.round(l.coords.altitudeAccuracy),
            Heading: Math.round(l.coords.heading),
            Speed: Math.round(l.coords.speed),
            Timestamp: a
          }
        ]
      };
    } else {
      b = { GeoLocationInfo: [{ Status: g }] };
    }
    return JSON.stringify(b);
  };
  this.handleError = function(a) {
    switch (a.code) {
      case a.TIMEOUT:
        k.stopWatch();
        g = 3;
        break;
      case a.POSITION_UNAVAILABLE:
        g = 2;
        j = a.message;
        break;
      case a.PERMISSION_DENIED:
        g = 1;
        break;
      case a.UNKNOWN_ERROR:
        g = 2;
        j = a.message;
        break;
    }
  };
  this.stopWatch = function() {
    navigator.geolocation.clearWatch(m);
    m = -2;
  };
}

export const UIEventCollector = (function() {
  var K = null;
  var N = null;
  var Y = null;
  var M = null;
  var F = ['output_size_limit'];
  O();
  R();
  function O(b) {
    M = { output_size_limit: 1024, collection_mode: 'partial' };
    if (b) {
      for (p in b) {
        if (!(p._config === undefined)) {
          var a = false;
          for (var c = F.length - 1; c >= 0; c--) {
            if (F[c] == p) {
              found = true;
              continue;
            }
          }
          if (!a) {
            M[p] = b[p];
          }
        }
      }
    }
    Y = false;
    N = X();
    K = {
      elements: new UIElementList(),
      events: [],
      collection_status: 0,
      toString: function() {
        return (
          'RecordedData: {elements: ' +
          this.elements +
          ', events: ' +
          this.events +
          '}'
        );
      }
    };
    R();
  }
  function J() {
    var c = V();
    for (var a = 0, b = c.length; a < b; a++) {
      T(c[a]);
    }
  }
  function V() {
    var a = [];
    var e = document.getElementsByTagName('input');
    for (var b = 0, c = e.length; b < c; b++) {
      var d = e[b];
      if (G(d)) {
        a.push(d);
      }
    }
    return a;
  }
  function G(b) {
    if (b.tagName && b.tagName.toLowerCase() == 'input') {
      var a = b.getAttribute('type');
      if (a == 'text' || a == 'checkbox' || a == 'checkbox') {
        return true;
      }
    }
    return false;
  }
  function X() {
    var a = document.createEvent
      ? document.createEvent('Event')
      : document.createEventObject();
    var b = a.timeStamp || new Date();
    b = new Date(b);
    if (b.getYear() > 2100) {
      b = new Date(b / 1000);
    }
    b = b.getTime();
    return b;
  }
  function T(a) {
    var b = null;
    var c = K.elements;
    var d = c.size();
    var e = Z(a);
    if (!K.elements.containsKey(e)) {
      b = new InteractionElement();
      b.id(e);
      b.type(D(a));
      b.length(a.value ? a.value.length : 0);
      c.put(b);
    } else {
      b = c.get(e);
    }
    return b;
  }
  function P(c) {
    var e = c || window.event;
    var a = T(W(e));
    a.incrementEventCount();
    var b = new UIEvent();
    b.index(a.index());
    b.type(aa(e));
    var d = I(e);
    b.offset(d - N);
    K.events.push(b);
    return true;
  }
  function E(a) {
    var b = a || window.event;
    if (H(b)) {
      var c = { target: W(b), type: 'paste' };
      return P(c);
    } else {
      return P(b);
    }
  }
  function H(b) {
    if (b.type == 'keydown') {
      var a = b.which || b.charCode || b.keyCode;
      var c =
        (typeof KeyboardEvent != 'undefined' && a == KeyboardEvent.DOM_VK_V) ||
        a == 118 ||
        a == 86;
      if (c && (b.ctrlKey || b.metaKey)) {
        return true;
      }
    }
    return false;
  }
  function W(a) {
    return a.target ? a.target : a.srcElement;
  }
  function I(b) {
    var a;
    if (b.timeStamp && b.timeStamp !== 0) {
      a = b.timeStamp;
      if (new Date(a).getYear() > 2100) {
        a = a / 1000;
      }
    } else {
      a = new Date().getTime();
    }
    return a;
  }
  function L(a) {}
  function Q() {
    J();
    var b = K.elements;
    for (var e = b.size(); e >= 1; e--) {
      var c = b.getByIndex(e);
      var d = c.id();
      var a = document.getElementById(d);
      if (!a) {
        var f = document.getElementsByName(d);
        if (f.length > 0) {
          a = f[0];
        }
      }
      if (a && a.value) {
        c.length(a.value.length);
      }
    }
  }
  function S(d) {
    var f = d || window.event;
    var a = d.target;
    if (a.nodeType == 1) {
      var c = a.getElementsByTagName('form');
      for (var e = c.length - 1; e >= 0; e--) {
        var b = c[e];
        b.onsubmit = recordFormSubmitEvent;
      }
    }
  }
  function R() {
    var a = P;
    var b = document;
    if (b.addEventListener) {
      b.addEventListener('keydown', E, false);
      b.addEventListener('paste', a, false);
      b.addEventListener('focus', a, true);
      b.addEventListener('blur', a, true);
    } else {
      if (b.attachEvent) {
        b.onkeydown = E;
        b.onfocusin = a;
        b.onfocusout = a;
      }
    }
  }
  function U() {
    return private_config;
  }
  function aa(a) {
    if (a.type == 'keydown') {
      return UIEvent.KeyDown;
    } else {
      if (a.type == 'submit') {
        return UIEvent.Submit;
      } else {
        if (a.type == 'paste') {
          return UIEvent.Paste;
        } else {
          if (a.type == 'focus' || a.type == 'focusin') {
            return UIEvent.Focus;
          } else {
            if (a.type == 'blur' || a.type == 'focusout') {
              return UIEvent.Blur;
            } else {
              return UIEvent.Unknown;
            }
          }
        }
      }
    }
  }
  function C(a) {
    if (a == UIEvent.KeyDown) {
      return 'keydown';
    } else {
      if (a == UIEvent.Submit) {
        return 'submit';
      } else {
        if (a == UIEvent.Focus) {
          return 'focus';
        } else {
          if (a == UIEvent.Blur) {
            return 'blur';
          } else {
            if (a == UIEvent.Paste) {
              return 'paste';
            } else {
              return 'unknown';
            }
          }
        }
      }
    }
  }
  function D(a) {
    return a.nodeName + (a.type ? ':' + a.type : '');
  }
  function Z(a) {
    return a.id ? a.id : a.name ? a.name : a.nodeName;
  }
  return {
    addElement: function(a) {
      return T(a);
    },
    getEventType: function(a) {
      return aa(a);
    },
    getEventCode: function(a) {
      return C(a);
    },
    getRecordedData: function() {
      return K;
    },
    getElementType: function(a) {
      return D(a);
    },
    getElementId: function(a) {
      return Z(a);
    },
    initEventCollection: function(a) {
      O(a);
    },
    getConfig: function() {
      return M;
    },
    serialize: function() {
      Q();
      var d = this.getRecordedData();
      var n = d.elements;
      var B = [];
      for (var f = 0; f < n.length; f++) {
        B[f] = false;
      }
      var A = d.events;
      var r = d.collection_status;
      var ab = this.getConfig().collection_mode == 'partial';
      var g = this.getConfig().output_size_limit;
      var v = A.length;
      var q = '@';
      var a = ';';
      var b = ',';
      var h = 2 * q.length;
      var e = '' + N + b + ('' + r);
      var s = 1;
      h += s;
      h += b.length;
      h += e.length;
      var u = '';
      L('serializing elements ');
      for (var o = n.size(); o > 0; o--) {
        var c = n.getByIndex(o);
        var k = c.serialize() + a;
        L('elementsStr.length: ' + u.length);
        if (ab && h + u.length + k.length > g) {
          Y = true;
          break;
        }
        if (c.eventCount() == 0) {
          L('collecting element without input: ' + c);
          u = k + u;
        }
      }
      if (u.length > 0) {
        u = u.substring(0, u.length - 1);
      }
      h += u.length;
      var y = '';
      L('serializing events ');
      while (v--) {
        var l = A[v];
        var m = l.index();
        var w = l.serialize() + a;
        var k = n.getByIndex(m).serialize() + a;
        var z = w.length;
        if (!B[m]) {
          z += k.length;
        }
        L('eventsStr.length: ' + y.length);
        if (ab && h + y.length + z > g) {
          Y = true;
          break;
        }
        L('collecting event: ' + l);
        if (!B[m]) {
          u = k + u;
          h += k.length;
          L('also adding element event: ' + k);
        }
        B[m] = true;
        y = w + y;
      }
      if (y.length > 0) {
        y = y.substring(0, y.length - 1);
      }
      var j = Y ? 1 : 0;
      var x = u + q + y + q + j + b + e;
      return x;
    }
  };
})();

function UIEvent() {
  var b = this === window ? {} : this;
  b.index = function(a) {
    if (arguments.length === 0) {
      return b._index;
    } else {
      b._index = arguments[0];
    }
  };
  b.offset = function(a) {
    if (arguments.length === 0) {
      return b._offset;
    } else {
      b._offset = arguments[0];
    }
  };
  b.type = function(a) {
    if (arguments.length === 0) {
      return b._type;
    } else {
      b._type = arguments[0];
    }
  };
  b.serialize = function() {
    var a = ',';
    var d = '0';
    return b.index() + a + b.type() + a + d;
  };
  b.toString = function() {
    return (
      'UIEvent: [index: ' +
      b.index() +
      ', type: ' +
      b.type() +
      ', offset: ' +
      b.offset() +
      ']'
    );
  };
}
UIEvent.Unknown = 0;
UIEvent.KeyDown = 1;
UIEvent.Submit = 2;
UIEvent.Focus = 3;
UIEvent.Blur = 4;
UIEvent.Paste = 5;

function InteractionElement() {
  var b = this === window ? {} : this;
  b._eventCount = 0;
  b.id = function(a) {
    if (arguments.length === 0) {
      return b._id;
    } else {
      b._id = arguments[0];
    }
  };
  b.index = function(a) {
    if (arguments.length === 0) {
      return b._index;
    } else {
      b._index = arguments[0];
    }
  };
  b.length = function(a) {
    if (arguments.length === 0) {
      return b._length;
    } else {
      b._length = arguments[0];
    }
  };
  b.type = function(a) {
    if (arguments.length === 0) {
      return b._type;
    } else {
      b._type = arguments[0];
    }
  };
  b.incrementEventCount = function() {
    b._eventCount++;
  };
  b.eventCount = function() {
    return b._eventCount;
  };
  b.serialize = function() {
    var a = ',';
    var d = b.index();
    return b.index() + a + d + a + b.type() + a + b.length();
  };
  b.toString = function() {
    return (
      'InteractionElement: [id: ' +
      b.id() +
      ', index: ' +
      b.index() +
      ', length: ' +
      b.length() +
      ', type: ' +
      b.type() +
      ']'
    );
  };
}

function UIElementList() {
  var e = this === window ? {} : this;
  var d = new Hashtable();
  var f = new Hashtable();
  e.get = function(a) {
    return d.get(a);
  };
  e.getByIndex = function(a) {
    return f.get(a);
  };
  e.containsKey = function(a) {
    return d.containsKey(a);
  };
  e.indexByKey = function(a) {
    return get(a).index();
  };
  e.size = function() {
    return d.size();
  };
  e.put = function(a) {
    var b = a.id();
    if (!d.containsKey(b)) {
      d.put(b, a);
      var c = d.size();
      a.index(c);
      f.put(c, a);
    }
  };
  e.toString = function() {
    return '[size: ' + d.size() + ', names: [' + d + '], indexes: [' + f + ']]';
  };
}
function activeXDetect(e) {
  var f = null;
  try {
    f = document.body.getComponentVersion('{' + e + '}', 'ComponentID');
  } catch (d) {}
  return f !== null ? f : false;
}

var BrowserDetect = {
  init: function() {
    this.browser = this.searchString(this.dataBrowser) || 'an unknown browser';
    this.version =
      this.searchVersion(navigator.userAgent) ||
      this.searchVersion(navigator.appVersion) ||
      'an unknown version';
    this.OS = this.searchString(this.dataOS) || 'an unknown OS';
  },
  searchString: function(l) {
    var k = l.length;
    for (var o = 0; o < k; o++) {
      var h = l[o];
      var n = h.string;
      var m = h.prop;
      var j = h.identity;
      this.versionSearchString = h.versionSearch || j;
      if (n) {
        if (n.toLowerCase().indexOf(h.subString.toLowerCase()) !== -1) {
          return j;
        }
      } else {
        if (m) {
          return j;
        }
      }
    }
  },
  searchVersion: function(d) {
    var e = d.toLowerCase().indexOf(this.versionSearchString.toLowerCase());
    if (e === -1) {
      return;
    }
    var f = d.substring(e + this.versionSearchString.length);
    if (f.indexOf(' ') === 0 || f.indexOf('/') === 0) {
      f = f.substring(1);
    }
    return parseFloat(f);
  },
  dataBrowser: [
    { string: navigator.userAgent, subString: 'Chrome', identity: 'Chrome' },
    {
      string: navigator.userAgent,
      subString: 'OmniWeb',
      versionSearch: 'OmniWeb/',
      identity: 'OmniWeb'
    },
    {
      string: navigator.userAgent.toLowerCase(),
      subString: 'opera',
      identity: 'Opera',
      versionSearch: 'version'
    },
    {
      string: navigator.vendor,
      subString: 'Apple',
      identity: 'Safari',
      versionSearch: 'Version'
    },
    {
      string: navigator.userAgent,
      subString: 'mobile safari',
      identity: 'Mobile Safari',
      versionSearch: 'mobile safari'
    },
    { string: navigator.vendor, subString: 'iCab', identity: 'iCab' },
    { string: navigator.vendor, subString: 'KDE', identity: 'Konqueror' },
    { string: navigator.userAgent, subString: 'Firefox', identity: 'Firefox' },
    { string: navigator.vendor, subString: 'Camino', identity: 'Camino' },
    {
      string: navigator.userAgent.toLocaleLowerCase(),
      subString: 'blackberry',
      identity: 'BlackBerry',
      versionSearch: '0/'
    },
    {
      string: navigator.userAgent,
      subString: 'Netscape',
      identity: 'Netscape'
    },
    {
      string: navigator.userAgent,
      subString: 'MSIE',
      identity: 'Explorer',
      versionSearch: 'MSIE'
    },
    {
      string: navigator.userAgent,
      subString: 'Gecko',
      identity: 'Mozilla',
      versionSearch: 'rv'
    },
    {
      string: navigator.userAgent,
      subString: 'Mozilla',
      identity: 'Netscape',
      versionSearch: 'Mozilla'
    }
  ],
  dataOS: [
    {
      string: navigator.userAgent,
      subString: 'BlackBerry',
      identity: 'BlackBerry'
    },
    {
      string: navigator.userAgent.toLowerCase(),
      subString: 'android',
      identity: 'Android'
    },
    { string: navigator.userAgent, subString: 'Symbian', identity: 'Symbian' },
    { string: navigator.platform, subString: 'Mac', identity: 'Mac' },
    {
      string: navigator.userAgent,
      subString: 'iPhone',
      identity: 'iPhone/iPod'
    },
    { string: navigator.platform, subString: 'Linux', identity: 'Linux' },
    {
      string: navigator.userAgent,
      subString: 'Windows CE',
      identity: 'Windows CE'
    },
    { string: navigator.platform, subString: 'Win', identity: 'Windows' }
  ]
};

function convertTimestampToGMT(c) {
  var d = c;
  if (!(c instanceof Date)) {
    d = new Date(c);
  }
  offsetFromGmt = d.getTimezoneOffset() * 60000;
  return d.getTime() + offsetFromGmt;
}

function getTimestampInMillis(c) {
  var d = c;
  if (c instanceof Date) {
    d = c.getTime();
  }
  return d;
}

function debug(b) {}

function stripIllegalChars(value) {
  var t = '';
  // first we need to escape any "\n" or "/" or "\"
  value = value.toLowerCase();
  for (let i = 0; i < value.length; i++) {
    if (
      value.charAt(i) != '\n' &&
      value.charAt(i) != '/' &&
      value.charAt(i) != '\\'
    ) {
      t += value.charAt(i);
    } else if (value.charAt(i) == '\n') {
      t += 'n';
    }
  }
  return t;
}

function stripFullPath(tempFileName, lastDir) {
  var fileName = tempFileName;
  // anything before the last lastDir will be lost
  var filenameStart = 0;
  filenameStart = fileName.lastIndexOf(lastDir);
  if (filenameStart < 0) {
    return tempFileName;
  }
  var filenameFinish = fileName.length;
  fileName = fileName.substring(filenameStart + lastDir.length, filenameFinish);
  return fileName;
}

var BrowserDetect = {
  init: function() {
    this.browser = this.searchString(this.dataBrowser) || 'An unknown browser';
    this.version =
      this.searchVersion(navigator.userAgent) ||
      this.searchVersion(navigator.appVersion) ||
      'an unknown version';
    this.OS = this.searchString(this.dataOS) || 'an unknown OS';
  },
  searchString: function(data) {
    for (let i = 0; i < data.length; i++) {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1) {
          return data[i].identity;
        }
      } else if (dataProp) {
        return data[i].identity;
      }
    }
  },
  searchVersion: function(dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) {
      return;
    }
    return parseFloat(
      dataString.substring(index + this.versionSearchString.length + 1)
    );
  },
  dataBrowser: [
    {
      string: navigator.userAgent,
      subString: 'Chrome',
      identity: 'Chrome',
      id: 1
    },
    {
      string: navigator.userAgent,
      subString: 'OmniWeb',
      versionSearch: 'OmniWeb/',
      identity: 'OmniWeb',
      id: 2
    },
    {
      string: navigator.vendor,
      subString: 'Apple',
      identity: 'Safari',
      versionSearch: 'Version',
      id: 3
    },
    {
      prop: window.opera,
      identity: 'Opera',
      id: 4
    },
    {
      string: navigator.vendor,
      subString: 'iCab',
      identity: 'iCab',
      id: 5
    },
    {
      string: navigator.vendor,
      subString: 'KDE',
      identity: 'Konqueror',
      id: 5
    },
    {
      string: navigator.userAgent,
      subString: 'Firefox',
      identity: 'Firefox',
      id: 6
    },
    {
      string: navigator.vendor,
      subString: 'Camino',
      identity: 'Camino',
      id: 7
    },
    {
      // for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: 'Netscape',
      identity: 'Netscape',
      id: 8
    },
    {
      string: navigator.userAgent,
      subString: 'MSIE',
      identity: 'Explorer',
      versionSearch: 'MSIE',
      id: 9
    },
    {
      string: navigator.userAgent,
      subString: 'Gecko',
      identity: 'Mozilla',
      versionSearch: 'rv',
      id: 10
    },
    {
      // for older Netscapes (4-)
      string: navigator.userAgent,
      subString: 'Mozilla',
      identity: 'Netscape',
      versionSearch: 'Mozilla',
      id: 11
    }
  ],
  dataOS: [
    {
      string: navigator.platform,
      subString: 'Win',
      identity: 'Windows'
    },
    {
      string: navigator.platform,
      subString: 'Mac',
      identity: 'Mac'
    },
    {
      string: navigator.userAgent,
      subString: 'iPhone',
      identity: 'iPhone/iPod'
    },
    {
      string: navigator.platform,
      subString: 'Linux',
      identity: 'Linux'
    }
  ]
};
/*
 * the FingerPrint prototype object defines the following properties, deviceprint_browser,
 * deviceprint_software, deviceprint_display...., that reference the functions, deviceprint_browser,
 * deviceprint_software, deviceprint_display, .... Every instance of FingerPrint inherits the
 * prototype allowing them to call the FingerPrint functions through the
 * properties.
 */
function FingerPrint() {
  /*
   Create a Hashtable of mozilla components
   */
  var ht = new Hashtable();
  ht.put('npnul32', 'def'); // Default netscape plugin
  ht.put('npqtplugin6', 'qt6'); // Quicktime 6.5.1
  ht.put('npqtplugin5', 'qt5'); // Quicktime 6.5.1
  ht.put('npqtplugin4', 'qt4'); // Quicktime 6.5.1
  ht.put('npqtplugin3', 'qt3'); // Quicktime 6.5.1
  ht.put('npqtplugin2', 'qt2'); // Quicktime 6.5.1
  ht.put('npqtplugin', 'qt1'); // Quicktime 6.5.1
  ht.put('nppdf32', 'pdf'); // Adobe Acrobat
  ht.put('NPSWF32', 'swf'); // Macromedia Flash
  ht.put('NPJava11', 'j11'); // Java 1.4.2_02
  ht.put('NPJava12', 'j12'); // Java 1.4.2_02
  ht.put('NPJava13', 'j13'); // Java 1.4.2_02
  ht.put('NPJava32', 'j32'); // Java 1.4.2_02
  ht.put('NPJava14', 'j14'); // Java 2 5.0 Update 4
  ht.put('npoji600', 'j61'); // Java 2 5.0 Update 4
  ht.put('NPJava131_16', 'j16'); // Java 1.3.1_16
  ht.put('NPOFFICE', 'mso'); // Microsoft Office 2003
  ht.put('npdsplay', 'wpm'); // Windows Media Player
  ht.put('npwmsdrm', 'drm'); // Windows DRM
  ht.put('npdrmv2', 'drn'); // Netscape DRM
  ht.put('nprjplug', 'rjl'); // Real Jukebox
  ht.put('nppl3260', 'rpl'); // Real Player Live Connect
  ht.put('nprpjplug', 'rpv'); // Real Player Version
  ht.put('npchime', 'chm'); // Chime
  ht.put('npCortona', 'cor'); // Cortina
  ht.put('np32dsw', 'dsw'); // Macromedia Director
  ht.put('np32asw', 'asw'); // Macromedia Authorware

  this.deviceprint_version = function() {
    return 1;
  };

  /*
   * This function captures the User Agent String from the Client Browser
   */
  this.deviceprint_browser = function() {
    var userAgent = navigator.userAgent;
    var ua = userAgent.toLowerCase();
    var t = ua + SEP + navigator.appVersion + SEP + navigator.platform;
    return t;
  };

  this.deviceprint_software = function() {
    var t = '';
    var isFirst = true;

    if (navigator.plugins.length > 0) {
      var temp = '';
      var moz = '';
      var key = '';
      var plugin = '';
      for (let i = 0; i < navigator.plugins.length; i++) {
        plugin = navigator.plugins[i];
        moz = plugin.filename;
        var index = moz.indexOf('.');
        moz = moz.slice(0, index);
        if (isFirst === true) {
          key = ht.containsKey(moz);
          if (key) {
            temp += ht.get(moz);
            isFirst = false;
          } else {
            temp = '';
            isFirst = false;
          }
        } else {
          key = ht.containsKey(moz);
          if (key) {
            temp += SEP + ht.get(moz);
          }
        }
      }
      t = stripIllegalChars(temp);
    }
    return t;
  };

  /*
   * This function captures the Client's Screen Information
   */
  this.deviceprint_display = function() {
    var t = '';
    if (self.screen) {
      t +=
        screen.colorDepth +
        SEP +
        screen.width +
        SEP +
        screen.height +
        SEP +
        screen.availHeight;
    }
    return t;
  };

  /*
   * This function captures the user's timezone in GMT
   */
  this.deviceprint_timezone = function() {
    var gmtHours = (new Date().getTimezoneOffset() / 60) * -1;
    return gmtHours;
  };

  /*
   * This function captures the user's browser language. Note: this is captured in
   * the User Agent String, but this function provides more detailed information
   * from IE (system language)
   */
  this.deviceprint_language = function() {
    var lang;

    if (typeof navigator.language !== 'undefined') {
      lang = 'lang' + PAIR + navigator.language + SEP;
    } else if (typeof navigator.browserLanguage !== 'undefined') {
      lang = 'lang' + PAIR + navigator.browserLanguage + SEP;
    } else {
      lang = 'lang' + PAIR + '' + SEP;
    }

    if (typeof navigator.systemLanguage !== 'undefined') {
      lang += 'syslang' + PAIR + navigator.systemLanguage + SEP;
    } else {
      lang += 'syslang' + PAIR + '' + SEP;
    }
    if (typeof navigator.userLanguage !== 'undefined') {
      lang += 'userlang' + PAIR + navigator.userLanguage;
    } else {
      lang += 'userlang' + PAIR + '';
    }
    return lang;
  };

  /*
   * This function captures whether or not Java is enabled
   */
  this.deviceprint_java = function() {
    var javaEnabled = navigator.javaEnabled() ? 1 : 0;
    return javaEnabled;
  };

  /*
   * This function captures whether or not user enabled cookies or not
   */
  this.deviceprint_cookie = function() {
    var cookieEnabled = navigator.cookieEnabled ? 1 : 0;
    // if not IE4+ nor NS6+
    if (typeof navigator.cookieEnabled === 'undefined' && !cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled = document.cookie.indexOf('testcookie') !== -1 ? 1 : 0;
    }
    return cookieEnabled;
  };

  /*
   * deviceprint Communication - 3 options 1. Post Asynchronously 2. Post
   * Synchronously 3. Query String   Removed by YT 2010-04-15
   */
}
/*
  Helper Hashtable implementation
  */
function Hashtable() {
  var keysToIndex = { __indexToValue: [], __indexToKeys: [] };
  var activeEnum = [];
  var tableLength = 0;
  var self = this;

  /*
      This inner Object constructor is used to implement a Java
      style Enumerator (and Iterator) Object.
      */

  function Enumeration(arrNm) {
    var lastIndex = null;
    var enumIndex = 0;
    while (typeof activeEnum[enumIndex] == 'number') {
      enumIndex += 1;
    }
    activeEnum[enumIndex] = 0;

    /*
          Returns true if this Enumerator/ has another entry to
          return, else returns false.
          */
    this.hasNext = this.hasMoreElements = function() {
      if (activeEnum[enumIndex] < tableLength) {
        return true;
      } else {
        if (typeof activeEnum[enumIndex] == 'number') {
          activeEnum[enumIndex] = null;
        }
        return false;
      }
    };

    /*
        Returns the next item from this Enumerator/Iterator (key
        or value, depending on whether it was created with the keys
        or elements methods).
        */
    this.next = this.nextElement = function() {
      if (this.hasNext) {
        lastIndex = activeEnum[enumIndex];
        return keysToIndex[arrNm][activeEnum[enumIndex]++];
      } else {
        return null;
      }
    };

    /*
        Removes the last entry (key/value pair) accessed with the
        next or nextElement methods of this Enumerator/Iterator
        (if any). The key/value pair is removed regardless of whether
        the Enumerator/Iterator was accessing keys or values.
        */
    this.remove = function() {
      if (typeof lastIndex == 'number') {
        self.remove(keysToIndex.__indexToKeys[lastIndex]);
        lastIndex = null;
      }
    };
  }
  // End Enumeration

  /*
      Returns the value mapped to the provided (String) key, or null
      if the key is not mapped to a value.
      */
  this.get = function(key) {
    if (typeof keysToIndex[key] == 'number') {
      return keysToIndex.__indexToValue[keysToIndex[key]];
    } else {
      return null;
    }
  };
  /*
      Adds the value provided to this Hashtable mapped to the key
      provided.
      */
  this.put = function(key, value) {
    if (typeof keysToIndex[key] == 'number') {
      keysToIndex.__indexToValue[keysToIndex[key]] = value;
    } else {
      keysToIndex[key] = tableLength;
      keysToIndex.__indexToValue[tableLength] = value;
      keysToIndex.__indexToKeys[tableLength++] = key;
    }
  };
  /*
      Removes the key and any value mapped to it from this
      Hashtable.
      */
  this.remove = function(key) {
    var remIndex = keysToIndex[key];
    if (typeof remIndex == 'number') {
      delete keysToIndex[key];
      tableLength -= 1;
      for (var c = remIndex; c < tableLength; c++) {
        keysToIndex.__indexToValue[c] = keysToIndex.__indexToValue[c + 1];
        keysToIndex[
          (keysToIndex.__indexToKeys[c] = keysToIndex.__indexToKeys[c + 1])
        ] = c;
      }
      for (var j = 0; j < activeEnum.length; j++) {
        if (activeEnum[j] && remIndex < activeEnum[j]) {
          activeEnum[j] -= 1;
        }
      }
    }
  };

  /*
      Returns the length of this Hashtable.
      */
  this.size = function() {
    return tableLength;
  };

  /*
      This method is not intended for external use! use elements
      and keys methods instead.
      */
  this.__enumerate = function(type) {
    return new Enumeration(type);
  };

  /*
    Returns an object that is similar to the Java Enumeration
    Interface, having hasMoreElements and nextElement Methods. This
    object also reproduces the Java Iterator interface, having methods
    hasNext, next and remove. This enumeration is of the values stored
    in the Hashtable.
    */
  Hashtable.prototype.elements = function() {
    return this.__enumerate('__indexToValue');
  };

  /*
    Returns an object that is similar to the Java Enumeration
    Interface, having hasMoreElements and nextElement Methods. This
    object also reproduces the Java Iterator interface, having methods
    hasNext, next and remove. This enumeration is of the keys stored
    in the Hashtable.
    */
  Hashtable.prototype.keys = function() {
    return this.__enumerate('__indexToKeys');
  };

  /*
    Removes all entry's from the Hashtable
    */
  Hashtable.prototype.clear = function() {
    var e = this.keys();
    while (e.hasNext()) {
      this.remove(e.next());
    }
  };

  Hashtable.prototype.toString = function() {
    var n,
      e = this.keys();
    var st = '';
    while (e.hasNext()) {
      n = e.next();
      st += n + ' =&gt; ' + this.get(n) + '\r\n';
    }
    return st;
  };

  /*
    Returns true if this Hashtable contains a value that is equal
    to the value provided, else returns false
    */
  Hashtable.prototype.contains = function(testVal) {
    var e = this.elements();
    while (e.hasNext()) {
      if (e.next() == testVal) {
        return true;
      }
    }
    return false;
  };

  /*
    Returns true if this Hashtable contains a value that is equal
    to the value provided, else returns false.
    */
  Hashtable.prototype.containsValue = Hashtable.prototype.contains;

  /*
    Returns true if this Hashtable contains a value mapped to
    the value provided, else returns false.
    */
  Hashtable.prototype.containsKey = function(testKey) {
    return this.get(testKey) !== null;
  };

  /*
    Returns true if this Hashtable has zero entry's.
    */
  Hashtable.prototype.isEmpty = function() {
    return this.size() === 0;
  };

  /*
    If the parameter provided is another Hashtable object
    then all of the key/value pairs from the provided Hashtable
    are added to this Hashtable.
    */
  Hashtable.prototype.putAll = function(hTable) {
    if (hTable.constructor == Hashtable) {
      var n,
        e = hTable.keys();
      while (e.hasNext()) {
        n = e.next();
        this.put(n, hTable.get(n));
      }
    }
  };

  /*
    Returns a 'shallow' copy of this Hashtable.
    */
  Hashtable.prototype.clone = function() {
    var ht = new Hashtable();
    ht.putAll(this);
    return ht;
  };

  /*
    Returns true if this Hashtable equals the parameter
    provided, else it returns false.
    */
  Hashtable.prototype.equals = function(o) {
    return o == this;
  };
}

function IE_FingerPrint() {
  /*
   * This function captures the User Agent String from the Client Browser
   */
  this.deviceprint_browser = function() {
    var ua = navigator.userAgent.toLowerCase();
    var t = ua + SEP + navigator.appVersion + SEP + navigator.platform;
    t +=
      SEP +
      navigator.appMinorVersion +
      SEP +
      navigator.cpuClass +
      SEP +
      navigator.browserLanguage;
    t += SEP + ScriptEngineBuildVersion();
    return t;
  };

  this.deviceprint_software = function deviceprint_software() {
    var t = '';
    var isFirst = true;

    document.body.addBehavior('#default#clientCaps');
    var compVer;
    // for (var i = 0; i < components.length; i++) {
    for (let i = 0; i < components.length; i++) {
      compVer = activeXDetect(components[i]);
      var name = names[i];
      if (compVer) {
        if (isFirst === true) {
          t += name + PAIR + compVer;
          isFirst = false;
        } else {
          t += SEP + name + PAIR + compVer;
        }
      } else {
        t += '';
        isFirst = false;
      }
    }
    return t;
  };
  var names = new Array(
    'abk', // Address Book
    'wnt', // Windows Desktop Update NT
    'aol', // AOL ART Image Format Support
    'arb', // Arabic Text Display Support
    'chs', // Chinese (Simplified) Text Display Support
    'cht', // Chinese (traditional) Text Display Support
    'dht', // Dynamic HTML Data Binding
    'dhj', // Dynamic HTML Data Binding for Java
    'dan', // DirectAnimation
    'dsh', // DirectShow
    'heb', // Hebrew Text Display Support
    'ie5', // Internet Explorer 5 Browser
    'icw', // Internet Connection Wizard
    'ibe', // Internet Explorer Browsing Enhancements
    'iec', // Internet Explorer Classes for Java
    'ieh', // Internet Explorer Help
    'iee', // Internet Explorer Help Engine
    'jap', // Japanese Text Display Support
    'krn', // Korean Text Display Support
    'lan', // Language Auto-Selection
    'swf', // Macromedia Flash
    'shw', // Macromedia Shockwave Director
    'msn', // MSN Messenger Service
    'wmp', // Windows Media Player
    'obp', // Offline Browsing Pack
    'oex', // Outlook Express
    'net', // NetMeeting NT
    'pan', // Pan-European Text Display Support
    'thi', // Thai Text Display Support
    'tks', // Task Scheduler
    'uni', // Uniscribe
    'vtc', // Vector Graphics Rendering (VML)
    'vnm', // Vietnamese Text Display Support
    'mvm', // Microsoft virtual machine
    'vbs', // Visual Basic Scripting Support
    'wfd' // Web Folders
  );

  /*
   * Create a Hashtable of IE components guids
   */
  var components = new Array(
    '7790769C-0471-11D2-AF11-00C04FA35D02',
    '89820200-ECBD-11CF-8B85-00AA005B4340',
    '47F67D00-9E55-11D1-BAEF-00C04FC2D130',
    '76C19B38-F0C8-11CF-87CC-0020AFEECF20',
    '76C19B34-F0C8-11CF-87CC-0020AFEECF20',
    '76C19B33-F0C8-11CF-87CC-0020AFEECF20',
    '9381D8F2-0288-11D0-9501-00AA00B911A5',
    '4F216970-C90C-11D1-B5C7-0000F8051515',
    '283807B5-2C60-11D0-A31D-00AA00B92C03',
    '44BBA848-CC51-11CF-AAFA-00AA00B6015C',
    '76C19B36-F0C8-11CF-87CC-0020AFEECF20',
    '89820200-ECBD-11CF-8B85-00AA005B4383',
    '5A8D6EE0-3E18-11D0-821E-444553540000',
    '630B1DA0-B465-11D1-9948-00C04F98BBC9',
    '08B0E5C0-4FCB-11CF-AAA5-00401C608555',
    '45EA75A0-A269-11D1-B5BF-0000F8051515',
    'DE5AED00-A4BF-11D1-9948-00C04F98BBC9',
    '76C19B30-F0C8-11CF-87CC-0020AFEECF20',
    '76C19B31-F0C8-11CF-87CC-0020AFEECF20',
    '76C19B50-F0C8-11CF-87CC-0020AFEECF20',
    'D27CDB6E-AE6D-11CF-96B8-444553540000',
    '2A202491-F00D-11CF-87CC-0020AFEECF20',
    '5945C046-LE7D-LLDL-BC44-00C04FD912BE',
    '22D6F312-B0F6-11D0-94AB-0080C74C7E95',
    '3AF36230-A269-11D1-B5BF-0000F8051515',
    '44BBA840-CC51-11CF-AAFA-00AA00B6015C',
    '44BBA842-CC51-11CF-AAFA-00AA00B6015B',
    '76C19B32-F0C8-11CF-87CC-0020AFEECF20',
    '76C19B35-F0C8-11CF-87CC-0020AFEECF20',
    'CC2A9BA0-3BDD-11D0-821E-444553540000',
    '3BF42070-B3B1-11D1-B5C5-0000F8051515',
    '10072CEC-8CC1-11D1-986E-00A0C955B42F',
    '76C19B37-F0C8-11CF-87CC-0020AFEECF20',
    '08B0E5C0-4FCB-11CF-AAA5-00401C608500',
    '4F645220-306D-11D2-995D-00C04F98BBC9',
    '73FA19D0-2D75-11D2-995D-00C04F98BBC9'
  );
}

IE_FingerPrint.prototype = new FingerPrint();

function Mozilla_FingerPrint() {}

Mozilla_FingerPrint.prototype = new FingerPrint();

function Opera_FingerPrint() {}

Opera_FingerPrint.prototype = new FingerPrint();

/*
 *include all the java script
 *
 *
 */

/*
 * Deviceprint - delimited string value where names are in accordance with
 * PassMarkDeviceRequest
 */
function add_deviceprint() {
  /*
   * Browser Detection
   */
  BrowserDetect.init();
  var fp;
  switch (BrowserDetect.browser) {
    case 'Explorer':
      fp = new IE_FingerPrint();
      break;
    case 'Firefox':
      fp = new Mozilla_FingerPrint();
      break;
    case 'Opera':
      fp = new Opera_FingerPrint();
      break;
    default:
      fp = new FingerPrint();
  }
  var t =
    'version=' +
    fp.deviceprint_version() +
    '&pm_fpua=' +
    fp.deviceprint_browser() +
    '&pm_fpsc=' +
    fp.deviceprint_display() +
    '&pm_fpsw=' +
    fp.deviceprint_software() +
    '&pm_fptz=' +
    fp.deviceprint_timezone() +
    '&pm_fpln=' +
    fp.deviceprint_language() +
    '&pm_fpjv=' +
    fp.deviceprint_java() +
    '&pm_fpco=' +
    fp.deviceprint_cookie();
  return t;
}

/*
 * URL encode the string to make it portable safely
 */
function urlEncode(text) {
  // The escape() function encodes special characters, with the exception of:
  // * @ - _ + . /
  // find *+-_/.@ and replace with equivalent url-encode value
  var encodedString = escape(text)
    .replace(/\*/g, '%2A')
    .replace(/\+/g, '%2B')
    .replace(/-/g, '%2D')
    .replace(/\./g, '%2E')
    .replace(/\//g, '%2F')
    .replace(/_/g, '%5F')
    .replace(/@/g, '%40');

  return encodedString;
}

/*
 * Encoded Deviceprint - Encodes The Deviceprint
 */
export const encode_deviceprint = () => {
  var t = add_deviceprint();
  return urlEncode(t);
}

/*
 * Helper Function - Shows How to Decode The Deviceprint
 */
function decode_deviceprint() {
  var t = encode_deviceprint;
  return unescape(urlEncode(t));
}

/*
 * deviceprint - POST data
 */
function post_deviceprint() {
  /*
   * Uncomment for another version
   *
   * document.forms[0].fp_browser.value = URLencode(deviceprint_browser());
   * document.forms[0].fp_screen.value = URLencode(deviceprint_display());
   * document.forms[0].fp_software.value = URLencode(deviceprint_software());
   * document.forms[0].fp_timezone.value = URLencode(deviceprint_timezone());
   * document.forms[0].fp_language.value = URLencode(deviceprint_language());
   * document.forms[0].fp_java.value = URLencode(deviceprint_java());
   * document.forms[0].fp_cookie.value = URLencode(deviceprint_cookie());
   */
  document.forms[0].pm_fp.value = encode_deviceprint();
  return true;
}

function v3mRSA_GetData(t) {
  t.RSA_DEVPRINT.value = encode_deviceprint();
  return true;
}
