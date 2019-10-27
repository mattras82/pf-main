<?php while (have_posts()) : the_post() ?>
<div class="hero hero--full flex-row align-middle">
    <div class="hero__content">
        <div class="grid-container margin-top-1">
            <h1 class="type-it"><?php the_title() ?><br>{</h1>
            <div class="margin-left-2">
                <div class="type-it type-it--after type-it--fade-left" data-type-it-delay="500">
                    <?php the_content() ?>
                </div>
            </div>
            <p class="h1 type-it">}</p>
        </div>
    </div>
</div>
<?php endwhile;