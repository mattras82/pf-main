import $ from 'jquery';

// FOUNDATION
// ========================================
import {
  Core as Foundation,
  // Abide,
  // Accordion,
  AccordionMenu,
  // Drilldown,
  // Dropdown,
  DropdownMenu,
  // Equalizer,
  // Interchange,
  // Magellan,
  OffCanvas,
  // Orbit,
  // ResponsiveMenu,
  // ResponsiveToggle,
  // Reveal,
  // Slider,
  // SmoothScroll,
  // Sticky,
  // Tabs,
  // Toggler,
  // Tooltip,
  // ResponsiveAccordionTabs,
} from 'foundation-sites';

Foundation.addToJquery($);

// JQUERY MASK
// ========================================
import 'jquery-mask-plugin';

// CUSTOM
// ========================================
import './frontend/slick-carousel';
import './frontend/lazy-images';
import pwa from './frontend/pwa';
import './frontend/component-loader';

$(document).ready(function() {
  // FOUNDATION
  $(document).foundation();

  // JQUERY MASK
  $.jMaskGlobals.translation[2] = { pattern: /[2-9]/, recursive: true };
  $('.wpcf7-tel').mask('(200) 000-0000');

  //Initialize Progressive Web App support
  pwa.init();
});
