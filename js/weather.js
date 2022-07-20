let url =
  'https://api.openweathermap.org/data/2.5/forecast?id=501175&appid=a722624eaa524af8342f7a194cffad4d&units=metric&lang=ru';

const temperatureUnit = '°';
const humidityUnit = ' %';
const pressureUnit = ' мм. рт. ст.';
const windUnit = ' м/с';

let currentData;
let city;

async function getData() {
  console.log('Fetching data...');

  try {
    const response = await fetch(url);
    if (response.ok) {
      const jsonData = await response.json();
      console.log(jsonData);
      return { data: jsonData, error: false };
    } else {
      alert('Ошибка HTTP: ' + response.status);
    }
  } catch (e) {
    console.error(e);
    return { data: null, error: true };
  }
}

function convertPressure(value) {
  return (value / 1.33).toFixed();
}

Number.prototype.addZero = function (zeroCount = 1) {
  let s = String(this);
  while (s.length <= zeroCount) s = '0' + s;
  return s + ':00';
};

function getHoursString(dateTime) {
  let date = new Date(dateTime);
  let hours = date.getHours().addZero();
  return hours;
}

function getValueWithUnit(value, unit) {
  return `${value}${unit}`;
}

function getTemperature(value) {
  let roundedValue = value.toFixed();
  return getValueWithUnit(roundedValue, temperatureUnit);
}

function render(data) {
  renderCity(data?.city?.name ?? 'неизвестный город');
  renderCurrentTemperature(data.list[0]?.main?.temp ?? 0);
  renderCurrentDescription(data.list[0].weather[0]?.description ?? 0);
  renderForecast(data.list);
  renderDetails(data.list[0]);
  renderDayOrNight(data.city);
}

function renderCity(data) {
  let cityName = document.querySelector('.current__city');
  cityName.innerHTML = data;
}

function renderCurrentTemperature(data) {
  let currentTemperature = document.querySelector('.current__temperature');
  currentTemperature.innerHTML = getTemperature(data);
}

function renderCurrentDescription(data) {
  let currentDescription = document.querySelector('.current__description');
  currentDescription.innerHTML = data;
}

const WEATHER_ICONS_MAP = {
  '01d': 'clear_sky',
  '01n': 'clear_sky',
  '02d': 'few_clouds',
  '02n': 'few_clouds',
  '03d': 'scattered_clouds',
  '03n': 'scattered_clouds',
  '04d': 'broken_clouds',
  '04n': 'broken_clouds',
  '09d': 'shower_rain',
  '09n': 'shower_rain',
  '10d': 'rain',
  '10n': 'rain',
  '11d': 'thunderstorm',
  '11n': 'thunderstorm',
  '13d': 'snow',
  '13n': 'snow',
  '50d': 'mist',
  '50n': 'mist',
};

function renderForecast(data) {
  let forecastDataContainer = document.querySelector('.forecast');
  let forecast = '';

  for (let i = 0; i < 6; i++) {
    let item = data[i];

    let icon = item.weather[0].icon;
    let temp = getTemperature(item.main.temp);
    let hours = i == 0 ? 'Сейчас' : getHoursString(item.dt * 1000);

    let template = `<div class="forecast__item">
      <div class="forecast__time">${hours}</div>
      <div class="forecast__icon icon__${WEATHER_ICONS_MAP[icon]}"></div>
      <div class="forecast__temperature">${temp}</div>
    </div>`;

    forecast += template;
  }
  forecastDataContainer.innerHTML = forecast;
}

function renderDetails(data) {
  let feelsLike = getTemperature(data.main.feels_like);
  let pressureValue = convertPressure(data.main.pressure);
  let pressure = getValueWithUnit(pressureValue, pressureUnit);
  let humidity = getValueWithUnit(data.main.humidity, humidityUnit);
  let wind = getValueWithUnit(data.wind.speed.toFixed(), windUnit);

  renderDetailsItem('.feelslike', 'ощущается как', feelsLike);
  renderDetailsItem('.pressure', 'давление', pressure);
  renderDetailsItem('.humidity', 'влажность', humidity);
  renderDetailsItem('.wind', 'ветер', wind);
}

function renderDetailsItem(className, name, value) {
  let detailsName = document
    .querySelector(className)
    .querySelector('.details__name');
  detailsName.innerHTML = name;

  let detailsContainer = document
    .querySelector(className)
    .querySelector('.details__value');
  detailsContainer.innerHTML = value;
}

function isDay(data) {
  let sunrise = data.sunrise * 1000;
  let sunset = data.sunset * 1000;
  let now = Date.now();

  return now > sunrise && now < sunset;
}

function renderDayOrNight(data) {
  let attrName = isDay(data) ? 'day' : 'night';
  console.log('Now is ', attrName);
  document.documentElement.setAttribute('data-theme', attrName);
  transition();
  let checkbox = document.querySelector('.theme-switch__checkbox');
  if (attrName === 'night') {
    checkbox.checked = true;
  }
}

function userThemePreference() {
  let checkbox = document.querySelector('.theme-switch__checkbox');
  let transparentImage = document.querySelectorAll('.forecast__icon');
  checkbox.addEventListener('change', function () {
    if (this.checked) {
      document.documentElement.setAttribute('data-theme', 'night');
      for (let i = 0; i < transparentImage.length; i++) {
        transparentImage[i].setAttribute('data-theme', 'night');
      }
      transition();
    } else {
      document.documentElement.setAttribute('data-theme', 'day');
      for (let i = 0; i < transparentImage.length; i++) {
        transparentImage[i].setAttribute('data-theme', 'day');
      }
      transition();
    }
  });
}

function transition() {
  document.documentElement.classList.add('transition');
}

function periodicTask() {
  setInterval(init, 6000000);
}

jQuery(document).ready(function () {
  $('.city-search').suggestions({
    token: '2a5003ab085c07782a03a08c8ec8b7fad6a5d9fc',
    type: 'ADDRESS',
    constraints: {
      locations: { country: '*' },
    },
    onSelect: function (suggestion) {
      let lat = suggestion.data.geo_lat;
      let lon = suggestion.data.geo_lon;
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=a722624eaa524af8342f7a194cffad4d&units=metric&lang=ru`;
      init();
      console.log(suggestion);
      console.log(suggestion.data.city || suggestion.data.settlement);
      console.log(suggestion.data.geo_lat, suggestion.data.geo_lon);
    },
  });
});

async function init() {
  const { data, error } = await getData();
  if (!error) {
    render(data);
    currentData = data;
    periodicTask();
    userThemePreference();
  }
}
init();
