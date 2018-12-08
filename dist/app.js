let express = require('express');
let app = express();
let http = require('http').Server(app);
let path = require('path');
let bodyParser = require('body-parser');
let fs = require("fs");
let content = require('../person_data.json');
let io = require('socket.io')(http);
// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static('public'));
// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.render('index', {
        json_data: content
    });
});
app.post('/update', (req, res) => {
    let jsonMsg = "You have entered invalid JSON!";
    let status = 400; // Bad request
    try {
        let data = req.body;
        let dataToSave = JSON.stringify(data, null, 2);
        fs.writeFileSync('person_data.json', dataToSave);
        jsonMsg = "Your JSON file has succesfully been updated!";
        content = data;
        io.emit('update message', dataToSave);
        status = 200; // OK
    }
    catch (_a) { }
    res.status(status).send(jsonMsg);
});
app.get('/find', (req, res) => {
    keyData = Object.keys(req.query)[0];
    let keyMsg = null;
    let status = 400;
    if (content.hasOwnProperty(keyData)) {
        keyMsg = content[keyData];
        status = 200;
    }
    res.status(status).send(keyMsg);
});
http.listen(3000, () => {
    console.log('Listening on *:3000');
});
//# sourceMappingURL=app.js.map