import os from "os";
import { detectGPU } from "./gpu.js";

let state = "idle";
const gpuType = detectGPU();

export function getStatus() {
  return {
    role: "hybrid",
    state,
    cpuCores: os.cpus().length,
    loadAvg: os.loadavg()[0],
    memoryUsage: Math.round(
      ((os.totalmem() - os.freemem()) / os.totalmem()) * 100
    ),
    gpuAvailable: gpuType !== null,
    gpuType
  };
}

export function setBusy() {
  state = "busy";
}

export function setIdle() {
  state = "idle";
}
