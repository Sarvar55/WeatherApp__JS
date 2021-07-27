const api = {
    key: "4f78f5b9bb43445a72ef33cc9954765a",
    baseUrl: "https://api.openweathermap.org/data/2.5",
    iconUrl: "http://openweathermap.org/img/w/"
}
const search = document.getElementById("search");
const sumbit = document.querySelector(".btn");

document.addEventListener("DOMContentLoaded", () => {
    let controlTime = (number) => {
        if (number < 10) { number = "0" + number }
        return number;
    }
    let startTime = () => {
        const today = new Date();
        let hours = today.getHours();
        let minute = today.getMinutes();
        hours = controlTime(hours);
        minute = controlTime(minute);

        const clock = document.querySelector(".clock").innerText = hours + ":" + minute;
        setTimeout(startTime, 1000);
    }
    startTime();
});

class UI {
    addErrorMsg() {
        const parentEl = document.getElementById("form");
        let span = "";
        if (!parentEl.lastElementChild.classList.contains("error")) {
            span = document.createElement("span");
            span.textContent = "Place enter a valid city";
            span.className = "error";
            parentEl.appendChild(span);
        }

    }
    clearErrorMsg() {
        const parentEl = document.getElementById("form");
        if (parentEl.lastElementChild.classList.contains("error")) {
            parentEl.lastElementChild.remove();
        }
    }
    static getInput = () => search.value;

    static clearInput = () => search.value = "";

    static checkDate() {
        const today = new Date();

        let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        let day = days[today.getDay()];
        let month = months[today.getMonth()];
        let date = today.getDate();
        let year = today.getFullYear();

        return `${day},${date} ${month} ${year}`;
    }
}
sumbit.addEventListener("click", (e) => {
    e.preventDefault();
    const weather = new Weather();
    weather.getData(UI.getInput());
    UI.clearInput();
    weather.displayData();
});

class Weather {
    async getData(cityName) {
        try {
            const response = await fetch(`${api.baseUrl}/weather?q=${cityName}&appid=${api.key}&units=metric&lang=en`)
                .then(resp => resp.json())
                .then(this.displayData);
        } catch (error) {
            console.log(error.message)
        }
    }

    displayData(weatherData) {
        try {
            const ui = new UI();
            if (weatherData.cod !== 200) {
                ui.addErrorMsg();
            } else {
                ui.clearErrorMsg();
            }
        } catch (error) {
            console.log(error.message);
        }


        try {
            let html = "";


            html += `
        <div class="weather__icon"><img src="${api.iconUrl + weatherData.weather[0].icon+".png"}" alt=""></div>
       <div class="location">
            <p class="city">${weatherData.name} ,${weatherData.sys.country}</p>
            <p class="date">${UI.checkDate()}</p>
        </div>
        <div class="current">
            <p class="temp">Temp: ${Math.round(weatherData.main.temp)}°C</p>
            <p class="weather">Weather: ${weatherData.weather[0].description}</p>
            <p class="temp__range">Temp Range: ${Math.round(weatherData.main.temp_max)}°C / ${Math.round(weatherData.main.temp_min)}°C</p>
        </div>
        `;
            const weatherAbout = document.querySelector(".weather__about").innerHTML = html;
        } catch (error) {
            console.log(error.message)
        }
    }
}