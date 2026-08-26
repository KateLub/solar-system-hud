export interface PlanetConfig {
  id: string;
  name: string;
  color: string;
  radius: number;
  realRadius: number;
  a: number;
  e: number;
  I: number;
  Omega: number;
  omega: number;
  M0: number;
  n: number;
  mass: string;
  temp: string;
  class: string;
}

export const planets: Record<string, PlanetConfig> = {
  "199": { id: "199", name: "Mercury", color: "#00f3ff", radius: 0.18, realRadius: 2439.7, a: 0.387098, e: 0.205630, I: 7.0049, Omega: 48.33167, omega: 29.12478, M0: 174.79439, n: 4.092334, mass: "3.3011e23 kg", temp: "167 °C", class: "TERRESTRIAL PLANET" },
  "299": { id: "299", name: "Venus", color: "#ff9f00", radius: 0.26, realRadius: 6051.8, a: 0.723332, e: 0.006773, I: 3.3947, Omega: 76.68069, omega: 54.85229, M0: 50.44675, n: 1.602130, mass: "4.8675e24 kg", temp: "464 °C", class: "TERRESTRIAL PLANET" },
  "399": { id: "399", name: "Earth", color: "#00ff66", radius: 0.28, realRadius: 6371.0, a: 1.000000, e: 0.016708, I: 0.0, Omega: 0.0, omega: 102.94719, M0: -2.48284, n: 0.985608, mass: "5.9723e24 kg", temp: "15 °C", class: "TERRESTRIAL PLANET" },
  "499": { id: "499", name: "Mars", color: "#ff3333", radius: 0.22, realRadius: 3389.5, a: 1.523662, e: 0.093412, I: 1.8506, Omega: 49.57854, omega: 286.46230, M0: 19.41248, n: 0.524033, mass: "6.4171e23 kg", temp: "-65 °C", class: "TERRESTRIAL PLANET" },
  "599": { id: "599", name: "Jupiter", color: "#ffcc00", radius: 0.65, realRadius: 69911.0, a: 5.203363, e: 0.048393, I: 1.3053, Omega: 100.55615, omega: -85.80230, M0: 19.65053, n: 0.083085, mass: "1.8982e27 kg", temp: "-110 °C", class: "GAS GIANT" },
  "699": { id: "699", name: "Saturn", color: "#e6b800", radius: 0.55, realRadius: 58232.0, a: 9.537070, e: 0.054150, I: 2.4845, Omega: 113.71504, omega: -21.28310, M0: -42.48762, n: 0.033459, mass: "5.6834e26 kg", temp: "-140 °C", class: "GAS GIANT" },
  "799": { id: "799", name: "Uranus", color: "#00ffff", radius: 0.42, realRadius: 25362.0, a: 19.19126, e: 0.047168, I: 0.7699, Omega: 74.22988, omega: 96.73436, M0: 142.26794, n: 0.011732, mass: "8.6810e25 kg", temp: "-195 °C", class: "ICE GIANT" },
  "899": { id: "899", name: "Neptune", color: "#3366ff", radius: 0.40, realRadius: 24622.0, a: 30.06896, e: 0.008586, I: 1.7691, Omega: 131.72169, omega: -86.75034, M0: 259.90868, n: 0.005981, mass: "1.0241e26 kg", temp: "-200 °C", class: "ICE GIANT" },
  "999": { id: "999", name: "Pluto", color: "#9966ff", radius: 0.14, realRadius: 1188.3, a: 39.48168, e: 0.248807, I: 17.14175, Omega: 110.30347, omega: 113.76329, M0: 14.86205, n: 0.003975, mass: "1.3030e22 kg", temp: "-225 °C", class: "DWARF PLANET" }
};