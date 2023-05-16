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

async function onSubmit(evt) {
  evt.preventDefault();
  pixabayApiService.query = evt.target.searchQuery.value.trim();
  pixabayApiService.resetPage();
  refs.loadMoreBtn.classList.add('is-hidden');
  if (!pixabayApiService.query) {
    clearGallery();
    return;
  }
  try {
    const data = await pixabayApiService.fetchImages();
    const totalHits = await data.totalHits;
    if (totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notify.success(`Hooray! We found ${totalHits} images.`);
    pixabayApiService.maxPage = Math.ceil(
      totalHits / pixabayApiService.per_page
    );
    clearGallery();
    renderGallery(data.hits);
    pixabayApiService.incrementPage();
    if (pixabayApiService.maxPage > 1) {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function onLoadMoreBtnClick(evt) {
  try {
    const data = await pixabayApiService.fetchImages();
    renderGallery(data.hits);
    smothScroll();
    if (pixabayApiService.maxPage === pixabayApiService.page) {
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      refs.loadMoreBtn.classList.add('is-hidden');
      return;
    }
    pixabayApiService.incrementPage();
  } catch (error) {
    console.error(error.message);
  }
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
