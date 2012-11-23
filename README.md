Thingiverse Iframe Javascript SDK
=================================

This SDK allows your iframe app to talk to Thingiverse using javascript.  It provides a way to display a number of pre-built [Dialogs](#dialogs) as well as communicate with the [API](#api).

Setup
-----

### Requirements

In addition to the tviframesdk, it also requires [json2](https://github.com/douglascrockford/JSON-js), [jquery](http://jquery.com/), and the [jquery postmessage plugin](https://github.com/cowboy/jquery-postmessage). (TODO: wrap this all into one minified file?)

    <script src="js/json2.js"></script>
    <script src="js/jquery-1.8.2.min.js"></script>
    <script src="js/jquery.ba-postmessage.min.js"></script>
    <script src="js/tviframesdk.js"></script>

### Init

This will load the SDK and sets all the default options.  Only `access_token` is required.  Replace this with the oauth token retrieved from `http://thingiverse.com/login/oauth/access_token`. (this should be done server side in order to keep your app's `client_secret` hidden)

    <script>
    	TV.init({
    		access_token: '[insert user oauth code here]',
    		api_url: 'https://api.thingiverse.com',
    		target_url: 'http://thingiverse.com',
    		target: parent
    	});
    </script>

### Testing Iframe Communication

To ensure that everything is configured correctly and your app is able to talk to Thingiverse using cross-domain postMessage, you can try sending an echo request message.  Thingiverse will send a message back to your app containing whatever you send to it.  This can be done with the following javascript.

    TV.sendMessage({cmd: 'echo', params: {foo: 'bar'}}, function(data) {
      alert('gotEcho: ' + JSON.stringify(data));
    });

Dialogs
-------

Dialogs are an easy way for your app to do common interactions with Thingiverse such as searching for a Thing and selecting a File by popping up a modal window saving you the time to design your own UI.  This is done using the `TV.dialog()` function.

This example shows a search box.  If the user cancels the dialog and doesn't select anything, `data.status` will be `cancelled`.

    TV.dialog('thing_search', function(data) {
      if (data.status != 'cancelled') {
        alert('You selected Thing #' + data.thing_id);
      }
    });

Parameters can also be passed to some dialogs.  For instance, this shows a search box with search results for the string `makerbot` pre-loaded.

    TV.dialog('thing_search', {q: 'makerbot'}, function(data) {
      if (data.status != 'cancelled') {
        alert('You selected Thing #' + data.thing_id);
      }
    });

### Dialog Methods

#### file_select

* Parameters: `thing_id`, `extension` (optional, comma delimited list of file extensions to filter by)
* Returns: `thing_id` and `file_id`

#### thing_select

* Parameters: none
* Returns: `thing_id`

#### thing_search

* Parameters: `q`
* Returns: `thing_id`

#### thing_save

* Parameters: `id` (optional, for editing an existing thing), `name`, `description`, `category`, `tags`, `license`, `is_published`, `is_wip`
* Returns: hash of values that can then be sent in an `API` request to create/update thing

API
---

Provides a way to access the Thingiverse API endpoints (currently read-only GET requests).  See API docs for full API documentation.  Pass it the enpoint (either relative or full url) and a callback. Here is the basic syntax.

    TV.api('/newest', function(data) {
      newest_thing = data[0];
      alert('gotNewest: ' + JSON.stringify(newest));
    });

Utility
-------

The `TV.log()` function is a wrapper for `console.log()`.
