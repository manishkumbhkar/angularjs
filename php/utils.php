<?php

/************************************************/
/******** DATA STORAGE HELPERS ******************/
/************************************************/
class DataDescriptor
{
	public $data;
	public $dataFile;
	public $type;
}

function build_from_generic($dd,$object,$merge=null)
{
	$result = $merge==null?eval("return new ".$dd->type."();"):$merge;
	foreach(get_class_vars($dd->type) as $var =>$data){
		if(strlen($var)>0){
			if(is_array($object) && isset($object[$var])){
				$dt = $object[$var];
				$result->$var=$dt;
			}else if(!is_array($object)){
				$result->$var=$object->$var;
			}
		}
	}
	return $result;
}

function generate_guid()
{
    if (function_exists('com_create_guid') === true)
    {
        return trim(com_create_guid(), '{}');
    }

    return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
}

function load_data_file($dd)
{	
	if(!file_exists($dd->dataFile)){
		$toWrite = "[]";
		file_put_contents($dd->dataFile,$toWrite);
	}
	$toRead = file_get_contents($dd->dataFile);
	$tmpData = json_decode($toRead);
	$keys = array();
	foreach($dd->data as $k=>$v)$keys[]=$k;
	foreach($keys as $k)unset($dd->data[$k]);
	
	foreach($tmpData as $item){
		$dd->data[$item->id] = $item;
	}
}

function persist_data_file($dd)
{
	$writeData = array();
	foreach($dd->data as $item=>$val){
		$writeData[] = $val;
	}
	$toWrite = json_encode($writeData);
	file_put_contents($dd->dataFile,$toWrite);
}

function get_request_data()
{
	$requestData=array();
	foreach($_GET as $k=>$v) $requestData[strtolower($k)]=$v;
	foreach($_POST as $k=>$v) $requestData[strtolower($k)]=$v;
	$requestData["method"] = strtoupper($_SERVER['REQUEST_METHOD']);
	if(isset($requestData["request_method"])){
		$requestData["method"] = strtoupper($requestData["request_method"]);
	}
	if ($requestData["method"] == 'POST' || $requestData["method"] == 'PUT'){
		$requestData["json"] = json_decode(file_get_contents('php://input'), true);
	}
	return $requestData;
}

function build_json_error($exception)
{
	return '{"result":"ko","data":{"text":"'. $exception->getMessage() .'"}}';
}

function build_json_success($object)
{
	return '{"result":"ok","data":'. json_encode($object) .'}';
}

function execute($dd)
{
	try{
		header('Content-Type: application/json');
		$data = get_request_data();
		switch($data["method"]){
			case "GET":
				if(isset($data["id"]))echo get_item_by_id($dd,$data["id"]);
				else echo get_all_items($dd);
				break;
			case "POST":
				echo save_item($dd,$data["json"]);
				break;
			case "PUT":
				echo update_item($dd,$data["id"],$data["json"]);
				break;
			case "DELETE":
				echo delete_item($dd,$data["id"]);
				break;
			default:
				header('HTTP/1.0 405 Method not allowed');
				break;
		}
	}catch(Exception $ex){
		header('HTTP/1.0 500 Internal error');
	}
}

function delete_item($dd,$id)
{
	load_data_file($dd);
	
	try {
		if(!isset($dd->data[$id])) throw new Exception("Missing item with id: '$id'.");
		unset($dd->data[$id]);
		persist_data_file($dd);
		return build_json_success(null);
	} catch(Exception $e) {
		return build_json_error($e);
	}
}

function get_item_by_id($dd,$id)
{
	load_data_file($dd);
	
	try {
		if(!isset($dd->data[$id])) throw new Exception("Missing item with id: '$id'.");
		return build_json_success($dd->data[$id]);
	} catch(Exception $e) {
		return build_json_error($e);
	}
}

function get_all_items($dd)
{
	load_data_file($dd);
	
	try {
		$real = array();
		foreach($dd->data as $k=>$v){
			$real[]=$v;
		}
		return build_json_success($real);
	} catch(Exception $e) {
		return build_json_error($e);
	}
}

function save_item($dd,$object)
{	
	load_data_file($dd);
	try {
		$newObject = build_from_generic($dd,$object);
		$newObject->id = generate_guid();
		$dd->data[$newObject->id] = $newObject;
		persist_data_file($dd);
		return build_json_success($newObject);
	} catch(Exception $e) {
		return build_json_error($e);
	}
}

function update_item($dd,$id,$object) 
{
	load_data_file($dd);
	
	try {
		if(!isset($dd->data[$id])) throw new Exception("Missing item with id: '$id'.");
		$previousObject = $dd->data[$id];
		$dd->data[$previousObject->id] = build_from_generic($dd,$object,$previousObject);
		persist_data_file($dd);
		return build_json_success($object);
	} catch(Exception $e) {
		return build_json_error($e);
	}
}

/************************************************/
/********* OTHER UTILITIES **********************/
/************************************************/
function ends_with($haystack, $needle)
{
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}

function get_current_url() 
{
	$protocol = 'http';
	if ($_SERVER['SERVER_PORT'] == 443 || (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on')) {
		$protocol .= 's';
		$protocol_port = $_SERVER['SERVER_PORT'];
	} else {
		$protocol_port = 80;
	}

	$host = $_SERVER['HTTP_HOST'];
	$port = $_SERVER['SERVER_PORT'];
	$request = $_SERVER['PHP_SELF'];
	$query = isset($_SERVER['argv']) ? substr($_SERVER['argv'][0], strpos($_SERVER['argv'][0], ';') + 1) : '';
	$port = $port == $protocol_port ? '' : ':' . $port;
	$query = empty($query) ? '' : '?' . $query;
	
	if(!ends_with($host,$port)) $host = $host.$port;
	
	$toret = $protocol.'://'.$host.$request.$query;
	
	return $toret;
}

function send_data($verb,$url,$data=null)
{
	$url = dirname(dirname(get_current_url())).$url;
	//echo $url."<br>";
	$data_string = "";
	if($data!=null){
		$data_string = json_encode($data);
	}
	
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $verb);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	
	if($data!=null){
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
			'Content-Type: application/json',
			'Content-Length: ' . strlen($data_string)));
	}
	$response = curl_exec($ch);
	$error = curl_error($ch);
	$result = array( 'body' => '','curl_error' => '','http_code' => '','last_url' => '');
		 
	if ( $error != "" ){
		$result['curl_error'] = $error;
		return $result['curl_error']."\n<br>".$response;
	}

	$result['body'] = $response;
	$result['http_code'] = curl_getinfo($ch,CURLINFO_HTTP_CODE);
	$result['last_url'] = curl_getinfo($ch,CURLINFO_EFFECTIVE_URL);
	//print_r($result);
	//echo "=================";
	return json_decode($result['body']);
}
?>