import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./components/leftTable/scenepanel.css";
import "./Scene.css";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { planets } from "./data/planets";
import { fetchEarth } from "./api/nasa";

function getDistanceScale(a: number, realScale: boolean): number {
  if (realScale) {
    return a;
  } else {
    return 1.5 + Math.pow(a, 0.75) * 2.2;
  }
}

function evaluateKeplerianPosition(planetId: string, M_deg: number): {x: number;y: number;z: number;} {
  const p = planets[planetId];
  if (!p) return { x: 0, y: 0, z: 0 };

  const M_rad = M_deg * Math.PI / 180;
  let E = M_rad;
  const e = p.e;
  for (let i = 0; i < 10; i++) {
    const deltaE = (E - e * Math.sin(E) - M_rad) / (1 - e * Math.cos(E));
    E -= deltaE;
    if (Math.abs(deltaE) < 1e-6) break;
  }

  const x_orb = p.a * (Math.cos(E) - e);
  const y_orb = p.a * Math.sqrt(1 - e * e) * Math.sin(E);

  const w_rad = p.omega * Math.PI / 180;
  const o_rad = p.Omega * Math.PI / 180;
  const i_rad = p.I * Math.PI / 180;

  const cos_w = Math.cos(w_rad),sin_w = Math.sin(w_rad);
  const cos_o = Math.cos(o_rad),sin_o = Math.sin(o_rad);
  const cos_i = Math.cos(i_rad),sin_i = Math.sin(i_rad);

  const x = x_orb * (cos_w * cos_o - sin_w * sin_o * cos_i) - y_orb * (sin_w * cos_o + cos_w * sin_o * cos_i);
  const y = x_orb * (cos_w * sin_o + sin_w * cos_o * cos_i) - y_orb * (sin_w * sin_o - cos_w * cos_o * cos_i);
  const z = x_orb * (sin_w * sin_i) + y_orb * (cos_w * sin_i);

  return { x, y, z };
}

function getPositionAtDate(planetId: string, date: Date): {x: number;y: number;z: number;} {
  const p = planets[planetId];
  if (!p) return { x: 0, y: 0, z: 0 };

  const jd = date.getTime() / 86400000 + 2440587.5;
  const t = jd - 2451545.0;
  let M = p.M0 + p.n * t ;
  M = M % 360;
  if (M < 0) M += 360;

  return evaluateKeplerianPosition(planetId, M);
}

function updateWarpSpeedText(timeWarpSpeed: React.RefObject<number>) {
  const text = document.getElementById('warp-speed-text')!;
  text.textContent = `${timeWarpSpeed.current.toFixed(1)}x / DAY`;
}

