const url =
  'https://api.openweathermap.org/data/2.5/forecast?id=501175&appid=a722624eaa524af8342f7a194cffad4d&units=metric&lang=ru';
const temperatureUnit = '°';
const humidityUnit = ' %';
const pressureUnit = ' мм. рт. ст.';
const windUnit = ' м/с';

let currentData;

async function getData() {
  console.log('Fetching data...');

  try {
    const response = await fetch(url);
    const jsonData = await response.json();
    console.log(jsonData);
    render(jsonData);
  } catch (e) {
    console.error(e);
    alert(e);
  }
}

function convertPressure(value) {
  return (value / 1.33).toFixed();
}

Number.prototype.addZero = function (zeroCount = 1) {
  let s = String(this);
  while (s.length <= zeroCount) s = '0' + s;
  return s;
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
  renderCity(data);
  renderCurrentTemperature(data);
  renderCurrentDescription(data);
  renderForecast(data);
  renderDetails(data);
}

function renderCity(data) {
  let cityName = document.querySelector('.current__city');
  cityName.innerHTML = data.city.name;
}

function renderCurrentTemperature(data) {
  let tmp = data.list[0].main.temp;
  let currentTemperature = document.querySelector('.current__temperature');
  currentTemperature.innerHTML = getTemperature(tmp);
}

function renderCurrentDescription(data) {
  let description = data.list[0].weather[0].description;
  let currentDescription = document.querySelector('.current__description');
  currentDescription.innerHTML = description;
}

function renderForecast(data) {
  let forecastDataContainer = document.querySelector('.forecast');
  let forecast = '';

  for (let i = 0; i < 6; i++) {
    let item = data.list[i];

    let icon = item.weather[0].icon;
    let temp = getTemperature(item.main.temp);
    let hours = i == 0 ? 'Сейчас' : getHoursString(item.dt * 1000);

    let template = `<div class="forecast__item">
      <div class="forecast__time">${hours}</div>
      <div class="forecast__icon icon__${icon}"></div>
      <div class="forecast__temperature">${temp}</div>
    </div>`;

    forecast += template;
  }
  forecastDataContainer.innerHTML = forecast;
}

function renderDetails(data) {
  let item = data.list[0];

  let feelsLike = getTemperature(item.main.feels_like);
  let pressureValue = convertPressure(item.main.pressure);
  let pressure = getValueWithUnit(pressureValue, pressureUnit);
  let humidity = getValueWithUnit(item.main.humidity, humidityUnit);
  let wind = getValueWithUnit(item.wind.speed.toFixed(), windUnit);

  renderDetailsItem('.feelslike', feelsLike);
  renderDetailsItem('.pressure', pressure);
  renderDetailsItem('.humidity', humidity);
  renderDetailsItem('.wind', wind);
}

function renderDetailsItem(className, value) {
  let detailsContainer = document
    .querySelector(className)
    .querySelector('.details__value');
  detailsContainer.innerHTML = value;
}

getData();
