import "./footer.css";

export default function Footer() {
    return (
        <div className = "container">
            <div className = "first-half">
                <span className="text-settings">STATUS: <span className = "green-text"> ONLINE</span></span>
                <span className="text-settings">|</span>
                <span className="text-settings">TELEMETRY SOURCE: <span className = "orange-text"> LOCAL ANALYTICAL MODEL</span></span> 
            </div>
            <div className = "first-half">
                <span className="text-settings">LATENCY: <span className = "blue-text"> 589 ms</span></span>
                <span className="text-settings">|</span>
                <span className="text-settings">COORDS: J2000 ECLIPTIC</span> 
            </div>
      </div>
    )
};