const express = require("express");//RESTful API framework
const fs = require("fs"); //built in node module lets server create update files
const path = require("path");//built in node module build folder paths
const app = express();//initialize express
//link to public files
app.use(express.static("public"));
//auto parse incoming json payloads
app.use(express.json());
//creates the full json path
const speakersFile = path.join(__dirname, "public", "pages-speakers", "speakers.json");
const submissionsFile = path.join(__dirname, "public", "pages-submissions", "submissions.json");
// Arrays to hold items
let submissions = [];
let speakers = [];
//check if speakers.json already exists
if (fs.existsSync(speakersFile)) {
    speakers = JSON.parse(fs.readFileSync(speakersFile, "utf8"));
}
//read the json
if(fs.existsSync(submissionsFile)){
    submissions = JSON.parse(fs.readFileSync(submissionsFile, "utf8"));
}
// GET all submissions to review
app.get("/api/submissions", (req, res) => {
    res.json(submissions);
});
// POST new submission
app.post("/api/submissions", (req, res) => {
    const newSubmission = {
        id: Math.floor(100 + Math.random() * 900),
        ...req.body,
        status: "pending"
    };
    submissions.push(newSubmission);
    fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));
    res.status(201).json({ message: "Submission saved", data: newSubmission });
});
// PUT update approval status
app.put("/api/submissions/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const item = submissions.find(s => s.id === id);
    if (!item) {
        return res.status(404).json({ message: "Submission not found" });
    }
    item.status = req.body.status;
    fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));
    //if approved, check speaker is new and save them to speakers.json
    if(req.body.status === "approved" && item.speaker){
        const fullName = item.speaker.trim();
        const alreadyExists = speakers.some(speaker =>
        (speaker.firstname + " " + (speaker.lastname || "")).trim().toLowerCase() === fullName.toLowerCase()
        );
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
            fs.writeFileSync(speakersFile, JSON.stringify(speakers,null,2));
        }
    }
    res.json({ message: "Status updated", data: item });
});
// GET speakers dropdown
app.get("/api/speakers", (req, res) => {
    res.json(speakers);
});
// POST new speaker and save to speakers.json
app.post("/api/speakers", (req, res) => {
    const fullName = (req.body.name || "").trim();
    if (!fullName) {
        return res.status(400).json({ message: "Speaker name is required" });
    }
    const parts = fullName.split(" ");
    const newSpeaker = {
        id: Date.now(),
        firstname: parts[0],
        lastname: parts.slice(1).join(" ") || "",
        specialty: req.body.category || "General",
        rate: 0,
        availableTopics: []
    };
    speakers.push(newSpeaker);
    fs.writeFileSync(speakersFile, JSON.stringify(speakers, null, 2));
    res.status(201).json({ message: "Speaker saved", data: newSpeaker });
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SummitPoint server listening on port ${PORT}`);
});