#include <Wire.h>
#include <SoftwareSerial.h>
#include <Servo.h>


Servo servodon;
Servo servoyukari;
Servo servoileri;
Servo servotut;

String inputString="";
char inChar='0';

void setup() {
  // put your setup code here, to run once:

  Serial.begin(9600);


  servodon.attach(3);
  servoyukari.attach(5);
  servoileri.attach(6);
  servotut.attach(9);
}

void loop() {
  // put your main code here, to run repeatedly:

  if(Serial.available()){
    while(Serial.available()){
      delay(20);
      char c = Serial.read();
      inputString += c;
    }

    //Serial.println(inputString);


    if(inputString == "0"){
      sifirla();
    }


    String s =inputString.substring(inputString.length()-4,inputString.length());

    


    if(s.indexOf('i')>=0){
        String ang = s.substring(1,4);
        servoileri.write(ang.toInt());
        Serial.println(ang);
    }

    if(s.indexOf('y')>=0){
      String ang = s.substring(1,4);
      servoyukari.write(ang.toInt());
       Serial.println(ang);
    }

    if(s.indexOf('d')>=0){
      String ang = s.substring(1,4);
      servodon.write(ang.toInt());
       Serial.println(ang);
    }

    if(s.indexOf('t')>=0){
      String ang = s.substring(1,4);
      servotut.write(ang.toInt());
       Serial.println(ang);
    }




    inputString="";
  }
  
  
}



void sifirla(){
  servodon.write(90);
  servoyukari.write(0);
  servoileri.write(90);
  servotut.write(0);

  delay(3000);
}
