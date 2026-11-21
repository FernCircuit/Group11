//REQUIREMENTS FOR MONGODB
require("dotenv").config();
const { connectToMongoDB } = require("./db");
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


//Starts connection
async function startServer() {
    await connectToMongoDB();

    //Creates seed data using legacy JSONs
    const materialSeedData = require("./public/pages-material/materials.json");
    const speakerSeedData = require("./public/pages-speakers/speakers.json");
    const submissionSeedData = require("./public/pages-submissions/submissions.json");
    const cancellationSeedData = require("./public/pages-speakers/cancellations.json");

    //Creates database entries using legacy JSON data if no data is found.
    if (await Material.countDocuments() === 0) {
        await Material.insertMany(materialSeedData);
        console.log(`Imported ${materialSeedData.length} materials`);
    }
    if (await Speaker.countDocuments() === 0) {
        await Speaker.insertMany(speakerSeedData);
        console.log(`Imported ${speakerSeedData.length} speakers`)
    }
    if (await Submission.countDocuments() === 0) {
        await Submission.insertMany(submissionSeedData);
        console.log(`Imported ${submissionSeedData.length} submissions`)
    }
    if (await Cancellation.countDocuments() === 0) {
        await Cancellation.insertMany(cancellationSeedData);
        console.log(`Imported ${cancellationSeedData.length} cancellations`)
    }

    app.listen(process.env.PORT || 3000, () => {
        console.log("SummitPoint server is running");
    });
}

//--------------MongoDB DATABASE SETUP--------------//
const mongoose = require("mongoose");
const { Schema, model } = mongoose;



//Speaker schema
const speakerSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, default: "", trim: true },
    specialty: { type: String, required: true },
    rate: { type: Number, required: true, min: 0 },
    availableTopics: { type: [String], default: [] }
}, { timestamps: true });

//Submission schema
const submissionSchema = new Schema({
    id: { type: String, required: true, unique: true },
    speaker: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, required: true, default: "pending" }
}, { timestamps: true });

//Cancellation schema
const cancellationSchema = new Schema({
    canId: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    speakers: { type: [Number], default: [] },
    price: { type: Number, required: true, min: 0 },
    reason: { type: String, required: true },
    status: { type: String, required: true, default: "pending" }
}, { timestamps: true });

//Material schema
const materialSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 }
}, { timestamps: true });

//Finalizes Schemas
const Speaker = model("Speaker", speakerSchema);
const Submission = model("Submission", submissionSchema);
const Cancellation = model("Cancellation", cancellationSchema);
const Material = model("Material", materialSchema);

//--------------END DATABASE SETUP--------------//


//PREP THE PATHNAMES TO FIND THINGS.........
//creates the full json path
const speakersFile = path.join(__dirname, "public", "pages-speakers", "speakers.json");
const submissionsFile = path.join(__dirname, "public", "pages-submissions", "submissions.json");
const cancellationsFile = path.join(__dirname, "public", "pages-speakers", "cancellations.json");
const materialsFile = path.join(__dirname, "public", "pages-material", "materials.json");

//CREATE THE ARRAYS TO HOLD THINGS.......
// Arrays to hold items
let submissions = [];
let speakers = [];
let cancellations = [];
let materials = []; // Added to hold materials

//CHECK IF THINGS EXIST............
//Speakers.json already exists?
if (fs.existsSync(speakersFile)) {
    speakers = JSON.parse(fs.readFileSync(speakersFile, "utf8"));
}
//Submissions.json exists?
if (fs.existsSync(submissionsFile)) {
    submissions = JSON.parse(fs.readFileSync(submissionsFile, "utf8"));
}
//Cancellations.json exists?
if (fs.existsSync(cancellationsFile)) {
    cancellations = JSON.parse(fs.readFileSync(cancellationsFile, "utf8"));
}
//Materials.json exists?
if (fs.existsSync(materialsFile)) {
    materials = JSON.parse(fs.readFileSync(materialsFile, "utf8"));
}
//END CHECKING IF THINGS EXISTS.....


