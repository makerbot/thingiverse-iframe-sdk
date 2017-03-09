Thingiverse Iframe Javascript SDK
=================================

This SDK allows your iframe app to talk to Thingiverse using javascript. It provides a way to display a number of pre-built [Dialogs](#dialogs) as well as communicate with the [API](#api).

Setup
-----

### Requirements

In addition to the tviframesdk, it also requires [json2](https://github.com/douglascrockford/JSON-js), [jquery](http://jquery.com/), and the [jquery postmessage plugin](https://github.com/cowboy/jquery-postmessage). (TODO: wrap this all into one minified file?)

    <script src="js/json2.js"></script>
    <script src="js/jquery-1.8.2.min.js"></script>
    <script src="js/jquery.ba-postmessage.min.js"></script>
    <script src="js/tviframesdk.js"></script>

### Init

This will load the SDK and sets all the default options. Only `access_token` is required. Replace this with the oauth token retrieved from `http://thingiverse.com/login/oauth/access_token`. (This should be done server side in order to keep your app's `client_secret` hidden)

    <script>
        TV.init({
            access_token: '[insert user oauth code here]',
            api_url: 'https://api.thingiverse.com',
            target_url: 'http://thingiverse.com',
            target: parent
        });
    </script>

Be sure to check out the [Thingiverse Getting Started documentation](http://www.thingiverse.com/developers/getting-started) to learn more about authentication steps and working with the Thingiverse API.

### Testing Iframe Communication

To ensure that everything is configured correctly and your app is able to talk to Thingiverse using cross-domain postMessage, you can try sending an echo request message. Thingiverse will send a message back to your app containing whatever you send to it. This can be done with the following javascript.

    TV.sendMessage({cmd: 'echo', params: {foo: 'bar'}}, function(data) {
      alert('gotEcho: ' + JSON.stringify(data));
    });

Dialogs
-------

Dialogs are an easy way for your app to interact with Thingiverse by popping up a modal window saving you the time to design your own UI. This is done using the `TV.dialog()` function.

This example shows an address window. If the user cancels the dialog or closes the window, `data.status` will be `cancelled`.

    TV.dialog('address', function(data) {
      if (data.status != 'cancelled') {
          if (data.ok && data.id) {
              alert('Address ID #' + data.id);
          } else if (data.error) {
              alert('Error: ' + data.error);
          }
      }
    });

Parameters can also be passed to some dialogs. For instance, this shows a payment dialog which needs information to create an order.
    
    var params = {
        thing_id: THING_ID,
        amount: TOTAL_ORDER_AMOUNT,
        charges: {
            'SOME CHARGE NAME': #.##,
            'ANOTHER CHARGE NAME': #.##,
            'Shipping': #.##
        },
        address_id: ADDRESS_ID,
        app_transaction_code: APP_TRANSACTION_CODE
     };
    
    TV.dialog('payment', params, function(data) {
      if (data.status != 'cancelled') {
          if (data.ok && data.order_id) {
              alert('Order ID: ' + data.order_id);
          } else if (data.error) {
              alert('Errors: ' + data.error);
          }
      }
    });

### Dialog Methods

#### address

* Parameters: none
* Returns: {'id': `address_id`, 'shipping_address': {address fields...}}

#### payment

* Parameters: `thing_id`, `amount` (total in USD), `charges` (see below), `address_id` (optional address_id to use for shipping), `app_transaction_code` (optional id to use for referencing order on your side)
* Returns: `ok` or `error`, `order_id`, `shipping_address`
* `charges`: An object breaking down the line items of the order. Use the reserved `Shipping` to indicate shipping charges. Attribute name will be used for display in order breakdown. Amounts are in USD. Example:

`charges = {
    'Filament Charge': 2.50,
    'Rush Fee': 1.25,
    'Shipping': 3.00
}`

API
---

Provides a way to access the Thingiverse API endpoints (currently read-only GET requests). See API docs for full API documentation. Pass it the endpoint (either relative or full url) and a callback. Here is the basic syntax.

    TV.api('/orders/ORDER_ID', function(data) {
      alert('Order: ' + JSON.stringify(data));
    });

Utility
-------

The `TV.log()` function is a wrapper for `console.log()`.
