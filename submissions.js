var app = angular.module("submissionApp",[])

app.controller("SubmissionController", function($scope) {

    $scope.submission = {
        title: "",
        time: "",
        duration: "",
        category: "",
        speaker: "",
        abstract: ""
    };

    $scope.contact = {
        email: "",
        phoneNumber: ""
    };

    $scope.submitted = false;
    $scope.finalized = false;

    $scope.submit = function() {
        $scope.submitted = true;
    };

    $scope.finalize = function() {
        $scope.finalized = true;
    };

    //Resets booleans and data on new submission.
    $scope.newSubmission = function() {
        $scope.submitted = false;
        $scope.finalized = false;

        $scope.submission = {
        title: "",
        time: "",
        duration: "",
        category: "",
        speaker: "",
        abstract: ""
        };

        $scope.contact = {
        email: "",
        phoneNumber: ""
        };
    }

});