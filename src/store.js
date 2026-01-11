import fs from "fs";
import path from "path";
import os from "os";

const STORE_PATH = path.join(os.homedir(), ".edge-trust.json");

export function loadTrust() {
  if (!fs.existsSync(STORE_PATH)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
}

export function saveTrust(trust) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(trust, null, 2));
}

export function addTrustedDevice(deviceId, meta = {}) {
  const trust = loadTrust();
  trust[deviceId] = {
    pairedAt: Date.now(),
    ...meta
  };
  saveTrust(trust);
}

export function isTrusted(deviceId) {
  const trust = loadTrust();
  return Boolean(trust[deviceId]);
}
