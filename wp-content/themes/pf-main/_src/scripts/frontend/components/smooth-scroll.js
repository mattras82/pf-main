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
  }

  run() {
    if (window.gcSmoothScroll) return false;
    if (document.querySelector('.lightbox-transition, .lightbox-open')) {
      document.addEventListener('lightbox-closed', this.smoothScroll.bind(this), {once:true});
      return false;
    }
    this.interval = setInterval(this.smoothScroll.bind(this), interval);
    window.gcSmoothScroll = true;
  }

  stop() {
    clearInterval(this.interval);
    if (cookies.get('smooth-scroll')) cookies.delete('smooth-scroll');
    window.gcSmoothScroll = undefined;
  }

  smoothScroll() {
    if (this.iteration === this.iterations) {
      window.scrollTo(0, this.destination);
      this.stop();
    } else {
      let scrollPos = this.scrollingDown ? window.pageYOffset + this.scrollChunk : window.pageYOffset - this.scrollChunk;
      window.scrollTo(0, scrollPos);
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
    let $dest = document.querySelector($link.getAttribute('href'));
    if ($dest) {
      processDestination($dest, e);
    }
  }
}

function init($links) {
  $links.forEach(($link) => {
    $link.addEventListener('click', handleClick);
  });
  let pageLoad = cookies.get('smooth-scroll');
  if (pageLoad) {
    let $dest = document.querySelector(pageLoad);
    if ($dest) {
      processDestination($dest);
    }
  }
}

export {
  activeSelector,
  init
}
