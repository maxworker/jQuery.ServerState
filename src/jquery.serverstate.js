/**
 * Copyright (C) 2018-2019 Max Butenko
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * @website https://github.com/maxworker/jquery-serverstate/
 * @version 1.0.0-rc1
 *
 * Dual licensed under the MIT and GPLv2 licenses.
 */
(function( factory ) {
  if ( typeof module === "object" && module.exports ) {
    // Node/CommonJS
    module.exports = factory( require( "jquery" ) );
  } else {
    // Browser globals
    factory( window.jQuery );
  }
}(function( $ ) {


  /**
   * Default plugin options.
   *
   * @type {object}
   */
  var defaultParams = {
    currentts: $.now()
  };


  function deserializeForm(obj, data, options) {
    obj.deserialize(data, options);
  }

  function deserializeFormCallback(obj, data, options, callback) {
    deserializeForm(obj, data, options);
    callback(data);
  }

  function formValidation(obj) {
      var formValid = true;
      var validField = function (field) {
          if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return true;
          return field.validity.valid;
      };

      obj.find('input,select,textarea').each(function(index, field){
          if (!validField(field)) {
              formValid = false;
              return false;
          }
      });
      return formValid;
  }

  /**
   * The $.stateInit function.
   *
   * @param endpoint The server endpoint.
   * @param options Additional options - formData - json object with form data.
   * @returns {jQuery} The jQuery object that was provided to the plugin.
   */
  $.fn.stateInit = function( endpoint, options ) {
    if ( !$.isFunction( $.fn.ajaxForm )) {
      return false;
    }
    var obj = this;
    if (endpoint) {
        this.data('serverEndpoint', endpoint);
        options = $.extend( {
                      url: endpoint,
                      dataType: 'json',
                      type: 'POST',
                      success: function (data) { deserializeForm(obj, data, options); }
                  }, options || {} );
    } else {
        options = $.extend( {
                      dataType: 'json',
                      type: 'POST',
                      success: function (data) { deserializeForm(obj, data, options); }
                  }, options || {} );
    }
    if (options.formData) {
        deserializeForm(obj, options.formData, options);
    }
    this.ajaxForm(options);
    return this;
  };

  $.fn.stateSave = function(params, options) {
    if ( !$.isFunction( $.fn.ajaxSubmit )) {
      return false;
    }

    defaultParams.currentts = $.now();
    params = $.extend( defaultParams, params || {} );

    var url;
    if (options && options.url) {
      url = options.url;
    } else {
      url = this.data('serverEndpoint');
    }

    if (url) {
        options = $.extend( {type:'POST', url: url, dataType: 'json'}, options || {});
    } else {
        options = $.extend( {type:'POST', dataType: 'json'}, options || {});
    }

    if (!options.disableFormValidation) {
        if (!formValidation(this)) {
            if (options.validationCallback) {
                options.validationCallback();
            }
            return false;
        }
    }

    options = $.extend( {data:  params}, options);

    this.ajaxSubmit(options);
    return this;
  };

  $.fn.stateJsonSave = function(params, options) {
    if ( !$.isFunction( $.fn.serializeObject )) {
      return false;
    }

    if (!axios) {
      return false;
    }

    defaultParams.currentts = $.now();
    params = $.extend( defaultParams, params || {} );

    var url;
    if (options && options.url) {
      url = options.url;
    } else {
      url = this.data('serverEndpoint');
    }

    if (!options.disableFormValidation) {
        if (!formValidation(this)) {
            if (options.validationCallback) {
                options.validationCallback();
            }
            return false;
        }
    }

    params = $.extend(this.serializeObject(), params);

    axios.post(url, params).then( function (response) {
        if (options.success) {
          options.success(response.data);
        }
    });

    return this;
  };

  $.fn.stateLoad = function(params, options ) {
    if ( !$.isFunction( $.fn.deserialize )) {
      return false;
    }

    defaultParams.currentts = $.now();
    params = $.extend( defaultParams, params || {} );

    var url;
    if (options.url) {
      url = options.url;
    } else {
      url = this.data('serverEndpoint');
      if (!url) {
          url = this.attr('action');
      }
    }
    var obj = this;
    $.getJSON(url, params, function (data) { deserializeForm(obj, data, options);} );

    return this;
  };

  $.fn.stateSubmit = function(params, options) {
    var obj = this;
    if (options && options.success) {
        var optSuccess = options.success;
        options = $.extend(options || {}, {success: function (data) { deserializeFormCallback(obj, data, options, optSuccess);}} );
    } else {
        options = $.extend({success: function (data) { deserializeForm(obj, data, options);} }, options || {} );
    }

    this.stateSave(params, options);
    return this;
  };

  $.fn.stateJsonSubmit = function(params, options) {
    var obj = this;
    if (options && options.success) {
        var optSuccess = options.success;
        options = $.extend(options || {}, {success: function (data) { deserializeFormCallback(obj, data, options, optSuccess);} });
    } else {
        options = $.extend({success: function (data) { deserializeForm(obj, data, options);} }, options || {} );
    }

    this.stateJsonSave(params, options);
    return this;
  };


}));
