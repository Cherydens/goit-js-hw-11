import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

import PixabayApiService from './js/pixabay-service';
import markupGallery from './js/markup';

const refs = {
  searchForm: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

const pixabayApiService = new PixabayApiService();

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onSubmit(evt) {
  evt.preventDefault();
  pixabayApiService.query = evt.target.searchQuery.value.trim();
  pixabayApiService.resetPage();
  pixabayApiService
    .fetchImages()
    .then(data => {
      const totalHits = data.totalHits;
      if (totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notify.success(`Hooray! We found ${totalHits} images.`);
      clearGallery();
      renderGallery(data.hits);
      pixabayApiService.incrementPage();
      refs.loadMoreBtn.classList.remove('is-hidden');
    })
    .catch(error => Notify.failure(error.message));
}

function onLoadMoreBtnClick(evt) {
  pixabayApiService
    .fetchImages()
    .then(data => {
      if (data.hits.length === 0) {
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        refs.loadMoreBtn.classList.add('is-hidden');
        return;
      }
      renderGallery(data.hits);
      smothScroll();
      pixabayApiService.incrementPage();
    })
    .catch(error => Notify.failure(error.message));
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function renderGallery(images) {
  refs.gallery.insertAdjacentHTML('beforeend', markupGallery(images));
  new SimpleLightbox('.gallery a', {
    captionSelector: 'img',
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  }).refresh();
}

function smothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
