import getRefs from '../utils/get-refs';

const refs = getRefs();

export default class LoadMoreBtn {
  showBtnLoadMore() {
    refs.loadMoreBtn.classList.add('active');
  }

  hideBtnLoadMore() {
    refs.loadMoreBtn.classList.remove('active');
  }
}
