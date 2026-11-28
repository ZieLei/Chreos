import { useEffect, useState } from "react";
import { getCryptoInfo } from "../api/crypto.api";
import type { CryptoInfo } from "../types/types";

export const useCryptoInfo = () => {
  const [cryptoInfo, setCryptoInfo] = useState<CryptoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptoInfo = async () => {
      try {
        setCryptoInfo(await getCryptoInfo());
      } catch (err) {
        setError("Could not load cipher info");
      }
    };

    fetchCryptoInfo();
  }, []);

  return { cryptoInfo, error };
};
