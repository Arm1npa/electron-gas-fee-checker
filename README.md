Gas Fee and ETH Price Checker
This is a desktop application built using Electron and Axios that checks Ethereum gas fees and the current price of ETH. The app fetches real-time data from the relevant APIs and displays the information in a simple user interface.

Features
Ethereum Gas Fee Checker: Fetches the latest gas fees for Ethereum transactions.
ETH Price Checker: Displays the current price of Ethereum in USD.
Real-Time Updates: Utilizes Axios to pull real-time data from APIs.
Electron-Based Desktop App: Cross-platform desktop application built with Electron.
Technologies Used
Electron: For building the cross-platform desktop application.
Axios: For making HTTP requests to external APIs.
Node.js: Backend runtime for the app.
Installation
Prerequisites
Node.js: Make sure you have Node.js installed on your machine.

npm: Comes bundled with Node.js, but verify its availability with the following command:

bash
Copy code
npm --version
Steps
Clone the repository:

bash
Copy code
git clone https://github.com/Arm1npa/Gas_fee-checker.git
Navigate into the project folder:

bash
Copy code
cd Gas_fee-checker
Install the dependencies:

bash
Copy code
npm install
Run the Electron app:

bash
Copy code
npm start
Usage
Once you have the app running, it will display the current Ethereum gas fees and the latest ETH price. The data is fetched and updated in real-time using APIs.

API Integration
The app uses the following APIs:

Ethereum Gas Station API: Fetches real-time gas fees for Ethereum transactions.
Crypto Price API: Retrieves the latest price of Ethereum.
Development
To start contributing to the development of this application:

Fork the repository.
Make your changes in a new branch.
Open a pull request.
Building the App
To build the app for distribution:

bash
Copy code
npm run build
This will package your Electron app for your operating system.

License
This project is licensed under the MIT License.
