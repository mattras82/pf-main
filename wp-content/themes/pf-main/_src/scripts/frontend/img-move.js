class ImgMove {
  _SENSITIVITY = 5;
  activeSelector = '.img-move';

  init($imgs) {
    return Promise.resolve({
      then: f => {
        if ($imgs.length) {
          this._$imgs = $imgs;
        } else {
          this._$imgs = [$imgs];
        }
        this._counter = 0;
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.mouseX = this.windowWidth / 2;
        this.mouseY = this.windowHeight / 2;
        this.loop();
        this.addListeners();
        f();
      }
    });
  }

  addListeners() {
    window.addEventListener('mousemove', this.updateMouse.bind(this));
    window.addEventListener('resize', this.updateWindow.bind(this));
  }

  updateMouse(e) {
    this.mouseX = e.pageX;
    this.mouseY = e.pageY;
  }

  updateWindow() {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
  }

  loop() {
    this._counter++;
    window.requestAnimationFrame(this.loop.bind(this));
    if (this.windowWidth > 700 && this._counter % 15 === 0) {
      this.process();
    }
  }
  
  process() {
    this.moveX = ((this.windowWidth - this.mouseX) / this.windowWidth - 0.5) * -2;
    this.moveY = ((this.windowHeight - this.mouseY) / this.windowHeight - 0.5) * 2;
    this._$imgs.forEach(this.moveImage.bind(this));
  }

  moveImage($img) {
    let s = parseInt($img.dataset.move || this._SENSITIVITY) * (1000 / $img.scrollWidth);
    $img.style.transform = `perspective(${this.windowWidth}px) rotateY(${this.moveX * s}deg) rotateX(${this.moveY * s}deg)`;
  }
}

export default ImgMove;