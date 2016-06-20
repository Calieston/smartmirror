var widgetsEl = document.querySelector('.widgets'),
    widgetEls = document.querySelectorAll('.widget'),
    interfaceEl = document.querySelector('.interface');

var clickPos = {};

interfaceEl.style.height = interfaceEl.offsetWidth / (16/9) + 'px';

var grid = interfaceEl.offsetWidth / 16;


for (var i = 0; i < widgetEls.length; i++) {
  widgetEls[i].style.width = interfaceEl.offsetWidth / 16 * parseInt(widgetEls[i].dataset.size.substr(0,1)) - 10 + 'px';
  widgetEls[i].style.height = interfaceEl.offsetHeight / 9 *parseInt(widgetEls[i].dataset.size.substr(-1)) - 10 + 'px';
}

// Widgets
// Start Draging
function dragStartHandler(evt) {
  this.classList.add('dragged');
  evt.dataTransfer.setData("text", evt.target.id);
  // if(evt.target.parentNode.classList.contains('widgets')) {
  //   evt.dataTransfer.effectAllowed = "copy";
  // } else {
    evt.dataTransfer.effectAllowed = "move";
  // }
}

function dragStopHandler(evt) {
 this.classList.remove('dragged');
}

function fetchPositionHandler(evt) {
  clickPos = {
    x: evt.offsetX,
    y: evt.offsetY
  }
}


[].forEach.call(widgetEls, function(widgetEl) {
  widgetEl.addEventListener('dragstart', dragStartHandler, false);
  widgetEl.addEventListener('dragend', dragStopHandler, false);
  widgetEl.addEventListener('mousedown', fetchPositionHandler, false);
  // widgetEl.addEventListener('dragover', handleDragOver, false);
  // widgetEl.addEventListener('dragleave', handleDragLeave, false);
});

// Interface
// Widget enters droparea
function dragEnterHandler(evt) {
  evt.preventDefault()
  evt.stopPropagation()
  this.classList.add('dragover');
}

// Widget is dragged over droparea
function dragOverHandler(evt) {
  // allow drop
  if(evt.target.classList.contains('droparea')) {
    evt.preventDefault();
    // if(evt.target.classList.contains('widgets')) {
    //   evt.dataTransfer.dropEffect = "copy";
    // } else {
    evt.dataTransfer.dropEffect = "move";
    // }
  }
}

// Dragged widget leaves droparea
function dragLeaveHandler(evt) {
  this.classList.remove('dragover');
}

// Widget is dropped
function dropHandler(evt) {
  evt.preventDefault();
  this.classList.remove('dragover');
  var el = document.getElementById(evt.dataTransfer.getData("text"));

  // Only move element if the droparea is
  // and only if is not its parent
  if(evt.target.classList.contains('droparea')) {

    if(el.parentNode != this) {
      // var _el = el.cloneNode(true);

      evt.target.appendChild(el);
    }
    if(evt.target.classList.contains('interface')) {
       el.style.transform = snap({x: evt.offsetX, y: evt.offsetY});
    } else {
      el.style.transform = 'none';
    }

  }

}

// Interface grid
interfaceEl.addEventListener('dragenter', dragEnterHandler, false);
interfaceEl.addEventListener('dragover', dragOverHandler, false);
interfaceEl.addEventListener('dragleave', dragLeaveHandler, false);
interfaceEl.addEventListener('drop', dropHandler, false);

// Widget list
widgetsEl.addEventListener('dragenter', dragEnterHandler, false);
widgetsEl.addEventListener('dragover', dragOverHandler, false);
widgetsEl.addEventListener('dragleave', dragLeaveHandler, false);
widgetsEl.addEventListener('drop', dropHandler, false);

function snap(params) {
  var x = Math.round((params.x - clickPos.x) / grid) * grid + 5;
  var y = Math.round((params.y - clickPos.y) / grid) * grid + 5;
  var transform = 'translate(' + x + 'px,' + y + 'px)';
  return transform;
}