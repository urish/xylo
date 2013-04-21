/*
  Xylodisk Firmware v0.0.1
 
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

int pin1 = 6;
int pin2 = 7;

void setup() {
  pinMode(pin1, OUTPUT);
  pinMode(pin2, OUTPUT);
}

// When specifying intensity < 255, use a capacitor to eliminate noise.
void ping(int intensity) {
  digitalWrite(pin1, LOW);
  if (intensity == 255) {
    digitalWrite(pin2, HIGH);
    return;
  }
  analogWrite(pin2, intensity);
}

void pong(int intensity) {
  digitalWrite(pin2, LOW);
  if (intensity == 255) {
    digitalWrite(pin1, HIGH);
    return;
  }
  analogWrite(pin1, intensity);
}

void hit(int length) {
  ping(255);
  delay(length / 2);
  pong(255);
  delay(length / 2);
}

// Currently plays a simple rhythm
void loop() {
  hit(1000);
  hit(500);
  hit(500);
}

