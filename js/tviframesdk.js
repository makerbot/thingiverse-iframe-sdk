var TV = (function() {
  var self = {};

  self.opts = {};

  self.callbacks = {};

  self.init = function(opts) {
    defaults = {
      api_url: 'https://api.thingiverse.com',
      target_url: 'http://thingiverse.com',
      target: parent
    };
    
    $.extend(defaults, opts);
    self.opts = defaults;
    
    $.receiveMessage(
      function(msg) {
        self.receiveMessage(msg.data);
      },
      self.opts.target_url
    );
  }

  // communication

  self.receiveMessage = function(data) {
    msg = JSON.parse(data);
    
    if ($.inArray(msg.callback, Object.keys(self.callbacks)) > -1) {      
      self.callbacks[msg.callback](msg.result);
      delete self.callbacks[msg.callback];
    } else {
      self.log('Received Unknown Callback: "' + msg.callback + '" Data: ' + data);
    }
  }
  
  self.sendMessage = function(data, callback) {
    data.params.access_code = self.opts.access_code;    
    data.params.callback = TV.guid();
    self.callbacks[data.params.callback] = callback;
    
    msg = JSON.stringify(data);
    
    $.postMessage(
      msg,
      self.opts.target_url,
      self.opts.target
    );
  }

  // dialogs

  /*
  Dialog Names:
    file_select
      params: thing_id, [extension (optional comma delimited list)]
      returns: thing_id and file_id
    thing_select
      params: TODO:
      returns: thing_id
    thing_save
      params: [id] (optional, for editing an existing thing), name, description, category, tags, license, is_published, is_wip
      returns: hash of entered values to be sent to api
    thing_search
      params: TODO: q
      returns: thing_id
  */
  
  self.dialog = function(dialog_name, params, callback) {
    if (typeof params === 'function') {
      _callback = params;
      _params = callback || {};
    } else {
      _callback = callback;
      _params = params || {};
    }
    
    self.sendMessage(
      {
        cmd: dialog_name,
        params: _params
      },
      _callback
    );
  }

  // api
  
  self.api = function(path, params, callback) {
    if (typeof params === 'function') {
      _callback = params;
      _params = callback || {};
    } else {
      _callback = callback;
      _params = params || {};
    }
    
    if (params.method) {
      method = _params.method;
    } else {
      method = 'GET';
    }
    
    if (/^http.*/.test(path)) {
      url = path;
    } else {
      url = self.opts.api_url + path;
    }
    
    $.ajax({
      url: url,
      type: method,
      data: _params,
      dataType: 'json',
      headers: { 'Authorization' : 'Bearer ' + self.opts.access_token },
      success: _callback
    });
  }

  // utility

  self.log = function (msg) {
    if (window.console) {
      console.log('[APP] ' + msg);
    }
  }  

  self.guid = function() {
    return 'f' + (Math.random() * (1<<30)).toString(16).replace('.', '');
  }

  return self;
}());
