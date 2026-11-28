import "./App.css";
import { Routes, Route } from "react-router";
import Landing from "./landing";
import Home from "./home";
import RequireAuth from "./components/RequireAuth";
import GuestOnly from "./components/GuestOnly";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <GuestOnly>
            <Landing />
          </GuestOnly>
        }
      />
      <Route
        path="/home"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
