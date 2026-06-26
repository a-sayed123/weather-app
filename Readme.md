# Weather App 🌦️

*A modern, responsive Weather Application built with HTML, CSS, and JavaScript.
The app provides real-time weather data with a clean UI and smooth user experience across all devices .*

## Live Demo 🚀
*https://weather-app-virid-six-92.vercel.app/*


## Features ✨
* **🌍 Real-time weather data .** <br/>
* **📱 Fully responsive design (Mobile / Tablet / Desktop) .** <br/>
* **🎨 Clean and modern UI .** <br/>
* **⚡ Fast loading performance .** <br/>
* **🔎 Search for any city worldwide .** <br/>
* **🌙 Dynamic weather conditions (icons + background updates) .** <br/>

## Smart Default Location (Important Feature) 🌐
***One of the key features of this project is intelligent initial city detection based on the user's device language.***

*When the app is opened for the first time (before user interaction or confirmation screen appears):*

* **If device language is Arabic → default city is Cairo .** <br/>
* **If device language is English → default city is London .** <br/>
* **Other languages → fallback default city (e.g., New York or a global default) .** <br/>

### Why this matters: 💡
*This improves user experience (UX) by:*<br/>
* **Reducing empty states on first load** .<br/>
* **Showing relevant data immediately** .<br/>
* **Making the app feel “localized” and intelligent** .<br/>

## Technologies Used 🧠
* **HTML5.**<br/>
* **CSS3 (Flexbox / Grid) .** <br/>
* **JavaScript (ES6+) .** <br/>
* **Weather API integration .** <br/>

## Responsive Design 📱
*The UI is designed with a mobile-first approach, ensuring:*<br/>
* **Smooth layout on small screens .** <br/>
* **Optimized spacing and typography .** <br/>
* **Adaptive components for all devices .** <br/>

## Project Structure ⚙️
* **weather-app/**
* **│**
* **├── public/**
* **│   ├── images/**
* **│   ├── icons/**
* **│   └── favicon.ico**
* **│**
* **├── src/**
* **│   │**
* **│   ├── api/**
* **│   │   └── API.js**
* **│   │**
* **│   ├── controllers/**
* **│   │   └── APPcontroller.js**
* **│   │**
* **│   ├── logic/**
* **│   │   └── Logic.js**
* **│   │**
* **│   ├── ui/**
* **│   │   └── UIController.js**
* **│   │**
* **│   ├── tools/**
* **│   │   └── Validator.js**
* **│   │**
* **│   ├── styles/**
* **│   │   ├── base.css**
* **│   │   ├── layout.css**
* **│   │   ├── components.css/**
* **│   │   ├── utilities.css**
* **│   │   └── state.css**
* **│   │**
* **│   │**
* **│   └── main.js**
* **│**
* **├── index.html**
* **└── README.md**

## Screenshots 📸

### Desktop View
[![Desktop Preview](./assets/screenshots/desktop-design-metric.jpg)](https://weather-app-virid-six-92.vercel.app/)

### Mobile View
[![Mobile Preview](./assets/screenshots/mobile-design-imperial.jpg)](https://weather-app-virid-six-92.vercel.app/)

## What I Learned 🎯

* ***Working with APIs and asynchronous JavaScript.***
* ***Handling UI states (loading / success / error).***
* ***Improving UX with smart defaults.***
* ***Responsive design principles.***
* ***Clean project structure.***

## Future Improvements 🚀 
* ***Add hourly forecast charts.***
* ***Save favorite cities.***
* ***Dark mode support.***
* ***Geolocation auto-detection.***
* ***PWA support (installable app).***

## Author 👨‍💻
*Built by a Frontend Developer focused on:*
* **Clean UI/UX.**
* **Responsive design.**
* **Real-world project architecture.**

## License
*This project is licensed under the [MIT License](https://choosealicense.com/) - see the [LICENSE.md](LICENSE) file for details.*