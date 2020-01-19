let activeSelector = '.lightbox, [data-lb-src], [data-lb-iframe], [data-lb-anchor]';
let $body = null;
let $overlay = null;
let $container = null;
let $contentParent = null;
let timeoutLength = 350;
let tempClasses = [];
let videoExtensions = ['mp4', 'webm'];
let scrollPos = null;
let openedEvent = null;
let closedEvent = null;
import lazy from '../lazy-images';

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
  if (window.Element && !Element.prototype.append) {
    Object.defineProperty(Element.prototype, 'append', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function append() {
        let argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment();

        argArr.forEach(function (argItem) {
          let isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });

        this.appendChild(docFrag);
      }
    });
    Object.defineProperty(Element.prototype, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        if (this.parentNode !== null)
          this.parentNode.removeChild(this);
      }
    });
  }
  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(search, this_len) {
      if (this_len === undefined || this_len > this.length) {
        this_len = this.length;
      }
      return this.substring(this_len - search.length, this_len) === search;
    };
  }
  if (typeof window.CustomEvent !== 'function') {
    const CustomEvent = ( event, params ) => {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      let evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
  }
}

function timeout() {
  return new Promise(resolve => setTimeout(resolve, timeoutLength));
}

function addOverlay() {
  $overlay = document.createElement('div');
  $overlay.classList.add('lightbox-overlay');
  $body.append($overlay);
}

function addContainer() {
  $container = document.createElement('div');
  $container.classList.add('lightbox-container');
  $container.innerHTML = "<button class=\"lightbox-close\" type=\"button\" aria-label=\"Close popup\">" +
    "<i class=\"fa fa-times fa-2x\" aria-hidden=\"true\"></i>" +
    "<span class=\"show-for-sr\">Close</span>" +
    "</button>";
  $body.append($container);
}

function addElements() {
  addOverlay();
  addContainer();
  $body.classList.add('lightbox-ready');
}

function addCloseListener() {
  $container.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  $overlay.addEventListener('click', closeLightbox);
  $container.addEventListener('click', function (e) {
    let transparentClasses = ['lightbox-image', 'lightbox-video', 'lightbox-iframe'],
      closed = false;
    transparentClasses.forEach(function (className) {
      if (!closed && e.target && e.target.classList.contains(className)) {
        closed = true;
        closeLightbox();
      }
    });
  });
}

function clearContainer() {
  for (let i = 0; i < $container.children.length; i++) {
    let $child = $container.children[i];
    if (!$child.classList.contains('lightbox-close')) {
      if ($contentParent) {
        $contentParent.append($child);
      } else {
        $child.remove();
      }
    }
  }
  $contentParent = null;
  tempClasses = tempClasses.filter(c => $container.classList.remove(c) && false);
}

function clearLightbox() {
  clearContainer();
  $body.classList.remove('lightbox-transition');
  if (closedEvent) document.dispatchEvent(closedEvent);
}

function closeLightbox() {
  $body.classList.remove('lightbox-open');
  if (scrollPos > 0) {
    window.scrollTo(0, scrollPos);
    scrollPos = null;
  }
  $body.classList.add('lightbox-transition');
  timeout().then(clearLightbox);
}

function stringToHTML(string) {
  let parser = new DOMParser();
  return parser.parseFromString(string, 'text/html').querySelector('body').firstChild;
}

function openLightbox(content) {
  if ($body.classList.contains('lightbox-transition')) {
    timeout().then(function () {
      openLightbox(content);
    });
    return false;
  }
  scrollPos = window.scrollY ? window.scrollY : window.pageYOffset;
  $container.append(content);
  $body.classList.add('lightbox-open');
  tempClasses.forEach(c => $container.classList.add(c));
  if (openedEvent) document.dispatchEvent(openedEvent);
  $container.querySelectorAll('.lightbox-close').forEach($e => $e.addEventListener('click', closeLightbox));
}

