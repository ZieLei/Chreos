import "./App.css";
import CRTScreen from "./components/CRTScreen";

function App() {
  return (
    <CRTScreen>
      <div className="flex bg-black justify-center items-center h-screen">
        <div className="flex flex-col gap-2">
          <h1 className="font-terminal text-7xl">Welcome!</h1>
          <input
            className="font-terminal border rounded-md p-2 outine-none"
            placeholder="Enter Secret Code"
          />
        </div>
      </div>
    </CRTScreen>
  );
}

export default App;
