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
        
        if (el.hasAttribute('data-thresholds')) {
          var thresholds = el.getAttribute('data-thresholds').split(',');
          this.inputMin = Number(thresholds[0]);
          this.inputMax = Number(thresholds[1]);
          this.min = Number(thresholds[2]);
          this.max = Number(thresholds[3]);
        }
        
        if (el.hasAttribute('data-input-thresholds')) {
          var thresholds = el.getAttribute('data-input-thresholds').split(',');
          this.inputMin = Number(thresholds[0]);
          this.inputMax = Number(thresholds[1]);
        }
        
        if (el.hasAttribute('data-output-thresholds')) {
          var thresholds = el.getAttribute('data-output-thresholds').split(',');
          this.min = Number(thresholds[0]);
          this.max = Number(thresholds[1]);
        }
        
      }
    }
  }
  