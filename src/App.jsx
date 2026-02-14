import React, { useState, useEffect } from "react";

export default function App() {
  const [gender, setGender] = useState("male");
  const [relation, setRelation] = useState("boyfriend");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [stage, setStage] = useState("form"); // form | sent | valentine | final

  useEffect(() => {
    // adjust relation when gender changes
    if (gender === "male") setRelation("boyfriend");
    else setRelation("girlfriend");
  }, [gender]);

  function validateEmail(e) {
    return /\S+@\S+\.\S+/.test(e);
  }

  function handleSend(e) {
    e.preventDefault();
    if (!name.trim() || !validateEmail(email)) return;
    // simulate sending email
    setSent(true);
    setStage("sent");
  }

  function goToValentine() {
    setStage("valentine");
  }

  function handleValentineAnswer(answer) {
    if (answer === "yes") setStage("final");
    else setStage("final");
  }

  return (
    <div className="app" style={{ maxWidth: 560, margin: "2rem auto", padding: 16 }}>
      <h1>Valentine Surprise Gift</h1>

      {stage === "form" && (
        <form onSubmit={handleSend} style={{ display: "grid", gap: 12 }}>
          <label>
            Whom are you sending to?
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>

          <label>
            Relation
            <select value={relation} onChange={(e) => setRelation(e.target.value)}>
              {gender === "male" ? (
                <>
                  <option value="boyfriend">Boy Friend</option>
                  <option value="husband">Husband</option>
                </>
              ) : (
                <>
                  <option value="girlfriend">Girl Friend</option>
                  <option value="wife">Wife</option>
                </>
              )}
            </select>
          </label>

          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Recipient name" />
          </label>

          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="recipient@example.com" />
          </label>

          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" disabled={!name.trim() || !validateEmail(email)}>
              Send
            </button>
          </div>
        </form>
      )}

      {stage === "sent" && (
        <div>
          <p>Good! Mail sent to {name} ({relation}).</p>
          <p>
            <button onClick={goToValentine}>Click me here</button>
          </p>
        </div>
      )}

      {stage === "valentine" && (
        <div>
          <h2>Valentine</h2>
          <p>Will you be my Valentine?</p>
          <p style={{ fontSize: 14, color: "#666" }}>Note: "No" is the default state — only click Yes to accept.</p>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => handleValentineAnswer("yes")} style={{ background: "#e83e8c", color: "white" }}>
              Yes
            </button>
            <button onClick={() => handleValentineAnswer("no")} style={{ background: "#ddd" }}>
              No
            </button>
          </div>
        </div>
      )}

      {stage === "final" && (
        <div>
          <h2>Thank you!</h2>
          <p>Congratulations — your message was delivered.</p>
        </div>
      )}
    </div>
  );
}
