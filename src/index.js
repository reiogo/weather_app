import "./style.css";
import Rain from "./images/rain.jpg";
import RainNight from "./images/rainnight.jpg";
import Cloudy from "./images/cloudy.jpg";
import CloudyNight from "./images/cloudynight.jpg";
import Snow from "./images/snow.jpg";
import SnowNight from "./images/snownight.jpg";
import Clear from "./images/clear.jpg";
import ClearNight from "./images/clearnight.jpg";



const process = function processJsonFromFetch(json) {
  // I want the weather forecast: current weather, current temp, weather for the next 5 days
  const result = {};
  result["address"] = json.resolvedAddress;
  result["curConditions"] = json.currentConditions.conditions;
  result["time"] = json.currentConditions.datetime;
  result["sunset"] = json.currentConditions.sunset;
  result["sunrise"] = json.currentConditions.sunrise;
  result["curTemp"] = json.currentConditions.temp;
  result["fiveDays"] = [];
  for (let i = 0; i < 5; i++) {
    result["fiveDays"].push(json.days[i].conditions);
  }
  // Remove Error text if there was any.
  const errorParagraph = document.getElementById("error-text")
  errorParagraph.textContent = "";

  return result;
};

const conditionDisplayer = function displayCurrentConditions(info) {
  const img =document.getElementById("condition-img");
  const credits = document.getElementById("img-credits");

  let isDayTime = false;
  if (info.sunrise < info.time && info.time < info.sunset) {
    isDayTime = true;
  }

  // In the case of rain, clouds, sun, or snow, else blank
  const rain = /[Rr]ain|[Dd]rizzle|[Ss]quall|[Tt]understorm|storms/;
  //unless it is:
  const noRain = /no\s|[Dd]ust/;
  const cloudy =
    /[Cc]loud|[Cc]over|[Ff]og|Lightning|[Mm]ist|[Ss]moke|[Oo]vercast/;
  const sunny = /[Ss]un|^[Cc]lear(ing)?|no\s/;
  const snow = /[Ss]now/;

  if (rain.test(info.curConditions) && !noRain.test(info.curConditions)) {
    if (isDayTime) {
      img.src = Rain;
      credits.textContent = "Image by Pexels from Pixabay";
    } else {
      img.src = RainNight;
      credits.textContent = "Image by ProsaClouds Pixabay";
    }
    return "rain";
  } else if (sunny.test(info.curConditions)) {
    if (isDayTime) {
      img.src = Clear;
      credits.textContent = "Image by Maybel Amber from Pixabay";
    } else {
      img.src = ClearNight;
      credits.textContent = "Image by Kanenori from Pixabay";
    }
    return "sunny";
  } else if (snow.test(info.curConditions)) {
    if (isDayTime) {
      img.src = Snow;
      credits.textContent = "Image by Jan Brzezinsky from Pixabay";
    } else {
      img.src = SnowNight;
      credits.textContent = "Image by Noel Bauza from Pixabay";
    }
    return "snow";
  } else if (cloudy.test(info.curConditions)) {
    if (isDayTime) {
      img.src = Cloudy;
      credits.textContent = "Image by Chris Stenger from Pixabay";
    } else {
      img.src = CloudyNight;
      credits.textContent = "Image by Pexels from Pixabay";
    }
    return "cloudy";
  } else {
    credits.textContent = "No picture";
    return "na";
  }
}

const display = function displayWeatherInfo(info) {
  const nameblock = document.getElementById("city-name");
  nameblock.textContent = info.address;
  const tempblock = document.getElementById("city-temp");
  tempblock.textContent = `The temperature is: ${info.curTemp} Celsius.`;
  const conditionblock = document.getElementById("city-condition");
  conditionblock.textContent = `It is: ${info.curConditions}`;

  conditionDisplayer(info);
};

const errorTxt = function displayErrorText() {
  const errorParagraph = document.getElementById("error-text")
  errorParagraph.textContent = "Something went wrong!";

}


const loaderfunc = function replaceImageWithLoader(state) {
  const loader = document.getElementById("loaderDiv");

  if (state == 'start') {  
    const prevImage = document.getElementById("condition-img");
    prevImage.src = "";
    loader.style.cssText = `display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            border: 1px solid gray;
                            width: 500px;
                            height: 350px;`;

  } else {
            loader.style.cssText = "display: none";
  }
}

const returndata = function returnWeatherDataByLocation(locationX) {
  loaderfunc('start');

  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationX}?unitGroup=metric&key=ABAPGJGP4H47WZSGCZMZ27CGJ`;
  const response = fetch(url, { mode: "cors" });
  response
    .then(function (response) {
      if (response.ok) {
        const parsedResponse = response.json();
        parsedResponse
          .then((responseJson) => {
            loaderfunc();
            display(process(responseJson))
            console.log(responseJson);
          })
          .catch((errorJson) => {
            console.log(errorJson);
            errorTxt();
          });
      } else {
        errorTxt();
        throw new Error("hi, something went wrong");
      }
    })
    .catch(function (error) {
      console.log("hi", error);
      errorTxt();
    });
};

returndata("london");

const cityForm = document.getElementById("city-form");

cityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = document.querySelector('input[name="city-input"]').value;
  returndata(city);
});
