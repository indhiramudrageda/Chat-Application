var express = require('express');
var router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');
var morgan = require('morgan');
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function(req,res) {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});

module.exports = router;