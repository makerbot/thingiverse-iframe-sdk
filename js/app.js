function gotEcho(data) {
  TV.log('gotEcho: ' + JSON.stringify(data));
}

function gotFile(data) {
  TV.log('gotFile: ' + JSON.stringify(data));
  
  TV.api('/things/' + data.result.thing_id, {}, gotThing);
  
  TV.api('/things/' + data.result.thing_id + '/files/' + data.result.file_id, {}, function(file_data) {
    $('#file').html(
      '<img src="' + file_data.thumbnail + '"/><br/><a href="' + file_data.url + '">' + file_data.name + '</a>'
    );
  });
}

function gotThing(data) {
  TV.log('gotThing: ' + JSON.stringify(data));
  
  $('#thing').html('<img src="' + data.thumbnail + '"/><br/><a href="' + data.url + '">' + data.name + '</a>');
}

function gotNewest(data) {
  newest = data[0];
  
  TV.log('gotNewest: ' + JSON.stringify(newest));
  
  $('#thing').html('<img src="' + newest.thumbnail + '"/><br/><a href="' + newest.url + '">' + newest.name + '</a>');
}

function gotUser(data) {
  TV.log('gotUser: ' + JSON.stringify(data));
  
  $('#user').html('<img src="' + data.thumbnail + '"/><br/><a href="' + data.url + '">' + data.name + '</a>');
}
