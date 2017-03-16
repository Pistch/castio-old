'use strict';

console.log('Radio station management interface, v.0.0.3 (pre-library)');

let interfaceContainer = document.getElementById('appContainer'),
    playerContainer = document.createElement('div'),
    playlistContainer = document.createElement('div'),
    libraryContainer = document.createElement('div'),
    uploaderContainer = document.createElement('div');

playerContainer.id = 'player';
playlistContainer.id = 'playlist';
libraryContainer.id = 'library';
uploaderContainer.id = 'uploader'

interfaceContainer.appendChild(playerContainer);
interfaceContainer.appendChild(playlistContainer);
interfaceContainer.appendChild(libraryContainer);
interfaceContainer.appendChild(uploaderContainer);

let player = new Player(playerContainer);

let playlist = new Playlist(playlistContainer, player);

let library = new Library(libraryContainer);

let uploader = new Uploader(uploaderContainer);

initEventListeners();

function initEventListeners() {
  player.addEventListener('ended', playlist.nextTrack.bind(playlist));
  player.addEventListener('DOMAttrModified', (event) => {
      if (event.attrName == 'src') player.controlsIface.title.innerHTML = playlist.tracks[playlist.currentTrack];
  });
};
