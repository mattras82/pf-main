function viewportCheck(offset = 0) {
  let $el = this;
  if (!$el || typeof $el.getBoundingClientRect !== 'function')
    return false;

  let rect = $el.getBoundingClientRect();

  return rect.width > 0 && rect.height > 0 && ((rect.bottom + offset >= 0 && rect.bottom <= window.innerHeight) || (rect.top >= 0 && rect.top - offset <= window.innerHeight) || (rect.top < 0 && rect.bottom > 0));
}

Element.prototype.isInViewport = viewportCheck;