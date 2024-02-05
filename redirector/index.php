<?
$apiUrl = $_ENV["API_URL"];
$url = $apiUrl . "/routes/redirect?route=" . $_SERVER['REQUEST_URI'];

$requestData = [
  "remoteIPAddress" => $_SERVER['REMOTE_ADDR'],
  "webhookUrl" => $_SERVER['REQUEST_URI'],
  "rawQueryString" => $_SERVER['QUERY_STRING'],
  "httpMethod" => $_SERVER['REQUEST_METHOD'],
  "requestHeaders" => getallheaders(),
  "service" => "REDIRECTOR",
  "action" => "redirect",
  "originalReferrer" => isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : null
];

// Send a POST request to the $url with the $requestData in the body
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

// $contents = file_get_contents($url);
$route = json_decode($response);


if(!is_array($route) && $route->to) {
  header('Location: '.$route->to);
  exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="author" content="Joel Lord">
  <meta name="image" content="https://www.mongodb.com/docs/assets/meta_generic.png">

  <title>MDB.link redirector</title>
</head>

<body id="page-top" style="">

  <h1>Uh oh, that URL was not found</h1>
  <p>Did you mean to visit any of these sites?</p>
  <ul id="routeList">
    <?php
      for ($i = 0; $i < count($route); $i++) {
        echo "<li><a href='".$route[$i]->route."'>".$route[$i]->title."</a></li>";
      }
    ?>
  </ul>
  <p>If you were trying to reach one of the landing pages, you can check out the list at <a href="http://landing.mdb.link">landing.mdb.link</a></p>
</body>

</html>
