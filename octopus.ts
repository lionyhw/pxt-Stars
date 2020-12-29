/**
* Functions to Octopus sensor by ELECFREAKS Co.,Ltd.
*/
//% color=#00B1ED  icon="\uf005" block="Octopus_Basic" blockId="Octopus_Basic"
//% groups='["Digital", "Analog", "IIC Port"]'
namespace Octopus_Basic {
    /**
    * TODO: Get the value of the potentiometer(0~1023)
    * @param Rjpin AnalogPin, eg: AnalogPin.P1
    */
    //% blockId="potentiometer" block="Trimpot %Rjpin analog value"
    //% subcategory=Input color=#E2C438 group="Analog"
    export function trimpot(Rjpin: AnalogPin): number {
        return pins.analogReadPin(Rjpin)
    }
    

}