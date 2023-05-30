#include "DFRobot_TCS34725.h"
#include <RF24.h>
RF24 radio(7, 8); // CE, CSN

// Define
#define LED_PIN 13
#define buttonPin 2

const byte address[6] = "00001";

unsigned long startMillis;
unsigned long stored_time = 0;
int counter = 1;

DFRobot_TCS34725 tcs = DFRobot_TCS34725(&Wire, TCS34725_ADDRESS, TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);

int buttonState = 0;
int prevButtonState = HIGH;
int stateProcess = 0;


void setup() {
  Serial.begin(115200);
  Serial.println("Color View Test!");
  while (!tcs.begin()) {
    Serial.println("No TCS34725 found ... check your connections");
    delay(1000);
  }

  radio.begin();
  radio.openWritingPipe(address);
  radio.setPALevel(RF24_PA_MIN);
  radio.stopListening();

  pinMode(buttonPin, INPUT_PULLUP);
  digitalWrite(buttonPin, HIGH);
}


void loop() {
  buttonState = digitalRead(buttonPin);
  digitalWrite(LED_PIN, LOW);

  helloLED();

  if (buttonState != prevButtonState && buttonState == LOW) {
    stateProcess = 1;
    laps_detection();
  }
  prevButtonState = buttonState;
}


void laps_detection() {
  if (red >= green + blue) {
    stateProcess = 2;
    startMillis = millis();
    stored_time = startMillis;
    for (int counter = 1; counter <= 3;) {
      uint16_t clear, red, green, blue;
      tcs.getRGBC(&red, &green, &blue, &clear);
      // turn off LED
      tcs.lock();
      // Check if detected color is a shade of red
      if (red >= green + blue) {
        startMillis = millis();
        unsigned long elapsed_time = startMillis - stored_time;

        char lap_str[10];
        char time_str[10];

        itoa(counter, lap_str, 10);
        itoa(elapsed_time, time_str, 10);

        char text[50];
        sprintf(text, "<red-lap=%s><red-time=%s>", lap_str, time_str);

        radio.write(&text, sizeof(text));

        Serial.print("<red-lap="); Serial.print(counter); Serial.print(">");
        Serial.print("<red-time="); Serial.print(elapsed_time); Serial.println(">");
        counter++;
        delay(3000);
      }
    }
  }
  Serial.println("<red-end>");
  counter = 1;
  stateProcess = 0;
}

void helloLED() {
  if (stateProcess == 0) {
    digitalWrite(LED_PIN, LOW);
  }
  else if (stateProcess == 1) {
    blinkLED();
  }
  else if (stateProcess == 2) {
    digitalWrite(LED_PIN, HIGH);
  }
  else {
    digitalWrite(LED_PIN, LOW);
  }
}

void blinkLED() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}