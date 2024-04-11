document.addEventListener("DOMContentLoaded", function() {
    const container = document.querySelector('.container');
    const searchButton = document.querySelector('.search-box button');
    const weatherBox = document.querySelector('.weather-box');
    const weatherDetails = document.querySelector('.weather-details');
    const error404 = document.querySelector('.not-found');
    const input = document.querySelector('.search-box input');
    const suggestionList = document.querySelector('.suggestion-list');

    const APIKey = 'c6d7c3d5150dde3d151b8b475bf5a17a';

    function searchWeather(cityName) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${APIKey}`)
            .then(response => response.json())
            .then(json => {
                if (json.cod === '404') {
                    container.style.height = '400px';
                    weatherBox.style.display = 'none';
                    weatherDetails.style.display = 'none';
                    error404.style.display = 'block';
                    error404.classList.add('fadeIn');
                    return;
                }

                error404.style.display = 'none';
                error404.classList.remove('fadeIn');

                const image = document.querySelector('.weather-box img');
                const temperature = document.querySelector('.weather-box .temperature');
                const description = document.querySelector('.weather-box .description');
                const humidity = document.querySelector('.weather-details .humidity span');
                const wind = document.querySelector('.weather-details .wind span');

                switch (json.weather[0].main) {
                    case 'Clear':
                        image.src = 'clear.png';
                        break;
                    case 'Rain':
                        image.src = 'rain.png';
                        break;
                    case 'Snow':
                        image.src = 'snow.png';
                        break;
                    case 'Clouds':
                        image.src = 'cloud.png';
                        break;
                    case 'Haze':
                        image.src = 'mist.png';
                        break;
                    default:
                        image.src = '';
                }

                temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
                description.innerHTML = `${json.weather[0].description}`;
                humidity.innerHTML = `${json.main.humidity}%`;
                wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

                weatherBox.style.display = '';
                weatherDetails.style.display = '';
                weatherBox.classList.add('fadeIn');
                weatherDetails.classList.add('fadeIn');
                container.style.height = '590px';
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function displaySuggestions(suggestions) {
        suggestionList.innerHTML = ''; // Clear previous suggestions
        suggestions.forEach(suggestion => {
            const listItem = document.createElement('li');
            listItem.textContent = suggestion.name;
            listItem.addEventListener('click', function() {
                input.value = suggestion.name;
                suggestionList.innerHTML = ''; // Clear the suggestion list
                searchWeather(suggestion.name); // Search weather for selected city
            });
            suggestionList.appendChild(listItem);
        });
    }

    input.addEventListener('input', function() {
        const query = input.value.trim(); // Get the input value
        if (query.length >= 3) { // Check if input length is at least 3 characters
            fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${APIKey}`)
                .then(response => response.json())
                .then(json => {
                    const suggestions = json.list; // Extract city suggestions from response
                    displaySuggestions(suggestions); // Display suggestions in the suggestion list
                })
                .catch(error => console.error('Error fetching suggestions:', error));
        } else {
            suggestionList.innerHTML = ''; // Clear suggestion list if input length is less than 3
        }
    });

    input.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') { // Check if Enter key is pressed
            searchWeather(input.value.trim()); // Search weather based on input value
        }
    });

    searchButton.addEventListener('click', function() {
        searchWeather(input.value.trim()); // Search weather based on input value when search button is clicked
    });
});
