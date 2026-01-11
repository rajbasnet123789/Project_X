import { useEffect, useState } from "react";
import Pairing from "./Pairing.jsx";
import Status from "./Status.jsx";
import Tasks from "./Tasks.jsx";

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!window.edge) {
      const msg =
        "window.edge is undefined — preload script did not load correctly";
      console.error(msg);
      setError(msg);
      return;
    }

    window.edge
      .getNodes()
      .then(setNodes)
      .catch((err) => {
        console.error("Failed to get nodes:", err);
        setError(err.message);
      });

    window.edge.onNodesUpdated(setNodes);
  }, []);

  if (error) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Available Edge Devices</h2>

      {nodes.length === 0 ? (
        <p>No devices available</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {nodes.map((n) => {
            const canAcceptTasks =
              n.state === "idle" &&
              (n.role === "host" || n.role === "hybrid");

            return (
              <li
                key={n.nodeId}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  padding: 10,
                  marginBottom: 10,
                  opacity: n.state === "busy" ? 0.6 : 1
                }}
              >
                <strong>{n.name}</strong>

                <Status node={n} />

                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={() => setSelectedNode(n)}
                    disabled={!canAcceptTasks}
                  >
                    Select
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {selectedNode && (
        <>
          <hr />
          <h3>Selected Node: {selectedNode.name}</h3>

          <Pairing deviceId={selectedNode.nodeId} />

          {selectedNode.state === "idle" && (
            <>
              <hr />
              <Tasks node={selectedNode} />
            </>
          )}
        </>
      )}
    </div>
  );
}
