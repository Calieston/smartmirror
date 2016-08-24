/**
 * Smartmirror Interface
 * Loading Widgets
 */
var widgetsEls = document.getElementsByClassName('widget');

for (var i = 0; i < widgetsEls.length; i++) {
  getContent(widgetsEls[i]);
}

function getContent(el) {

  var request = new XMLHttpRequest();

  request.open('GET', '/smartmirror/widget/' + el.dataset.widget, true);

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      // Success!
      var div = document.createElement('div');
      div.innerHTML = this.response;

      el.appendChild(div);

      var script = el.querySelector('script');

      if (script) {
        script.parentNode.removeChild(script);
        newScript = document.createElement('script');
        newScript.dataset.widget = el.id;
        document.body.appendChild(newScript);
        newScript.textContent = script.textContent;
      }

    } else {
      // We reached our target server, but it returned an error
      console.log('Fehler');
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log('Fehler');
  };

  request.send();

}

/**
 * Sockets
 */

var socket = io.connect('http://localhost:3000');

socket.on('reload', function(data) {
  window.location.reload();
});

socket.on('loadUser', function(data) {
  window.location.href = 'http://localhost:3000/smartmirror/' + data.user;
})

/*socket.on('tagesschau', function(data) {
  console.log('tagesschau');
})*/

socket.on('smartmirror-video-tagesschau100sek', function(data) {
  playPause();
})
socket.on('smartmirror-weather', function(data) {
  console.log('call smartmirror socket');
/*  console.log('FUNCTION: '+ JSON.stringify(data));*/
  playPause();
})
socket.on('recording', function(data) {
  if (data.status == 'enabled') {
    document.getElementById("Record").style.display = "block";
  } else {
    if (data.status = 'disabled') {
      document.getElementById("Record").style.display = "none";
    }
  }
})

socket.on('test', function(data) {
  socket.emit('clientTest', {
    msg: 'Message from Client'
  });
  //socket.emit('smartmirror', {msg: 'record' });
});