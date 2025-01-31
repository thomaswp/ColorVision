export type WavelengthPeak = {
    mean: number;
    stdDev: number;
    intensity: number;
}

export type WavelengthDistribution = {
    peaks: WavelengthPeak[];
}

export type ColorPerception = {
    wavelength: number;
    intensity: number;
}

export type ColorPerceptions = ColorPerception[];

export function getPerception(colorVision: WavelengthDistribution, source: WavelengthDistribution, delta = 1) {
    const perceptions: ColorPerceptions = [];
    for (let peak of colorVision.peaks) {
        const intensity = getPerceptionIntensity(peak, source, delta);
        perceptions.push({ wavelength: peak.mean, intensity });
    }
    return perceptions;
}

export function getPerceptionIntensity(perception: WavelengthPeak, source: WavelengthDistribution, delta = 1) {
    if (perception.intensity <= 0) return 0;
    let areaActivated = 0;
    let areaPossible = 0;
    const sd3 = 2 * perception.stdDev;
    for (let wavelength = perception.mean - sd3; wavelength <= perception.mean + sd3; wavelength += delta) {
        const perceptionIntensity = getBellCurve(perception.mean, perception.stdDev, wavelength) * perception.intensity;
        areaPossible += perceptionIntensity;
        let sourceIntensity = 0;
        for (let peak of source.peaks) {
            const peakIntensity = getBellCurve(peak.mean, peak.stdDev, wavelength) * peak.intensity;
            sourceIntensity += peakIntensity;
        }
        areaActivated += perceptionIntensity * Math.min(sourceIntensity, 1);

    }
    return areaActivated / areaPossible;
}

export function getBellCurve(mean: number, stdDev: number, x: number) {
    // return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
    return Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2)));
}