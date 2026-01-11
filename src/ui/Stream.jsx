import { useEffect, useState } from "react";

export default function Stream({ node, taskId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(
      `ws://${node.ip}:7070`
    );

    ws.onopen = () => {
      ws.send(JSON.stringify({
        action: "subscribe",
        taskId
      }));
    };

    ws.onmessage = (e) => {
      setMessages(m => [...m, JSON.parse(e.data)]);
    };

    return () => ws.close();
  }, [taskId]);

  return (
    <div>
      <h4>Live Stream</h4>
      <pre style={{ maxHeight: 200, overflow: "auto" }}>
        {messages.map((m, i) =>
          JSON.stringify(m, null, 2)
        ).join("\n")}
      </pre>
    </div>
  );
}
