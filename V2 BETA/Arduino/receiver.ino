#include <RF24.h>

RF24 radio(7, 8);
const byte adresse[6] = "00001"; // Mise au format "byte array" du nom du tunnel

void setup() {
  // Initialisation du port série (pour afficher les infos reçues, sur le "Moniteur Série" de l'IDE Arduino)
  Serial.begin(115200);

  // Partie NRF24
  radio.begin();                       // Initialisation du module NRF24
  radio.openReadingPipe(1, adresse);    // Ouverture du tunnel en LECTURE, avec le "nom" qu'on lui a donné
  radio.setPALevel(RF24_PA_MIN);        // Sélection d'un niveau "MINIMAL" pour communiquer (pas besoin d'une forte puissance, pour nos essais)
  radio.startListening();               // Démarrage de l'écoute du NRF24 (signifiant qu'on va recevoir, et non émettre quoi que ce soit, ici)
}

void loop() {
  // On vérifie à chaque boucle si un message est arrivé
  if (radio.available()) {
    char message[50];                               // Variable pour stocker le message reçu
    radio.read(&message, sizeof(message));          // Si un message vient d'arriver, on le charge dans la variable "message"
    Serial.print("Message reçu : "); Serial.println(message);     // … et on l'affiche sur le port série !
  }
}