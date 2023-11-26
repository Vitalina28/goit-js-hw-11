import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formEl = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '40708369-d6dc8a1f6c8c52c3bc15ef748';

const PER_PAGE = 40;
let currentPage = 1;
let searchQuery = '';

const ligthbox = new SimpleLightbox('.gallery a');

async function searchAnimal(tags, page = 1) {
    try {
        const respons = await axios.get(`${BASE_URL}?key=${KEY}&q=${tags}
&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`)
        const { hits, totalHits } = respons.data;
        console.log(respons.data)

        displayImage(hits);
        if (!totalHits) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        } 
        else {
            toggleLoadMoreButton(hits.length, totalHits);
            }
}
catch (error) {
Notiflix.Notify.failure('An error', error);
    }
}

function displayImage(images) {
   
const markup = createMarkup(images);
    gallery.insertAdjacentHTML('beforeend', markup);
    ligthbox.refresh();
}


function createMarkup(arr) {
return arr.map(( { largeImageURL, webformatURL, likes, views, comments, downloads }) =>
`<div class="photo-card">
    <a href="${largeImageURL}"><img src="${webformatURL}" alt="" loading="lazy" width='250' /></a>
    <div class="info">
        <p class="info-item">
            <b>Likes: <span>${likes}</span></b>
        </p>
        <p class="info-item">
            <b>Views: <span>${views}</span></b>
        </p>
        <p class="info-item">
            <b>Comments: <span>${comments}</span></b>
        </p>
        <p class="info-item">
            <b>Downloads: <span>${downloads}</span></b>
        </p>
    </div>
</div>`).join(' ')
}

function toggleLoadMoreButton(_, totalHits) {
const remainingImage = totalHits - (currentPage * PER_PAGE);
    if (remainingImage > 0) {
        loadMore.style.display = "block";
        if (remainingImage === totalHits - PER_PAGE) {
            Notiflix.Notify.success('Hooray! We found totalHits images.');
        }
    }
     else {
        loadMore.style.display = "none";
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
    }
}

function smoothScrollToGallery() {
const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
window.scrollBy({
top: cardHeight * 2,
behavior: 'smooth',
});
}

formEl.addEventListener('submit', animalForm);

function animalForm(evt) {
    evt.preventDefault();
    searchQuery = evt.target.elements.searchQuery.value.trim();

    if (searchQuery) {
        searchAnimal(searchQuery);
        loadMore.style.display = 'none';
        gallery.innerHTML = " ";
        currentPage = 1;
    }
}

loadMore.addEventListener('click', onLoad);

function onLoad() {
currentPage += 1;
searchAnimal(searchQuery, currentPage);
    
smoothScrollToGallery();
}
