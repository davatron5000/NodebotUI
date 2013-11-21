/**
   * All the methods that are defined in Johnny-Five. These extend
   * our Input objects (not elements)
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
      if (value === null) {
        value = Number(document.getElementById(this._element).value)
      }
      if (socket) {
        socket.emit('call', { "board": this._board, "device": this._element, "method": "move", params: value });
      }
      this._update( value );
    }
  }
  