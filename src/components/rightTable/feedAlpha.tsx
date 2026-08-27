import "./feedAlpha.css";
import alphaImage from "./14374912.png";

export default function FeedAlpha() {
  return (
  <div className="alpha-panel">
      <div className="orbital-feed-header">
        <span className="alpha-cyan-text">FEED ALPHA: DIAGNOSTIC INTEL</span>
        <span className="alpha-cyan-text2">LIVE</span>
      </div>
      <div className="orbital-feed-content">
          <img src={alphaImage} className = "orbital-feed-image" alt="Wired Reference Uploaded" />
        <div className="orbital-feed-grid"></div>
        <div className="orbital-feed-location">SYS.LOC: ORB.BETA</div>
      </div>
  </div>
  )};
