let express = require('express');
let app = express();
let http = require('http').Server(app);
let path = require('path');
let bodyParser = require('body-parser');
let fs = require("fs");
let content = require('../person_data.json');
let io = require('socket.io')(http);
const { check, validationResult } = require('express-validator/check');
// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
// Global Variables
app.use((req, res, next) => {
    res.locals.errors = null;
    next();
});
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
    res.status(status).json({
        jsonMsg: jsonMsg
    });
});
app.post('/find', check('key').isLength({ min: 1 }).withMessage("The key is required!"), (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('index', {
            errors: errors.array(),
            json_data: content
        });
    }
    else {
        let keyMsg = "The key '" + req.body.key + "' could not be found!";
        if (content.hasOwnProperty(req.body.key)) {
            keyMsg = "The value for the Key: '" + req.body.key + "' is '" + content[req.body.key] + "'";
        }
        res.render('index', {
            json_data: content,
            keyMsg: keyMsg
        });
    }
});
http.listen(3000, () => {
    console.log('Listening on *:3000');
});
//# sourceMappingURL=app.js.map