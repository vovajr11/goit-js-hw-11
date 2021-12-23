import axios from 'axios';

const API_KEY = '24915051-c2ebbb3bd81136fb9facbc73a';
const photoConfig = axios.create({
  baseURL: 'https://pixabay.com/api/',
});

class PhotoApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this._totalNumberFreePictures = 0;
    this._totalPictures = 0;
  }

  requestPhoto() {
    const params = new URLSearchParams({
      per_page: 100,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });
    const url = `?key=${API_KEY}&q=${this.searchQuery}&page=${this.page}&${params}`;

    const promiseResult = photoConfig.get(url, params);
    this.incrementPage();
    this.increaseTheTotalNumberImages();

    return promiseResult;
  }

  incrementPage() {
    this.page += 1;
  }

  increaseTheTotalNumberImages() {
    this._totalNumberFreePictures += 100;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get totalNumberFreePictures() {
    return this._totalNumberFreePictures;
  }

  set totalNumberFreePictures(numberPictures) {
    this._totalNumberFreePictures += numberPictures;
  }

  get totalPictures() {
    return this._totalPictures;
  }

  set totalPictures(numberPictures) {
    this._totalPictures += numberPictures;
  }
}

export default PhotoApi;
