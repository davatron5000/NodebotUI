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
    
    // Extend this object with the browser control properties and methods
    this.dataDeviceType = el.getAttribute('data-device-type');
    _extend(this, browserControls[this.dataDeviceType]);
    
    // Initialize object
    this._initialize(el, this);
    
    // Bind event listeners
    this._listen(el, this);
  
  }
