function gotEcho(data) {
  TV.log('gotEcho: ' + JSON.stringify(data));
}

function gotFile(data) {
  TV.log('gotFile: ' + JSON.stringify(data));

  if (data.msg != 'cancelled') {
    $('#file').html('<img src="' + data.thumbnail + '"/><br/><a href="' + data.url + '">' + data.name + '</a>');
    gotThing(data.thing);
  }
}

function gotThing(data) {
  TV.log('gotThing: ' + JSON.stringify(data));

  if (data.msg != 'cancelled') {
    $('#thing').html('<img src="' + data.thumbnail + '"/><br/><a href="' + data.url + '">' + data.name + '</a>');
  }
}

function gotNewest(data) {
  newest = data[0];
  
  TV.log('gotNewest: ' + JSON.stringify(newest));
  
  if (data.msg != 'cancelled') {
    $('#thing').html('<img src="' + newest.thumbnail + '"/><br/><a href="' + newest.url + '">' + newest.name + '</a>');
  }
}

function gotUser(data) {
  TV.log('gotUser: ' + JSON.stringify(data));
  
  if (data.msg != 'cancelled') {  
    $('#user').html('<img src="' + data.thumbnail + '"/><br/><a href="' + data.url + '">' + data.name + '</a>');
  }
}

function createdThing(data) {
  TV.log('createdThing: ' + JSON.stringify(data));
  
  if (data.msg != 'cancelled') {
    gotThing(data);
  }
}