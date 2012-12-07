<?php
	// live site = http://thingiverse.com/login/oauth/access_token
	$auth_url = 'http://thingiverse.dev:8888/login/oauth/access_token';
	// set client id and secret to your own app!
	$client_id = 'd1039c7beaa77f69aa6d';
	$client_secret = 'a24ab8620ad63fbc99794242f7e08aa0';
	$code = $_GET['code'];
	
	$context = stream_context_create(array(
		'http' => array(
			'method' => 'POST',
			'header' => 'Content-Type: application/x-www-form-urlencoded',
			'content' => http_build_query(array(
				'client_id' => $client_id,
				'client_secret' => $client_secret,
				'code' => $code
			))
		)
	));
	
	// quick error checking...
	// file_get_contents raises a warning instead of throwing an exception :(
	set_error_handler("warning_handler", E_WARNING);
	$result = file_get_contents($auth_url, false, $context);
	restore_error_handler();
	
	parse_str($result, $result_array);
	$access_token = $result_array['access_token'];
	
	function warning_handler($errno, $errstr) {
		print "Error $errno: $errstr";
	}
?>
<!doctype html>
<html>
	<head>
		<title>Thingiverse Iframe Test App</title>
		<script src="js/json2.js"></script>
		<script src="js/jquery-1.8.2.min.js"></script>
		<script src="js/jquery.ba-postmessage.min.js"></script>
		<script src="js/tviframesdk.js"></script>
		<script src="js/app.js"></script>
	</head>
	<body>
		<div style="float:right;width:50%">
			<h3>Access Token</h3>
			<p><?= $access_token ?></p>
			
			<h3>User</h3>
			<p id="user"></p>

			<h3>Thing</h3>
			<p id="thing"></p>

			<h3>File</h3>
			<p id="file"></p>
		</div>

		<h1>Thingiverse Iframe Test App</h1>

		<input id="message_test" type="button" value="Test Post Message" onclick="TV.sendMessage({cmd: 'echo', params: {foo: 'bar'}}, gotEcho)"/>
		
		<h2>Dialogs</h2>

		<input type="button" value="Select File" onclick="TV.dialog('file_select', {thing_id: 12405}, selectedFile)"/>
		<input type="button" value="Select File (filtered)" onclick="TV.dialog('file_select', {thing_id: 12405, extension: 'stl,obj'}, selectedFile)"/>

		<br/>
		
		<input type="button" value="Select My Things" onclick="TV.dialog('thing_select', selectedThing)"/>
		
		<br/>
		
		<input type="button" value="Search Things" onclick="TV.dialog('thing_search', selectedThing)"/>
		<input type="button" value="Search 'makerbot'" onclick="TV.dialog('thing_search', {q: 'makerbot'}, selectedThing)"/>
		
		<br/>
		
		<input type="button" value="Create a New Thing" onclick="TV.dialog('thing_save', {name: 'Awesome Thing', description: 'Foo Bar', category: 'Model Robots', tags: 'iframe, app', license: 'cc-sa', is_published: 1}, createdThing)"/>
		<input type="button" value="Edit a Thing" onclick="TV.dialog('thing_save', {id: 12405}, savedThing)"/>
		
		<h2>API</h2>
		
		<input type="button" value="Get Latest Thing" onclick="TV.api('/newest', gotNewest)"/>
		<input type="button" value="Get Tags" onclick="TV.api('/tags', gotApi)"/>
		<input type="button" value="Test Absolute URL" onclick="TV.api('http://api.thingiverse.dev:8888/things/23338', gotThing)"/>
		
		<script>
			// api_url, target_url, and target are optional - set here for dev environment
			TV.init({
				access_token: '<?= $access_token ?>',
				api_url: 'http://api.thingiverse.dev:8888',
				target_url: 'http://thingiverse.dev:8888',
				target: parent
			});
			
			TV.api('/users/me', gotUser);
		</script>
	</body>
</html>
