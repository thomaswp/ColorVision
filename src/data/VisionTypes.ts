import { WavelengthDistribution } from "./Wavelengths";

export const humanTricolorVision = {
    peaks: [
        { mean: 560, stdDev: 50, intensity: 1 },
        { mean: 530, stdDev: 45, intensity: 1 },
        { mean: 440, stdDev: 30, intensity: 1 },
    ]
} as WavelengthDistribution;


export const humanRedGreenColorBlind = {
    peaks: [
        { mean: 560, stdDev: 50, intensity: 1 },
        { mean: 440, stdDev: 30, intensity: 1 },
    ]
} as WavelengthDistribution;

export const dogVision = {
    peaks: [
        { mean: 430, stdDev: 50, intensity: 1 },
        { mean: 560, stdDev: 60, intensity: 1 },
    ]
}

export const panVision = {
    peaks: Array.from({ length: 7 }, (_, i) => ({
        mean: 410 + i * 45,
        stdDev: 20,
        intensity: 1,
    }))
}

export const monochromat = {
    peaks: [
        { mean: 550, stdDev: 100, intensity: 1 },
    ]
} as WavelengthDistribution;
