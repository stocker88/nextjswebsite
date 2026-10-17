// One serial fetch worker: every provider attempt (including failed attempts)
// starts at least 16 seconds after the previous one. Four starts per rolling minute.
// This queue is process-wide, NOT a distributed limiter. Keep public fetching off
// until a single scheduled worker or a shared cross-instance limiter is deployed.
export function createMassiveRequestGate(
  now:()=>number=Date.now,
  sleep:(ms:number)=>Promise<void>=ms=>new Promise(resolve=>setTimeout(resolve,ms)),
) {
  let nextStart=0;
  let tail:Promise<unknown>=Promise.resolve();
  return {
    run<T>(operation:()=>Promise<T>):Promise<T> {
      const task=tail.then(async()=>{
        while(now()<nextStart)await sleep(nextStart-now());
        nextStart=now()+16000;
        return operation();
      });
      // A failed request consumes its slot but must not stall the queue.
      tail=task.catch(()=>undefined);
      return task;
    },
  };
}
const shared=globalThis as typeof globalThis & {stockerMassiveGate?:ReturnType<typeof createMassiveRequestGate>};
export const massiveRequestGate=shared.stockerMassiveGate||(shared.stockerMassiveGate=createMassiveRequestGate());
