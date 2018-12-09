let express = require("express");
const app = express();
const http = require("http").Server(app);
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
let content = {key: "value"};
const io = require("socket.io")(http);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(express.static("public"));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get("/", (req, res) => {
  let status = 400
  try {
    content = require("../person_data.json");
    JSON.parse(content);
    status = 200
  } catch {/* tslint:disable:no-empty */}
  res.status(status).render("index", { json_data: content });
});

app.post("/update",
  (req, res) => {

  let jsonMsg = "You have entered invalid JSON!";
  let status = 400; // Bad request
  try {
    const data = req.body;
    const dataToSave = JSON.stringify(data, null, 2);
    fs.writeFileSync("person_data.json", dataToSave);
    jsonMsg = "Your JSON file has succesfully been updated!";
    content = data;

    io.emit("update message", dataToSave);

    status = 200; // OK
  } catch {/* tslint:disable:no-empty */}

  res.status(status).send(jsonMsg);
});

app.get("/find",
  (req, res) => {

  const keyData = Object.keys(req.query)[0];
  let keyMsg = null;
  let status = 400;
  if (content.hasOwnProperty(keyData)) {
    keyMsg = content[keyData];
    status = 200;
  }

  res.status(status).send(keyMsg);
});

http.listen(3000, () => {
  // tslint:disable-next-line:no-console
  console.log("Listening on *:3000");
});
