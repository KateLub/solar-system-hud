import "./target.css";

export default function Target() {
    return (
        <div id="target-panel" className="target-panel">
          <div className="target-title">
            <span className="target-title-text">TARGET TELEMETRY</span>
            <span id="target-index" className="target-id-text">ID: 10</span>
          </div>
          <div>
            <h2 id="target-name" className="target-name-text">SUN</h2>
            <p id="target-class" className="target-class">G2V YELLOW DWARF STAR</p>
          </div>

          <div className="telemetry-grid">
            <div className="telemetry-box">
              <span className="telemetry-label">DISTANCE TO SUN</span>
              <span id="telemetry-dist" className="telemetry-value">0.0000 AU</span>
            </div>
            <div className="telemetry-box">
              <span className="telemetry-label">ORBITAL VELOCITY</span>
              <span id="telemetry-vel" className="telemetry-value">0.00 km/s</span>
            </div>
            <div className="telemetry-box">
              <span className="telemetry-label">MASS INDEX</span>
              <span id="telemetry-mass" className="telemetry-value">1.989e30 kg</span>
            </div>
            <div className="telemetry-box">
              <span className="telemetry-label">MEAN TEMP</span>
              <span id="telemetry-temp" className="telemetry-value">5500 °C</span>
            </div>
          </div>

          <div className="coordinates-box">
            <span className="coordinates-label">CARTESIAN COORDINATES (AU)</span>
            <div className="coordinates-grid">
              <div>X: <span id="coord-x" className="coordinate-value">0.0000</span></div>
              <div>Y: <span id="coord-y" className="coordinate-value">0.0000</span></div>
              <div>Z: <span id="coord-z" className="coordinate-value">0.0000</span></div>
            </div>
          </div>
        </div>
    )
};