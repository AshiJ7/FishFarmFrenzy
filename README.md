# FishFarmFrenzy

Website with 5 mini games to educate students about aquaponics. 

## Installation and Setup

1. Make sure that you have Node installed (v22 or higher)
2. Clone the repo into a designated location on your local machine
3. Run npm install to install dependencies
4. To start the development server: npm run dev 
5. Open http://localhost:3000
6. Enjoy playing our game!



Unit Testing 
Run this command in terminal to install jest: 
npm install --save-dev jest @types/jest ts-jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom

In lib folder, create a file with your function definition 
In tests folder, add test file 
In game file, replace function definition with the lib file import (example line 301 in minigame 2 code)

Run: npm test 