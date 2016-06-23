var widgetsEl = document.querySelector('.widgets'),
    widgetEls = document.querySelectorAll('.widget'),
    interfaceEl = document.querySelector('.interface');

var formEl = document.querySelector('form');

var clickPos = {};

interfaceEl.style.height = interfaceEl.offsetWidth / (16/9) + 'px';

var grid = interfaceEl.offsetWidth / 16;

for (var i = 0; i < widgetEls.length; i++) {
  widgetEls[i].style.width = interfaceEl.offsetWidth / 16 * parseInt(widgetEls[i].dataset.size.substr(0,1)) - 10 + 'px';
  widgetEls[i].style.height = interfaceEl.offsetHeight / 9 *parseInt(widgetEls[i].dataset.size.substr(-1)) - 10 + 'px';
  // Set position in interface
  if(widgetEls[i].parentNode.classList.contains('interface')) {
    var x = Number(widgetEls[i].dataset.x) * grid + 5;
    var y = Number(widgetEls[i].dataset.y) * grid + 5;
    widgetEls[i].style.transform = 'translate(' + x + 'px,' + y + 'px)';
  }
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
      var pos = snap({x: evt.offsetX, y: evt.offsetY});
      el.dataset.x = pos.x;
      el.dataset.y = pos.y;
      el.style.transform = 'translate(' + (pos.x*grid+5) + 'px,' + (pos.y*grid+5) + 'px)';
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
  var x = Math.round((params.x - clickPos.x) / grid);
  var y = Math.round((params.y - clickPos.y) / grid);
  return {x: x, y: y};
}

// function snap(params) {
//   var x = Math.round((params.x - clickPos.x) / grid) * grid + 5;
//   var y = Math.round((params.y - clickPos.y) / grid) * grid + 5;
//   return {x: x, y: y};
// }

formEl.addEventListener('submit', function(evt) {
  var data = [];
  [].forEach.call(interfaceEl.querySelectorAll('.widget'), function(widget) {
    data.push({
      _id: widget.id,
      position: {
        x: widget.dataset.x,
        y: widget.dataset.y
      },
      size: widget.dataset.size
    })
  });

  formEl.querySelector('input').value = JSON.stringify(data);
});