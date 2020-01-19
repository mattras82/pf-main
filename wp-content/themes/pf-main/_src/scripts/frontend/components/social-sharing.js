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
      title: encodeURIComponent($container.dataset.title),
      url: encodeURIComponent($container.dataset.url)
    };
    if ($container.dataset.desc) {
      postData.desc = encodeURIComponent($container.dataset.desc);
    }
    if ($container.dataset.src) {
      postData.src = encodeURIComponent($container.dataset.src);
    }
    let br = encodeURIComponent('\r\n');
    let networks = {
      facebook: `https://www.facebook.com/sharer.php?u=${postData.url}`,
      twitter: `https://twitter.com/intent/tweet?url=${postData.url}&text=${postData.title}`,
      linkedin: `https://linkedin.com/shareArticle?mini=true&url=${postData.url}&title=${postData.title}` + (postData.desc ? `&summary=${postData.desc}` : '') + (postData.src ? `&source=${postData.src}` : ''),
      email: `mailto:?to=&subject=${postData.title}&body=${postData.url}` + (postData.desc ? `${br}${postData.desc}` : '')
    };
    $container.querySelectorAll('[data-popup]').forEach(function ($link) {
      if ($link.dataset.popup === 'email') {
        $link.href = networks[$link.dataset.popup];
        return true;
      }
      $link.addEventListener('click', function () {
        openPopup(networks[$link.dataset.popup], postData);
      });
    });
  }
}

function init($containers) {
  return Promise.resolve({
    then: f => {
      polyfills();
      $containers.forEach(processButtons);
      f();
    }
  })
}

export {
  activeSelector,
  init
}
