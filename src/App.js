import React from "react";
import "./App.css";

import "weather-icons/css/weather-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Weather from "./app_component/weather.component";
import Form from "./app_component/form.component";

//api.openweathermap.org/data/2.5/weather?q=London,uk
const API_key = "26164810fd93cf4080bb86bef2618ad2";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      celcius: undefined,
      temp_max: undefined,
      temp_min: undefined,
      description: "",
      error: false
    };

    this.weatherIcon = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: "wi-storm-showers",
      Snow: "wi-snow",
      Atmosphere: "wi-fog",
      Clear: "wi-day-sunny",
      Clouds: "wi-day-fog"
    };
  }

  calCelcius(temp) {
    let celcius = Math.floor(temp - 273.15);
    return celcius;
  }

  get_WeatherIcon(icons, rangeId) {
    switch (true) {
      case rangeId >= 200 && rangeId < 232:
        this.setState({ icon: icons.Thunderstorm });
        break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({ icon: icons.Drizzle });
        break;
      case rangeId >= 500 && rangeId <= 521:
        this.setState({ icon: icons.Rain });
        break;
      case rangeId >= 600 && rangeId <= 622:
        this.setState({ icon: icons.Snow });
        break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({ icon: icons.Atmosphere });
        break;
      case rangeId === 800:
        this.setState({ icon: icons.Clear });
        break;
      case rangeId >= 801 && rangeId <= 804:
        this.setState({ icon: icons.Clouds });
        break;
      default:
        this.setState({ icon: icons.Clouds });
    }
  }

  getWeather = async event => {
    event.preventDefault();
    const city = event.target.elements.city.value;
    const country = event.target.elements.country.value;

    if (city && country) {
      const api_call = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_key}`
      );
      const response = await api_call.json();
      console.log(response);

      this.setState({
        city: `${response.name}, ${response.sys.country}`,
        celcius: this.calCelcius(response.main.temp),
        temp_max: this.calCelcius(response.main.temp_max),
        temp_min: this.calCelcius(response.main.temp_min),
        description: response.weather[0].description,
        error: false
      });

      this.get_WeatherIcon(this.weatherIcon, response.weather[0].id);
    } else {
      this.setState({
        error: true
      });
    }
  };

  render() {
    return (
      <div className="App">
        <Form loadweather={this.getWeather} error={this.state.error} />
        <Weather
          city={this.state.city}
          country={this.state.country}
          temp_celcius={this.state.celcius}
          temp_max={this.state.temp_max}
          temp_min={this.state.temp_min}
          description={this.state.description}
          weatherIcon={this.state.icon}
        />
      </div>
    );
  }
}

export default App;
