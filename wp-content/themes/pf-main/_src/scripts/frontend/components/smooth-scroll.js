const className = 'smooth-scroll';
const activeSelector = `.${className}`;
const interval = 15;
import cookies from '../../utilities/cookies';

function getDuration(distance) {
  if (distance < 300) {
    return distance * 1.05;
  } else if (distance < 850) {
    return distance * 0.75;
  } else if (distance < 1000) {
    return distance * 0.65;
  } else if (distance < 1650) {
    return distance * 0.45;
  } else if (distance < 2500) {
    return distance * 0.25;
  }
  return distance * 0.15;
}

class SmoothScroll {
  constructor(destination) {
    this.destination = destination;
    this.scrollingDown = this.destination > window.pageYOffset;
    this.distance = Math.abs(this.destination - window.pageYOffset);
    this.duration = getDuration(this.distance);
    this.iterations = Math.ceil(this.duration / interval);
    this.scrollChunk = this.distance / this.iterations;
    this.iteration = 0;
    this.animating = false;
  }

  run() {
    if (window.pfSmoothScroll) return false;
    if (document.querySelector('.lightbox-transition, .lightbox-open')) {
      document.addEventListener('lightbox-closed', this.run.bind(this), {once:true});
      return false;
    }
    this.interval = setInterval(this.smoothScroll.bind(this), interval);
    window.pfSmoothScroll = true;
  }

  stop() {
    clearInterval(this.interval);
    if (cookies.get('smooth-scroll')) cookies.delete('smooth-scroll');
    window.pfSmoothScroll = undefined;
  }
  
  animate() {
    window.scrollTo(0, this.yPos);
    this.yPos = null;
    this.animating = false;
  }

  scroll(yPos) {
    if (!this.animating) {
      this.yPos = yPos;
      window.requestAnimationFrame(this.animate.bind(this));
      this.animating = true;
    }
  }

  smoothScroll() {
    if (this.iteration === this.iterations) {
      this.scroll(this.destination);
      this.stop();
    } else {
      let scrollPos = this.scrollingDown ? window.pageYOffset + this.scrollChunk : window.pageYOffset - this.scrollChunk;
      this.scroll(scrollPos);
      this.iteration++;
    }
  }
}

function processDestination($dest, e = false) {
  let destination = $dest.getBoundingClientRect().top + window.pageYOffset - (window.innerHeight / 4.5);
  if (isNaN(destination)) return false;
  if (e) e.preventDefault();
  let scroller = new SmoothScroll(destination);
  scroller.run();
}

function processHref(href, e = false) {
  let $dest = document.querySelector(href);
  if ($dest) {
    processDestination($dest, e);
  }
}

function handleClick(e) {
  let $link = e.target;
  while (!$link.classList.contains(className)) {
    $link = $link.parentElement;
  }
  let href = $link.getAttribute('href');
  if (!href) return false;
  if (href.startsWith('/')) {
    e.preventDefault();
    let dest = href.split('#');
    if (dest.length !== 2) return console.error('The smooth scroll link has not been configured properly', $link);
    let id = '#' + dest[1];
    cookies.set('smooth-scroll', id, 1);
    if (dest[0]) location.href = dest[0];
  } else if (href.startsWith('#')) {
    processHref(href, e);
  }
}

function init($links) {
  return Promise.resolve({
    then: f => {
      $links.forEach(($link) => {
        $link.addEventListener('click', handleClick);
      });
      f();
    }
  })
}

function pageLoad() {
  let pageLoad = cookies.get('smooth-scroll');
  if (pageLoad) {
    let $dest = document.querySelector(pageLoad);
    if ($dest) {
      processDestination($dest);
    }
  }
}

window.addEventListener('load', pageLoad);

export {
  activeSelector,
  init
}

export const smoothScroll = processHref;
