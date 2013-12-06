/**
 * HEY, DON'T EDIT THIS FILE!
 * It is assembled by a grunt script. You should be edit the files in the src
 * folder and then run grunt in the nodebotui root
 **/
 

var nodebotui = (function () {

  var socket, boards, easing = {};
  
  /**
   * Board
   * @constructor
   *
   * @param {Object} opts
   */
  var Board = function( opts ) {
    
    if ( !(this instanceof Board) ) { 
      return new Board( opts );
    }
    
    this._extendAttributes(opts);    
    this.getControls(opts.id.nodeValue);
    
  };
  
  /**
   * Method to loop through all the inputs and fieldsets within 
   * a form, if they have a data-device-type defined then initialize
   * them and associate them with the board
   */
  Board.prototype.getControls = function(board) {  
    
    var inputs = document.getElementById(this.id).getElementsByTagName('input');
    for (i = 0; i < inputs.length; i++) {
      if (inputs[i].hasAttribute('data-device-type')) {
        this[inputs[i].id] = new BrowserControl(inputs[i].attributes, board);
      }
    }
    
    var fieldsets = document.getElementById(this.id).getElementsByTagName('fieldset');
    for (i = 0; i < fieldsets.length; i++) {
      if (fieldsets[i].hasAttribute('data-device-type')) {
        this['_'+fieldsets[i].id] = new BrowserControl(fieldsets[i].attributes, board);
      }
    }
      
  };
  
  /**
   * Method to initialize all the control devices and make sure
   * that their initial values are set on the server side
   */
  Board.prototype.initialize = function() {  
    _each(this, function(device, key) {
      if (key.substring(0,1) !== '_' && device._initialize) {
        device._initialize();
      }
    });
  };
  
  Board.prototype._extendAttributes = function(attrs) {
    
    var i, l, result = {};
    
    for (i=0, l=attrs.length; i<l; i++){
      result[(attrs.item(i).nodeName.replace('data-', ''))] = attrs.item(i).nodeValue;
    }
    _extend(this, result);
  };
    
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
  
  /**
   * These are all the device types defined in Johnny-Five. These
   * extend our Input objects (not elements)
   *
   * min - Minimum value for the device type
   * max - Maximum value for the device type
   * _methods - A list of deviceMethods names that apply to the device type
   */ 
  var deviceTypes = {
    Led: { 
      min: 0, 
      max: 255,
      _methods: ['on', 'off'] //, 'toggle', 'brightness', 'pulse', 'fade', 'fadeIn', 'fadeOut', 'strobe', 'stop']
    },
    Servo: {
      min: 0,
      max: 180,
      "tolerance": 0,
      _lastUpdate: -999,
      _methods: ['move'] //, 'center', 'sweep'
    }
  };
    
  /**
   * All the methods that are defined in Johnny-Five. These extend
   * our BrowserControl objects (not their associated elements)
   */
   var deviceMethods = {
    
    on: function() {
      if (socket) {
        socket.emit('call', { "board": this._board, "device": this.id, "method": "on" });
      }
      this._update(true);
    },
    
    off: function() {
      if (socket) {
        socket.emit('call', { "board": this._board, "device": this.id, "method": "off" });
      }
      this._update(false);
    },
    
    move: function(value) {
      
      // If no value was passed, then read the value from the HTML
      if (value === null || typeof value === 'undefined') {
        value = Number(document.getElementById(this.id).value);
      }
      
      // Find the base value (0-1)
      var inValue = (value - this.inputMin)/(this.inputMax - this.inputMin);
      
      // value is within range
      if (inValue < 0) inValue = 0;
      if (inValue > 1) inValue = 1;
      
      if (this.inverse) inValue = 1 - inValue;
      
      var outValue = inValue * (this.max - this.min) + this.min;
      
      var displayValue = outValue;
      
      // If we have an easing function use it
      if (this.easing) {
        outValue = easing[this.easing](outValue);
      }
           
      // If the board is ready and we've moved more than out tolerance value, then send an update to the server
      if (socket && boards[this._board]._ready && Number(this.tolerance) <= Math.abs(outValue - this._lastUpdate)) { 
        this._lastUpdate = outValue;
        socket.emit('call', { "board": this._board, "device": this.id, "method": "move", params: outValue });        
      }
      
      // Update the browserControl
      this._update( displayValue );
    }
    
  };
    
  /**
   * These are browser controls.
   * Browser controls are inputs or groups of inputs working in concert
   *
   * _listen - A function that binds necessary event listeners to the <input> elements
   */
  var browserControls = {
    
    /**
     * fieldset data-device-type="orientation"
     *
     * A group of two or three ranges
     **/
    Orientation: {
       
      /**
       * On deviceorientation check to see if there are inputs for each of the three axes
       * If so, move that range input
       **/
      _listen: function(el, browserControl) {
        window.addEventListener('deviceorientation', function(event) {
          _each(['alpha', 'beta', 'gamma'], function (prefix) {
            if (this[prefix+'Input']) {
              boards[this._board][this[prefix+'Input']].move(event[prefix]);
            }
          }, browserControl);          
        });
      },
      
      _update: function(alpha, beta, gamma) {
        //todo
      },
      
      /**
       * Bind each of the inputs associated with the browser control with
       * the appropriate axis
       **/
      _initialize: function(el, browserControl) {
        var inputs = document.getElementById(this.id).getElementsByTagName('input');
        
        // Loop through all the inputs within this fieldset
        for (i = 0; i < inputs.length; i++) {
          
          if (inputs[i].hasAttribute('data-axis')) { 
            this[inputs[i].getAttribute('data-axis')+'Input'] = inputs[i].id;
          }
          
        }
        
      }
    }
  };  
  /**
   * These are all the HTML input types we recognize.
   * Inputs can be standalone or grouped under fieldsets to form a browser control.
   *
   * _listen - A function that binds necessary event listeners to the <input> elements
   */
  var inputTypes = {
    
    /**
     * input type="checkbox"
     *
     * Can be bound to an LED
     **/
    checkbox: {
      _listen: function(el, input) {
        el.addEventListener('change', function() { 
          if (el.checked) {
            input.on();
          } else {
            input.off(); 
          }
        });
      },
      _update: function(status) {
        document.getElementById(this.id).checked = status;
      }
    },
    
    /**
     * input type="range"
     *
     * Can be bound to a servo
     **/
     range: {
      _listen: function(el, input) {
        el.addEventListener('change', function() { 
          input.move();
        });
      },
      _update: function(status) {
        document.getElementById(this.id).value = status;
      },
      _initialize: function() {

        var el = document.getElementById(this.id);
        
        this.max = Number(el.getAttribute('max')) || this.max;
        el.setAttribute('max', this.max);
        
        this.min = Number(el.getAttribute('min')) || this.min;
        el.setAttribute('min', this.min);
        
        if (this.thresholds) {
          var thresholds = this.thresholds.split(',');
          this.inputMin = Number(thresholds[0]);
          this.inputMax = Number(thresholds[1]);
        } else {
          this.inputMin = this.min;
          this.inputMax = this.max;
        }
        
      }
    }
  };
    
  /**
   * These are browser controls.
   * Browser controls are inputs or groups of inputs working in concert
   *
   * _listen - A function that binds necessary event listeners to the <input> elements
   */
  var browserControls = {
    
    /**
     * fieldset data-device-type="orientation"
     *
     * A group of two or three ranges
     **/
    Orientation: {
       
      /**
       * On deviceorientation check to see if there are inputs for each of the three axes
       * If so, move that range input
       **/
      _listen: function(el, browserControl) {
        window.addEventListener('deviceorientation', function(event) {
          _each(['alpha', 'beta', 'gamma'], function (prefix) {
            if (this[prefix+'Input']) {
              boards[this._board][this[prefix+'Input']].move(event[prefix]);
            }
          }, browserControl);          
        });
      },
      
      _update: function(alpha, beta, gamma) {
        //todo
      },
      
      /**
       * Bind each of the inputs associated with the browser control with
       * the appropriate axis
       **/
      _initialize: function(el, browserControl) {
        var inputs = document.getElementById(this.id).getElementsByTagName('input');
        
        // Loop through all the inputs within this fieldset
        for (i = 0; i < inputs.length; i++) {
          
          if (inputs[i].hasAttribute('data-axis')) { 
            this[inputs[i].getAttribute('data-axis')+'Input'] = inputs[i].id;
          }
          
        }
        
      }
    }
  };  
  /**
   * The following is, ahem, borrowed code
   */
  
  // extend function from underscore.js http://underscorejs.org/#extend
  function _extend(obj) {
    _each(Array.prototype.slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  }
  
  // each function from underscore.js http://underscorejs.org/#each
  function _each(obj, iterator, context) {
    var i;
    if (obj === null) return;
    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === {}) return;
      }
    } else {
      var keys = _keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === {}) return;
      }
    }
  }
  
  // keys function from underscore.js http://underscorejs.org/#keys
  function _keys(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys.push(key);
    return keys;
  }  
  /**
 * Copied from jQuery UI 
 * https://github.com/jquery/jquery-ui
 **/
 
