"use client";

import { useState } from "react";

export default function AddSubscriptionForm() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    durationInDays: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const { name, price, durationInDays } = formData;

    if (!name || !price || !durationInDays) {
      setError("Ju lutem plotësoni fushat e detyrueshme.");
      return;
    }

    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: parseFloat(price),
        durationInDays: parseInt(durationInDays),
        description: formData.description,
      }),
    });

    if (res.ok) {
      setSuccess(true);
      setFormData({
        name: "",
        price: "",
        durationInDays: "",
        description: "",
      });
    } else {
      setError("Dështoi shtimi i abonimit.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl space-y-5"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Emri i Abonimit *</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Premium, Free, Enterprise..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Çmimi (€) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="0, 10, 99..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kohëzgjatja (ditë) *</label>
          <input
            type="number"
            name="durationInDays"
            value={formData.durationInDays}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="30, 365..."
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Përshkrimi</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Detaje mbi këtë abonim..."
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">Abonimi u shtua me sukses!</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Shto Abonim
      </button>
    </form>
  );
}
