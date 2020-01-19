class TypeIt {

    constructor() {
        this.$elements = [];
        this.$after = [];
        this.letters = [];
        this.runningAfter = false;
        this.activeSelector = '.type-it';
    }

    init($els) {
        return Promise.resolve({
            then: f => {
                this.$baseNode = document.createElement('span');
                this.$baseNode.classList.add('type-it--waiting');
                this.$blinkNode = document.createElement('span');
                this.$blinkNode.classList.add('type-it__blink');
                this.$blinkNode.innerHTML = '|';
                this.doneEvent = document.createEvent('CustomEvent');
                this.doneEvent.initEvent('type-it-done', true, false);
                this.timeout(500).then(r => this.run($els));
                f();
            }
        });
    }

    run($els) {
        $els.forEach(this.processEl.bind(this));
        this.$elements = this.$elements.concat(this.$after);
        this.runEls().then(r => {
            document.dispatchEvent(this.doneEvent);
        });
    }

    processEl($el) {
        $el.classList.add('type-it--processing');
        if ($el.classList.contains('type-it--after')){
            this.$after.push($el);
        } else {
            let text = $el.innerText.split('');
            if (text.length > 0) {
                $el.innerHTML = '';
                $el.classList.remove('type-it--processing');
                $el.classList.add('type-it--show');
                text.forEach(letter => {
                    let $span = this.$baseNode.cloneNode();
                    $span.innerText = letter;
                    $el.appendChild($span);
                    this.$elements.push($span);
                });
            }
        }
    }

    runEls() {
        if (this.$elements.length < 1) {
            return true;
        } else {
            let $el = this.$elements.shift();
            $el.classList.add('type-it--show');
            $el.classList.remove('type-it--waiting', 'type-it--processing');
            if ($el.classList.contains('type-it--after')) {
                let delay = $el.dataset.typeItDelay;
                if (!this.runningAfter) {
                    this.runningAfter = true;
                    delay = 750;
                } else if(!delay) {
                    delay = 0;
                }
                return this.timeout(delay).then(r => {
                    return this.runEls();
                });
            } else {
                $el.after(this.$blinkNode);
                let interval = this.randomIntFromInterval(55, 125);
                return this.timeout(interval).then(r => {
                    return this.runEls();
                });
            }
        }
    }

    randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    timeout(duration = 50) {
        return new Promise(resolve => setTimeout(resolve, duration));
    }
}

export default TypeIt