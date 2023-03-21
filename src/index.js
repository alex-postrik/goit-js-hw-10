import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

// error name mast be specific - "Too many matches found. Please enter a more specific name.":
// error 404 - "Oops, there is no country with that name".

const ref = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  inform: document.querySelector('.country-info'),
};

ref.input.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(e) {
  const trimValue = ref.input.value.trim();

  clearHtml();
  if (trimValue !== '') {
    fetchCountries(trimValue)
      .then(data => {
        if (data.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        } else if (data.length >= 2 && data.length <= 10) {
          Notiflix.Notify.success('OK');
          createCountryList(data);
        } else if (data.length === 1) {
          createCountry(data);
        }
      })
      .catch(() => {
        clearHtml();
        Notiflix.Notify.failure('Oops, there is no country with that name.');
      });
  }
}

function createCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country">
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" hight="20">
         <p>${country.name.official}</p>
                </li>`;
    })
    .join('');

  ref.list.innerHTML = markup;
}


function createCountry(countries) {
  console.log(countries);
  const markup = countries
    .map(({ name, capital, population, flags, languages }) => {
      const langList = Object.values(languages).join(', ');
      return `<li class='country'>
          <div class='country-item'>
            <img class='country-image' src="${flags.svg}" />
            <h1 class='country-name'>${name.official}</h1>
          </div>
          <p><b>Capital</b>: ${capital}</p>
          <p><b>Population</b>: ${population}</p>
          <p><b>Languages</b>: ${langList}
        </li>`;
    })
    .join('');
  ref.inform.innerHTML = markup;
}

function clearHtml() {
  ref.list.innerHTML = '';
  ref.inform.innerHTML = '';
}
