import { useState } from "react";
import type { HistoryItem } from "../components/History";

export function useHistory(userId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  async function getHistory() {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/history?userId=${userId}`, {
        method: "GET",
      });
      const results = await response.json();
      setHistory(results);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  return { getHistory, history, error, isLoading };
}
