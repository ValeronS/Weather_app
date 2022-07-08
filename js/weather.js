const url =
  'https://api.openweathermap.org/data/2.5/forecast?lat=35&lon=139&appid=a722624eaa524af8342f7a194cffad4d';
const temperatureUnin = '°';
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
  } catch (e) {
    console.error(e);
    alert(e);
  }
}
getData();

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
  return roundedValue + temperatureUnin;
}
