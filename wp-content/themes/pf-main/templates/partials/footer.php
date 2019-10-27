<footer class="footer">
    <?php if (false) : ?>
    <div class="grid-container">
        <div class="grid-x grid-margin-x grid-padding-y">
            <?php for ($i = 1; $i <= 4; $i++) : ?>
                <div class="cell medium-auto">
                    <?php dynamic_sidebar("footer-{$i}"); ?>
                    <?php if ($i === 4) { pf_partial('social'); } ?>
                </div>
            <?php endfor; ?>
        </div>
    </div>
    <?php endif ?>
    <div class="footer__copyright grid-container">
        <div class="grid-x grid-margin-x grid-padding-y text-center">
            <div class="cell">
                <p>&copy; <?php echo Date('Y'); ?> <a href="<?php home_url(); ?>"><?= bloginfo('name'); ?>, LLC</a></p>
            </div>
        </div>
    </div>
</footer>
<a href="#" id="add2home" class="button primary small">Add Site To Homescreen</a>