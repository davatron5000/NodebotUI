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
  