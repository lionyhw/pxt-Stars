/**
* Functions to Octopus sensor by ELECFREAKS Co.,Ltd.
*/
//% color=#00B1ED  icon="\uf005" block="Octopus_Basic" blockId="Octopus_Basic"
//% groups='["Digital", "Analog", "IIC Port"]'
namespace Octopus_Basic {
    export enum Distance_Unit_List {
        //% block="cm" 
        Distance_Unit_cm,

        //% block="inch"
        Distance_Unit_inch,
    }
    export enum TrackingStateType {
        //% block="● ●" enumval=0
        Tracking_State_0,

        //% block="● ◌" enumval=1
        Tracking_State_1,

        //% block="◌ ●" enumval=2
        Tracking_State_2,

        //% block="◌ ◌" enumval=3
        Tracking_State_3
    }
    /**
    * TODO: Get the value of the potentiometer(0~1023)
    * @param Rjpin AnalogPin, eg: AnalogPin.P1
    */
    //% blockId="potentiometer" block="Trimpot %Rjpin analog value"
    //% subcategory=Input color=#E2C438 group="Analog"
    export function trimpotSensor(Rjpin: AnalogPin): number {
        return pins.analogReadPin(Rjpin)
    }
    /**
    * TODO: Judge whether the button is pressed
    * @param Rjpin DigitalPin, eg: DigitalPin.P1
    */
    //% blockId=button block="Button %Rjpin is pressed"
    //% subcategory=Input group="Digital" color=#EA5532
    export function buttonSensor(Rjpin: DigitalPin): boolean {
        let pin = Rjpin
        pins.setPull(pin, PinPullMode.PullUp)
        if (pins.digitalReadPin(pin) == 0) {
            return true
        }
        else{
            return false
        }
    }
    /**
    * TODO: get light intensity(lux)
    * @param Rjpin AnalogPin, eg: AnalogPin.P1
    */
    //% blockId="lightSensor" block="Light sensor %Rjpin light intensity(lux)"
    //% subcategory=Sensor color=#E2C438 group="Analog"
    export function lightSensor(Rjpin: AnalogPin): number {
        let voltage = 0, lightintensity = 0;
        for (let index = 0; index < 100; index++) {
            voltage = voltage + pins.analogReadPin(Rjpin)
        }
        voltage = voltage / 100
        if (voltage < 200) {
            voltage = Math.map(voltage, 45, 200, 0, 1600)
        }
        else {
            voltage = Math.map(voltage, 200, 1023, 1600, 14000)
        }
        if(voltage < 0){
            voltage = 0
        }
        return Math.round(voltage)
    }
    /**
    * TODO: get distance
    * @param Rjpin_t Trig pin DigitalPin, eg: DigitalPin.P1
    * @param Rjpin_e Echo pin DigitalPin, eg: DigitalPin.P2
    * @param distance_unit unit, eg: Distance_Unit_List.Distance_Unit_cm
    */
    //% blockId=sonarbit block="Ultrasonic sensor Trig:%Rjpin_t echo:%Rjpin_e distance %distance_unit"
    //% distance_unit.fieldEditor="gridpicker"
    //% distance_unit.fieldOptions.columns=2
    //% subcategory=Sensor group="Digital" color=#EA5532
    export function ultrasoundSensor(Rjpin_t:DigitalPin,Rjpin_e: DigitalPin, distance_unit: Distance_Unit_List): number {
        pins.setPull(Rjpin_t, PinPullMode.PullNone)
        pins.digitalWritePin(Rjpin_t, 0)
        control.waitMicros(2)
        pins.digitalWritePin(Rjpin_t, 1)
        control.waitMicros(10)
        pins.digitalWritePin(Rjpin_t, 0)

        // read pulse
        let d = pins.pulseIn(Rjpin_e, PulseValue.High, 25000)
        let distance = d * 9 / 6 / 58

        if (distance > 400) {
            distance = 0
        }
        switch (distance_unit) {
            case Distance_Unit_List.Distance_Unit_cm:
                return Math.floor(distance)  //cm
                break
            case Distance_Unit_List.Distance_Unit_inch:
                return Math.floor(distance / 254)   //inch
                break
            default:
                return 0
        }
    }
    /**
    * TODO: Drive motor fan
    * @param Rjpin AnalogPin, eg: AnalogPin.P1
    * @param fanstate Switch status, eg: true
    * @param speed Motor speed, eg: 80
    */
    //% blockId=fans block="Motor fan %Rjpin toggle to $fanstate || speed %speed \\%"
    //% fanstate.shadow="toggleOnOff"
    //% subcategory=Excute group="Digital" color=#EA5532
    //% speed.min=0 speed.max=100
    //% expandableArgumentMode="toggle"
    export function motorFan(Rjpin: AnalogPin, fanstate: boolean, speed: number = 100): void {
        if (fanstate) {
            pins.analogSetPeriod(Rjpin, 100)
            pins.analogWritePin(Rjpin, Math.map(speed, 0, 100, 0, 1023))
        }
        else {
            pins.analogWritePin(Rjpin, 0)
            speed = 0
        }
    }
    /**
    * TODO: Acquisition of line inspection sensor
    * @param Rjpin_l Left sensor port, eg: DigitalPin.P1
    * @param Rjpin_r Right sensor port, eg: DigitalPin.P2
    * @param state state, eg: TrackingStateType.Tracking_State_0
    */
    //% subcategory=Sensor group="Digital" color=#EA5532
    //% blockId=tracking block="Line-tracking sensor Left:%Rjpin Right:%Rjpin_r is %state"
    export function trackingSensor(Rjpin_l: DigitalPin, Rjpin_r: DigitalPin,state: TrackingStateType): boolean {
        pins.setPull(Rjpin_l, PinPullMode.PullUp)
        pins.setPull(Rjpin_r, PinPullMode.PullUp)
        let lsensor = pins.digitalReadPin(Rjpin_l)
        let rsensor = pins.digitalReadPin(Rjpin_r)
        if (lsensor == 0 && rsensor == 0 && state == TrackingStateType.Tracking_State_0) {
            return true;
        } else if (lsensor == 0 && rsensor == 1 && state == TrackingStateType.Tracking_State_1) {
            return true;
        } else if (lsensor == 1 && rsensor == 0 && state == TrackingStateType.Tracking_State_2) {
            return true;
        } else if (lsensor == 1 && rsensor == 1 && state == TrackingStateType.Tracking_State_3) {
            return true;
        } else return false;
    }
}