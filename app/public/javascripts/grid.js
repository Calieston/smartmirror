// load the gridster module
var app = angular.module('gridModule', ['gridster']);
app.controller('moduleCtrl', function($scope) {
  $scope.gridsterOpts = {
    columns: 10, // the width of the grid, in columns
    pushing: true, // whether to push other items out of the way on move or resize
    floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
    swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
    width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
    colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
    rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
    margins: [10, 10], // the pixel distance between each widget
    minColumns: 1, // the minimum columns the grid must have
    maxColumns: 1, // the minimum columns the grid must have
    minRows: 1, // the minimum height of the grid, in rows
    maxRows: 1,
    resizable: {
      enabled: false,
    },
    draggable: {
      enabled: true, // whether dragging items is supported
    }
  };
  $scope.moduleItems = [{
    sizeX: 1,
    sizeY: 1,
    row: 0,
    col: 0
  }, {
    sizeX: 1,
    sizeY: 1,
    row: 0,
    col: 1
  }, {
    sizeX: 1,
    sizeY: 1,
    row: 0,
    col: 2
  }, {
    sizeX: 1,
    sizeY: 1,
    row: 0,
    col: 3
  }, {
    sizeX: 1,
    sizeY: 1,
    row: 0,
    col: 4
  }, {
    sizeX: 1,
    sizeY: 1,
    row: 0,
    col: 5
  }];
});
app.controller('mirrorCtrl', function($scope) {

  $scope.gridsterOpts = {
    columns: 15, // the width of the grid, in columns
    pushing: true, // whether to push other items out of the way on move or resize
    floating: false, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
    swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
    width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
    colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
    rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
    margins: [10, 10], // the pixel distance between each widget
    minColumns: 1, // the minimum columns the grid must have
    maxColumns: 15, // the minimum columns the grid must have
    minRows: 1, // the minimum height of the grid, in rows
    maxRows: 8,
    resizable: {
      enabled: false,
    },
    draggable: {
      enabled: true, // whether dragging items is supported
    }
  };
  $scope.interfaceItems = [{
    sizeX: 1,
    sizeY: 1,
    row: 0,
    col: 0
  }, {
    sizeX: 1,
    sizeY: 1,
    row: 0,
    col: 0
  }, {
    sizeX: 1,
    sizeY: 1,
    row: 0,
    col: 0
  }, {
    sizeX: 1,
    sizeY: 1,
    row: 0,
    col: 5
  }, {
    sizeX: 1,
    sizeY: 1,
    row: 1,
    col: 0
  }, {
    sizeX: 1,
    sizeY: 1,
    row: 1,
    col: 4
  }, {
    sizeX: 1,
    sizeY: 1,
    row: 1,
    col: 5
  }, {
    sizeX: 1,
    sizeY: 1,
    row: 2,
    col: 0
  }, {
    sizeX: 1,
    sizeY: 1,
    row: 2,
    col: 1
  }, {
    sizeX: 1,
    sizeY: 1,
    row: 2,
    col: 3
  }, {
    sizeX: 1,
    sizeY: 1,
    row: 2,
    col: 4
  }];
});