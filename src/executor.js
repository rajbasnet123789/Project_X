import { setBusy, setIdle } from "./status.js";
import { sendStream } from "./streams.js";

export async function execute(task) {
  setBusy();

  try {
    const emit = (data) =>
      sendStream(task.taskId, data);

    if (task.type === "cpu") {
      const cpu = await import("./tasks/cpu.js");
      return await cpu.run(task.payload, emit);
    }

    if (task.type === "gpu") {
      const gpu = await import("./tasks/gpu.js");
      return await gpu.run(task.payload, emit);
    }

    if (task.type === "video") {
      const video = await import("./tasks/video.js");
      return await video.run(task.payload, emit);
    }

    throw new Error("Unknown task type");
  } catch (err) {
    sendStream(task.taskId, {
      type: "error",
      message: err.message
    });
    throw err;
  } finally {
    setIdle();
  }
}
