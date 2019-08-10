import $ from 'jquery';
import 'slick-carousel';

function updateSlideshowConfig(config) {
  if ('vertical' in config) {
    config.prevArrow = '<button class="slick-prev button secondary" aria-label="Previous" type="button"><i class="fas fa-chevron-up"></i><span class="show-for-sr">Previous</span></button>';
    config.nextArrow = '<button class="slick-next button secondary" aria-label="Next" type="button"><i class="fas fa-chevron-down"></i><span class="show-for-sr">Next</span></button>';
    config.verticalSwiping = true;
  }

  return config;
}

$('.slideshow').each(function(i) {
  let config = Object.assign({
    mobileFirst: true,
    infinite: false,
    prevArrow: '<button class="slick-prev" aria-label="Previous" type="button"><i class="fas fa-chevron-left"></i><span class="show-for-sr">Previous</span></button>',
    nextArrow: '<button class="slick-next" aria-label="Next" type="button"><i class="fas fa-chevron-right"></i><span class="show-for-sr">Next</span></button>',
    customPaging(slideshow, i) {
      return $('<button type="button" class="slick-dot button clear secondary small"><i class="fas fa-circle"></i><span class="show-for-sr">' + i + '</span></button>');
    },
    responsive: []
  }, $(this).data('slideshow-small') || {});

  let md = $(this).data('slideshow-medium');
  let lg = $(this).data('slideshow-large');

  if (md) config.responsive.push({ breakpoint: 640, settings: md });
  if (lg) config.responsive.push({ breakpoint: 1024, settings: lg });

  updateSlideshowConfig(config);
  config.responsive.forEach(breakpoint => updateSlideshowConfig(breakpoint.settings));

  $(this).slick(config);
});
