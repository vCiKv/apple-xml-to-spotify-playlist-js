# XML/JSON to Spotify Playlist Converter

This is a Vite-based React application that allows you to convert a list of songs from an XML or JSON file into a Spotify playlist. Simply upload your file, and the application will extract the song titles and artist names, then guide you through the process of creating a new playlist on your Spotify account.

## Features

* **Supports XML and JSON file formats:** Easily upload your song lists regardless of the format.
* **convert XML to JSON file formats:** Convert XML to JSON for any other purpose
* **Error handling:** Provides informative messages if there are issues with file parsing or Spotify API communication.

## Prerequisites

* **Spotify Account API Key:** You need a Spotify account api key to create playlists.
* **ITunes Library in XML/JSON:** You need to connect your apple music to itunes sync then export your library to xml on the itunes application.
* **Web Browser:** The application runs in your web browser.
* **pnpm** While you can use npm or yarn, this project is configured for and recommends using pnpm for faster and more efficient dependency management.

## Installation

### Installing pnpm

pnpm is a fast, disk space efficient package manager. Here's how to install it:
[pnpm installation link](https://pnpm.io/installation)

### Get Spotify API key

spotify api key is used to access your spotify account to find music and create a playlist [how to spotify create api token](https://developer.spotify.com/documentation/web-api/tutorials/getting-started) set [http://localhost:5173/](http://localhost:5173/) as your redirect uri

### Export ITunes Library

you have to download [itunes](https://www.apple.com/itunes/) install then sign in with your apple ID sync wait for your libraries to sync then export look to the top options bar then

File > Library > Export Library

## Setup and Usage

* create an .env file to store your api key copy the code into the new .env file if you don't know how please watch [youtube video 1](https://www.youtube.com/watch?v=bUNJg_TV91k&ab_channel=AMANRAJ) or [youtube video 2](https://www.youtube.com/watch?v=zlNBgP4xOR0&ab_channel=LinuxLad) you'll need to rename the file to **_.env_** only

```env

VITE_SPOTIFY_ID=your_spotify_api_key

```

* download repo and extra to desired location after installing pnpm run command on project root this will install all dependence.

```bash

pnpm install

```

* then run the program

```bash

pnpm dev

```

* open your browser and go to this link [http://localhost:5173/](http://localhost:5173/) the app will run successfully

* authorize your spotify account **test the connection before proceeding** try again if connection fails

* upload your desired format and let the program run in your browser playlist will be created automatically as **apple_music** on your spotify

## Notes

* test music included as json

* keep web browser tab active to prevent cancellation

* issues or problems create PR

* python version coming soon
