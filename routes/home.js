var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var morgan = require('morgan');
var monk = require('monk');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
var db = monk('localhost:27017/ChatApp');

router.get("/", function (req, res, next) {
	if(req.session.user === undefined)
		res.redirect("login");
	else
   		res.redirect("chats");
});

module.exports = router;
