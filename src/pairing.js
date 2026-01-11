import crypto from "crypto";
import { addTrustedDevice } from "./store.js";


let activePin=null;
let expiresAt=null;

export function generatePin(){
   activePin = crypto.randomInt(100000, 999999).toString();
  expiresAt = Date.now() +  60 * 1000; 
  return activePin;
}

export function verifyPin(pin,deviceID){
    if(!activePin) return false;
    if(Date.now()>expiresAt) return false;
    if(pin!=activePin) return false;
    addTrustedDevices(deviceID);
    activePin=null;
    expiresAt=null;
    return true;
}


