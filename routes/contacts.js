var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var morgan = require('morgan');
var monk = require('monk');
const {ObjectId} = require('mongodb');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
var db = monk('localhost:27017/ChatApp');
var chatRooms = db.get('chatRooms');
var chatMessages = db.get('chatMessages');
var users = db.get('users');

//create a chat room between 2 users
router.post('/', function (req, res, next) {
    users.findOne({email: req.body.participantEmail}, function(err, user) {
        if(user == null || user === undefined)
            res.send({error:'No user available with this email'})
        else {
            users.update(
                { _id: ObjectId(req.session.user._id) }, 
                { $push: { contacts: {userID: ObjectId(user._id), createDate: new Date(Date.now())}}}, 
                function(err, result) {
                    //check first if chat room is already created. If so donot create a new one.
                    /*chatRooms.findOne({$or: [{participants: [ObjectId(req.session.user._id), ObjectId(user._id)]}, {participants: [ObjectId(user._id), ObjectId(req.session.user._id)]}]}, function(err, chatRoom) {
                        if(chatRoom == null || chatRoom === undefined) {
                            chatRooms.insert({
                                participants: [ObjectId(req.session.user._id), ObjectId(user._id)],
                                createDate: new Date(Date.now())
                            }, function(err, user){
                            });
                        }
                    });*/
                    res.send({success:'Success'}); 
                });

        }
    });
});

//get all contacts of the logged-in user
router.get('/', function(req, res, next) {
	users.aggregate([
            {$match: {_id:ObjectId(req.session.user._id)}},
            {$unwind: "$contacts"},
            {$lookup:{
                from: "users",
                localField: "contacts.userID",
                foreignField: "_id",
                as: "contactInfo"
            }},
            {$unwind:"$contactInfo"},
            {$sort: {"createDate" : -1}},
            {$project: {
                "participantID" : "$contactInfo._id",
                "participantFName" : "$contactInfo.firstName",
                "participantLName" : "$contactInfo.lastName"
            }
        }], function(err, contacts) {
            res.render('chats', {contacts:contacts});
        });
});

module.exports = router;