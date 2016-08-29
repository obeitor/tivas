// JavaScript Document
  var width = $(window).width();
	var contacts_;//storing all contacts
  $(document).ready(function() {
	  if(width > 600){
		  $('.pad-me').css('padding-left','10%');//if not mobile phone, pad the view
		  $('.pad-me').css('padding-right','10%');
		  }
		  $('#scrolls').enscroll();//my scroller
		  $('.del').click(function(event){//delete button in view contact, gets the id assigned to it, which corresponds
		  //to the position of the contact in contact array
			  var id = event.target.id;
			  delContact(id);
		  });
		  $('.edit').click(function(){
			  var id = event.target.id;
			  sendContact(id);
			  })//calls the sendcontact function, gives him the editiing id
		  $('#add').click(function(){sendContact(0);});
		  $('.editMe').click(function(event){//gets the id just like delete button in form
			  var id = event.target.id;
			  editContact(id);
		  });
		  getContacts();//get al contacts
		  $('#scrolls').on("click",'.contact',function(event){//when an item on scrolling div, i.e a contact is selected
			  var id = event.target.id;
			  viewContact(id);});
	});
	
	function viewContact(id){//all items has id corresponding to position in contact array
		document.getElementById('c-name').innerHTML = contacts_[id].contact_name;//get the name from array
		var i;
		document.getElementById("errV").innerHTML = "";
		var number = contacts_[id].contact_no;//get all the numbers and emails, seperated with space
		var email = contacts_[id].contact_email;
		var t_numbers = number.split(" ");//split them by the space
		var emails = email.split(" ");
		var table = document.getElementById('table');//my table
		table.innerHTML = '';//empty
		for(i=0;i<t_numbers.length;i++){//add every telephone number to the table
			var row = document.createElement('tr');
			row.innerHTML = '<th>Telephone '+(i+1)+' :</th><td>'+t_numbers[i]+'</td>';
			table.appendChild(row);
		}
		for(i=0;i<emails.length;i++){//same
			var row = document.createElement('tr');
			row.innerHTML = '<th>Email '+(i+1)+' :</th><td>'+emails[i]+'</td>';
			table.appendChild(row);
		}
		$('.editMe').attr('id',id);//the edit button is given the id of the contact
		$('.del').attr('id',id);//same delete button
		$('#contact-view').show();//show the contact view 
		$("#formdiv").show();
	}
	function editContact(id){
		$('#contact-view').hide();//hide the contact view
		$('#contact').show();//show the contact form view
		$('.edit').show();$('#add').hide();//using the edit button instead of add used for new contact
		$('.edit').attr('id',contacts_[id].contact_id);//the edit button in the form page is also given
		var i;
		var number = contacts_[id].contact_no;
		var email = contacts_[id].contact_email;
		var t_numbers = number.split(" ");
		var emails = email.split(" ");
		for(i=1;i<t_numbers.length;i++)addTel();//create a textbox corresponding to every phone number owned by contact
		for(i=1;i<emails.length;i++)addEmail();//email too
		i=0;
		$('#name').val(contacts_[id].contact_name);
		$('.tel').each(function() {
			$(this).val(t_numbers[i]);//store the value as initial value in text box
			i++;
         });
		 i=0;
		$('.email').each(function() {
			$(this).val(emails[i]);
			i++;
         });
	}
	function delContact(id){
			$('#errV').css("color", "yellow");//my status
			document.getElementById("errV").innerHTML = "Deleting";
		var realId = contacts_[id].contact_id;//the database id
		var url = "http://www.efiwe.net/contacts.php?id="+realId;
			var req = new XMLHttpRequest();
			req.onreadystatechange = function(){
				if(req.readyState == 4 && req.status == 200){
					$('#errV').css("color", "green");setTimeout(closeForm, 3000);//done, close the form after like 3s
					document.getElementById("errV").innerHTML = "Deleted";//update status
					getContacts();//update contact list from db
				}
				else if(req.readyState == 4 && req.status!=200){
					$('#errV').css("color", "red");//just tell him failed to 
					document.getElementById("errV").innerHTML = "Failed";
				}
			}
        	req.open("POST", url, true);
			req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
        	req.send('p=DEL');//this posted value tells php u want to delete the contact
	}
	function addContact(){//just show the contact form
		$("#formdiv").show();
		$("#contact").show();
		$(".edit").hide();
		$('#add').show();//since its new, remove edit button
	}
	function closeForm(){//closes all opened forms
		$('#formdiv').hide();
		$('#contact').hide();
		$('#contact-view').hide();
	}
	function getContacts(){
		var holder = document.getElementById('scrolls');//the scroll view parent
		while(holder.lastChild){//remove all listed contacts
			holder.removeChild(holder.lastChild);
		}
		var req = new XMLHttpRequest();
		var url = "http://www.efiwe.net/contacts.php";
		var i;
		req.onreadystatechange = function() {
    		if (req.readyState == 4 && req.status == 200) {
        		contacts_ = JSON.parse(req.responseText);
        		for(i=0;i<contacts_.length;i++){
					var child = document.createElement('div');
					child.setAttribute('class','contact well-sm well');
					child.setAttribute('id',i);
					var content = document.createTextNode(contacts_[i].contact_name);
					child.appendChild(content);
					holder.appendChild(child);
				}
    		}
			else if(req.readyState == 4 && req.status == 201){
				var content = document.createTextNode("No Contact");//just write no contact
				holder.appendChild(content);
			}
		};
		req.open("GET", url, true);
		req.send();
	}
	function searchContact(){
		var s = $('#searchbx').val();//get the user input
		var holder = document.getElementById('scrolls');
		var i ;var j;
		while(holder.lastChild){//clear all contacts
				holder.removeChild(holder.lastChild);
			}
			var len = s.length;
		if(s.length != 0){//as long as their is an entry
			for(i=0;i<contacts_.length;i++){
				var names = contacts_[i].contact_name.split(" ");//get the various names separately
				var matches = false;//to check if any name matches
				for(j=0;j<names.length;j++){//browse thrue individual names of a contact
					var c = names[j].substring(0,len);
					if(c.toUpperCase() === s.toUpperCase()){matches = true;}//once one matches, true
				}
				if(matches){//add the contact that matches to the view
					var child = document.createElement('div');
					child.setAttribute('class','contact well-sm well');
					child.setAttribute('id',contacts_[i].contact_id);
					var content = document.createTextNode(contacts_[i].contact_name);
					child.appendChild(content);
					holder.appendChild(child);
				}
			}
		}
	}
	function clrSearch(){
		$('#searchbx').val('');//clears search boz
		var holder = document.getElementById('scrolls');
		while(holder.lastChild){
			holder.removeChild(holder.lastChild);//clears all listed
		}
		for(i=0;i<contacts_.length;i++){//relists all contacts
				var child = document.createElement('div');
					child.setAttribute('class','contact well-sm well');
					child.setAttribute('id',contacts_[i].contact_id);
					var content = document.createTextNode(contacts_[i].contact_name);
					child.appendChild(content);
					holder.appendChild(child);
			}
	}
	var tel = 1;var email = 1;//holds nummber of telphone input or email input
	var moreEM = document.getElementById('moreEm');
	var parEM = document.getElementById('em');
	function addTel(){
		var moreHP = document.getElementById('moreHp');//the button to add new input for phone
		var parentHP = document.getElementById('hp')//the formgroup for phones
		if(tel<3){//max is three
		tel++;//creates a new input and labels it
		var newTel = document.createElement('label');
		var newTelLabel = document.createTextNode("Tel No "+tel+":");
		var newTB = document.createElement('input');newTB.setAttribute("class","form-control tel");
		newTB.setAttribute("type","text");newTB.setAttribute("placeholder","Tel No "+tel+":")
		newTB.setAttribute("id","tel["+tel+"]");
		newTel.appendChild(newTelLabel);
		parentHP.insertBefore(newTel,moreHP);parentHP.insertBefore(newTB,moreHP);
		}if(tel==3){//when u have 3, hide the more button
			$('#moreHp').hide();
		}
	}
	function addEmail(){//same as telephone
		var moreEM = document.getElementById('moreEm');
		var parentEM = document.getElementById('em')
		if(email<3){
		email++;
		var newEm = document.createElement('label');
		var newEmLabel = document.createTextNode("Email "+email+":");
		var newTB = document.createElement('input');newTB.setAttribute("class","form-control email");
		newTB.setAttribute("type","text");newTB.setAttribute("placeholder","Email "+email+":")
		newEm.appendChild(newEmLabel);
		parentEM.insertBefore(newEm,moreEM);parentEM.insertBefore(newTB,moreEM);
		}if(email==3){
			$('#moreEm').hide();
		}
	}
	function sendContact(id){//sends details of new or edited contact
		var url;
		if(id == 0){url = "http://www.efiwe.net/contacts.php";}//new contact
		else{
			url = "http://www.efiwe.net/contacts.php?id="+id;}//edit contact
		var error = "ERROR: ";
		var erMail = "";var erTel = "";
		var allGood = true;
		var emailEntry = "";
		$('.email').each(function() {//check validity first// no space especially since thats used to separate two emails
			if(!isEmail($(this).val())){erMail="Invalid-Email ";allGood = false;
			}
			else{
           		emailEntry +=  $(this).val() + " ";
		   }
         });
		 var numEntry = "";
		 $('.tel').each(function() {
            if(!isNumber($(this).val())){
				erTel="Invalid-TelNo ";allGood = false;
				}
				else{
					numEntry += $(this).val() + " ";
				}
        });
		var nameEntry = $("#name").val();//cant have an empty string, NB tel and email can
		if(nameEntry == ""){error+="Invalid-Name ";allGood = false;}
		if(allGood)//all good so send it
		{
			$('#error').css("color", "yellow");
			document.getElementById("error").innerHTML = "Saving";
			var req = new XMLHttpRequest();
			req.onreadystatechange = function(){
				if(req.readyState == 4 && req.status == 200){
					$('#error').css("color", "green");setTimeout(closeForm, 3000);
					document.getElementById("error").innerHTML = "Saved";getContacts();//reopen new version of list
					setTimeout(clearForm,3000);
				}
				else if(req.readyState == 4 && req.status!=200){
					$('#error').css("color", "red");
					document.getElementById("error").innerHTML = "Failed";
				}
			}
        	req.open("POST", url, true);
			req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
        	req.send('name='+nameEntry+"&tel="+numEntry+"&email="+emailEntry);
		}
		else{//if all was not good with user entry
			error += erTel + erMail;
			$('#error').css("color", "red").val(error);
			document.getElementById("error").innerHTML = error;
		}
	}
	function clearForm(){//clears form after every edit or add
		$('#name').val('');
		$('.tel').remove();//all inputs for telephone removed
		$('.email').remove();//emails too
		$('#moreEm').show();$('#moreHp').show();//show the more buttons if they were removed
			document.getElementById("error").innerHTML = "";//clear the error space
			tel = 0; email = 0;//reset the input counters
			addTel();addEmail();//add one each
	}
	function isEmail(email){
		var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
		if (filter.test(email) || email == '') {
			return true;
		}
		return false;
	}
	function isNumber(number){
		return number.match(/^[0-9]*$/) && (number.length >= 10 || number == '');
	}
			