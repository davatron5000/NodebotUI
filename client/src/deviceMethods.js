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
  