<?php

$contactsData = array();
$contactsDataFile = dirname(dirname(__FILE__))
	.DIRECTORY_SEPARATOR."data"
	.DIRECTORY_SEPARATOR."contacts.json";

$contactsDescriptor = new DataDescriptor();
$contactsDescriptor->type = "Contact";
$contactsDescriptor->data = &$contactsData;
$contactsDescriptor->dataFile = $contactsDataFile;	

class Contact
{
	public $id;
	public $name;
	public $surname;
	public $address;
	public $phone;
}
?>