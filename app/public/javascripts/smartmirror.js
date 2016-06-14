console.log('Hello World');

var widgetsEls = document.getElementsByClassName('widget');

for (var i = 0; i < widgetsEls.length; i++) {
  getContent(widgetsEls[i]);
}

function getContent(el) {

  var request = new XMLHttpRequest();

  request.open('GET', '/smartmirror/widget/' + el.dataset.widget , true);

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      // Success!
      var div = document.createElement('div');
      div.innerHTML = this.response;

      var script = div.querySelector('script');
      if(script) {
        script.parentNode.removeChild(script);
        newScript = document.createElement('script');
        newScript.innerHTML = script.innerText;
        el.appendChild(newScript);
      }

      el.appendChild(div);

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