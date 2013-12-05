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
  