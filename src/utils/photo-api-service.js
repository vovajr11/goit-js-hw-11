import axios from 'axios';

const API_KEY = '24915051-c2ebbb3bd81136fb9facbc73a';
const photoConfig = axios.create({
  baseURL: 'https://pixabay.com/api/',
});

class PhotoApi {
  constructor() {
    this.searchQuery = '';
    this.perPage = 40;
    this.page = 1;
  }

  requestPhoto() {
    const params = new URLSearchParams({
      per_page: 40,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });
    const url = `?key=${API_KEY}&q=${this.searchQuery}&page=${this.page}&${params}`;

    const promiseResult = photoConfig.get(url, params).then(({ data }) => {
      this.incrementPage();

      return data;
    });

    return promiseResult;
  }

  incrementPage() {
    this.page += 1;
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
}

export default PhotoApi;
