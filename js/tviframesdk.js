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

  // params: thing_id, [extension]
  // returns: thing_id and file_id
  self.fileSelect = function(params, callback) {
    self.sendMessage(
      {
    	  cmd: 'file_select',
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
