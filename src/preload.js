import { contextBridge, ipcRenderer } from "electron";
import { isTrusted } from "./store";

try {
  contextBridge.exposeInMainWorld("edge", {
    getNodes: () => ipcRenderer.invoke("get-nodes"),
    onNodesUpdated: (callback) =>
      ipcRenderer.on("nodes-updated", (_, data) => callback(data))
  });

  contextBridge.exposeInMainWorld("pairing",{
      start:()=>ipcRenderer.invoke("pairing:start"),
      verify:(pin,deviceId)=>
          ipcRenderer.invoke("pairing:verify",pin,deviceId),
      isTrusted:(deviceId)=>
          ipcRenderer.invoke("pairing:isTrusted",deviceId)
  });
  
  console.log("✓ Preload script loaded successfully - window.edge is available");
} catch (error) {
  console.error("✗ Preload script error:", error);
}