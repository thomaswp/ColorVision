import { WavelengthDistribution } from "./Wavelengths";


const violetWavelength = 420;
const blueWavelength = 460;
const cyanWavelength = 490;
const greenWavelength = 530;
const yellowWavelength = 570;
const orangeWavelength = 610;
const redWavelength = 640;

function distFromWavelengths(wavelengths: number[], stdDev = 20, intensities = wavelengths.map(w => 1)): WavelengthDistribution {
    return {
        peaks: wavelengths.map((w, i) => ({ mean: w, stdDev: stdDev, intensity: intensities[i] }))
    }
}

export const pureRed = distFromWavelengths([redWavelength]);


export const pureGreen = distFromWavelengths([greenWavelength]);


export const pureBlue = distFromWavelengths([blueWavelength]);

export const biYellow = distFromWavelengths([greenWavelength, redWavelength]);

export const pureYellow = distFromWavelengths([yellowWavelength]);

export const biPurple = distFromWavelengths([blueWavelength, redWavelength], 30, [1, 0.5]);

export const pureViolet = distFromWavelengths([violetWavelength]);

export const triWhite = distFromWavelengths([redWavelength, greenWavelength, blueWavelength]);

export const fullWhite = distFromWavelengths([violetWavelength, blueWavelength, cyanWavelength, greenWavelength, yellowWavelength, orangeWavelength, redWavelength]);

export const allSources = [pureRed, pureGreen, pureBlue, biYellow, pureYellow, biPurple, pureViolet, triWhite, fullWhite];