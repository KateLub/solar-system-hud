import { useEffect, useState } from "react";
import Scene from "./Scene";
import HUDHeader from "./components/leftTable/hudHeader";
import Settings from "./components/leftTable/settings";
import CelIndex from "./components/leftTable/celIndex";
import Target from "./components/rightTable/target";
import FeedAlpha from "./components/rightTable/feedAlpha";
import FeedBeta from "./components/rightTable/feedBeta";
import Footer from "./components/footer";

export default function App() {
  const [data, setData] = useState<any>(null);
    const [timeScale, setTimeScale] = useState(1);

  useEffect(() => {

    fetch("http://localhost:3001/api/earth")
        .then((res) => res.json())
        .then((data) => {
            console.log("Earth:", data);
            setData(data);
        })
        .catch(console.error);

}, []);

  return (
    <div style={{display: "flex", flex: "1", flexDirection: "column"}}>
      <div style={{display: "flex", flex: "1",flexDirection: "row", padding:"1vw", minHeight:"0"}} >
        <div style={{display:"flex", flex: "0.5", flexDirection: "column", minHeight:"0"}} >
          <HUDHeader/>
          <Settings/>
          <CelIndex/>
        </div>
        {/*<div
          style={{
            position: "absolute",
            zIndex: 10,
            top: 60,
            left: 10,
            background: "rgba(0,0,0,0.5)",
            padding: 10,
            borderRadius: 8,
          }}
        >
          <label>Time Scale: {timeScale.toFixed(1)}</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={timeScale}
            onChange={(e) => setTimeScale(parseFloat(e.target.value))}
          />
        </div>*/}

          
        <Scene data={data} timeScale={timeScale} />

        <div style={{display:"flex", flex: "0.5", flexDirection: "column", minHeight:"0"}} >
          <Target/>
          <FeedAlpha/>
          <FeedBeta/>
        </div>

        {/*<pre
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            zIndex: 10,
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>*/}
      </div>
      <Footer />
    </div>
  );
}