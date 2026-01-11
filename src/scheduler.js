const queue=[];

export function enqueue(task){
    queue.push(task);
    queue.sort((a,b)=> b.priority-a.priority)
}
export function nextTask(){
    return queue.shift();
}

export function hastask(){
    return queue.length >0;
}
