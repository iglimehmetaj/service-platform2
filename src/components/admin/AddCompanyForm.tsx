"use client";

import { useState } from "react";
import { cities } from '../../app/help/helper';

export default function AddCompanyForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    location: "",
    address:"",
    latitude:"",
    longitude:"",
    openingTime: "",
    closingTime: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.name) {
      setError("Ju lutem plotësoni emrin e kompanisë.");
      return;
    }

    const res = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData }),
    });

    if (res.ok) {
      setSuccess(true);
      setFormData({
        name: "",
        description: "",
        logo: "",
        location: "",
        address:"",
        latitude:"",
        longitude:"",
        openingTime: "",
        closingTime: "",
      });
    } else {
      setError("Dështoi krijimi i kompanisë.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8 max-w-2xl mx-auto space-y-6 border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Shto Kompani të Re
      </h2>

      <div className="space-y-4">
        <InputField
          label="Emri i kompanisë *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Shembull: OpenAI"
          required
        />

        <TextAreaField
          label="Përshkrimi"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Përshkrim i shkurtër i kompanisë"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Logo (URL)"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
          />
         <SelectField
  label="Lokacioni"
  name="location"
  value={formData.location}
  onChange={handleChange}
  options={cities}
  required
  placeholder="Zgjidh qytetin"
/>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Ora hapjes"
            name="openingTime"
            value={formData.openingTime}
            onChange={handleChange}
            type="time"
          />
          <InputField
            label="Ora mbylljes"
            name="closingTime"
            value={formData.closingTime}
            onChange={handleChange}
            type="time"
           
          />
        </div>

        {/* {address,lat,long} */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Adresa"
            name="address"
            value={formData.address}
            onChange={handleChange}
           
          />
           <InputField
            label="Latitudes"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            
          />
          <InputField
            label="Longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">Kompania u shtua me sukses!</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-all font-medium"
      >
        Shto Kompani
      </button>
    </form>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}


function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  placeholder = "Zgjidh qytetin",
}: {
 label: string;
  name: string;
  value: string;
onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { name: string }[];
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