export default function Scene({ data, timeScale }: any) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dataRef = useRef<any>(null);
  const timeScaleRef = useRef(1);
  const currentDate = useRef(new Date());
  const isPlaying = useRef(true);
  const timeWarpSpeed = useRef(1.0); // days per real-time second
  const selectedPlanetId = useRef("10"); // Default: Sun
  const showOrbits = useRef(false);
  const showGrid = useRef(false);
  const showLabels = useRef(false);
  const realScale = useRef(false);
  const lastFetchTime = useRef(0);
  
  useEffect(() => {
    async function loadEarth() {
        try {
            const earth = await fetchEarth();
            console.log("Earth position:", earth);
        } catch (error) {
            console.error(error);
        }
    }
    loadEarth();

}, []);

  // keep latest API data
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    timeScaleRef.current = timeScale;
  }, [timeScale]);

  
  useEffect(() => {
    if (!mountRef.current) return;
    const panel = document.getElementById("scene-panel");

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    const width = panel.clientWidth;
    const height = panel.clientHeight;

    const camera = new THREE.PerspectiveCamera(
      70,
      width / height,
      0.1,
      1000
    );
    camera.position.set(3, 2, 25);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    mountRef.current.appendChild(renderer.domElement);

        // resize
    const handleResize = () => {
      const width = panel.clientWidth;
      const height = panel.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    handleResize();

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 150;
    controls.minDistance = 2;

    // lights
    scene.add(new THREE.AmbientLight(0x0a1424, 1.5));
    const sunLight = new THREE.PointLight(0xffffff, 3, 300);
    scene.add(sunLight);

    // Ecliptic Grid
    let gridHelper: THREE.GridHelper | null = null;
    const createGrid = () => {
      if (gridHelper) scene.remove(gridHelper);
      gridHelper = new THREE.GridHelper(80, 80, 0x00f3ff, 0x10223b);
      const gridMaterial = gridHelper.material as THREE.Material;
      gridMaterial.opacity = 0.15;
      gridMaterial.transparent = true;
      scene.add(gridHelper);
    };
    createGrid();

    // Sun Visuals
    const sunGroup = new THREE.Group();
    scene.add(sunGroup);

    const sunGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunGroup.add(sunMesh);

    const sunCoreGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const sunCoreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4
    });
    const sunCoreMesh = new THREE.Mesh(sunCoreGeo, sunCoreMat);
    sunGroup.add(sunCoreMesh);

    const coronaMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(1.3 + i * 0.3, 1.35 + i * 0.3, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xff7700,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3 - i * 0.08
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      sunGroup.add(ringMesh);
      coronaMeshes.push(ringMesh);
    }

    // Planets 3D Objects
    interface PlanetMeshGroup {
      group: THREE.Group;
      bodyMesh: THREE.Mesh;
      orbitLine: THREE.Line;
      label: HTMLDivElement;
      leadLine: THREE.Line;
    }
    const planetMeshes: Record<string, PlanetMeshGroup> = {};

    Object.keys(planets).forEach((id) => {
      const p = planets[id];
      const group = new THREE.Group();
      scene.add(group);

      const bodyGeo = new THREE.SphereGeometry(p.radius, 16, 16);
      const bodyMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(p.color),
        wireframe: true,
        transparent: true,
        opacity: 0.7
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      group.add(bodyMesh);

      const coreGeo = new THREE.SphereGeometry(p.radius * 0.4, 8, 8);
      const coreMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(p.color),
        transparent: true,
        opacity: 0.9
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      group.add(coreMesh);

      if (id === "699") {
        const ringGeo = new THREE.RingGeometry(p.radius * 1.4, p.radius * 2.2, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(p.color),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.4,
          wireframe: true
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.5;
        group.add(ringMesh);
      }

      // Orbit Line
      const orbitPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= 128; i++) {
        const M_deg = i / 128 * 360;
        const pos = evaluateKeplerianPosition(id, M_deg);
        orbitPoints.push(new THREE.Vector3(pos.x, pos.z, pos.y));
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(p.color),
        transparent: true,
        opacity: 0.25
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      scene.add(orbitLine);

      // Lead Line
      const leadPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
      const leadGeo = new THREE.BufferGeometry().setFromPoints(leadPoints);
      const leadMat = new THREE.LineDashedMaterial({
        color: 0x00f3ff,
        dashSize: 0.2,
        gapSize: 0.1,
        transparent: true,
        opacity: 0.4
      });
      const leadLine = new THREE.Line(leadGeo, leadMat);
      scene.add(leadLine);

      const label = document.createElement('div');
      label.className = "label-style";
      label.style.borderColor = p.color;
      label.innerHTML = `<span style="color: ${p.color}">●</span> ${p.name.toUpperCase()}`;
      mountRef.current.appendChild(label);

      //btn.addEventListener('click', () => selectPlanet(id));

      planetMeshes[id] = {
        group,
        bodyMesh,
        orbitLine,
        label,
        leadLine
      };
    });

    function updateCameraTracking() {
      if (selectedPlanetId.current == "10") {
        controls.target.set(0, 0, 0);
      } else {
        const meshGroup = planetMeshes[selectedPlanetId.current];
        if (meshGroup) {
          const pos = meshGroup.group.position;
          controls.target.copy(pos);
        }
      }
    };

    function updateTelemetry() {
      const panel = document.getElementById('telemetry-panel')!;
      
      if (selectedPlanetId.current === "10") {
        // Sun selected
        document.getElementById('target-index')!.textContent = "ID: 10";
        document.getElementById('target-name')!.textContent = "SUN";
        document.getElementById('target-class')!.textContent = "G2V YELLOW DWARF STAR";
        document.getElementById('telemetry-dist')!.textContent = "0.0000 AU";
        document.getElementById('telemetry-vel')!.textContent = "0.00 km/s";
        document.getElementById('telemetry-mass')!.textContent = "1.989e30 kg";
        document.getElementById('telemetry-temp')!.textContent = "5500 °C";
        document.getElementById('coord-x')!.textContent = "0.0000";
        document.getElementById('coord-y')!.textContent = "0.0000";
        document.getElementById('coord-z')!.textContent = "0.0000";
        targetLeadLine.visible = false;
      } else {
        const p = planets[selectedPlanetId.current];
        const meshGroup = planetMeshes[selectedPlanetId.current];
        if (p && meshGroup) {
          let pos = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 };
          //if (apiPositions[selectedPlanetId]) {
          //  pos = apiPositions[selectedPlanetId];
          //} else {
            const localPos = getPositionAtDate(selectedPlanetId.current, currentDate.current);
            pos = { ...localPos, vx: 0, vy: 0, vz: 0 }; // Velocity approximated or 0
          //}

          const dist = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
          // Orbital speed in km/s: v = sqrt(G*M/r) or from vector velocity
          let speed = 0;
          if (pos.vx !== 0 || pos.vy !== 0) {
            // Convert AU/day to km/s: 1 AU = 1.496e8 km, 1 day = 86400 s
            const speed_au_day = Math.sqrt(pos.vx * pos.vx + pos.vy * pos.vy + pos.vz * pos.vz);
            speed = speed_au_day * 1.496e8 / 86400;
          } else {
            // Analytical speed formula: v = sqrt(G*M_sun / r)
            // G*M_sun = 1.327e11 km^3/s^2. r in km = dist * 1.496e8
            speed = Math.sqrt(1.327e11 / (dist * 1.496e8));
          }

          document.getElementById('target-index')!.textContent = `ID: ${selectedPlanetId}`;
          document.getElementById('target-name')!.textContent = p.name.toUpperCase();
          document.getElementById('target-class')!.textContent = p.class;
          document.getElementById('telemetry-dist')!.textContent = `${dist.toFixed(4)} AU`;
          document.getElementById('telemetry-vel')!.textContent = `${speed.toFixed(2)} km/s`;
          document.getElementById('telemetry-mass')!.textContent = p.mass;
          document.getElementById('telemetry-temp')!.textContent = p.temp;
          document.getElementById('coord-x')!.textContent = pos.x.toFixed(4);
          document.getElementById('coord-y')!.textContent = pos.y.toFixed(4);
          document.getElementById('coord-z')!.textContent = pos.z.toFixed(4);

          // Update target lead line
          targetLeadLine.visible = true;
          const targetPos = meshGroup.group.position;
          const targetLeadPoints = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z)
          ];
          targetLeadLine.geometry.setFromPoints(targetLeadPoints);
        }
      }
    }
    const list = document.getElementById("planet-list");
    const sunbtn = document.createElement("button");
    sunbtn.className= `planet-button`;
    sunbtn.innerHTML = `
      <div class="planet-row">
          <div class="planet-name-container">
              <span class="sun-dot" style = "background-color:#ffaa00"></span>
              <span class="planet-name">SUN</span>
          </div>
          <span class="planet-distance">0.00 AU</span>
      </div>`;
    sunbtn.addEventListener('click', () => selectPlanet("10"));
    list.appendChild(sunbtn);

    Object.keys(planets).map((id) => {
      const p = planets[id];
      const btn = document.createElement("button");
      btn.className= `planet-button`;
      btn.innerHTML = `
        <div class="planet-row">
            <div class="planet-name-container">
                <span class="sun-dot" style = "background-color: ${p.color}"></span>
                <span class="planet-name">${p.name.toUpperCase()}</span>
            </div>
            <span class="planet-distance">${p.a.toFixed(2)} AU</span>
        </div>`;
      btn.addEventListener('click', () => selectPlanet(id));
      list.appendChild(btn);
      });
    
    // Target Lead Line
    const targetLeadPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
    const targetLeadGeo = new THREE.BufferGeometry().setFromPoints(targetLeadPoints);
    const targetLeadMat = new THREE.LineBasicMaterial({
      color: 0xff3333,
      transparent: true,
      opacity: 0.6
    });
    const targetLeadLine = new THREE.Line(targetLeadGeo, targetLeadMat);
    scene.add(targetLeadLine);

  function selectPlanet(id: string) {
    selectedPlanetId.current = id;
    //populatePlanetList();
    updateCameraTracking();
    updateTelemetry();
    
    // Update camera mode text
    const camModeText = document.getElementById('cam-mode')!;
    if (id === "10") {
      camModeText.textContent = "ORBITAL FREE";
    } else {
      camModeText.textContent = `TRACKING: ${planets[id].name.toUpperCase()}`;
    }
  }
  const datePicker = document.getElementById('date-picker') as HTMLInputElement;
  datePicker.value = currentDate.current.toISOString().split('T')[0];

  //button controls
  document.getElementById('btn-rewind')!.addEventListener('click', () => {
    if (timeWarpSpeed.current > 0.1) timeWarpSpeed.current /= 2;
    else if (timeWarpSpeed.current >= -10) timeWarpSpeed.current -= 1;
    updateWarpSpeedText(timeWarpSpeed);
  });

  document.getElementById('btn-play-pause')!.addEventListener('click', () => {
    isPlaying.current = !isPlaying.current;
    document.getElementById('btn-play-pause')!.textContent = isPlaying.current ? "PAUSE" : "PLAY";
  });

  document.getElementById('btn-forward')!.addEventListener('click', () => {
    if (timeWarpSpeed.current < 0) timeWarpSpeed.current += 1;
    else if (timeWarpSpeed.current === 0) timeWarpSpeed.current = 1;
    else timeWarpSpeed.current *= 2;
    updateWarpSpeedText(timeWarpSpeed);
  });

  document.getElementById('btn-today')!.addEventListener('click', () => {
    currentDate.current = new Date();
    datePicker.value = currentDate.current.toISOString().split('T')[0];
    //fetchLiveEphemeris(currentDate);
  });

  // Visual Toggles
