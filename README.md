NodebotUI
==========

A client/server framework for rapid prototyping of browser controlled robotic systems. The goal is a complete Bootstrap-like experience for assembling HTML that talks to Johnny-Five via socket.io. The user should only have to edit HTML to wire-up a basic interface.

This is just a bare-bones POC right now. If you'd like to try it out, follow these steps:

* Grab a copy of this repo
* In the NodebotUI folder npm install
* Wire up an arduino with an LED on pin 13
* In the examples folder run node demoServer
* Open led.html in your browser (you can open from the filesystem, no server needed for that)

##Notes

* This is just a POC for the client and server js structure. There is no CSS or custom controls.
* I've only added support for LED's on a single board, and only the on() and off() methods at that. Additional device types and methods should be pretty easy.
* Make sure you wait for board ready before you click the checkbox to turn on/off the LED
* There really isn't much to the server code. The heavy lifting is all in nodebotui-client.

##Goals of this POC

* Really I just want to run the high level structure of nodebotui.js and nodebotui-client.js by some developers who are smarter than me.
* In the console take a look at the global nodebotui object. This is what we pass to the server once the page has loaded.

##To Do

* Capture/queue calls from client that happen before the board is ready.
* Initialize devices based on default values in HTML file (i.e. if the box is checked to begin with, make sure the LED is initially on)
