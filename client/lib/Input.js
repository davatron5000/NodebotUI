/**
   * Input
   * @constructor
   *
   * @param {Object} opts
   */
  var Input = function( opts ) {
    
    if ( !(this instanceof Input) ) {
      return new Input( opts );
    }
    
    // Cache the element and set common attriubutes
    var el = document.getElementById(opts.element.id);
    this._board = opts.board;
    this._element = el.id;
    this.pin = el.getAttribute('data-pin');
    
    // Extend this object with the devicetype properties and methods
    this.dataDeviceType = el.getAttribute('data-device-type');
    _extend(this, deviceTypes[this.dataDeviceType]);
    
    // Extend this object with inputType properties and methods
    this.inputType = el.getAttribute('type');
    _extend(this, inputTypes[this.inputType]);
    
    // Bind event listeners
    this._listen(el, this);
  
    // Add required methods to the object
    _each(this._methods, function(method, index) {
      this[method] = deviceMethods[method];
    }, this);
    
    delete this._methods;
    
  }
