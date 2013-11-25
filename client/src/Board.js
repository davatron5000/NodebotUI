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
    
    var fieldsets = document.getElementById(this._element).getElementsByTagName('fieldset');
    for (i = 0; i < fieldsets.length; i++) {
      if (fieldsets[i].hasAttribute('data-device-type')) {
        this['_'+fieldsets[i].id] = new BrowserControl({'element': fieldsets[i], 'board': this._element });
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
  