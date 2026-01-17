import { useState } from "react";
import LeadGate from "./components/LeadGate";
import ChatWidget from "./components/ChatWidget";
import "./styles.css";

export default function App() {
  const [lead, setLead] = useState(() => {
    const stored = localStorage.getItem("lead");
    return stored ? JSON.parse(stored) : null;
  });

  return (
    <>
      {!lead && <LeadGate onSubmit={setLead} />}
      {lead && <ChatWidget lead={lead} />}
    </>
  );
}
