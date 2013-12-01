/**
   * Browser Control
   * @constructor
   *
   * @param {Object} opts
   */
  var BrowserControl = function( opts ) {
    
    if ( !(this instanceof BrowserControl) ) {
      return new BrowserControl( opts );
    }
    
    // Cache the element and set common attributes
    var el = document.getElementById(opts.element.id);
    this._board = opts.board;
    this._element = el.id;
    this.pin = el.getAttribute('data-pin');
    
    // Extend this object with the browser control properties and methods
    this.dataDeviceType = el.getAttribute('data-device-type');
    _extend(this, browserControls[this.dataDeviceType]);
    
    // Extend this object with the device properties and methods
    this.dataDeviceType = el.getAttribute('data-device-type');
    _extend(this, deviceTypes[this.dataDeviceType]);
 
    // Extend this object with inputType properties and methods
    this.inputType = el.getAttribute('type');
    _extend(this, inputTypes[this.inputType]);

    // Add required methods to the object
    _each(this._methods, function(method, index) {
      this[method] = deviceMethods[method];
    }, this);
    
    delete this._methods;

    // Initialize object
    this._initialize(el, this);
    
    // Bind event listeners
    this._listen(el, this);
  
  }