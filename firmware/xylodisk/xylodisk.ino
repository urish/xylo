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
#define BUF_SIZE (64)

void setup() {
  Serial.begin(BAUD_RATE);
  Serial.println("100 Ready !");
}

void malletControl(char *args) {
  int direction = 0;
  int pin = 0;
  int pinPair = 0;

  sscanf(args, "%d %d", &direction, &pin);
  pinPair = pin + 1;

  if (pin == 0) {
    return;
  }

  pinMode(pin, OUTPUT);
  pinMode(pinPair, OUTPUT);  

  switch (direction) {
  case -1:
    Serial.println("201 Reverse");
    digitalWrite(pin, LOW);
    digitalWrite(pinPair, HIGH);
    break;
  case 0:
    Serial.println("200 Zero");
    digitalWrite(pin, LOW);
    digitalWrite(pinPair, LOW);
    break;
  case 1:
    Serial.println("202 Forward");
    digitalWrite(pin, HIGH);
    digitalWrite(pinPair, LOW);
    break;
  }
}

void executeCommand(char *buf) {
  if (buf[0] == 'C') {
    malletControl(buf+1);
  }
}

// Currently plays a simple rhythm

char buf[BUF_SIZE];
int index = 0;

void loop() {
  int ch = Serial.read();
  if (ch == '\n') {
    buf[index] = '\0';
    executeCommand(buf);
    index = 0;
  } 
  else if ((ch >= 0) && (index < BUF_SIZE - 1)) {
    buf[index++] = ch;
  }
}


