# Hard-Drive & Beer Bottles Xylophone

This repository contains the source code for the Hard Drive Xylophone project.
This is a xylophone built using recycled materials: old computer hard drives
and bottles of beer. The bottles are filled with different levels of water to
produce different tones, and a small mallet connected to the hard drive
actuators strikes the bottles in order to make the sound.

[Watch the Hard Drive Xylophone in action](http://www.youtube.com/watch?v=dw9U0WxtK9c)

Directory structure:

* firmware - The firmware for the Arduino Mega / ADK that controls the hard drives
* service - Python code that communicates with the firmware in order to play notes,
  including a small webserver that exposes a RESTful API for playing on the xylophone.
* simulator - HTML5 application for playing the xylophone. Can be used either in
  conjunction with the python service to play on the real xylophone, either as a
  standalone simulator using a recorded sound sample. The simulator mode works only on
  WebKit browsers with Web Audio API enabled.

