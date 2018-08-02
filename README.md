# Summer18POC
Summer of 2018 Intern POC Project

Proof-of-concept using Angular 6 and YouTube Data API.

Allows GET, POST, PUT, DELETE requests on videos/data in playlists on the corresponding authorized YouTube account.

**Requires ng-gapi package and Angular Material.**<br />
This package should be installed when the repository is cloned and set up locally properly; if not, run `npm install ng-gapi` and/or `npm install --save @angular/material @angular/cdk`. See the ng-gapi [documentation](https://github.com/rubenCodeforges/ng-gapi) and Angular Material [documentation](https://material.angular.io/guide/getting-started) for more details.

### Setting Up the Project Locally

Navigate to the desired directory location and clone the repository using:
```
git clone https://github.com/LawLogix/Summer18POC.git
```
Then, set up Angular locally. Navigate into the `pocYT` folder and run:
```
npm install
```
For more information on Angular, see the [documentation](https://angular.io/guide/setup).

### Running the Project Locally

Navigate into the `pocYT` folder and run:
```
ng serve --open
```
After compiling, the application should start up in your default browser.

### Testing

This application uses the [Jasmine](https://jasmine.github.io/2.4/introduction.html) test framework. Navigate into the `pocYT` folder and run:
```
ng test
```

### Using the Application

### Application Layout

This application has three main sections/tabs:
* Sign In/Out, where a user can sign in and out of their Google account
* User Overview, where a signed-in user can easily view/watch the playlists on their YouTube channel
* Playlist View, which displays the contents of a playlist and allows a user to view/update its contents

#### Signing In

To sign in (under "Sign In/Out"), click the sign-in button and sign in to Google using an account that has editing permissions for the playlist(s) you wish to view/edit. To sign out, click the sign-out button.

By default, you may only view playlists and video descriptions. You must sign in with the correct account in order to add videos to, delete videos from, and move videos around in a playlist. In addition, only signed-in users will have access to a handy overview of their own playlists for quicker access. If the signed-in account does not have editing permissions for the playlist you wish to edit (i.e. the playlist was not created by current account), you will still be restricted to viewing only.

### Navigating User Overview

Once signed in, you will have access to the "User Overview" section. Here, you can see all of your playlists associated with your YouTube channel. Click the play button next to a playlist to immediately start watching it in the application, or click "View/Edit" to switch to the "Playlist View" tab and view its contents.

### Managing Playlist Contents

To view a specific playlist in "Playlist View", either click on its corresponding "View/Edit" button in "User Overview" or copy and paste the desired playlist ID (or a YouTube URL containing the ID) into the corresponding textbox. Here, you can see all videos in the playlist. Click the play button to immediately start watching it in the application.

To view the details of a video in the current playlist, click "View/Edit" next to the video. To update its position in the playlist, change the number in the corresponding textbox and click "Save".

To add a video to the current playlist, copy and paste the desired video ID (or a YouTube URL containing the ID) into the corresponding textbox.

To delete video(s) from the current playlist, check the box next to any of the videos and click "Delete Selected Videos".

#### Finding IDs on YouTube

This application deals heavily with YouTube playlist IDs and video IDs.

Playlist ID example: **PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG** from https://www.youtube.com/playlist?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG<br />
Video ID example: **dQw4w9WgXcQ** from https://www.youtube.com/watch?v=dQw4w9WgXcQ

#### Notes

* YouTube does not support the embedding of private playlists, so you may not watch private playlists within this application.
* YouTube Data API errors will appear in a card toward the top of the screen, showing the HTTP status code, error message, and a potential solution.
* Please take note of this application's super cool favicon.