function preLoadContent($content) {
  $content.querySelectorAll('img[data-src]').forEach(function ($img) {
    if (!$img.classList.contains('loaded')) {
      lazy.loadImage($img);
    }
  });
  $content.querySelectorAll('noscript').forEach(function ($noscript) {
    $noscript.remove();
  });
  $content.classList.add('lightbox-loaded');
}

function getIframeContent(src) {
  let $frame = document.createElement('iframe');
  $frame.src = src;
  $frame.addEventListener('load', function () {
    $container.classList.remove('loading');
  }, {once: true});
  tempClasses.push('loading');
  tempClasses.push('lightbox-iframe');
  return $frame;
}

function getAnchorContent(anchor) {
  let $el = null;
  if ($el = document.querySelector(anchor)) {
    if (!$el.classList.contains('lightbox-loaded')) preLoadContent($el);
    return stringToHTML($el.innerHTML);
  }
  return null;
}

function getImageContent(src) {
  let $image = document.createElement('img');
  $image.src = src;
  tempClasses.push('lightbox-image');
  tempClasses.push('loading');
  $image.addEventListener('load', function () {
    $container.classList.remove('loading');
  }, {once: true});
  return $image;
}

function getVideoContent(src) {
  let $video = document.createElement('video');
  $video.src = src;
  $video.setAttribute('autoplay', '');
  $video.setAttribute('playsinline', '');
  $video.setAttribute('controls', '');
  $video.setAttribute('loop', 'loop');
  tempClasses.push('lightbox-video');
  tempClasses.push('loading');
  $video.addEventListener('loadeddata', function () {
    $container.classList.remove('loading');
  }, {once: true});
  document.addEventListener('lightbox-opened', function () {
    $video.play();
  }, {once: true});
  return $video;
}

function handleClick(e) {
  e.preventDefault();

  let $this = this,
    iframe = null,
    anchor = null,
    src = null,
    content = null,
    $content = null;
  if (iframe = $this.dataset.lbIframe) {
    content = getIframeContent(iframe);
  } else if ((src = $this.dataset.lbSrc) || (src = $this.getAttribute('src'))) {
    let isVideo = false;
    videoExtensions.forEach((ext) => {
      if (src.endsWith(ext)) isVideo = true;
    });
    if (isVideo) {
      content = getVideoContent(src);
    } else {
      content = getImageContent(src);
    }
  } else if ((anchor = $this.dataset.lbAnchor) || (anchor = $this.getAttribute('href'))) {
    if (typeof $this.dataset.lbCopy === 'string') {
      content = getAnchorContent(anchor);
    } else {
      let $el = null;
      if ($el = document.querySelector(anchor)) {
        content = $el;
        if (!content.classList.contains('lightbox-loaded')) preLoadContent(content);
        $contentParent = $el.parentNode;
      }
    }
  } else if (($content = $this.querySelector('[data-lb-content]')) || ($content = $this.querySelector('.lightbox-content'))) {
    if (!$content.classList.contains('lightbox-loaded')) preLoadContent($content);
    if (typeof $this.dataset.lbCopy === 'string') {
      content = stringToHTML($content.innerHTML);
    } else {
      content = $content;
      $contentParent = $content.parentNode;
    }
  }
  if ($this.dataset.lbClass) {
    $this.dataset.lbClass.split(' ').forEach(val => tempClasses.push(val));
  }
  if (content) openLightbox(content);
}

function addListeners($links) {
  addCloseListener();
  $links.forEach(function ($link) {
    $link.addEventListener('click', handleClick);
  });
}

function addListener($el) {
  if ($el && $el.addEventListener) {
    $el.addEventListener('click', handleClick);
  }
}

function init($links) {
  return Promise.resolve({
    then: f => {
      polyfills();
      $body = document.querySelector('.off-canvas-content');
      addElements();
      addListeners($links);
      openedEvent = new CustomEvent('lightbox-opened');
      closedEvent = new CustomEvent('lightbox-closed');
    }
  });
}

export {
  init,
  activeSelector,
  addListener
}
