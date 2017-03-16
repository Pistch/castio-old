"use strict";

class Library {
  constructor (libraryElem) {
    this.container = libraryElem;
    this.rootPath = '';
    this.currentPath = [];
    this.getListFromServer();
  }

  getListFromServer (searchParams) {
    let xhr = new XMLHttpRequest();
    let pageSource = "http://castio.space/api/getAllTracks/";
    xhr.open('GET', pageSource, true);
    xhr.send();
    xhr.onreadystatechange = (function() {
      if (xhr.readyState != 4) return;
      //действия по готовности
      if (xhr.status != 200) {
        // обработать ошибку
        alert(xhr.status + ': ' + xhr.statusText);
      } else {
        // вывести результат
        this.structure = JSON.parse(xhr.responseText);
        this.setCurrentObject();
        this.renderCurrentCategory();
      };
    }).bind(this);
    //действия во время подгрузки
  }

  setCurrentObject () {
    this.currentObject = this.structure;
    for (let i = 0; i < this.currentPath.length; i++) {
      this.currentObject = this.currentObject[this.currentPath[i]];
    };
  }

  _listItems () {
    let objToExplore = this.currentObject;
    if (objToExplore != this.structure) {
      objToExplore = objToExplore.content;
    };
    for (let key in objToExplore) {
      console.log(key);
    };
  }

  getFullPath (itemName) {
    let fullPath = this.rootPath;
    for (let i = 0; i < this.currentPath.length; i++) {
      fullPath += '/' + this.structure[this.currentPath[i]].src;
    };
    let objToExplore = this.currentObject;
    if (objToExplore != this.structure) {
      objToExplore = objToExplore.content;
    };
    return fullPath + '/' + objToExplore[itemName].src;
  }

  openCategory (name) {
    this.currentPath.push(name);
    this.setCurrentObject();
    this.renderCurrentCategory();
  }

  goUp() {
    this.currentPath.pop();
    this.setCurrentObject();
    this.renderCurrentCategory();
  }

  renderCurrentCategory () {
    this.container.innerHTML = '';
    let objToExplore = this.currentObject;
    if (objToExplore != this.structure) {
      objToExplore = objToExplore.content;
    };
    let categoryListing = document.createDocumentFragment();
    if (this.currentObject != this.structure) {
      let goUpLink = document.createElement('button');
      goUpLink.innerHTML = '<-';
      goUpLink.addEventListener('click', this.goUp.bind(this));
      categoryListing.append(goUpLink);
    };
    objToExplore.forEach((track) => {
      let libraryItem = document.createElement('div');
      let trackDuration = (track.duration - track.duration % 60)/60 + ':' +
                          Math.ceil(track.duration % 60);
      libraryItem.dataset.trackName = track.artist + ' - ' + track.title;
      libraryItem.innerHTML = track.artist + ' - ' + track.title +
      '<div class="duration">' + trackDuration + '</div>';
      libraryItem.classList.add('library_item');
      if (track.type == 'category') {
        libraryItem.classList.add('category');
        libraryItem.addEventListener('click', this.openCategory.bind(this, key));
      } else {
        libraryItem.classList.add('track');
        libraryItem.addEventListener('click', playlist.addTrack.bind(playlist, {'name': libraryItem.dataset.trackName, 'src': track.filename}, undefined));
      };
      categoryListing.append(libraryItem);
    });
    this.container.appendChild(categoryListing);
  }
}
