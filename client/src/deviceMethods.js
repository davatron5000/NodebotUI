/**
   * All the methods that are defined in Johnny-Five. These extend
   * our BrowserControl objects (not their associated elements)
   */
   var deviceMethods = {
    
    on: function() {
      if (socket) {
        socket.emit('call', { "board": this._board, "device": this._element, "method": "on" });
      }
      this._update(true);
    },
    
    off: function() {
      if (socket) {
        socket.emit('call', { "board": this._board, "device": this._element, "method": "off" });
      }
      this._update(false);
    },
    
    move: function(value) {
      
      // If no value was passed, then read the value from the HTML
      if (value === null) {
        value = Number(document.getElementById(this._element).value)
      }
      
      // Find the base value (0-1)
      var inValue = (value - this.inputMin)/(this.inputMax - this.inputMin);
      
      // value is within range
      if (inValue < 0) inValue = 0;
      if (inValue > 1) inValue = 1;
      
      if (this.inverse) inValue = 1 - inValue;
      
      var outValue = inValue * (this.max - this.min) + this.min;
      
      // If we have an easing function use it
      if (this.easing) {
        outValue = easing[this.easing](outValue);
      }
      
      
     if (socket && boards[this._board]._ready && this.tolerance < Math.abs(outValue - this._lastUpdate)) { 
        this._lastUpdate = outValue;
        socket.emit('call', { "board": this._board, "device": this._element, "method": "move", params: outValue });
      }
      this._update( outValue );
    }
    
  }
  