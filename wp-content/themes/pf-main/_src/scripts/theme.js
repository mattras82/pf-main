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
import TypeIt from './frontend/type-it';
import ImgMove from './frontend/img-move';

let modules = [];

modules.push(TypeIt);
modules.push(ImgMove);

$(document).ready(function() {
  // FOUNDATION
  $(document).foundation();

  // JQUERY MASK
  $.jMaskGlobals.translation[2] = { pattern: /[2-9]/, recursive: true };
  $('.wpcf7-tel').mask('(200) 000-0000');

  //Initialize Progressive Web App support
  pwa.init();

  modules.forEach(module => {
    let mod = new module();
    if (mod && mod.activeSelector) {
      let $els = document.querySelectorAll(mod.activeSelector);
      if ($els.length > 0) {
        mod.init($els);
      }
    }
  });
});
