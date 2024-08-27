import * as css from "./style.css";

css; //use css

const returndata = function returnWeatherDataByLocation(locationX) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationX}?key=ABAPGJGP4H47WZSGCZMZ27CGJ`;
  const response = fetch(url, { mode: "cors" });
  response
    .then(function (response) {
      if (response.ok) {
        const parsedResponse = response.json();
        parsedResponse
          .then((responseJson) => {
            console.log(responseJson);
          })
          .catch((errorJson) => {
            console.log(errorJson);
          });
      }
      throw new Error("hi, something went wrong");
    })
    .catch(function (error) {
      console.log("hi", error);
    });
};

// returndata('london');

const process = function processJsonFromFetch(json) {
  const result = json;
};
