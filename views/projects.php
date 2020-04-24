<?php

    require '../components/project_card.php';

    $query = "SELECT * FROM projects";
    $stmt = $pdo -> prepare($query);
    $stmt -> execute([]);
    $projects = $stmt -> fetchAll(PDO::FETCH_ASSOC);

    echo var_dump($projects);

?>

<div class="section">
    <h1 class="title is-secondary">My Projects</h1>
</div>

<div class="section">
    <div class="columns is-multiline is-centered">
        <?php foreach ($projects as $project) { ?>
            <div class="column is-4" data-aos="fade-down" data-aos-duration="2000" data-aos-delay="{id}50">
                <?php projectCard($project) ?>
            </div>
        <?php } ?>
        <div class="column is-4 has-text-centered is-vcentered" data-aos="fade-down" data-aos-duration="2000" data-aos-delay="250">
            <a href="https://www.github.com/Olyno" class="is-secondary-bg button animate pulse">See more projects</a>
        </div>
    </div>
</div>