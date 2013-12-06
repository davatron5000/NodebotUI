/**
   * Browser Control
   * @constructor
   *
   * @param {Object} opts
   */
  var BrowserControl = function( opts, board ) {
    
    if ( !(this instanceof BrowserControl) ) {
      return new BrowserControl( opts );
    }
    
    // Cache the element and set common attributes
    var el = document.getElementById(opts.id.nodeValue);
    
    this._board = board;
    this._ready = false;
    
    // Extend this object with the browser control, device and input type properties and methods
    this._extendAttributes(opts); 
    _extend(this, browserControls[this["device-type"]], deviceTypes[this["device-type"]], inputTypes[this.type]); 
    
    // This is goofy. I run this once to get type and device-type and then run it again to reset any attributes which may have
    // been overridden by browserControls[this["device-type"]], deviceTypes[this["device-type"]] or inputTypes[this.type]
    this._extendAttributes(opts);
    
    // We have to delete the type object because it will conflict in johnny-five
    delete this.type;
    
    // Add required methods to the object
    if (this._methods) {
      _each(this._methods, function(method, index) {
        this[method] = deviceMethods[method];
      }, this);
    }
    
    delete this._methods;
    
    // Initialize object
    if (this._initialize)
      this._initialize(el, this);
    
    // Bind event listeners
     if (this._listen)
      this._listen(el, this);
  
  };
  
  BrowserControl.prototype._extendAttributes = function(attrs) {
    
    var i, l, name, val, result = {};
    
    for (i=0, l=attrs.length; i<l; i++){
      val = attrs.item(i).nodeValue;
      name = attrs.item(i).nodeName.replace('data-', '');
      
      if(isNumber(val)) {
        result[name] = Number(val);
      } else {
        result[name] = val;
      }
    }
    _extend(this, result);
  };
  
  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
