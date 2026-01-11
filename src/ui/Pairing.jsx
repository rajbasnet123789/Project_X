import { useState } from "react";

export default function Pairing({ deviceId }) {
  const [pin, setPin] = useState(null);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");

  async function startPairing() {
    const p = await window.pairing.start();
    setPin(p);
  }

  async function submitPin() {
    const ok = await window.pairing.verify(input, deviceId);
    setStatus(ok ? "Paired successfully" : "Invalid PIN");
  }

  return (
    <div>
      <h3>Secure Pairing</h3>

      {!pin && (
        <button onClick={startPairing}>
          Generate Pairing PIN
        </button>
      )}

      {pin && <h2>PIN: {pin}</h2>}

      <input
        placeholder="Enter PIN"
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      <button onClick={submitPin}>Pair</button>

      <p>{status}</p>
    </div>
  );
}
