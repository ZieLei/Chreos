import "./App.css";
import { Routes, Route } from "react-router";
import Landing from "./landing";
import Home from "./home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
