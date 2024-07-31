const api = "bb2a5bb404333d4846ab87eb31c058f6";

const currentDate = new Date();
const timestamp = currentDate.getTime();

// get all the DOM elements
const body = document.querySelector("body");
const iconSpan = document.querySelector("#icon");
const loc = document.querySelector("#location");
const temp = document.querySelector(".temp");
const tempC = document.querySelector(".c");
const tempF = document.querySelector(".f");
const desc = document.querySelector(".desc");
const sunriseDOM = document.querySelector(".sunrise");
const sunsetDOM = document.querySelector(".sunset");
const date = document.querySelector(".date");

window.addEventListener("load", () => {
  let long;
  let lat;

  // access geolocation of user
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      // store the coordinates
      long = position.coords.longitude;
      lat = position.coords.latitude;

      // use the geo API to get the city name
      const reverseGeo = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=1&appid=${api}`;
      //console.log(reverseGeo);
      fetch(reverseGeo)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const city = data[0].name;
          loc.textContent = city;
        });

      // use the weather API to get all the other info
      const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}&units=metric`;
      // console.log(base);
      // fetch the url
      fetch(base)
        // format the response into json
        .then((response) => {
          return response.json();
        })
        // save the data into variables
        .then((data) => {
          const { temp } = data.main;
          const place = data.name;
          const { description, icon } = data.weather[0];
          const { sunrise, sunset } = data.sys;

          // convert variables
          const sunriseGMT = new Date(sunrise * 1000);
          const sunsetGMT = new Date(sunset * 1000);
          const fahrenheit = (temp * 9) / 5 + 32;

          // replace all the values
          desc.textContent = description;
          tempC.textContent = `${temp.toFixed(2)} °C`;
          tempF.textContent = `${fahrenheit.toFixed(2)} °F`;
          // sunriseDOM.textContent = sunriseGMT.toLocaleTimeString();
          // sunsetDOM.textContent = sunsetGMT.toLocaleTimeString();
          // date.textContent = sunriseGMT.toLocaleDateString();

          iconSpan.classList.remove("spin");
          // set the icon
          if (timestamp > sunset * 1000) {
            if (description.includes("clear")) {
              iconSpan.textContent = "clear_night";
            }
            if (description.includes("cloud")) {
              iconSpan.textContent = "partly_cloudy_night";
            }
            if (description.includes("rain")) {
              iconSpan.textContent = "rainy";
            }
          } else {
            if (description.includes("clear")) {
              iconSpan.textContent = "clear_day";
            }
            if (description.includes("cloud")) {
              iconSpan.textContent = "partly_cloudy_day";
            }
            if (description.includes("rain")) {
              iconSpan.textContent = "rainy";
            }
          }

          // change the background
          if (timestamp > sunset * 1000) {
            body.classList.add("night");
          }
        });
    });
  }
});

// toggle between celsius and fahrenheit
temp.addEventListener("click", () => {
  tempC.classList.toggle("big");
  tempF.classList.toggle("big");
});
