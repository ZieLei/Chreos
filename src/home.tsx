import { useState, useEffect } from "react";
import Toolbar from "./components/Toolbar";
import Listtab from "./components/Listtab";
import ProfileTab from "./components/ProfileTab";

export default function Home() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return (
    <div className="h-screen bg-black p-3">
      <div className="flex flex-col gap-2 h-full bg-black rounded-sm border-2 border-mint-green py-2 px-2">
        <div className="flex flex-row gap-2">
          <div className="flex border-2 bg-black border-mint-green aspect-square h-8 justify-center items-center rounded-xs">
            <h1 className="font-terminal text-2xl text-center">CH</h1>
          </div>

          <div className="flex flex-row justify-between w-full h-8 bg-mint-green px-6 rounded-xs">
            <h1 className="flex-1 text-left font-terminal text-dark-cyan text-2xl">
              CHREOS DEBT TRACKER
            </h1>
            <h1 className="font-terminal text-dark-cyan text-2xl">{time}</h1>
            <h1 className="flex-1 text-right font-terminal text-dark-cyan text-2xl">
              USER: Adachi{"<3"}
            </h1>
          </div>

          <div className="flex border-2 bg-black border-mint-green aspect-square h-8 justify-center items-center rounded-xs">
            <h1 className="font-terminal text-2xl text-center">?</h1>
          </div>
        </div>
        <Toolbar />
        <div className="flex flex-row gap-2">
          <Listtab />
          <div className="w-screen h-full border-2 border-mint-green" />
          <ProfileTab
            id="1"
            picture="../samples/shimamura.png"
            firstName="Hougetsu"
            lastName="Shimamura"
            birthday="April 10 2005"
            phoneNumber="09123456789"
            email="iloveadachi@gmail.com"
            facebook="Hougetsu Shimamura"
            lastReminded="August 14 2025"
          />
        </div>
      </div>
    </div>
  );
}
