<?php if (false) : ?>
<header class="header" role="banner">
  <div class="grid-container">
    <div class="grid-x grid-padding-x align-middle">
      <div class="header__off-canvas-menu-toggle cell shrink position-absolute medium-position-static hide-for-large">
        <button type="button" data-toggle="off-canvas-menu">
          <i class="fas fa-bars"></i>
          <span class="show-for-sr">Menu</span>
        </button>
      </div>
      <div class="header__logo cell medium-shrink text-center">
        <a href="<?php echo home_url(); ?>" title="<?php bloginfo('name') ?>">
          <img src="<?php pf_option('header.logo') ?>" alt="<?php bloginfo('name') ?>">
          <span class="show-for-sr"><?php bloginfo('name'); ?></span>
        </a>
      </div>
      <div class="header__navigation cell show-for-large shrink">
        <?php
        if ( has_nav_menu( 'top-bar' ) ) {
          wp_nav_menu([
            'container'         => 'nav',
            'menu_class'        => 'dropdown menu',
            'theme_location'    => 'top-bar',
            'depth'             => 5,
            'walker'            => new \PublicFunction\Walkers\TopBarMenu(),
            'items_wrap'        => '<ul id="%1$s" class="%2$s" data-dropdown-menu>%3$s</ul>'
          ]);
        }
        ?>
      </div>
      <div class="header__search-form cell show-for-medium shrink">
        <?php get_search_form() ?>
      </div>
    </div>
  </div>
</header>
<?php endif;