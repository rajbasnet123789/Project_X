import express from "express";
import http from "http";
import WebSocket from "ws";
import {enqueue,nextTask,hastask} from './scheduler.js';
import {execute} from './executor.js';
import {isTrusted} from './store.js';
import { openStream, closeStream } from "./streams.js";

const app=express();
app.use(express.json());

const server = http.createServer(app);
server.listen(7070, "0.0.0.0", () => {
  console.log("Edge worker listening on port 7070");
});

const wss=new WebSocket.Server({server});

let clients=new Map();

wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    const { taskId, action } = JSON.parse(msg);

    if (action === "subscribe") {
      openStream(taskId, ws);
    }

    if (action === "unsubscribe") {
      closeStream(taskId);
    }
  });

  ws.on("close", () => {
    for (const [id, socket] of streams.entries()) {
      if (socket === ws) closeStream(id);
    }
  });
});

app.post("/task",async(req,res)=>{
    const task=req.body;
    if(!isTrusted(task.requester)){
        return res.status(403).json({error:"not trusted"});
    }
    enqueue(task)
    res.json({accepted:true})
});

setInterval(async() => {
    if(!hastask()) return;
    const task=nextTask();
    try{
        await execute(task,(progress)=>{
            wss.clients.forEach(c=> 
               c.send(JSON.stringify({taskId:task.taskId,progress}))    
            );
        });
    } catch(err){
        console.error("tasked failed",err);
    }
}, 1000);

// Binding is already configured above with explicit host 0.0.0.0
