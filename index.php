<?php

	require_once './database/database.php';

?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,initial-scale=1">

	<title>Olyno | Portfolio</title>
	<meta name="description" content="Personnal Portfolio of Olyno">
	<meta name="theme-color" content="#586994">
	<meta property="og:title" content="Olyno Portfolio">
	<meta property="og:url" content="https://olyno.github.io/portfolio/">
	<meta property="og:description" content="My personnal portfolio.">
	<meta property="og:image" content="https://www.github.com/Olyno.png">
	<meta property="og:site_name" content="Olyno Portfolio">

	<link rel="icon" type="image/png" href="https://www.github.com/Olyno.png">
	<link rel="stylesheet" type="text/css" href="./build/global.css">
	<link rel="stylesheet" type="text/css" href="./build/bundle.css">
	<link rel="stylesheet" type="text/css" href="./styles/bulma.css">

	<script src="./utils.js"></script>
	<script defer src="./fontawesome.js"></script>
</head>

<body>

	<div class="columns">
		<div class="column is-1 is-secondary-bg is-sidebar is-hidden-mobile">
			<?php require_once('./components/sidebar.php') ?>
		</div>
		<div class="column is-primary-bg">
			<div id="home">
				<?php require_once('./views/home.php') ?>
			</div>
			<div id="me">
				<?php require_once('./views/me.php') ?>
			</div>
			<div id="projects">
				<!-- <?php require_once('./views/projects.php') ?> -->
			</div>
			<div id="contact">
				<?php require_once('./views/contact.php') ?>
			</div>
		</div>
	</div>

</body>
</html>
