<style>
    .project-card {
        color: white;
        margin: auto;
        border-radius: 50px;
        background-color: #586994;
        /* box-shadow: 0px -15px 40px #4b597e, 15px 15px 40px #6579aa */
    }
    .project-card-icon {
        width: 25px;
        height: 25px;
    }
    .card-footer, .card-footer-item { 
        border: none !important;
    }
    /* .modal-card-head { border-bottom: none !important; } */
    .modal-card-foot { border-top: none !important; }
    .modal-content {
        color: white;
        overflow-wrap: break-word;
    }
    .is-rounded {
        border-radius: 50%;
    }
</style>

<?php

    function projectCard($project) {
        $query = 'SELECT * FROM project_links WHERE name = ' . $project['name'];
        $stmt = $pdo -> prepare($query);
        $links = $stmt -> fetchAll(PDO::FETCH_ASSOC);
        $render = '
            <div class="card project-card animate pulse">
                <div class="card-content">
                    <div class="media">
                        <div class="media-left">
                            <figure class="image is-48x48">
                                <img
                                    src=""
                                    alt="Project Logo"
                                />
                            </figure>
                        </div>
                        <div class="media-content">
                            <p class="title is-4 is-secondary">{project.title}</p>
                        </div>
                    </div>
                    <div class="content">
                        <p>{project.description}</p>
                    </div>
                </div>
                <footer class="card-footer">
                    <div class="card-footer-item">
                        <AnimatedButton animation="tada" on:click={() => modalIsVisible = true}>
                            <i class="project-card-icon is-secondary fas fa-info-circle"></i>
                        </AnimatedButton>
                    </div>';
                    foreach ($links as $link) {
                        $render += '
                            <div class="card-footer-item">' .
                                $link['type'] === 'website' ? '<i class="project-card-icon is-secondary fas fa-external-link-alt"></i>'
                                    : '<i class="project-card-icon is-secondary fab fa-github"></i>'
                            . '</div>
                        ';
                    }
            $render += '
                </footer>
            </div>
        ';
        echo $render;
    }

?>