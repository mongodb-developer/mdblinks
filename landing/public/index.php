<?php
  error_reporting(E_ERROR | E_PARSE);
  $url = $_ENV["API_URL"] . "/landings" . $_SERVER['REQUEST_URI'];
  $contents = file_get_contents($url);
  $decoded = json_decode($contents);
  if($decoded->redirectTo) {
    header("Location: " . $decoded->redirectTo);
    die();
  }
?>
<!doctype html>
<html lang="en">
<script>
  <?php
  if ($decoded->title) {
    echo "window.landingData = " . $contents;
  }
  ?>
</script>

<head>
  <meta charset="utf-8" />
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="<?= $decoded->summary ?>" />
  <link rel="apple-touch-icon" href="/logo192.png" />
  <link rel="manifest" href="/manifest.json" />
  <title><?= $decoded->title ?></title>
</head>

<body><noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>

</html>