import "./settings.css";

export default function Settings(){
    return (
        <div className="settings-panel">
          <div>
            <div className="settings-title-box">
              <span>SIMULATION DATE</span>
              <span id="date-source-badge" className="date-source-badge">NASA API</span>
            </div>
            <input type="date" id="date-picker" className="date-picker"/>
          </div>

          <div>
            <span className="settings-label">TIME WARP</span>
            <div className="time-warp-buttons">
              <button id="btn-rewind" className="warp-button">◀◀</button>
              <button id="btn-play-pause" className="warp-button">PAUSE</button>
              <button id="btn-forward" className="warp-button">▶▶</button>
              <button id="btn-today" className="warp-button">TODAY</button>
            </div>
            <div className="warp-speed">
              <span>SPEED:</span>
              <span id="warp-speed-text" className="warp-speed-value">1.0x / DAY</span>
            </div>
          </div>

          <div>
            <span className="settings-label">VISUAL SCHEMATICS</span>
            <div className="schematics-list">
              <label className="schematic-option">
                <span>ORBITAL TRACKS</span>
                <input type="checkbox" id="chk-orbits"  className="schematic-checkbox"/>
              </label>
              <label className="schematic-option">
                <span>COORDINATE GRID</span>
                <input type="checkbox" id="chk-grid"  className="schematic-checkbox"/>
              </label>
              <label className="schematic-option">
                <span>CELESTIAL LABELS</span>
                <input type="checkbox" id="chk-labels"  className="schematic-checkbox"/>
              </label>
              <label className="schematic-option">
                <span>SCALE REALISM</span>
                <input type="checkbox" id="chk-real-scale" className="schematic-checkbox" />
              </label>
            </div>
          </div>
        </div>
    )
};