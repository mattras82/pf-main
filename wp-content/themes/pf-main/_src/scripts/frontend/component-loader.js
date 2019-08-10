import config from '../../../config/config';

let components = [];

for (let component in config.styles.sass.components) {
  if (config.styles.sass.components.hasOwnProperty(component) &&
    config.styles.sass.components[component] === true) {
    import(
      /* webpackMode: "eager" */
      /* webpackExclude: /lightbox|social-sharing|smooth-scroll/ */
      `./components/${component}`).then(module => components.push(module));
  }
}

function initComponents() {
  components.forEach(component => {
    if (component.activeSelector) {
      let items = document.querySelectorAll(component.activeSelector);
      if (items && items.length > 0) {
        component.init(items);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', initComponents);
