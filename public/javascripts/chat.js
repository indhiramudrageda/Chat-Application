var socket = io.connect('http://localhost:3001/');
var activeChat = {};

function sendMessage() {
    var message = $('#message').val();
    socket.emit('send-message', {message:message, to:activeChat.participantID, from: $('#loggedInUser').val(), chatID: activeChat.chatID, socketID:socket.id});
    var messageDiv = document.createElement('div');
    messageDiv.classList.add("message");
    messageDiv.classList.add("self");
    var messageBodyDiv = document.createElement('div');
    messageBodyDiv.classList.add("message-inner-body");
    messageBodyDiv.textContent = message;

    messageDiv.append(messageBodyDiv);
    $('.messages').append(messageDiv);
    $('#message').val('');
    
    //scroll to bottom
    var elmnt = document.getElementsByClassName("message");
    elmnt[elmnt.length-1].scrollIntoView();
}

function openChat(chatRoomStr) {
	var chatRoom = JSON.parse(chatRoomStr);
	activeChat = chatRoom;
    $('.messages').html('');
    $('.message-header').html('');

	$.ajax({
            type: "GET",
            url: "/chats/"+chatRoom.chatID,
            success: function (data) {
                var messageHeader = document.createElement('div');
                messageHeader.classList.add("message-header-inner");
                messageHeader.textContent = chatRoom.participantFName+' '+chatRoom.participantLName;
            	$('.message-header').append(messageHeader);

            	data.messages.forEach(function(messageObj) {
            		var messageDiv = document.createElement('div');
                    messageDiv.classList.add("message");
                    if(messageObj.from == $('#loggedInUser').val())
                        messageDiv.classList.add("self");

                    var messageBodyDiv = document.createElement('div');
                    messageBodyDiv.classList.add("message-inner-body");
					messageBodyDiv.textContent = messageObj.message;

                    var messageFooterDiv = document.createElement('div');
                    messageFooterDiv.classList.add("message-inner-footer");
                    var formattedDate = messageObj.createDate.split("T")[0] + " " + messageObj.createDate.split("T")[1].substring(0, 5);
                    messageFooterDiv.textContent = formattedDate;

                    messageDiv.append(messageBodyDiv);
                    messageDiv.append(messageFooterDiv);
					$('.messages').append(messageDiv);
            	});
                $('.message-body').css('display', 'block');
                $('.landing').css('display', 'none');
                //scroll to bottom
                var elmnt = document.getElementsByClassName("message");
                elmnt[elmnt.length-1].scrollIntoView();
            }
    });
}

function openChatWithoutRoomID(contactStr) {
    var contact = JSON.parse(contactStr);
    activeChat = contact;
    $('.messages').html('');
    $('.message-header').html('');
    $.ajax({
            type: "GET",
            url: "/chats/contact/"+contact.participantID,
            success: function (data) {
                var messageHeader = document.createElement('div');
                messageHeader.classList.add("message-header-inner");
                messageHeader.textContent = contact.participantFName+' '+contact.participantLName;
                $('.message-header').append(messageHeader);

                data.messages.forEach(function(messageObj) {
                    var messageDiv = document.createElement('div');
                    messageDiv.classList.add("message");
                    if(messageObj.from == $('#loggedInUser').val())
                        messageDiv.classList.add("self");

                    var messageBodyDiv = document.createElement('div');
                    messageBodyDiv.classList.add("message-inner-body");
                    messageBodyDiv.textContent = messageObj.message;

                    var messageFooterDiv = document.createElement('div');
                    messageFooterDiv.classList.add("message-inner-footer");
                    var formattedDate = messageObj.createDate.split("T")[0] + " " + messageObj.createDate.split("T")[1].substring(0, 5);
                    messageFooterDiv.textContent = formattedDate;

                    messageDiv.append(messageBodyDiv);
                    messageDiv.append(messageFooterDiv);
                    $('.messages').append(messageDiv);
                });
                $('.message-body').css('display', 'block');
                $('.landing').css('display', 'none');
                //scroll to bottom
                var elmnt = document.getElementsByClassName("message");
                if(elmnt.length > 0)
                    elmnt[elmnt.length-1].scrollIntoView();
            }
    });
}

socket.on( 'connect', function() {
	socket.emit('set-socket-ID', {socketID: socket.id, userID: $('#loggedInUser').val()});
});

socket.on('get-message', function(message) {
	var messageDiv = document.createElement('div');
    messageDiv.classList.add("message");
    var messageBodyDiv = document.createElement('div');
    messageBodyDiv.classList.add("message-inner-body");
    messageBodyDiv.textContent = message;

    messageDiv.append(messageBodyDiv);
    $('.messages').append(messageDiv);

    //scroll to bottom
    var elmnt = document.getElementsByClassName("message");
    elmnt[elmnt.length-1].scrollIntoView();
});


function showContactDialog() {
    var modal = $('#myCreateModal');
    modal.css('display', 'block');
    var desc = $('#add-contact').html();
    modal.children("#create-modal-content").html(desc);
    var span = document.getElementsByClassName("create-close")[0];
    span.onclick = function() { 
        modal.css('display', 'none');
    }
}

function addContact() {
    var data = {participantEmail : $('#participantEmail').val()};
    $('#error-message-add-contact').text('');
    if($('#participantEmail').val() == '') {
            $('#error-message-add-contact').text('Enter valid user email ID');
    } else {
        $("#btnSubmit").prop("disabled", true);
        $.ajax({
            type: "POST",
            url: "/contacts",
            data: data,
            timeout: 600000,
            success: function (data) {
                $("#btnSubmit").prop("disabled", false);
                if(data.success) {
                    $('#myCreateModal').hide();
                    location.reload(true);
                    $('#error-message-add-contact').text('');
                } else {
                    $('#error-message-add-contact').text(data.error);
                }
            }
        });
    }
}

function showContacts() {
    $('.contacts-container-inner').css('display','block');
    $('.chatRooms-container-inner').css('display','none');
    
}

function showActionsMenu() {
    var modal = $('.profile-actions-menu');
    document.getElementsByClassName("profile-actions-menu")[0].classList.toggle("show")
}

window.onclick = function(event) {
  if (!event.target.matches('.menuBtn')) {
    var dropdowns = document.getElementsByClassName("profile-actions-menu");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

