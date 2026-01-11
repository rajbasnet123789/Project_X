export default function Status({ node }) {
  return (
    <div style={{ marginTop: 10 }}>
      <p>Role: {node.role}</p>
      <p>Status: {node.state}</p>
      <p>CPU Cores: {node.cpu}</p>
      <p>Memory Usage: {node.mem}%</p>
      <p>GPU: {node.gpu ? "Yes" : "No"}</p>
    </div>
  );
}
