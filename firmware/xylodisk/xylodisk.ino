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

#include <QueueArray.h>

#define BAUD_RATE (115200)
#define BUF_SIZE (64)

typedef struct {
  unsigned long time;
  char direction;
  char pin;
} 
QueueEntry;

QueueArray <QueueEntry> queue;
unsigned long queueStartTime;

void setup() {
  Serial.begin(BAUD_RATE);
  Serial.println("100 Ready !");
  queueStartTime = millis();
}

void pinCommand(int direction, int pin, boolean output) {
  int pinPair = pin + 1;
  pinMode(pin, OUTPUT);
  pinMode(pinPair, OUTPUT);

  switch (direction) {
  case -1:
    digitalWrite(pin, LOW);
    digitalWrite(pinPair, HIGH);
    if (output) {
      Serial.println("201 Reverse");
    }
    break;
  case 0:
    digitalWrite(pin, LOW);
    digitalWrite(pinPair, LOW);
    if (output) {
      Serial.println("200 Zero");
    }
    break;
  case 1:
    digitalWrite(pin, HIGH);
    digitalWrite(pinPair, LOW);
    if (output) {
      Serial.println("202 Forward");
    }
    break;
  }
}

void malletControl(char *args) {
  int direction = 0;
  int pin = 0;
  int pinPair = 0;

  sscanf(args, "%d %d", &direction, &pin);

  if (pin > 1) {
    pinCommand(direction, pin, true);
  }
}

void resetQueue(char* args) {
  queueStartTime = millis();
  while (!queue.isEmpty()) {
    queue.pop();
  }
  Serial.println("300 Reset");
}

void enqueue(char* args) {
  unsigned long time;
  int direction = 0;
  int pin = 0;

  sscanf(args, "%lu %d %d", &time, &direction, &pin);

  if (queue.count() >= 512) {
    Serial.println("400 Queue Full");
    return;
  }

  if (pin > 1) {
    QueueEntry entry;
    entry.pin = pin;
    entry.direction = direction;
    entry.time = time;
    queue.push(entry);
    Serial.println("300 Enqueue Successful");
  }
}

void executeCommand(char *buf) {
  char *args = buf + 1;
  switch (buf[0]) {
  case 'C':
    malletControl(args);
    break;

  case 'R':
    resetQueue(args);
    break;

  case 'Q':
    enqueue(args);
    break;
  }
}

char buf[BUF_SIZE];
int index = 0;

void loop() {
  if (Serial.available()) {
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
  if (!queue.isEmpty()) {
    QueueEntry head = queue.peek();
    if (head.time < millis() - queueStartTime) {
      pinCommand(head.direction, head.pin, false);
      queue.pop();
    }
  }
}

