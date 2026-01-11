import { useState } from "react";
import Stream from "./Stream.jsx";

export default function Tasks({ node }) {
  const [taskId, setTaskId] = useState(null);

  async function submit() {
    const id = crypto.randomUUID();
    setTaskId(id);

    await fetch(`http://${node.ip}:7070/task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: id,
        type: "video",
        priority: 10,
        payload: {},
        requester: window.edge.nodeId
      })
    });
  }

  return (
    <div>
      <button onClick={submit}>
        Run Streaming Task
      </button>

      {taskId && (
        <Stream node={node} taskId={taskId} />
      )}
    </div>
  );
}
