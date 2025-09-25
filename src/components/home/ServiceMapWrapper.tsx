"use client";

import dynamic from "next/dynamic";

const CompanyMap = dynamic(() => import("@/components/home/CompanyMap"), {
  ssr: false,
});

interface ServiceMapWrapperProps {
  latitude: number;
  longitude: number;
  companyName: string;
  address?: string;
}

export default function ServiceMapWrapper({
  latitude,
  longitude,
  companyName,
  address,
}: ServiceMapWrapperProps) {
  return (
    <>
      <CompanyMap
        latitude={latitude}
        longitude={longitude}
        companyName={companyName}
        address={address}
      />
    </>
  );
}
