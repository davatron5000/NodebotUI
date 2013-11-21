/**
   * The following is, ahem, borrowed code
   */
  
  // extend function from underscore.js http://underscorejs.org/#extend
  function _extend(obj) {
    _each(Array.prototype.slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };
  
  // each function from underscore.js http://underscorejs.org/#each
  function _each(obj, iterator, context) {
    if (obj == null) return;
    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === {}) return;
      }
    } else {
      var keys = _keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === {}) return;
      }
    }
  };
  
  // keys function from underscore.js http://underscorejs.org/#keys
  function _keys(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys.push(key);
    return keys;
  };