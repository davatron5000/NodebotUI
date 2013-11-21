/**
   * These are all the HTML input types we recognize.
   * Inputs can be standalone or grouped to form a browser control.
   *
   * _listen - A function that binds necessary event listeners to the <input> elements
   */
  var inputTypes = {
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