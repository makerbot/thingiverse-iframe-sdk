// iframe communication debugging button

function gotEcho(data) {
  TV.log('gotEcho: ' + JSON.stringify(data));
}

// dialog callbacks

function selectedFile(data) {
  TV.log('selectedFile: ' + JSON.stringify(data));

  if (data.status != 'cancelled') {
    TV.api('/things/' + data.thing_id, gotThing);
    TV.api('/things/' + data.thing_id + '/files/' + data.file_id, gotFile);
  }
}

function selectedThing(data) {
  TV.log('selectedThing: ' + JSON.stringify(data));

  if (data.status != 'cancelled') {
    TV.api('/things/' + data.thing_id, gotThing);
  }
}

function createdThing(data) {
  TV.log('createdThing: ' + JSON.stringify(data));  
}

function savedThing(data) {
  TV.log('savedThing: ' + JSON.stringify(data));  
}

// api callbacks

function gotFile(data) {
  TV.log('gotFile: ' + JSON.stringify(data));

  $('#file').html('<img src="' + data.thumbnail + '"/><a href="' + data.public_url + '" target="_blank">' + data.name + '</a>');
}

function gotThing(data) {
  TV.log('gotThing: ' + JSON.stringify(data));

  $('#thing').html('<img src="' + data.thumbnail + '"/><a href="' + data.public_url + '" target="_blank">' + data.name + '</a><input type="button" value="Select File" onclick="TV.dialog(\'file_select\', {thing_id: ' + data.id + '}, selectedFile)"/>');
}

function gotNewest(data) {
  newest = data[0];
  
  TV.log('gotNewest: ' + JSON.stringify(newest));
  
  gotThing(newest);
}

function gotUser(data) {
  TV.log('gotUser: ' + JSON.stringify(data));
  
  $('#user').html('<img src="' + data.thumbnail + '"/><a href="' + data.public_url + '" target="_blank">' + data.name + '</a>');
}

function gotApi(data) {
  // just log it
  TV.log('gotApi: ' + JSON.stringify(data));
}
