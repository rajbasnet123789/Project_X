export async function run(payload,progress){
    let sum=0;
    for(let i=0;i<payload.iterations;i++){
        sum+=Math.sqrt(i);
        if(i%1_000_000==0){
            progress({percent:(i/payload.iterations)*100});
            await new Promise(r=>setTimeout(r,1))
        }

    }
    return {result:sum};
}