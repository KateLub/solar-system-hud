import "./feedBeta.css";

export default function FeedBeta(){
    return (
        <div className="beta-panel">
            <div className="subpanel">
              <span className="beta-orange-text">FEED BETA: DIAGNOSTIC INTEL</span>
              <span className="beta-orange-text2">MONITOR</span>
            </div>
            <div className="subpanel2">
                <img src="src\components\rightTable\Screenshot 2026-06-29 151907.png" className = "image" alt="Thermal Diagnostic Feed" />
              <div className="subpanel3"></div>
              <div className="overlay-text">SYS.STAT: WARN_LVL_1</div>
              
            </div>
        </div>
    )
};