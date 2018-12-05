let app = require('express')();
let http = require('http').Server(app);
let path = require('path');
let bodyParser = require('body-parser');
let fs = require("fs");
let content = require('../person_data.json');
const { check, validationResult } = require('express-validator/check');
// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Global Variables
app.use((req, res, next) => {
    res.locals.errors = null;
    next();
});
app.route('/')
    .get((req, res) => {
    res.render('index', {
        json_data: content
    });
})
    .post(check('json_textarea').isLength({ min: 1 }).withMessage("The json file cannot be empty!"), (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('index', {
            errors: errors.array(),
            json_data: content
        });
    }
    else {
        let jsonMsg = "You have entered invalid JSON!";
        try {
            let data = JSON.parse(req.body.json_textarea);
            let dataToSave = JSON.stringify(data, null, 2);
            fs.writeFileSync('person_data.json', dataToSave);
            jsonMsg = "Your JSON file has succesfully been updated!";
            res.render('index', {
                json_data: content,
                jsonMsg: jsonMsg
            });
        }
        catch (_a) {
            res.render('index', {
                json_data: content,
                jsonMsg: jsonMsg
            });
        }
        //content = newUser
        //let data = JSON.stringify(newUser, null, 2)
        //fs.writeFileSync('person_data.json', data)
    }
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
        let keyMsg = "The key could not be found!";
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