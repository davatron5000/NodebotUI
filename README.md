NodebotUI
==========

A client/server framework for rapid prototyping of browser controlled robotic systems. The goal is a complete Bootstrap-like experience for assembling HTML that talks to Johnny-Five via socket.io. The user should only have to edit HTML to wire-up a basic interface.

This is just a bare-bones POC right now. If you'd like to try it out head over to the [Getting Started](wiki/Getting-Started) wiki page. You can find more details in the [Documentation](wiki/Documentation)

##Notes

* This is just a POC for the client and server js structure. There is no CSS or custom controls.
* I've only added support for LED's and servos on a single board, and only the on(), off() and move() methods at that. Additional device types and methods should be pretty easy.
* The first browserDevice is implemented (orientation)
* Make sure you wait for board ready before you click the checkbox or move the slider.
* There really isn't much to the server code. The heavy lifting is all in nodebotui-client.
* There is also an api for the browser that can be used from the console or in other JS.

##Goals of this POC

* Really I just want to run the high level structure of nodebotui.js and nodebotui-client.js by some developers who are smarter than me.

##To Do

* Capture/queue calls from client that happen before the board is ready.
* Initialize devices based on default values in HTML file (i.e. if the box is checked to begin with, make sure the LED is initially on)
