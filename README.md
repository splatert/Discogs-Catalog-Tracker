# Discogs Catalog Tracker
Userscript to keep track of releases that you view on Discogs.

<img src="https://github.com/user-attachments/assets/ffe8c68a-2c8e-4955-86c8-72b72fbd6dd4">


## Features
- Keep track of links to releases and artist pages.
- Import and export URL history.


## Installation
Install with a userscript manager of your choice (Tampermonkey, Greasemonkey, etc.).


## Privacy Policy
This userscript does not collect any data. It saves any URLs you visit to a table in your browser's LocalStorage.


## Usage
1. Click on an artist or release that interests you.

<img src="https://github.com/user-attachments/assets/7732996d-b93e-4c08-8dd7-7ef7fba69930">

2. The link to it will be saved in your URL history which can be accessed by clicking on the "History" button shown on artist and release pages (above the discogs results box).

<img src="https://github.com/user-attachments/assets/baab34cc-b8c5-4990-96e0-3cd2de50f438">

3. Clicking on "History" will show a dialog that contains links to every release or artist you've clicked on. You have to option to delete unwanted links and even be able to save your entire list to a file that can be imported back to this userscript.

<img src="https://github.com/user-attachments/assets/87f93c2c-8987-40bf-8114-ce47d7556f00">

4. The release you click on will turn transparent and have a status saying "Visited", meaning that you've visited this release.
<img src="https://github.com/user-attachments/assets/7a6c7e99-4632-42bc-8f76-6bcbeb6a6413">


## Troubleshooting
The history button may not load sometimes to due to the dynamic element it loads inside being missing. You can bump up the seconds it takes for the userscript to load in if you're experiencing slow connection issues on Discogs.
