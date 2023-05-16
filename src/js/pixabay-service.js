import axios from 'axios';

const API_KEY = '36326636-76b3e37fcbe8c7da541d5c25c';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.max_Page = 1;
    this.per_page = 40;
  }

  async fetchImages() {
    const params = {
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.per_page,
    };
    const url = 'https://pixabay.com/api/';

    const response = await axios.get(url, { params });
    return response.data;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get maxPage() {
    return this.max_Page;
  }

  set maxPage(newMaxPage) {
    this.max_Page = newMaxPage;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
