import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { announceNode, discoverNodes, getNodes } from "./mdns.js";
import { generatePin,verifyPin} from "./pairing.js";
import { isTrusted } from "./store.js";

// Mute noisy DevTools Autofill warnings in Chromium
app.commandLine.appendSwitch("disable-features", "AutofillServerCommunication");



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win;

function createWindow() {

  const preloadPath = path.join(__dirname, "preload.js");
  console.log("Preload path:", preloadPath);
  console.log("__dirname:", __dirname);
  
  win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });
  
 
  win.webContents.on('preload-error', (event, preloadPath, error) => {
    console.error('Preload error:', error);
  });


  if (typeof MAIN_WINDOW_VITE_DEV_SERVER_URL !== 'undefined') {
    win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    
    win.loadURL('http://localhost:5173');
  } else {
    
    const rendererName = typeof MAIN_WINDOW_VITE_NAME !== 'undefined' ? MAIN_WINDOW_VITE_NAME : 'renderer';
    win.loadFile(path.join(__dirname, `../renderer/${rendererName}/index.html`));
  }
  
  if (process.env.ELECTRON_DEVTOOLS === "1") {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();
  
  announceNode();

  discoverNodes((nodes) => {
    win?.webContents.send("nodes-updated", nodes);
  });
});

ipcMain.handle("get-nodes", () => getNodes());


ipcMain.handle("pairing:start",()=>{
  return generatePin();
});

ipcMain.handle("pairing:verify",(_,pin,deviceId)=>{
  return verifyPin(pin,deviceId);
});

ipcMain.handle("pairing:isTrusted",(_,deviceId)=>{
  return isTrusted(deviceId);
})
