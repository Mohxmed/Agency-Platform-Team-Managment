"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

const EMPTY = [];

function buildConstraints({ filters = [], searchField = "", searchValue = "" }) {
  const constraints = [];

  filters.forEach((item) => {
    if (
      !item?.field ||
      item?.value === undefined ||
      item?.value === null ||
      item?.value === "" ||
      item?.value === "all"
    ) {
      return;
    }

    constraints.push(where(item.field, item.op || "==", item.value));
  });

  const value = String(searchValue || "").trim();

  if (searchField && value) {
    constraints.push(where(searchField, ">=", value));
    constraints.push(where(searchField, "<=", value + "\uf8ff"));
  }

  return constraints;
}

function snapshotToPage(snapshot) {
  return {
    docs: snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })),
    first: snapshot.docs[0] || null,
    last: snapshot.docs[snapshot.docs.length - 1] || null,
  };
}

function buildFilteredQuery({
  collectionName,
  filters,
  searchField,
  searchValue,
}) {
  const baseRef = collection(db, collectionName);

  const constraints = buildConstraints({
    filters,
    searchField,
    searchValue,
  });

  return constraints.length ? query(baseRef, ...constraints) : baseRef;
}

function buildOrderedQuery({
  collectionName,
  orderField,
  orderDirection,
  filters,
  searchField,
  searchValue,
}) {
  const filteredQuery = buildFilteredQuery({
    collectionName,
    filters,
    searchField,
    searchValue,
  });

  return query(filteredQuery, orderBy(orderField, orderDirection));
}

export function usePaginatedFirestore(params) {
  const {
    collectionName,
    orderField = "createdAt",
    orderDirection = "desc",
    pageSize = 20,
    filters = [],
    searchField = "",
    searchValue = "",
  } = params;

  const [pages, setPages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [tick, setTick] = useState(0);

  const paramsRef = useRef(params);
  const pagesRef = useRef(pages);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  const key = JSON.stringify({
    collectionName,
    orderField,
    orderDirection,
    pageSize,
    filters,
    searchField,
    searchValue,
    tick,
  });

  /* =========================================================
     INITIAL LOAD / FILTER CHANGE / REFRESH
  ========================================================= */

  useEffect(() => {
    if (!db) return;

    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const current = paramsRef.current;

        const filteredQuery = buildFilteredQuery(current);

        const orderedQuery = query(
          filteredQuery,
          orderBy(current.orderField, current.orderDirection),
        );

        const countSnapshot = await getCountFromServer(filteredQuery);

        const snapshot = await getDocs(
          query(orderedQuery, limit(pageSize)),
        );

        if (cancelled) return;

        setPages([snapshotToPage(snapshot)]);
        setCurrentIndex(0);
        setTotalCount(countSnapshot.data().count);
      } catch (error) {
        console.error(`Failed to paginate "${collectionName}":`, error);

        if (!cancelled) {
          setPages([]);
          setTotalCount(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [key, collectionName, pageSize]);

  /* =========================================================
     NAVIGATION (forward pages are fetched with a cursor)
  ========================================================= */

  const goToPage = useCallback(
    async (targetIndex) => {
      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

      if (targetIndex < 0 || targetIndex >= totalPages) return;
      if (targetIndex === currentIndex) return;
      if (!db) return;

      setPageLoading(true);

      try {
        const current = paramsRef.current;

        let nextPages = [...pagesRef.current];

        if (targetIndex > nextPages.length - 1) {
          const orderedQuery = buildOrderedQuery(current);

          for (let index = nextPages.length; index <= targetIndex; index += 1) {
            const previous = nextPages[index - 1];

            const pageQuery = previous?.last
              ? query(
                  orderedQuery,
                  startAfter(previous.last),
                  limit(pageSize),
                )
              : query(orderedQuery, limit(pageSize));

            const snapshot = await getDocs(pageQuery);

            nextPages.push(snapshotToPage(snapshot));
          }
        }

        setPages(nextPages);
        setCurrentIndex(targetIndex);
      } catch (error) {
        console.error(`Failed to navigate "${collectionName}":`, error);
      } finally {
        setPageLoading(false);
      }
    },
    [currentIndex, totalCount, pageSize, collectionName],
  );

  const refresh = useCallback(() => {
    setTick((previous) => previous + 1);
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const docs = pages[currentIndex]?.docs || EMPTY;

  return {
    docs,
    loading,
    pageLoading,
    totalCount,
    totalPages,
    currentPage: currentIndex + 1,
    pageSize,
    goToPage,
    refresh,
    hasNext: currentIndex < totalPages - 1,
    hasPrev: currentIndex > 0,
  };
}
