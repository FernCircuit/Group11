//REQUIREMENTS FOR NODE.JS THINGS...........
const express = require("express");//RESTful API framework
const fs = require("fs"); //built in node module lets server create update files
//dev notes - use fs in node.js because it runs on a server, different from vanilla js
const path = require("path");//built in node module build folder paths
const app = express();//initialize express
//link to public files
app.use(express.static("public"));
//auto parse incoming json payloads
app.use(express.json());

//PREP THE PATHNAMES TO FIND THINGS.........
//creates the full json path
const speakersFile = path.join(__dirname, "public", "pages-speakers", "speakers.json");
const submissionsFile = path.join(__dirname, "public", "pages-submissions", "submissions.json");
const cancellationsFile = path.join(__dirname, "public", "pages-speakers", "cancellations.json");

//CREATE THE ARRAYS TO HOLD THINGS.......
// Arrays to hold items
let submissions = [];
let speakers = [];
let cancellations = [];

//CHECK IF THINGS EXIST............
//Speakers.json already exists?
if (fs.existsSync(speakersFile)) {
    speakers = JSON.parse(fs.readFileSync(speakersFile, "utf8"));
}
//Submissions.json exists?
if(fs.existsSync(submissionsFile)){
    submissions = JSON.parse(fs.readFileSync(submissionsFile, "utf8"));
}
//Cancellations.json exists?
if(fs.existsSync(cancellationsFile)){
    cancellations = JSON.parse(fs.readFileSync(cancellationsFile, "utf8"));
}
//END CHECKING IF THINGS EXISTS.....

//-----------START HTTP REQUEST METHODS--------------
// GET...........
//  submissions
app.get("/api/submissions", function(request, response) {
    response.json(submissions);
});
//  speakers
app.get("/api/speakers", function(request, response){
    response.json(speakers);
});
//  cancellations
app.get("/api/cancellations", function(request, response){
    response.json(cancellations);
});
// END GETS..........
//
// POST..............
//  submissions
app.post("/api/submissions", function(request, response) {
        const nextNumber = submissions.length + 1;
        const id = ("000" + nextNumber).slice(-4);
        
        const newSubmission = {
            id: id,
            speaker: request.body.speaker,
            title: request.body.title,
            category: request.body.category,
            status: "pending"
    };

    submissions.push(newSubmission);
    fs.writeFileSync(submissionsFile, JSON.stringify(submissions));
    response.status(201).json({ message: "Submission saved", data: newSubmission });
});
//  cancellations
app.post("/api/cancellations", function(request, response) { //tells express server to wait for POST from Angular JS
    const nextNumber = cancellations.length + 1;
    const id = ("000"+nextNumber).slice(-4);

    const newCancellations = { //create the new cancellation format
        canId: "CAN-" + id,
        date: new Date().toISOString(),
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        phoneNumber: request.body.phoneNumber,
        speakers: request.body.speakers,
        price: request.body.price,
        reason: request.body.reason,
        status: "pending"
    };

    cancellations.push(newCancellations); //adds the cancellation to the array
    fs.writeFileSync(cancellationsFile, JSON.stringify(cancellations)); //writes the file
    response.status(201).json({ message: "Cancellation saved", data: newCancellations }); //http code 201 is "Created"
});
// END POSTS..........
//
// PUT................
app.put("/api/submissions/:id", function (request, response) {
    const id = parseInt(request.params.id);
    const item = submissions.find(function(subs) {
        return subs.id == id;
    });
    if (!item) {
        return response.status(404).json({ message: "submission not found" });
    }

    item.status = request.body.status;
    fs.writeFileSync(submissionsFile, JSON.stringify(submissions));
    //response.json({ message: "Order status updated", data: item });

    //if approved, check speaker is new and save them to speakers.json
    if(request.body.status === "approved" && item.speaker){
        const fullName = item.speaker.trim();
        const alreadyExists = speakers.some(function(speaker){
            return (speaker.firstname + " " + (speaker.lastname || "")).trim().toLowerCase() === fullName.toLowerCase();
        });

        if(!alreadyExists){
            const parts = fullName.split(" ");
            const newSpeaker = {
                id: Date.now(),
                firstname: parts[0],
                lastname: parts.slice(1).join(" ") || "",
                specialty: item.category || "General",
                rate: 0,
                availableTopics: [item.title]
            };
            speakers.push(newSpeaker);
            fs.writeFileSync(speakersFile, JSON.stringify(speakers));
        }
    }
    response.json({ message: "Status updated", data: item });
});
//Cancellations put
app.put("/api/cancellations/:id", function(request, response){
    const id = request.params.id;
    const item = cancellations.find(function(cancellation){
        return cancellation.canId == id;
    })
    if(!item){
        return response.status(404).json({ message: "Cancellation not found" });
    }
    item.status = request.body.status;
    fs.writeFileSync(cancellationsFile, JSON.stringify(cancellations));
    response.json({ message: "Cancellation status updated", data:item});
});
//speakers
app.post("/api/speakers", function(request, response){
    const fullName = (request.body.name || "").trim();
    if(!fullName){
        return response.status(400).json({ message: "Speaker name is required" });
    }

    const parts = fullName.split(" ");
    const newSpeaker = {
        id: Date.now(),
        firstname:parts[0],
        lastname:parts.slice(1).join(" ")||"",
        specialty: request.body.category || "General",
        rate: 0,
        availableTopics:[]
    };

    speakers.push(newSpeaker);
    fs.writeFileSync(speakersFile, JSON.stringify(speakers));
    response.status(201).json({ message: "Speaker saved", data: newSpeaker });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
    console.log(`SummitPoint server listening on port ${PORT}`);
});