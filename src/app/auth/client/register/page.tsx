// src/app/register/page.tsx  (or wherever you want it)

import ClientRegisterForm from "@/components/client/ClientRegisterForm";

export default function RegisterPage() {
  return (
    <div>
      <h1>Regjistrimi i Klientit</h1>
      <ClientRegisterForm />
    </div>
  );
}
