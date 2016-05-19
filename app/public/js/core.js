var smartmirror = angular.module('smartmirror', []);

function mainController($scope, $http) {
  $scope.formData = {};

  // When landing on the page, get weather widget information
  $http.get('smartmirror/weather')
    .success(function(data) {

      $scope.widget = data;
      $scope.imgUrl = 'http://image005.flaticon.com/159/svg/136/136717.svg';
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  // When submitting the search form, send the cityname to the node API
  $scope.getWeatherData = function() {
    $http
      .get('smartmirror/weather', {
        params: {
          city: $scope.formData.city,
        },
      }).success(function(data) {
        $scope.formData = {}; // Clear the form for next search term
        $scope.widget = data;
        $scope.imgUrl =
          'http://image005.flaticon.com/159/svg/136/136717.svg';
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };
}