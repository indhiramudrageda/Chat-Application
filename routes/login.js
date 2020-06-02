var express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
var morgan = require('morgan');
var router = express.Router();
var monk = require('monk');
var bcrypt = require('bcrypt');
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

var db = monk('localhost:27017/ChatApp');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('login');
});

router.post('/', function(req,res) {
	var collection = db.get('users');
	collection.findOne({ email: req.body.Email }, function(err, user){
		if (!user) {
			res.render('login', { error: "Email ID doesn't exist!" });
        } else {
            bcrypt.compare(req.body.Password, user.password, function(err, result) {
                if (err){
                    res.render('login', { error: 'Password is incorrect!' });
                }
                if (result) {
                    req.session.user = user;

                    res.redirect('/home');
                } else {
                    res.render('login', { error: 'Password is incorrect!' });
                }
            });
        }
	});  
});

module.exports = router;