let app = require('express')()
let http = require('http').Server(app)
let path = require('path')
let bodyParser = require('body-parser')
let fs = require("fs")
let content = require('../person_data.json')

const {check, validationResult} = require('express-validator/check')

// View engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))

// Body Parser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Global Variables
app.use((req, res, next) => {
  res.locals.errors = null
  next()
})

app.route('/')
  .get((req, res) => {
    res.render('index', {
      json_data: content
    })
  })
  .post(
    [check('first_name').isLength({ min: 1 }).withMessage("First Name is required!"),
    check('last_name').isLength({ min: 1 }).withMessage("Last Name is required!"),
    check('email').isLength({ min: 1 }).withMessage("Email is required!"),
    check('email').isEmail().withMessage("Email has to be in the format of email@example.com"),
    check('favorite_color').isLength({ min: 1 }).withMessage("Favorite color is required!")
    ], (req, res) => {

    let errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.render('index', {
        errors: errors.array(),
        json_data: content
      })
    }
    else {
      let newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        favorite_color: req.body.favorite_color,
      }
      console.log('User updated!')
      content = newUser
      let data = JSON.stringify(newUser, null, 2)
      fs.writeFileSync('person_data.json', data)
    }
  })



http.listen(3000, () => {
  console.log('Listening on *:3000')
})
