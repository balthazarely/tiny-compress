import { useState } from "react";

export function useCompress() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  async function compress(file: File, format: string = "webp", quality: number = 75) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("format", format);
      formData.append("quality", quality.toString());

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/compress`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  return { compress, isLoading, error };
}
