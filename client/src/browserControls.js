/**
   * These are browser controls.
   * Browser controls are inputs or groups of inputs working in concert
   *
   * _listen - A function that binds necessary event listeners to the <input> elements
   */
  var browserControls = {
    
    /**
     * fieldset data-device-type="orientation"
     *
     * A group of two or three ranges
     **/
    Orientation: {
       
      /**
       * By default ignore input values below -90 and above 90. I think most use cases
       * will expect that the device is right side up.
       **/
      inputMin: -90,
      inputMax: 90,
      
      /**
       * On deviceorientation check to see if there are inputs for each of the three axes
       * If so, move that range input
       **/
      _listen: function(el, browserControl) {
        window.addEventListener('deviceorientation', function(event) {
          // This is stupid. We should not have to find the inputs every time we update.
          _each(['alpha', 'beta', 'gamma'], function (prefix) {
            if (browserControl[prefix+'Input']) {
              boards[browserControl._board][browserControl[prefix+'Input']].move(event[prefix]);
            }
          }, this);          
        });
      },
      
      _update: function(alpha, beta, gamma) {
        //todo
      },
      
      /**
       * Bind each of the inputs associated with the browser control with
       * the appropriate axis
       **/
       _initialize: function(el, browserControl) {
        var inputs = document.getElementById(this._element).getElementsByTagName('input');
        
        // Loop through all the inputs within this fieldset
        for (i = 0; i < inputs.length; i++) {
          
          if (inputs[i].hasAttribute('data-axis')) {
            _each(['alpha', 'beta', 'gamma'], function (prefix) {
              if (inputs[i].getAttribute('data-axis') === prefix) {
                this[prefix+'Input'] = inputs[i].id;
              }
            }, this);  
          }
          
        }
        
      }
    }
  }