// Generated from coffeescript
// Taken from https://github.com/movableink/CORS-Proxy

var Cache, EventEmitter, cacheMiddleware,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

EventEmitter = require('events').EventEmitter;

cacheMiddleware = require('./cache-middleware');

Cache = (function(superClass) {
  extend(Cache, superClass);

  function Cache(expires1, options) {
    this.expires = expires1;
    this.options = options != null ? options : {};
    this.cacheBucket = {};
    this.locked = {};
    this.setMaxListeners(5000);
    setInterval((function(_this) {
      return function() {
        return _this.debugLog();
      };
    })(this), 60 * 1000);
  }

  Cache.prototype.get = function(key) {
    return this.cacheBucket[key];
  };

  Cache.prototype.has = function(key) {
    return this.cacheBucket[key] != null;
  };

  Cache.prototype.set = function(key, value, expires) {
    this.cacheBucket[key] = value;
    expires || (expires = this.expires);
    return setTimeout(((function(_this) {
      return function() {
        return delete _this.cacheBucket[key];
      };
    })(this)), expires);
  };

  Cache.prototype.inFlight = function(key) {
    return this.locked[key] != null;
  };

  Cache.prototype.getLater = function(key, cb) {
    return this.once(key, function(value) {
      return cb(value);
    });
  };

  Cache.prototype.lock = function(key) {
    return this.locked[key] = true;
  };

  Cache.prototype.unlock = function(key, defaultValue) {
    var value;
    value = this.get(key) || defaultValue;
    delete this.locked[key];
    return this.emit(key, value);
  };

  Cache.prototype.clear = function() {
    this.cacheBucket = {};
    return this.locked = {};
  };

  Cache.prototype.keys = function() {
    return Object.keys(this.cacheBucket);
  };

  Cache.prototype.log = function(message) {
    if (this.options.logging !== false) {
      return console.log("[CACHE] " + message);
    }
  };

  Cache.prototype.debugLog = function() {
    var e, i, key, keys, len, size;
    try {
      keys = Object.keys(this.cacheBucket);
      size = 0;
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        size += this.cacheBucket[key].length || 0;
      }
      if (size > 0) {
        return this.log("Info: has " + keys.length + " keys of size " + size + "b");
      }
    } catch (_error) {
      e = _error;
      return this.log("Problem listing cache info");
    }
  };

  Cache.prototype.middleware = function() {
    return cacheMiddleware(this);
  };

  return Cache;

})(EventEmitter);

module.exports = Cache;
