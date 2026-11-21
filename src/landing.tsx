import { useNavigate } from "react-router";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex bg-black justify-center items-center h-screen">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="font-terminal text-7xl">Welcome!</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/home");
          }}
        >
          <input
            className="font-terminal border rounded-md p-2 outline-none"
            placeholder="Enter Secret Code"
            type="password"
          />
        </form>
      </div>
    </div>
  );
}
