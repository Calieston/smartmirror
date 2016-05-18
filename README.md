# Smart Mirror
Smart Mirror is a prototype project which has been developed in the context of the modules Innovation Project and Smart-Home Practicum in the summersemester of 2016 at Stuttgart Media University. The module was offered by the graduate program Computer Science and Media.

The Smart Mirror allows the user to display personalized widgets on the mirror for example current weather or actual traffic situation. The data is taken from different open source APIs.

The goal of the module was to realize an innovation project with focus on the technology and architecture. The core component which controls sensors, the frontend and the backend is a Raspberry Pi which will be fit behind the mirror.

## Team
- [Calieston](https://github.com/Calieston)
- [RomanKol](https://github.com/RomanKo)
- [Coriux](https://github.com/Coriux)
- [ma4a](https://github.com/ma4a)

## Technologies and Tools
- Node.js
- Kinect
- Leap Motion
- Sensors (temperature, motion, ...)

## Installation
- Clone the repository
- [Download and install node.js](https://nodejs.org/en/download/)
- [Download and install MongoDB](https://www.mongodb.org/downloads#production)
- Start the MongoDB Service
- Open a console and navigate to the directory **smartmirror/backend**
- Install node modules `npm install`
- Start the Smartmirror App `npm start`
- You can access the Smartmirror interface at localhost:3000

## Dev Environment
- Open a second console and navigate to the directory **smartmirror/backend**
- Install the node modules gulp, nodemon, mocha and chai as global modules `npm install -g gulp nodemon mocha chai`
- Start the dev build tools `gulp`
- You can access the Smartmirror interface for development at `localhost:8080`
- When ever you change a file, the browser will refresh automaticly

## Commits
- Before commiting, run the three following tests and fix the errors
- Unit Tests: `npm mocha` or `npm mochaWatch` (runs tests on filechange)
- Codestyle: `npm jscs`
- Codequality: `npm jshint`

## Error FAQ
- Check if MongoDB Service is running
- If you start the Dev Build Tools, make sure that the server is running