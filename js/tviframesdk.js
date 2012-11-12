var TV = (function() {
	var self = {};

  self.opts = {};

  self.callbacks = {};

  self.init = function(opts) {
    self.opts = opts;
    
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
      self.callbacks[msg.callback](msg);
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
      params: thing_id, [extensions]
      returns: thing_id and file_id
    thing_select
      params: TODO:
      returns: thing_id
    thing_create
      params: TODO: default values for fields...
      returns: thing_id
    thing_search
      params: TODO: q
      returns: thing_id
  */
  
  self.dialog = function(dialog_name, params, callback) {
    self.sendMessage(
      {
    	  cmd: dialog_name,
    	  params: params
  	  },
  	  callback
  	);
  }

  // api
  
  self.api = function(path, params, callback, error) {
    $.ajax({
			url: self.opts.api_url + path,
			dataType: 'json',
			headers: { 'Authorization' : 'Bearer ' + self.opts.access_token },
			success: callback,
			error: error
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
