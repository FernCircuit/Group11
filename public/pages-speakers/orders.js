var app = angular.module("orderApp", []);
app.controller("orderController", function($scope, $http) {
    $scope.orders = [];
    $http.get("/api/orders").then(function(response) {
        $scope.orders = response.data;
    });
    $scope.updateStatus = function(item, newStatus) {
        $http.put("/api/orders/" + item.orderId, { status: newStatus }).then(function(response) {
            item.status = newStatus;
        });
    };
});