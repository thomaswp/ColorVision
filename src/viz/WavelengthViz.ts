import { getBellCurve, WavelengthDistribution, WavelengthPeak } from "../data/Wavelengths";
import Color from "color";
import { wavelengthToRGB as wavelengthToColor } from "../util/ColorConverter";

export class WavelengthDistViz {

    public readonly canvas: HTMLCanvasElement;

    constructor(
        private dist: WavelengthDistribution, 
        public readonly width: number, 
        public readonly height: number,
        public readonly minWaveLength: number,
        public readonly maxWaveLength: number,
    ) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
    }

    render() {
        let ctx = this.canvas.getContext("2d")!;
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, this.width, this.height);

        for (let peak of this.dist.peaks) {
            this.renderPeak(peak);
        }
    }

    renderPeak({mean, stdDev, intensity}: WavelengthPeak) {
        let ctx = this.canvas.getContext("2d")!;
        const demiWidth = Math.floor(this.wavelengthRange() * 0.85);
        const meanColor = wavelengthToColor(mean);
        console.log(meanColor.string());
        ctx.strokeStyle = meanColor.string();
        ctx.fillStyle = meanColor.alpha(0.3).string();
        ctx.beginPath();
        for (let xOffset = -demiWidth; xOffset <= demiWidth; xOffset++) {
            const wavelength = mean + xOffset;
            const prob = getBellCurve(mean, stdDev, wavelength) * intensity;
            const x = this.wavelengthToX(wavelength);
            const y = this.probToY(prob);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.fill();
    }

    wavelengthRange() {
        return this.maxWaveLength - this.minWaveLength;
    }

    xToWavelength(x: number) {
        return this.minWaveLength + (this.maxWaveLength - this.minWaveLength) * x / this.width;
    }

    wavelengthToX(wavelength: number) {
        return this.width * (wavelength - this.minWaveLength) / (this.maxWaveLength - this.minWaveLength);
    }

    probToY(prob: number) {
        return this.height * (1 - prob) * 0.95 + this.height * 0.05 - 1;
    }
}
