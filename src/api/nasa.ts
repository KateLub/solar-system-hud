export interface PlanetPosition {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    source: string;
}

export async function fetchEarth(): Promise<PlanetPosition> {

    const response = await fetch(
        "http://localhost:3001/api/earth"
    );

    if (!response.ok) {
        throw new Error("Failed to fetch Earth position");
    }

    const data: PlanetPosition = await response.json();

    return data;
}