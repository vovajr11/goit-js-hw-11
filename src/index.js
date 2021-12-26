import './sass/main.scss';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PhotoApi from './utils/photo-api-service';
import LoadMoreBtn from './components/load-more-btn';
import getRefs from './utils/get-refs';

const refs = getRefs();
const galleryLightbox = new SimpleLightbox('.galleryItem a');
const photoAPIService = new PhotoApi();
const loadMoreBtn = new LoadMoreBtn();

refs.searchForm.addEventListener('submit', onSearchForm);
refs.loadMoreBtn.addEventListener('click', loadMorePictures);

function onSearchForm(evt) {
  evt.preventDefault();

  const form = evt.currentTarget;
  const searchValue = form.elements.searchQuery.value.trim();

  if (searchValue.length > 0) {
    photoAPIService.query = searchValue;
    photoAPIService.resetPage();
    clearPhotosList();

    photoAPIService.requestPhoto().then(data => {
      if (data.total === 0) {
        return findPictureErorr();
      }

      if (data.total > photoAPIService.perPage) {
        loadMoreBtn.showBtnLoadMore();
      }

      renderPhotoCard(data);
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    });

    loadMoreBtn.hideBtnLoadMore();
  } else {
    Notiflix.Notify.warning('You have not entered anything');
  }
}

function loadMorePictures() {
  photoAPIService
    .requestPhoto()
    .then(res => {
      renderPhotoCard(res);
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })
    .finally(() => refs.searchForm.reset());
}

function renderPhotoCard(photoData) {
  const markup = photoData.hits
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
      <div class="galleryItem">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              Likes <span>${likes}</span>
            </p>
            <p class="info-item">
              Views <span>${views}</span>
            </p>
            <p class="info-item">
              Comments <span>${comments}</span>
            </p>
            <p class="info-item">
              Downloads <span>${downloads}</span>
            </p>
          </div>
        </a>
      </div>
    `,
    )
    .join('');

  const totalHits = photoData.totalHits;
  const totalPages = Math.ceil(totalHits / photoAPIService.perPage);

  refs.galleryList.insertAdjacentHTML('beforeend', markup);
  galleryLightbox.refresh();

  if (photoAPIService.page > totalPages) {
    Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    return loadMoreBtn.hideBtnLoadMore();
  }

  loadMoreBtn.showBtnLoadMore();
}

function clearPhotosList() {
  refs.galleryList.innerHTML = '';
}

function findPictureErorr() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
}
