import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "./api/auth.api";

export default function Landing() {
  const navigate = useNavigate();
  const [secret, setSecret] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex bg-black justify-center items-center h-screen">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="font-terminal text-7xl">Welcome!</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (checking || secret === "") return;

            setChecking(true);
            setError(null);

            try {
              await login(secret);
              navigate("/home", { replace: true });
            } catch (err) {
              setError(err instanceof Error ? err.message : "Access denied");
              setSecret("");
              setChecking(false);
            }
          }}
        >
          <input
            autoFocus
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            // readOnly instead of disabled keeps focus for the next try
            readOnly={checking}
            className="font-terminal border rounded-md p-2 outline-none"
            placeholder="Enter Secret Code"
            type="password"
          />
        </form>
        <p className="font-terminal text-2xl h-8 text-cloud-sky">
          {checking ? "VERIFYING..." : error && `>> ${error.toUpperCase()}`}
        </p>
      </div>
    </div>
  );
}
