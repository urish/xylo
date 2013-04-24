/*
  Xylodisk Firmware v0.1.0
 
 Hard Drive Xylophone Project
 Copyright 2013, Omri Baumer & Uri Shaked
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

#define BAUD_RATE (115200)

void setup() {
  Serial.begin(BAUD_RATE);
  Serial.println("100 Ready !");
}

void malletControl() {
  int direction = Serial.parseInt();
  int pin = Serial.parseInt();
  int pinPair = pin + 1;

  if (pin == 0) {
    return;
  }

  pinMode(pin, OUTPUT);
  pinMode(pinPair, OUTPUT);  

  switch (direction) {
  case -1:
    Serial.println("Reverse");
    digitalWrite(pin, LOW);
    digitalWrite(pinPair, HIGH);
    break;
  case 0:
    Serial.println("Zero");
    digitalWrite(pin, LOW);
    digitalWrite(pinPair, LOW);
    break;
  case 1:
    Serial.println("Forward");
    digitalWrite(pin, HIGH);
    digitalWrite(pinPair, LOW);
    break;
  }
}

// Currently plays a simple rhythm
void loop() {
  switch (Serial.read()) {
  case 'C':
    malletControl();
    break;
  }
}




