export async function run(payload, emit) {
  for (let i = 0; i <= 100; i += 5) {
    emit({
      type: "progress",
      percent: i
    });

    emit({
      type: "frame",
      data: `FRAME_${i}` // replace with base64 PNG
    });

    await new Promise(r => setTimeout(r, 100));
  }

  emit({ type: "done" });
  return { status: "completed" };
}
