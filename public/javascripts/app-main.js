function validateLogin() {
  	if (!$('#Email').val().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
  		$('.Email-error-message').css('display','inline');
  		$('.Email-error-message').text('Email is not valid');
		return false;
	}
	return true;
}

function validateSignup() {
  	if (!$('#Email').val().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
  		$('.Email-error-message').css('display','inline');
  		$('.Email-error-message').text('Email is not valid');
		  return false;
	 } 
   if ($('#FirstName').val() == '') {
      $('.FirstName-error-message').css('display','inline');
      $('.FirstName-error-message').text('FirstName is mandatory');
    return false;
  }
  if ($('#LastName').val() == '') {
      $('.LastName-error-message').css('display','inline');
      $('.LastName-error-message').text('LastName is mandatory');
    return false;
  }
  if ($('#Phone').val() == '') {
      $('.Phone-error-message').css('display','inline');
      $('.Phone-error-message').text('Phone is mandatory');
    return false;
  }
  if ($('#Address').val() == '') {
      $('.Address-error-message').css('display','inline');
      $('.Address-error-message').text('Address is mandatory');
    return false;
  }
  if ($('#Password').val() == '') {
      $('.Password-error-message').css('display','inline');
      $('.Password-error-message').text('Address is mandatory');
    return false;
  }
}

async function validateEmail(argument) {
  if($('#Email').val() == '')
    return;
  const result = await $.ajax({
      url: '/signup/'+$('#Email').val(),
      type: 'GET' 
  });
  console.log(result);
  if(result.success) {
        $('.Email-error-message').css('display','inline');
        $('.Email-error-message').text('An account already exists with this email!');
  } else {
        $('.Email-error-message').css('display','none');
        $('.Email-error-message').text('');
  }
}

function validatePassword() {
	var pswd = $('#Password').val();
	if ( pswd.length < 8 ) {
    	$('#length').removeClass('valid').addClass('invalid');
	} else {
    	$('#length').removeClass('invalid').addClass('valid');
	}

	if ( pswd.match(/[a-z]/) ) {
    	$('#lowercase').removeClass('invalid').addClass('valid');
	} else {
    	$('#lowercase').removeClass('valid').addClass('invalid');
	}

	if ( pswd.match(/[A-Z]/) ) {
    	$('#uppercase').removeClass('invalid').addClass('valid');
	} else {
    	$('#uppercase').removeClass('valid').addClass('invalid');
	}

	//validate number
	if ( pswd.match(/\d/) ) {
    	$('#number').removeClass('invalid').addClass('valid');
	} else {
    	$('#number').removeClass('valid').addClass('invalid');
	}
}







