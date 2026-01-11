import bonjour from "bonjour";
import os from "os";
import crypto from "crypto";
import { getStatus } from "./status.js";


const bonjourInstance = bonjour();
const nodeId = crypto.randomUUID();
const nodes = new Map();

export function announceNode() {
  const status = getStatus();
  const serviceName = `PC-${os.hostname()}-${nodeId.slice(0, 6)}`;

  const publish = (name) =>
    bonjourInstance.publish({
      name,
      type: "edge-node",
      protocol: "tcp",
      port: 7070,
      txt: {
        nodeId,
        role: status.role,
        state: status.state,
        cpu: status.cpuCores.toString(),
        mem: status.memoryUsage.toString(),
        gpu: status.gpuAvailable ? "1" : "0",
        gpuType: status.gpuType
      }
    });

  try {
    publish(serviceName);
    console.log("Announced node:", nodeId, "as", serviceName);
  } catch (err) {
    if (err?.message?.includes("Service name is already in use")) {
      const altName = `${serviceName}-${crypto.randomBytes(2).toString("hex")}`;
      console.warn("mDNS name in use, retrying with", altName);
      publish(altName);
      console.log("Announced node:", nodeId, "as", altName);
    } else {
      console.error("Failed to announce node:", err);
    }
  }
}

export function discoverNodes(onUpdate) {
  const browser = bonjourInstance.find({ type: "edge-node" });

  browser.on("up", (service) => {
    if (!service.txt?.nodeId || service.txt.nodeId === nodeId) return;

    nodes.set(service.txt.nodeId, {
  nodeId: service.txt.nodeId,
  name: service.name,
  ip: service.referer.address,
  role: service.txt.role,
  state: service.txt.state,
  cpu: Number(service.txt.cpu),
  mem: Number(service.txt.mem),
  gpu: service.txt.gpu === "1"

});


    onUpdate(getNodes());
  });

  browser.on("down", (service) => {
    if (!service.txt?.nodeId) return;
    nodes.delete(service.txt.nodeId);
    onUpdate(getNodes());
  });
}

export function getNodes() {
  return Array.from(nodes.values());
}
