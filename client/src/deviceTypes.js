/**
   * These are all the device types defined in Johnny-Five. These
   * extend our Input objects (not elements)
   *
   * min - Minimum value for the device type
   * max - Maximum value for the device type
   * initial - Initial value for the device type
   * _methods - A list of deviceMethods names that apply to the device type
   */ 
  var deviceTypes = {
    Led: { 
      min: 0, 
      max: 255,
      _methods: ['on', 'off'] //, 'toggle', 'brightness', 'pulse', 'fade', 'fadeIn', 'fadeOut', 'strobe', 'stop']
    },
    Servo: {
      min: 0,
      max: 180,
      initial: 90,
      _methods: ['move'] //, 'center', 'sweep'
    }
  }