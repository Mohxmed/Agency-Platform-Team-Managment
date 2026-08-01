"use client";

import { useEffect, useState } from "react";
import { Users, Briefcase, GraduationCap, Layers } from "lucide-react";
import { subscribeToCollection } from "@/lib/firestoreService";
import StatsCard from "../ui/StatsCard";

export default function StatsGrid() {
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [works, setWorks] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const unsub1 = subscribeToCollection("profiles", setUsers);
    const unsub2 = subscribeToCollection("clients", setClients);
    const unsub3 = subscribeToCollection("works", setWorks);
    const unsub4 = subscribeToCollection("services", setServices);
    return () => { unsub1?.(); unsub2?.(); unsub3?.(); unsub4?.(); };
  }, []);

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        label="المستخدمين"
        value={String(users.length)}
        description="عدد الحسابات المسجلة في الموقع."
        icon={Users}
        footer="إجمالي المستخدمين"
      />

      <StatsCard
        label="الأعمال"
        value={String(works.length)}
        description="عدد الأعمال الموجودة في معرض الأعمال."
        icon={Briefcase}
        footer="إجمالي الأعمال"
      />

      <StatsCard
        label="العملاء"
        value={String(clients.length)}
        description="عدد العملاء المسجلين في الموقع."
        icon={GraduationCap}
        footer="إجمالي العملاء"
      />

      <StatsCard
        label="الخدمات"
        value={String(services.length)}
        description="عدد الخدمات المتاحة."
        icon={Layers}
        footer="إجمالي الخدمات"
      />
    </section>
  );
}
