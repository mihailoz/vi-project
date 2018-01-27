# VI-Project
## About
This is a simple game with a AI opponent made as a project for AI at the University of Novi Sad.
The game is written using Phaser javascript game engine and the AI code is written in java, these two parts
communicate data between themselves using a simple websocket connection.

## How to setup
First you need to navigate to the *game* folder and run `npm install`.

Then you need to build and run the java AI controller in the folder *aiserver*.

After that you can start the game server by navigating to the *game* folder once more and running `grunt connect`.

Open your browser and navigate to [localhost:9000]