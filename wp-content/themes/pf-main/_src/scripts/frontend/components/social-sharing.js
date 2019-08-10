let activeSelector = '[data-social-links]';

/**
 * Polyfills for missing functions on IE11
 */
function polyfills() {
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (let i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }
}

function openPopup(network, data) {
  let c = void 0 !== window.screenLeft ? window.screenLeft : screen.left
    , d = void 0 !== window.screenTop ? window.screenTop : screen.top
    , e = 640
    , f = 400
    , g = screen.width / 2 - e / 2 + c
    , h = screen.height / 2 - f / 2 + d;
  window.open(network, data.title, "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=" + e + ",height=" + f + ",top=" + h + ",left=" + g);
}

function processButtons($container) {
  if ($container.dataset.title && $container.dataset.url) {
    let postData = {
      title: $container.dataset.title,
      url: $container.dataset.url
    };
    let networks = {
      facebook: "//www.facebook.com/sharer.php?u=" + postData.url,
      googleplus: "//plus.google.com/share?url=" + postData.url,
      twitter: "https://twitter.com/intent/tweet?text=" + postData.url + " " + postData.title,
      linkedin: "https://linkedin.com/shareArticle?mini=true&url=" + postData.url + "&title=" + postData.title
    };
    $container.querySelectorAll('.social-sharing-link').forEach(function ($link) {
      $link.addEventListener('click', function () {
        openPopup(networks[this.dataset.popup], postData);
      });
    });
  }
}

function init($containers) {
  polyfills();
  $containers.forEach(processButtons);
}

export {
  activeSelector,
  init
}
