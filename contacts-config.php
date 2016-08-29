<?php
header('Access-Control-Allow-Origin: *');
$myurl = "www.efiwe.net/contacts.php";
$conn = new MySQLi('mysql1.000webhost.com','a6586663_users','a5s2ee21','a6586663_efiwe');
if ($conn->connect_error) {
    header('Internal Server Error', true, 500);//error server error to connect
}
else{
	if((isset($_GET["id"]))||($_GET["id"] != '')){
		$cid = htmlspecialchars($_GET["id"]);
		if($_SERVER['REQUEST_METHOD'] == 'POST'){
			if((isset($_POST["name"]))&&(isset($_POST["tel"]))&&(isset($_POST["email"]))&&(!$_POST["name"] == '')){
				$name = trim(htmlspecialchars($_POST["name"]));
				$tel = trim(htmlspecialchars($_POST["tel"]));
				$email = trim(htmlspecialchars($_POST["email"]));
				//make sure all were sent, and name must contain something at least
				$sql = "UPDATE contacts SET contact_name = '".$name."', contact_no = '".$tel."', contact_email = '".$email.
				"' WHERE contact_id = '".$cid."'";
				if($conn->query($sql) === FALSE){header('Server Error', true,500);}
				else{header('Successful',true,200);}//was successful
			}
			else if((isset($_POST["p"]))&&($_POST["p"] == 'DEL')){
				$sql = "DELETE FROM contacts WHERE contact_id = '".$cid."'";
				if($conn->query($sql) === FALSE){}
				else{header('Successful',true,200);}//was successful
			}
			else{
				header('Failed',true,401);
			}
			//do post for editing since id is available	
		}
		else{
			$sql = "SELECT * FROM contacts WHERE contact_id = '".$cid."' LIMIT 1";
			$rs = $conn->query($sql);
			if($rs === FALSE){header('Internal Server Error',true,500);}
			else if($rs->num_rows == 1){
				echo json_encode($rs->fetch_assoc());
			}
			else{
				header('Non-valid ID',true,400);
			}
		}
	}
	else{
		if($_SERVER['REQUEST_METHOD'] == 'POST'){//then adding a new contact
			if((isset($_POST["name"]))||(isset($_POST["tel"]))||(isset($_POST["email"]))||(!$_POST["name"] == '')){
				$name = trim(htmlspecialchars($_POST["name"]));
				$tel = trim(htmlspecialchars($_POST["tel"]));
				$email = trim(htmlspecialchars($_POST["email"]));
				$sql = "INSERT INTO contacts (contact_name, contact_no, contact_email) VALUES ('".$name."', '".$tel.
				"', '".$email."')";
				if($conn->query($sql) === FALSE){header('Server Error', true,500);}
				else{header('Successful',true,200);}//was successful 
			}
			else{
				header('Faileed',true,401);
			}
		}
		else{//getting all the contacts
			$contacts = array();
			$sql = "SELECT * FROM contacts ORDER BY contact_name ASC";
			$rs = $conn->query($sql);
			if($rs === FALSE){header('Internal Server Error',true,500);}
			else if($rs->num_rows <1){
				header('No Contact In Book',true,201);
			}
			else{
				while($row = $rs->fetch_assoc()){
					$row["url"] = $myurl."?id=".$row["id"];
					array_push($contacts, $row);
				}echo json_encode($contacts);
			}
		}
	}
}
?>