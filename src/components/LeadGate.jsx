import { useState } from "react";

export default function LeadGate({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    city: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (
      !form.name ||
      !form.phone ||
      !form.whatsapp ||
      !form.email ||
      !form.city
    ) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem("lead", JSON.stringify(form));
    onSubmit(form);
  };

  return (
    <div className="lead-overlay">
      <div className="lead-popup">
        <h2>Start Your Germany Study Journey</h2>
        <p>Get personalized guidance instantly</p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Contact Number"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="whatsapp"
          placeholder="WhatsApp Number"
          value={form.whatsapp}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>Continue →</button>
      </div>
    </div>
  );
}
