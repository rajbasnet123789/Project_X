import {spawnSync} from "child_process";
export function detectGPU(){
    try{
        const result=spawnSync("nvidia-smi",{stdio:"ignore"});
        if(result.status===0) return "nvidia";
    }
    catch{}
    return "webgpu";
}