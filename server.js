const io = require('socket.io') (3001);
var monk = require('monk');
const {ObjectId} = require('mongodb');
var db = monk('localhost:27017/ChatApp');
var chatRooms = db.get('chatRooms');
var chatMessages = db.get('chatMessages');
var users = {};

io.on('connection', (socket) => {
    socket.join(socket.id);

    socket.on('send-message', function(data){
      if(data.chatID == null || data.chatID === undefined || data.chatID == "") {
          //check first if chat room is already created. If so donot create a new one.
          chatRooms.findOne({$or: [{participants: [ObjectId(data.from), ObjectId(data.to)]}, {participants: [ObjectId(data.to), ObjectId(data.from)]}]}, function(err, chatRoom) {
                if(chatRoom == null || chatRoom === undefined) {
                        chatRooms.insert({
                            participants: [ObjectId(data.from), ObjectId(data.to)],
                            createDate: new Date(Date.now())
                        }, function(err, newRoom){
                            chatMessages.update(
                                { chatID: ObjectId(newRoom._id) }, 
                                { $push: { messages: {message: data.message, to: ObjectId(data.to), from: ObjectId(data.from), createDate: new Date(Date.now())}}}, 
                                { upsert: true }, function(err, result) {
                                      console.log('send');
                                      socket.to(users[data.to]).emit('get-message', data.message);
                            });
                        });
                } else {
                        chatMessages.update(
                            { chatID: ObjectId(chatRoom._id) }, 
                            { $push: { messages: {message: data.message, to: ObjectId(data.to), from: ObjectId(data.from), createDate: new Date(Date.now())}}}, 
                            { upsert: true }, function(err, result) {
                                  console.log('send');
                                  socket.to(users[data.to]).emit('get-message', data.message);
                        });
                }
          });
      } else {
    	    chatMessages.update(
              { chatID: ObjectId(data.chatID) }, 
           	  { $push: { messages: {message: data.message, to: ObjectId(data.to), from: ObjectId(data.from), createDate: new Date(Date.now())}}}, 
           	  { upsert: true }, function(err, result) {
           		   socket.to(users[data.to]).emit('get-message', data.message);
          });
      }
    });

    socket.on('set-socket-ID', function(data) {
		users[data.userID] = data.socketID;
    });
});