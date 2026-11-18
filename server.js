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
const ordersFile = path.join(__dirname, "public", "pages-checkout", "orders.json");

//CREATE THE ARRAYS TO HOLD THINGS.......
// Arrays to hold items
let submissions = [];
let speakers = [];
let orders = [];

//CHECK IF THINGS EXIST............
//Speakers.json already exists?
if (fs.existsSync(speakersFile)) {
    speakers = JSON.parse(fs.readFileSync(speakersFile, "utf8"));
}
//Submissions.json exists?
if(fs.existsSync(submissionsFile)){
    submissions = JSON.parse(fs.readFileSync(submissionsFile, "utf8"));
}
//Orders.json exists?
if(fs.existsSync(ordersFile)){
    orders = JSON.parse(fs.readFileSync(ordersFile, "utf8"));
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
//  orders
app.get("/api/orders", function(request, response){
    response.json(orders);
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
//  orders
app.post("/api/orders", function(request, response) { //tells express server to wait for POST from Angular JS
    const nextNumber = orders.length + 1;
    const id = ("000"+nextNumber).slice(-4);

    const newOrder = { //create the new order format
        orderId: "ORD-" + id,
        date: new Date().toISOString(),
        contact: request.body.contact,
        billing: request.body.billing,
        items: request.body.items,
        totalCost: request.body.totalCost,
        status: "Confirmed"
    };

    orders.push(newOrder); //adds the order to the array
    fs.writeFileSync(ordersFile, JSON.stringify(orders)); //writes the file
    response.status(201).json({ message: "Order saved", data: newOrder }); //http code 201 is "Created"
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
//orders put
app.put("/api/orders/:id", function(request, response){
    const id = request.params.id;
    const item = orders.find(function(order){
        return order.orderId == id;
    })
    if(!item){
        return response.status(404).json({ message: "Order not found" });
    }
    item.status = request.body.status;
    fs.writeFileSync(ordersFile, JSON.stringify(orders));
    response.json({ message: "Order status updated", data:item});
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