/******************************************************************************/
/*********************************** EASING ***********************************/
/******************************************************************************/

// based on easing equations from Robert Penner (http://www.robertpenner.com/easing)

var baseEasings = {};

_each( [ "Quad", "Cubic", "Quart", "Quint", "Expo" ], function( name, i ) {
  baseEasings[ name ] = function( p ) {
    return Math.pow( p, i + 2 );
  };
});

_extend( baseEasings, {
  Sine: function( p ) {
    return 1 - Math.cos( p * Math.PI / 2 );
  },
  Circ: function( p ) {
    return 1 - Math.sqrt( 1 - p * p );
  },
  Elastic: function( p ) {
    return p === 0 || p === 1 ? p :
    -Math.pow( 2, 8 * (p - 1) ) * Math.sin( ( (p - 1) * 80 - 7.5 ) * Math.PI / 15 );
  },
  Back: function( p ) {
    return p * p * ( 3 * p - 2 );
  },
  Bounce: function( p ) {
    var pow2, bounce = 4;
    while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
    return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
  }
});

_each( baseEasings, function( easeIn, name ) {
  easing[ "easeIn" + name ] = easeIn;
  easing[ "easeOut" + name ] = function( p ) {
    return 1 - easeIn( 1 - p );
  };
  easing[ "easeInOut" + name ] = function( p ) {
    return p < 0.5 ? easeIn( p * 2 ) / 2 : 1 - easeIn( p * -2 + 2 ) / 2;
  };
});
   
  /**
   * Loop through the forms in the web page. For each one that has a 
   * data-device-type attribute set to "board" we are defining a
   * a new board to pass to Johnny-Five
   */
  function _getBoards() {
    
    var boards = {}, forms = document.getElementsByTagName ('form'), i;
    
    for (i = 0; i < forms.length; i++) {
      if (forms[i].getAttribute('data-device-type') === 'board') {
        boards[forms[i].id] = new Board(forms[i].attributes);
      }
    }
    
    return boards;
  }
  
  /**
   * This next part loads the socket.io client script asynchronously
   * and then fires our _getBoards function
   **/
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;

  /**
   * Find the src for this script so we can request socket.io 
   * from the same server
   **/
  var scripts = document.getElementsByTagName('script'), len = scripts.length, re = /nodebotui-client\.js$/, src, nbuiScriptSrc;
  while (len--) {
    src = scripts[len].src;
    if (src && src.match(re)) {
      nbuiScriptSrc = src;
      break;
    }
  }
  
  script.onload = function(){
      
      socket = io.connect();
    
      socket.on('connect', function () {
        // tell the server to initialize our new boards
        console.log('connect');
        _each(boards, function( board, key) {
          socket.emit('new board', board );
        });
      });
      
      // This is where we listen for events from the server
      socket.on('board ready', function( opts ) {
        console.log('board ready');
        boards[opts.id]._ready = true;
        boards[opts.id].initialize();
      });
      
  };

  // Insert script element for socket.io
  script.src = 'socket.io/socket.io.js';
  document.getElementsByTagName('head')[0].appendChild(script);
  
  //Initialize boards
  boards =  _getBoards();

  // assign our boards object to nodebotui global
  return boards;
   
})();