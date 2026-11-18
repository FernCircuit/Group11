var app = angular.module("cancellationsApp", [])

app.controller("CancellationsController", function ($scope, $http) {

    $scope.submitted = false;
    $scope.submitting = false;
    $scope.submissionError = "";

    $scope.reservedSpeakers = [];
    $scope.speakerLoadError = "";

    $scope.cancellation = {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        speakers: [],
        price: 0,
        reason: ""
    };

    function loadSpeakers() {
        $http.get("/api/speakers")
            .then(function (response) {
                $scope.reservedSpeakers = response.data;
            })
            .catch(function (error) {
                console.error("Failed to load speakers:", error);
                $scope.speakerLoadError = "Unable to load speakers. Please try again later.";
            })
    }
    loadSpeakers();

    $scope.updateSelectedSpeakers = function () {
        $scope.cancellation.speakers = $scope.reservedSpeakers
            .filter(function (speaker) {
                return speaker.selected;
            })
            .map(function (speaker) {
                return speaker.id;
            });
        $scope.calculatePrice();
    };

    $scope.calculatePrice = function () {
        var totalCents = $scope.reservedSpeakers
            .filter(function (speaker) {
                return speaker.selected;
            })
            .reduce(function (total, speaker) {
                var rate = Number(speaker.rate);
                return total + (Number.isFinite(rate) ? Math.round(rate * 100) : 0);
            }, 0);

        $scope.cancellation.price = totalCents / 100;
        return $scope.cancellation.price;
    };

    $scope.submit = function () {
        $scope.updateSelectedSpeakers();
        if (!validateCancellationForm($scope.cancellation)) {
            return;
        }

        if ($scope.submitting) {
            return;
        }

        var payload = {
            firstName: $scope.cancellation.firstName,
            lastName: $scope.cancellation.lastName,
            email: $scope.cancellation.email,
            phoneNumber: $scope.cancellation.phoneNumber,
            speakers: $scope.cancellation.speakers,
            price: $scope.cancellation.price,
            reason: $scope.cancellation.reason
        };

        $scope.submitting = true;
        $scope.submissionError = "";
        $http.post("/api/cancellations", payload)
            .then(function(response) {
                console.log("POST /api/cancellations success:", response.data);
                $scope.submitted = true;
            })
            .catch(function(error) {
                console.error("POST /api/cancellations failed:", error);
                $scope.submissionError = "Unable to submit your cancellation request. Please try again.";
            })
            .finally(function() {
                $scope.submitting = false;
            });
    };

});