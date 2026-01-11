export async function run(payload, progress) {
  if (!navigator.gpu) {
    throw new Error("WebGPU not available");
  }

  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();

  // Fake compute workload
  for (let i = 0; i <= 100; i += 10) {
    progress({ percent: i });
    await new Promise(r => setTimeout(r, 50));
  }

  return {
    result: "GPU task completed",
    backend: "webgpu"
  };
}