//Finds the next ID using MongoDB records and legacy JSON records; it does not migrate data.
async function nextSequenceNumber(Model, field, prefix = "", legacyRecords = []) {
    const databaseRecords = await Model.find({}, { [field]: 1, _id: 0 }).lean();
    return [...databaseRecords, ...legacyRecords].reduce((max, record) => {
        const value = String(record[field]);
        const sequence = Number(prefix && value.startsWith(prefix) ? value.slice(prefix.length) : value);
        return Number.isSafeInteger(sequence) ? Math.max(max, sequence) : max;
    }, 0) + 1;
}

//-----------START HTTP REQUEST METHODS--------------
// GET...........
//  submissions
app.get("/api/submissions", function (request, response) {
    response.json(submissions);
});
//  speakers
app.get("/api/speakers", function (request, response) {
    response.json(speakers);
});
//  cancellations
app.get("/api/cancellations", function (request, response) {
    response.json(cancellations);
});
// END GETS..........
//POSTS
//submissions
app.post("/api/submissions", async function (request, response) {
    const nextNumber = await nextSequenceNumber(Submission, "id", "", submissions);
    const newSubmission = await Submission.create({
        id: String(nextNumber).padStart(4, "0"),
        speaker: request.body.speaker,
        title: request.body.title,
        category: request.body.category,
        status: "pending"
    });
    response.status(201).json({ message: "Submission saved", data: newSubmission });
});

//cancellations
app.post("/api/cancellations", async function (request, response) {
    const nextNumber = await nextSequenceNumber(Cancellation, "canId", "CAN-", cancellations);
    const newCancellation = await Cancellation.create({
        canId: `CAN-${String(nextNumber).padStart(4, "0")}`,
        date: new Date(),
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        phoneNumber: request.body.phoneNumber,
        speakers: request.body.speakers,
        price: request.body.price,
        reason: request.body.reason,
        status: "pending"
    });
    response.status(201).json({ message: "Cancellation saved", data: newCancellation });
});

// materials
app.post("/api/materials", async function (request, response) {
    const nextNumber = await nextSequenceNumber(Material, "id", "", materials);
    const newMaterial = await Material.create({
        id: nextNumber,
        name: request.body.name,
        category: request.body.category,
        quantity: request.body.quantity,
        price: request.body.price
    });
    response.status(201).json({ message: "Material saved", data: newMaterial });
});
//speakers
app.post("/api/speakers", async function (request, response) {
    const fullName = (request.body.name || "").trim();
    if (!fullName) {
        return response.status(400).json({ message: "Speaker name is required" });
    }

    const parts = fullName.split(/\s+/);
    const newSpeaker = await Speaker.create({
        id: Date.now(),
        firstname: parts[0],
        lastname: parts.slice(1).join(" ") || "",
        specialty: request.body.category || "General",
        rate: 0,
        availableTopics: []
    });

    response.status(201).json({ message: "Speaker saved", data: newSpeaker });
});
// END POSTS..........
//
// PUT................
app.put("/api/submissions/:id", function (request, response) {
    const id = parseInt(request.params.id);
    const item = submissions.find(function (subs) {
        return subs.id == id;
    });
    if (!item) {
        return response.status(404).json({ message: "submission not found" });
    }

    item.status = request.body.status;
    fs.writeFileSync(submissionsFile, JSON.stringify(submissions));
    //response.json({ message: "Order status updated", data: item });

    //if approved, check speaker is new and save them to speakers.json
    if (request.body.status === "approved" && item.speaker) {
        const fullName = item.speaker.trim();
        const alreadyExists = speakers.some(function (speaker) {
            return (speaker.firstname + " " + (speaker.lastname || "")).trim().toLowerCase() === fullName.toLowerCase();
        });

        if (!alreadyExists) {
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
app.put("/api/cancellations/:id", function (request, response) {
    const id = request.params.id;
    const item = cancellations.find(function (cancellation) {
        return cancellation.canId == id;
    })
    if (!item) {
        return response.status(404).json({ message: "Cancellation not found" });
    }
    item.status = request.body.status;
    fs.writeFileSync(cancellationsFile, JSON.stringify(cancellations));
    response.json({ message: "Cancellation status updated", data: item });
});


startServer().catch((error) => {
    console.error("Could not start server:", error);
    process.exit(1);
});