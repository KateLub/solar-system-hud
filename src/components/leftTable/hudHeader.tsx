import "./HUDHeader.css";

export default function HUDHeader() {
  return (
  <div className="hud-panel">
    <div className="hud-top-line"/>
    <div style = {{padding: "3cqw 3cqw"}}>
    <div className="hud-row">
      <div>SYSTEM: ACTIVE</div>

      <div className="hud-live">
        <div className="dot"></div>
        LIVE SYNC
      </div>
    </div>

    <div className="hud-title">
      HORIZONS 3D
    </div>

    <div className="hud-subtitle">
      NASA JPL EPHEMERIS TELEMETRY HUD
    </div>

    <div className="scanlines"></div>
  </div>
  </div>
  )};
