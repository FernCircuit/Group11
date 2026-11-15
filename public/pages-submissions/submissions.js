var app = angular.module("submissionApp",[])

app.controller("SubmissionController", function($scope, $http) {

    $scope.submission = {
        title: "",
        time: "",
        duration: "",
        category: "",
        speaker: "",
        customSpeaker: "",
        abstract: ""
    };

    $scope.contact = {
        email: "",
        phoneNumber: ""
    };

    $scope.reservedSpeakers=[];
    $scope.submitted = false;
    $scope.finalized = false;

    //load speakers from node.js
    function loadSpeakers(){
        $http.get("/api/speakers")
            .then(function(response){
                $scope.reservedSpeakers = response.data.map(function(speaker){
                    return (speaker.firstname + " " + (speaker.lastname || "")).trim();
                });
            })
                .catch(function(error){
                    console.error("Failed to load speakers:", error);
                });
    }

    loadSpeakers();

    function getSelectedSpeaker(){
        if($scope.reservedSpeakers.length === 0 || $scope.submission.speaker === "__new__"){
            return $scope.submission.customSpeaker ? $scope.submission.customSpeaker.trim() : "";
        }
        return $scope.submission.speaker;
    }

    //validate
    $scope.submit = function() {
        var chosenSpeaker = getSelectedSpeaker();
        if(!validateSessionForm($scope.submission, chosenSpeaker)){
            return;
        }
        $scope.submitted = true;
    };

   $scope.finalize = function() {
        if(!validateContactForm($scope.contact)){
            return;
        }

        var chosenSpeaker = getSelectedSpeaker();

        var isNewSpeaker = ($scope.reservedSpeakers.length === 0 || $scope.submission.speaker === "__new__");

        var payload = {
            title: $scope.submission.title,
            time: $scope.submission.time || "TBD",
            duration: $scope.submission.duration || 30,
            category: $scope.submission.category,
            speaker: chosenSpeaker,
            abstract: $scope.submission.abstract,
            email: $scope.contact.email,
            phoneNumber: $scope.contact.phoneNumber
        };

        $http.post("/api/submissions", payload)
            .then(function(response) {
                console.log("POST /api/submissions success:", response.data);
                $scope.finalized = true;
            })
            .catch(function(error) {
                console.error("POST /api/submissions failed:", error);
            });
    };

    $scope.newSubmission = function() {
        $scope.submission = { title: "", time: "", duration: 30, category: "", speaker: "", customSpeaker: "", abstract: "" };
        $scope.contact = { email: "", phoneNumber: "" };
        $scope.submitted = false;
        $scope.finalized = false;
    };
});
app.controller("ReviewController", function($scope, $http) {
    $scope.submissions = [];

    $scope.loadSubmissions = function() {
        $http.get("/api/submissions")
            .then(function(response) {
                $scope.submissions = response.data;
            })
            .catch(function(error) {
                console.error("GET /api/submissions failed:", error);
            });
    };

    $scope.updateStatus = function(item, newStatus) {
        $http.put("/api/submissions/" + item.id, { status: newStatus })
            .then(function(response) {
                item.status = newStatus;
                console.log("PUT /api/submissions/" + item.id + " success:", response.data);
            })
            .catch(function(error) {
                console.error("PUT failed:", error);
            });
    };

    $scope.loadSubmissions();
});