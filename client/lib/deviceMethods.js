/**
   * All the methods that are defined in Johnny-Five. These extend
   * our Input onjects (not elements)
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
    move: function() {
      socket.emit('call', { "board": this._board, "device": this._element, "method": "move", params: Number(document.getElementById(this._element).value) });
      this._update(document.getElementById(this._element).value);
    }
  }