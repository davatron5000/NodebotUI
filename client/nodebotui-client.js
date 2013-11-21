var nodebotui = (function () {

  var socket, boards;
  
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
    
    this._element = opts.element;
    
    this.getInputs();
    
  } 
  
  /**
   * Method to loop through all the inputs within a form, if they 
   * have a data-device-type defined then initialize them and 
   * associate them with the board
   */
  Board.prototype.getInputs = function() {  
    var inputs = document.getElementById(this._element).getElementsByTagName('input');
    for (i = 0; i < inputs.length; i++) {
      if (inputs[i].hasAttribute('data-device-type')) {
        this[inputs[i].id] = new Input({'element': inputs[i], 'board': this._element });
      }
    }  
  }
  
  /**
   * Method to initialize all the input devices and make sure
   * that their initial values are set on the server side
   */
  Board.prototype.initialize = function() {  
    _each(this, function(device, key) {
      if (key.substring(0,1) !== '_' && device._initialize) {
        device._initialize();
      }
    });
  }
  
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

  
  /**
   * These are all the device types defined in Johnny-Five. These
   * extend our Input objects (not elements)
   *
   * min - Minimum value for the device type
   * max - Maximum value for the device type
   * initial - Initial value for the device type
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
      initial: 90,
      _methods: ['move'] //, 'center', 'sweep'
    }
  }
  
  /**
   * All the methods that are defined in Johnny-Five. These extend
   * our Input objects (not elements)
   */
   var deviceMethods = {
    on: function() {
      socket.emit('call', { "board": this._board, "device": this._element, "method": "on" });
      this._update(true);
    },
    off: function() {
      socket.emit('call', { "board": this._board, "device": this._element, "method": "off" });
      this._update(false);
    },
    move: function(value) {
      socket.emit('call', { "board": this._board, "device": this._element, "method": "move", params: value || Number(document.getElementById(this._element).value) });
      this._update( value || Number(document.getElementById(this._element).value) );
    }
  }
  
  /**
   * These are all the HTML input types we recognize.
   * Inputs can be standalone or grouped to form a browser control.
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
          el.checked ? input.on() : input.off(); 
        });
      },
      _update: function(status) {
        document.getElementById(this._element).checked = status;
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
          input.move()
        });
      },
      _update: function(status) {
        document.getElementById(this._element).value = status;
      },
      _initialize: function() {
        var el = document.getElementById(this._element);
        
        this.max = el.getAttribute('max') || this.max;
        el.setAttribute('max', this.max);
        
        this.min = el.getAttribute('min') || this.min;
        el.setAttribute('min', this.min);
      }
    }
  }
  
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
  };
  
  // each function from underscore.js http://underscorejs.org/#each
  function _each(obj, iterator, context) {
    if (obj == null) return;
    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === {}) return;
      }
    } else {
      var keys = _keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === {}) return;
      }
    }
  };
  
  // keys function from underscore.js http://underscorejs.org/#keys
  function _keys(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys.push(key);
    return keys;
  };
   
  /**
   * Loop through the forms in the web page. For each one that has a 
   * data-device-type attribute set to "board" we are defining a
   * a new board to pass to Johnny-Five
   */
  function _getBoards() {
    
    var boards = {}, forms = document.getElementsByTagName ('form'), i;
    
    for (i = 0; i < forms.length; i++) {
      if (forms[i].getAttribute('data-device-type') === 'board') {
        boards[forms[i].id] = new Board({ 'element': forms[i].id});
        
      }
    }
    
    return boards;
  }
  
  /**
   * This bit loads the socket.io client script asynchronously
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

      socket = io.connect(nbuiScriptSrc.replace('/nodebotui/nodebotui-client.js', ''));
            
      // tell the server to initialize our new boards
      _each(boards, function( board, key) {
        socket.emit('new board', board );
      });
      
      // This is where we listen for events from the server
      socket.on('board ready', function( opts ) {
        boards[opts.id]._ready = true;
        boards[opts.id].initialize();
        console.log('board ready');
      });
      
  };

  // Insert script element for socket.io
  script.src = nbuiScriptSrc.replace('nodebotui/nodebotui-client.js', 'socket.io/socket.io.js');
  document.getElementsByTagName('head')[0].appendChild(script);
  
  //Initialize boards
  boards =  _getBoards();

  // assign our boards object to nodebotui global
  return boards;
   
})();