const chkOrbits = document.getElementById('chk-orbits') as HTMLInputElement;
  chkOrbits.addEventListener('change', () => {
    showOrbits.current = chkOrbits.checked;
  });

  const chkGrid = document.getElementById('chk-grid') as HTMLInputElement;
  chkGrid.addEventListener('change', () => {
    showGrid.current = chkGrid.checked;
    if (gridHelper) gridHelper.visible = showGrid.current;
  });

  const chkLabels = document.getElementById('chk-labels') as HTMLInputElement;
  chkLabels.addEventListener('change', () => {
    showLabels.current = chkLabels.checked;
  });

  const chkRealScale = document.getElementById('chk-real-scale') as HTMLInputElement;
  chkRealScale.addEventListener('change', () => {
    realScale.current = chkRealScale.checked;
    createGrid();
  });
    const clock = new THREE.Clock();
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const api = dataRef.current;
      //const planets = api?.planets ?? [];

      // Rotate Sun
      sunMesh.rotation.y += 0.005;
      coronaMeshes.forEach((mesh, index) => {
        mesh.rotation.z += (index % 2 === 0 ? 1 : -1) * 0.002;
        const pulse = 1 + Math.sin(Date.now() * 0.001 + index) * 0.03;
        mesh.scale.set(pulse, pulse, 1);
      });

        // Rotate planets
      Object.keys(planetMeshes).forEach((id) => {
        planetMeshes[id].bodyMesh.rotation.y += 0.01;
       // console.log(id);
      });

      // Update positions
      Object.keys(planets).forEach((id) => {
        const p = planets[id];
        const meshGroup = planetMeshes[id];

        let pos = { x: 0, y: 0, z: 0 };
        pos = getPositionAtDate(id, currentDate.current);

        const r_raw = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
        const scale = getDistanceScale(r_raw, false) / (r_raw || 1);

        const x_scaled = pos.x * scale;
        const y_scaled = pos.z * scale;
        const z_scaled = pos.y * scale;

        meshGroup.group.position.set(x_scaled, y_scaled, z_scaled);
      // Update orbit lines scale
        if (showOrbits.current) {
          meshGroup.orbitLine.visible = true;
          const points: THREE.Vector3[] = [];
          for (let i = 0; i <= 128; i++) {
            const M_deg = (i / 128) * 360;
            const oPos = evaluateKeplerianPosition(id, M_deg);
            const o_r = Math.sqrt(oPos.x * oPos.x + oPos.y * oPos.y + oPos.z * oPos.z);
            const o_scale = getDistanceScale(o_r, realScale.current) / (o_r || 1);
            points.push(new THREE.Vector3(oPos.x * o_scale, oPos.z * o_scale, oPos.y * o_scale));
          }
          meshGroup.orbitLine.geometry.setFromPoints(points);
        } else {
          meshGroup.orbitLine.visible = false;
        }
        
        // Update lead line to ecliptic plane
        if (showGrid.current) {
          meshGroup.leadLine.visible = true;
          const leadPoints = [
            new THREE.Vector3(x_scaled, y_scaled, z_scaled),
            new THREE.Vector3(x_scaled, 0, z_scaled)
          ];
          meshGroup.leadLine.geometry.setFromPoints(leadPoints);
          meshGroup.leadLine.computeLineDistances();
        } else {
          meshGroup.leadLine.visible = false;
        }
      
        // Labels
        if (showLabels.current) {
          meshGroup.label.style.opacity = '1';
          const tempV = new THREE.Vector3(x_scaled, y_scaled + p.radius + 0.3, z_scaled);
          tempV.project(camera);

          // Check if behind camera
          if (tempV.z > 1) {
            meshGroup.label.style.opacity = '0';
          } else {
            const x_screen = (tempV.x *  .5 + .5) * mountRef.current.clientWidth;
            const y_screen = (tempV.y * -.5 + .5) * mountRef.current.clientHeight;
            meshGroup.label.style.left = `${x_screen}px`;
            meshGroup.label.style.top = `${y_screen}px`;
          }
        } else {
          meshGroup.label.style.opacity = '0';
        }
      });
      const delta = clock.getDelta();

      // Time simulation
    if (isPlaying.current) {
      //const daysToAdd = timeWarpSpeed.current * delta;
      //currentDate.current.setDate(currentDate.current.getDate() + daysToAdd);
      currentDate.current.setTime(currentDate.current.getTime() + timeWarpSpeed.current * delta * 86400000);
      //console.log(delta);
      datePicker.value = currentDate.current.toISOString().split('T')[0];
      
      // Fetch live ephemeris periodically (every 5 seconds of real-time) to stay synced
      //const now = Date.now();
      //if (now - lastFetchTime > 5000) {
       // fetchLiveEphemeris(currentDate);
        //lastFetchTime = now;
      //}
    }
    const timeStr = (new Date()).toUTCString().split(' ')[4];
    document.getElementById('hud-time')!.textContent = timeStr;

    // Update camera latitude display
    const camLat = (camera.position.y / (camera.position.length() || 1)) * (180 / Math.PI);
    document.getElementById('cam-lat')!.textContent = `${camLat.toFixed(2)}°`;
    
      // Camera tracking
    updateCameraTracking();
    controls.update();

      renderer.render(scene, camera);
    };

    animate();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if(mountRef.current?.contains(renderer.domElement)){
        mountRef.current?.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="scene-panel" id = "scene-panel" >
      <div ref={mountRef} className="three-container"></div>

      <div className="hud-top-right">
          <div className="hud-box">
              CAM_MODE: <span id="cam-mode">ORBITAL FREE</span>
          </div>

          <div className="hud-box">
              ECLIPTIC_LAT: <span id="cam-lat">0.00°</span>
          </div>
      </div>

      <div className="hud-bottom-left">
          <div className="hud-box">
              GRID_SCALE: <span>1.0 AU / DIV</span>
          </div>

          <div className="hud-box">
              SYSTEM_TIME: <span id="hud-time">--:--:--</span>
          </div>
      </div>

      <div className="compass">
          <div className="compass-circle">
              <div className="compass-center"></div>
              <div className="compass-horizontal"></div>
              <div className="compass-vertical"></div>
          </div>
      </div>        
    </div>
);
}