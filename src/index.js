import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PhotoApi from './utils/photo-api-service';
import getRefs from './utils/get-refs';

const refs = getRefs();
const photoAPIService = new PhotoApi();

refs.loadMoreBtn.style.display = 'none';
refs.searchForm.addEventListener('submit', onSearchForm);
refs.loadMoreBtn.addEventListener('click', requestForPictures);

function onSearchForm(evt) {
  evt.preventDefault();

  const form = evt.currentTarget;
  photoAPIService.query = form.elements.searchQuery.value;

  photoAPIService.resetPage();
  clearPhotosList();
  requestForPictures();
}

function requestForPictures() {
  photoAPIService
    .requestPhoto()
    .then(({ data }) => {
      if (data.total === 0) {
        throw new Error('BAD REQUEST !!!');
      }

      photoAPIService.totalPictures = data.total;

      renderPhotoCard(data);
    })
    .catch(findPictureErorr)
    .finally(() => refs.searchForm.reset());
}

function renderPhotoCard(photoData) {
  const markup = photoData.hits
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
    <div class="photo-card">
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
    </div>
    `,
    )
    .join('');

  if (photoAPIService.totalNumberFreePictures === 500) {
    Notify.info("We're sorry, but you've reached the end of search results.");

    refs.galleryList.insertAdjacentHTML('beforeend', markup);
    return (refs.loadMoreBtn.style.display = 'none');
  }

  refs.loadMoreBtn.style.display = 'block';
  refs.galleryList.insertAdjacentHTML('beforeend', markup);
}

function findPictureErorr() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function clearPhotosList() {
  refs.galleryList.innerHTML = '';
}
