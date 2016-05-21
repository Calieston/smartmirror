console.log('Hello World');

var widgetsEls = document.getElementsByClassName('widget');

for (var i = 0; i < widgetsEls.length; i++) {
  getContent(widgetsEls[i]);
}

function getContent(el) {

  var request = new XMLHttpRequest();
  request.open('GET', '/smartmirror/module/' + el.id , true);

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      // Success!
      el.innerHTML = this.response;
    } else {
      // We reached our target server, but it returned an error
      console.error('Fehler');
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log('Fehler');
  };

  request.send();

}