import "./celIndex.css";
import { planets } from "../../data/planets";

export default function CelIndex() {
    return (
        <div className="index-panel" >
          <span className="index-title-text">CELESTIAL INDEX</span>
            <div id="planet-list" className="planets-list">
            </div>
        </div>
    )
};