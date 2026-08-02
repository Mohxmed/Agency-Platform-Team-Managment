"use client";

import { useEffect, useMemo, useState } from "react";

import { subscribeToCollection } from "@/lib/firestoreService";

const COLLECTIONS = ["teamProjects", "tasks", "profiles", "clients"];

export function useTeamData() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let loadedCount = 0;

    const markLoaded = () => {
      loadedCount += 1;
      if (loadedCount >= COLLECTIONS.length) {
        setLoading(false);
      }
    };

    const unsubscribers = [
      subscribeToCollection("teamProjects", (data) => {
        setProjects(Array.isArray(data) ? data : []);
        markLoaded();
      }),

      subscribeToCollection("tasks", (data) => {
        setTasks(Array.isArray(data) ? data : []);
        markLoaded();
      }),

      subscribeToCollection("profiles", (data) => {
        setUsers(Array.isArray(data) ? data : []);
        markLoaded();
      }),

      subscribeToCollection("clients", (data) => {
        setClients(Array.isArray(data) ? data : []);
        markLoaded();
      }),
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      });
    };
  }, []);

  const activeUsers = users.filter((user) => user.status !== "inactive");

  const userMap = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    [users],
  );

  const clientMap = useMemo(
    () => new Map(clients.map((client) => [client.id, client])),
    [clients],
  );

  return {
    projects,
    tasks,
    users,
    activeUsers,
    userMap,
    clientMap,
    clients,
    loading,
  };
}
