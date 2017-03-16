'use strict';

class Player extends Audio {
  constructor (elem) {
    super();

    this.container = elem;
    this._initInterface();
    this.volume = this.controlsIface.volume.value / this.controlsIface.volume.max;
    this._initEvents();
    this.setAttribute('preload', 'metadata');
  }

  turnTrack (src) {
    this.pause();
    this.setAttribute('src', src);
    this.play();
  }

  _togglePlayButtonState () {
    if (!this.controlsIface.play.classList.contains('hidden')) {
      this.controlsIface.play.classList.add('hidden');
    };
    if (this.controlsIface.pause.classList.contains('hidden')) {
      this.controlsIface.pause.classList.remove('hidden');
    };
  }

  _togglePauseButtonState () {
    if (this.controlsIface.play.classList.contains('hidden')) {
      this.controlsIface.play.classList.remove('hidden');
    };
    if (!this.controlsIface.pause.classList.contains('hidden')) {
      this.controlsIface.pause.classList.add('hidden');
    };
  }

  _initEvents () {
    this.controlsIface.play.addEventListener('click', this.play.bind(this));
    this.controlsIface.pause.addEventListener('click', this.pause.bind(this));
    this.addEventListener('timeupdate', (() => {
      try {
        this.controlsIface.progress.value = this.currentTime / this.duration;
      } catch (err) {
      };
    }).bind(this));
    this.controlsIface.progress.addEventListener('click', (e) => {
      if (!this.src) return;
      e.target.value = (e.clientX - (e.target.getBoundingClientRect().left + pageXOffset))/e.target.clientWidth;
      this.currentTime = e.target.value * this.duration;
    });
    this.controlsIface.volume.addEventListener('change', () => this.volume = this.controlsIface.volume.value / this.controlsIface.volume.max);
    this.addEventListener('pause', this._togglePauseButtonState);
    this.addEventListener('play', this._togglePlayButtonState);

  }

  _initInterface () {
    this.controlsIface = {};
    let ifaceComponents = document.createDocumentFragment();

      //track progress bar
      {
        this.controlsIface.progress = document.createElement('progress');
        this.controlsIface.progress.value = 0;
        this.container.append(this.controlsIface.progress);
      };
      //play button
      {
        this.controlsIface.play = document.createElement('button');
        this.controlsIface.play.classList.add("play","square_button");
        ifaceComponents.append(this.controlsIface.play);
      };
      //pause button
      {
        this.controlsIface.pause = document.createElement('button');
        this.controlsIface.pause.classList.add("pause","square_button","hidden");
        ifaceComponents.append(this.controlsIface.pause);
      };
      //volume control bar
      {
        this.controlsIface.volume = document.createElement('input');
        this.controlsIface.volume.classList.add("volume");
        this.controlsIface.volume.type = 'range';
        this.controlsIface.volume.max = 50;
        this.controlsIface.volume.value = 40;
        ifaceComponents.append(this.controlsIface.volume);
      };
      //current song title
      {
        this.controlsIface.title = document.createElement('span');
        this.controlsIface.title.innerHTML = 'No track to play';
        this.controlsIface.title.classList.add('track_title');
        ifaceComponents.append(this.controlsIface.title);
      };
    this.container.appendChild(ifaceComponents);
  }
}
