void setup() {
  Serial.begin(9600);
  randomSeed(analogRead(0));
}

void loop() {
  int randNumber = random(0, 100);
  Serial.print("<");
  Serial.print(randNumber);
  Serial.println(">");
  delay(5000);
}
