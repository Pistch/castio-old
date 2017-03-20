'use strict';

class Playlist {
  constructor (playlistElem, playerLink) {
    this.tracks = [];
    this.currentTrack = 0;
    this.controlsIface = playlistElem;
    this.controlsIface.innerHTML = '<p style="text-align: right;"><i>No tracks yet. Please use the library -> <br/>to add some!</i></p>';
    this.player = playerLink;
    this.player.playlist = this;
    this._setUp();

  }

  addTrack (trackInfo, position) {
    if (this.allowDuplicateTracks === false && this._inPlaylist(trackInfo)) throw new Error('This track is already in playlist!');
    if (position === 0 || position) {
      this.tracks.splice(position,0,trackInfo);
    } else {
      this.tracks.push(trackInfo);
    };
    if (!this.player.src) this.player.setAttribute("src", trackInfo.filename);
    this.renderPlaylist();
  }

  removeTracks (method, param, quantity) {
    if (typeof(quantity) != 'number') quantity = null;
    if (typeof(method) == 'number') {
      quantity = param;
      param = method;
      method = 'byNumber';
    };
    if (method == 'byNumber') {
      let trackToRemove = +param;
      this.tracks.splice(trackToRemove,(quantity || 1));
      this.tracksInfo.splice(trackToRemove,(quantity || 1));
      this.renderPlaylist();
      return;
    };
    if (method == 'multiple') {  //Дописать бы...
      quantity = param.length;

    };
    if (method == 'byName') {
      let trackToRemove = this.tracks.indexOf(param);
      this.tracks.splice(trackToRemove,(quantity || 1));
      this.tracksInfo.splice(trackToRemove,(quantity || 1));
      if (this.tracks == []) {
        this.player.pause();
        this.player.setAttribute("src", "");
      };
      this.renderPlaylist();
      return;
    };
  }

  nextTrack () {
    if (this.currentTrack == this.tracks.length - 1) {
      if (this.loopPlaylist === false) return;
      this.currentTrack = 0;
    } else {
      this.currentTrack++;
    };
    this.player.turnTrack(this.tracks[this.currentTrack].filename);
  }

  previousTrack () {
    this.currentTrack--;
    this.player.turnTrack(this.tracks[this.currentTrack].filename);
  }

  turnTrack (name) {
    if (typeof(name) == 'string') {
      this.currentTrack = this.tracks.indexOf(name);
    } else {
      this.currentTrack = name;
    };
    this.player.turnTrack(this.tracks[this.currentTrack].filename);
  }

  renderPlaylist () {
    this.controlsIface.innerHTML = '';
    if (this.tracks.length === 0) {
      this.controlsIface.innerHTML = 'No tracks in playlist. Please add some ->';
      return;
    };
    this.tracks.forEach((item, i, arr) => {
      let track = document.createElement('div');
      track.innerHTML = item.artist + ' - ' + item.title;
      track.classList.add('playlist_item');
      track.dataset.trackName = item.title;
      track.dataset.trackNumber = i;
      track.addEventListener('click', (e) => {
        if (!e.target.classList.contains('playlist_item')) return;
        this.turnTrack(+e.target.dataset.trackNumber);
      });
      this._addSingleItemControls(track);
      track.addEventListener('mouseenter', (e) => {
        e.target.querySelector('.controls').classList.remove('hidden');
      });
      track.addEventListener('mouseleave', (e) => {
        e.target.querySelector('.controls').classList.add('hidden');
      });
      this.controlsIface.appendChild(track);
    }, this);
  }

  _reorder (arr) {
    let temp = [];
    let coll = document.querySelectorAll('#playlist .playlist_item');
    for (let i = 0; i < arr.length; i++) {
      console.log(coll[i]);
      coll[i].dataset.trackNumber = i;
      if (i == this.currentTrack) this.currentTrack = +arr[i];
      console.log('moving track ' + (+arr[i]) + ' to ' + i + 'position');
      temp[i] = this.tracks[(+arr[i])];
    };
    this.tracks = temp;
  }

  _inPlaylist(info) {
    for (let i = 0; i < this.tracks.length; i++) {
      if (this.tracks[i].title == info.title) {
        return true;
      };
    };
    return false;
  }

  _setUp () {
    this.allowDuplicateTracks = false;
    this.loopPlaylist = false;
  }

  _addSingleItemControls (elem) {
    let deleteButton = document.createElement('button');
    deleteButton.classList.add('controls','hidden');
    deleteButton.innerHTML = 'x';
    deleteButton.addEventListener('click', this.removeTracks.bind(this, 'byNumber', elem.dataset.trackNumber));
    elem.appendChild(deleteButton);
  }
}
