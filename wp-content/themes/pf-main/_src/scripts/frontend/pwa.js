import config from '../../../config/config';

let deferredPrompt;

function errorMessage(m) {
  console.error('PF PWA Error: ' + m);
  return false;
}

function warningMessage(m) {
  console.warn('PF PWA Warning: ' + m);
  return false;
}

function addCurrentPage(worker = null) {
  if (worker && worker.state === 'activated') {
    updateStatus('installed');
    worker.postMessage({
      action: 'cache',
      url: location.href
    });
  }
}

function updateStatus(status = '') {
  let icon = document.querySelector('.pwa-status');
  if (icon) {
    icon.classList.remove('fa-times', 'fa-sync', 'fa-spin', 'fa-pause-circle');
    switch (status) {
      case 'installed':
        icon.classList.add('fa-check');
        break;
      case 'installing':
        icon.classList.add('fa-sync', 'fa-spin');
        break;
      case 'waiting':
        icon.classList.add('fa-pause-circle');
        break;
      default:
        icon.classList.add('fa-times');
    }
  }
}

function updateWorker(reg = null) {
  if (reg) {
    updateStatus('installing');
    const installingWorker = reg.installing;
    installingWorker.onstatechange = () => {
      if (installingWorker.state === 'installed' &&
        navigator.serviceWorker.controller) {
        let $button = document.querySelector('#update-sw');
        if ($button) {
          $button.classList.add('active');
          updateStatus('waiting');

          $button.addEventListener('click', (e) => {
            e.preventDefault();
            installingWorker.postMessage({
              action: 'skipWaiting'
            });
            setTimeout(() => { location.reload()}, 1000);
          });
        }
      }
    };
  }
}

function registerSW() {
  if (window.location.protocol !== 'https:')
    return errorMessage('This site is not using HTTPS, which is required by PWA standards.');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (typeof reg === 'object' && reg.active) {
        // We've already registered this service worker
        updateStatus('installed');
        reg.onupdatefound = () => { updateWorker(reg) };
        return true;
      } else {
        if (location.pathname.indexOf('pwa') === -1)
          return false;

        updateStatus('installing');
        navigator.serviceWorker.register('/sw.js').then((registration) => {
          let worker = null;
          if (registration.installing) {
            worker = registration.installing;
          } else if (registration.waiting) {
            worker = registration.waiting;
          } else if (registration.active) {
            addCurrentPage(registration.active);
            return true;
          }
          if (worker) {
            worker.addEventListener('statechange', (event) => {
              if (event.target.state === 'activated') {
                addCurrentPage(worker);
              }
            });
          }
        });
      }
    });
  }
}

function listenForPrompt($button) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    $button.classList.add('active');
  });
}

// Pass an HTML element containing the "Add to Home" button
// to this module's init function to set up a custom install experience.
// This functionality is still in dev mode for most browsers, so it is not
// implemented by default.
function init($button) {
  if (!config.env.production) {
    return warningMessage('Please run WebPack under production mode to register the service worker');
  }
  
  registerSW();
  $button = document.querySelector('#add2home');
  if ($button) {
    listenForPrompt($button);

    $button.addEventListener('click', function (e) {
      e.preventDefault();
      $button.classList.remove('active');
      deferredPrompt.prompt();
      deferredPrompt.userChoice
        .then((choiceResult) => {
          deferredPrompt = null;
        });
    });
  }
}

export default {
  init
}
