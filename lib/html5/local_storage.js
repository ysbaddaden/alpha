/**
 * Emulates localStore.
 * 
 * It's mostly a refactoring of YUI Storage Lite by Ryan Grove.
 * http://github.com/rgrove/storage-lite
 * 
 * License?
 * 
 * Also relies on YUI SWFStore (in some rare cases). You may set
 * +ALPHA_SWFSTORE_PATH+ to define a particular path to find the SWF file.
 * By default it uses +./swfstore.swf+.
 * 
 * Note: Contrary to the HTML5 Web Storage specs, Storage events are not
 * sent. It should be possible to send inter HTMLDocument events, using
 * the storage itself to tell it, and with each HTMLDocument reading from
 * the storage every few milliseconds, checking for changes.
 * 
 * TODO: Test it all!
 */ 

if (typeof window.localStorage == 'undefined')
{
  // firefox 2, 3.0
  if (window.globalStorage)
  {
    Alpha.Storage = function() {
      this.storage = window.globalStorage[window.location.hostname];
    }
    
    Alpha.Storage.prototype.setItem = function(key, value) {
      this.storage.setItem(key, value);
    }
    
    Alpha.Storage.prototype.getItem = function(key) {
      return this.storage.getItem(key);
    }
    
    Alpha.Storage.prototype.removeItem = function(key) {
      return this.storage.removeItem(key);
    }
    
    Alpha.Storage.prototype.key = function(n) {
      return this.storage.key(n);
    }
    
    Alpha.Storage.prototype.clear = function()
    {
      for (var key in this.storage) {
        delete this.storage[key];
      }
    }
  }
  
  // Safari 3.1, 3.2
  else if (window.openDatabase)
  {
    var DB_NAME        = 'alpha_storage';
    var DB_DISPLAYNAME = 'Alpha Storage data';
    var DB_MAXSIZE     = 1048576;
    var DB_VERSION     = '1.0';
    
    Alpha.Storage = function()
    {
      this._db = window.openDatabase(DB_NAME, DB_VERSION, DB_DISPLAYNAME, DB_MAXSIZE);
      
      this._exec = function(sql, args)
      {
        this._load();
        this._db.transaction(function(t) {
          t.executeSql(sql, args || []);
        });
      }
      
      this._load = function()
      {
        if (!this._loaded)
        {
          this._db.transaction(function(t) {
            t.executeSql("CREATE TABLE IF NOT EXISTS " + DB_NAME + "(key TEXT PRIMARY KEY, value TEXT NOT NULL)");
          });
          this._loaded = true;
        }
      }
    }
    
    Alpha.Storage.prototype.getItem = function(key)
    {
      var value = null;
      this._load();
      this._db.transaction(function(t)
      {
        t.executeSql("SELECT value FROM " + DB_NAME + " WHERE key = ?", [key], function(t, results)
        {
          if (results.rows.length) {
            value = results.rows.item(0);
          }
        });
      });
      return value;
    }
    
    Alpha.Storage.prototype.setItem = function(key, value) {
      this._exec("REPLACE INTO " + DB_NAME + " (key, value) VALUES (?, ?)", [key, value]);
    }
    
    Alpha.Storage.prototype.removeItem = function(key) {
      this._exec("DELETE FROM " + DB_NAME + " WHERE key = ?", [key]);
    }
    
    Alpha.Storage.prototype.clear = function(key) {
      this._exec("DELETE FROM " + DB_NAME);
    }
    
    Alpha.Storage.prototype.key = function(n) {
      trgger_error("localStorage.key isn't supported.");
    }
  }
  
  // IE 5, 6, 7
  else if (Alpha.browser.ie)
  {
    var USERDATA_PATH = 'alpha_storage';
    var USERDATA_NAME = 'data';
    
    Alpha.Storage = function()
    {
      this._driver = document.createElement('span');
      this._driver.addBehavior('#default#userdata');
      this._driver.style.display = 'none';
      document.body.appendChild(this._driver);
      
      this._data = JSON.parse(this._driver.getAttribute(USERDATA_NAME));
      this.length = this._data.length;
      
      this._save = function()
      {
        this._driver.setAttribute(USERDATA_NAME, JSON.stringify(this._data));
        this._driver.save(USERDATA_PATH);
      }
    }
    
    Alpha.Storage.prototype.length = 0;
    
    Alpha.Storage.prototype.clear = function()
    {
      this._data = {};
      this._save();
      this.length = 0;
    }
    
    Alpha.Storage.prototype.getItem = function(key) {
      return (key in this._data) ? this._data[key] : null;
    }
    
    Alpha.Storage.prototype.setItem = function(key, value)
    {
      if (!(key in this._data)) this.length++;
      this._data[key] = value;
      this._save();
    }
    
    Alpha.Storage.prototype.removeItem = function(key, value)
    {
      if (key in this._data)
      {
        delete this._data[key];
        this._save();
        this.length--;
      }
    }
    
    Alpha.Storage.prototype.key = function(n)
    {
      var i = 0;
      for (var key in this._data)
      {
        if (i++ == n) {
          return key;
        }
      }
      return null;
    }
  }
  
  // Older browser (relies on YUI SWFStore)
  else
  {
    Alpha.Storage = function()
    {
      this.swf = document.createElement('embed');
      this.swf.setAttribute('allowScriptAccess', 'always');
      this.swf.setAttribute('allowNetworking',   'all');
      this.swf.setAttribute('scale',  'noScale');
      this.swf.setAttribute('src',    ALPHA_SWFSTORE_PATH || './swfstore.swf');
      this.swf.setAttribute('width',  '0');
      this.swf.setAttribute('height', '0');
      this.swf.setAttribute('FlashVars', 'shareData=0&browser=1234567890&useCompression=1');
      document.body.appendChild(this.swf);
      
      this.length = this.swf.callSWF("getLength", []);
    }
    
    Alpha.Storage.prototype.setItem = function(key, value)
    {
      this.swf.callSWF("setItem", [key, value]);
      this.length = this.swf.callSWF("getLength", []);
    }
    
    Alpha.Storage.prototype.getItem = function(key) {
      this.swf.callSWF("getValueOf", [key]);
    }
    
    Alpha.Storage.prototype.removeItem = function(key)
    {
      this.swf.callSWF("removeItem", [key]);
      this.length = this.swf.callSWF("getLength", []);
    }
    
    Alpha.Storage.prototype.clear = function()
    {
      this.swf.callSWF("clear", []);
      this.length = 0;
    }
    
    Alpha.Storage.prototype.key = function(index) {
      this.swf.callSWF("getNameAt", [index]);
    }
  }
  
  window.localStorage = new Alpha.Storage();
}

