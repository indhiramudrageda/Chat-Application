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
	chatRooms.insert({
            participants: [req.session.user._id, req.body.recipient],
            createDate: new Date(Date.now())
    }, function(err, user){
            
    });
});

//get all chat rooms and contacts of the logged-in user
router.get('/', function(req, res, next) {
    if(req.session.user == null || req.session.user === undefined)
        res.redirect('login');
    else {
        chatRooms.aggregate([
        {$match: {participants:ObjectId(req.session.user._id)}},
        {$unwind: "$participants"},
        {$match: {participants:{ $ne : ObjectId(req.session.user._id)}}},
        {$sort: {"lastModifiedDate" : -1}},
        {$lookup:{
                from: "users",
                localField: "participants",
                foreignField: "_id",
                as: "participantInfo"
            }
        },
        {$unwind:"$participantInfo"},
        {$project: {
                "participantID" : "$participantInfo._id",
                "participantFName" : "$participantInfo.firstName",
                "participantLName" : "$participantInfo.lastName",
                "chatID" : "$_id"
            }
        }
        ], function(err, chatRooms) {
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
            res.render('chats', {chatRooms: chatRooms, contacts:contacts});
        });  
    });
    }
	
});

//get all messages of specific chat
router.get('/:id', function(req, res, next) {
    chatMessages.findOne({chatID: ObjectId(req.params.id)}, function(req, chat) {
            if(chat == null || chat == undefined)
                res.send({messages:[]});
            else
                res.send({messages:chat.messages});
    });
});

//get all messages of specific contact
router.get('/contact/:id', function(req, res, next) {
    chatRooms.findOne({$or: [{participants: [ObjectId(req.session.user._id), ObjectId(req.params.id)]}, {participants: [ObjectId(req.params.id), ObjectId(req.session.user._id)]}]}, function(err, chatRoom) {
            if(chatRoom == null || chatRoom === undefined) {
                res.send({messages:[]});
            } else {
                chatMessages.findOne({chatID: ObjectId(chatRoom._id)}, function(req, chat) {
                    if(chat == null || chat == undefined)
                        res.send({messages:[]});
                    else
                        res.send({messages:chat.messages});
                });
            }
    });
});

module.exports = router;