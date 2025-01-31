import { getBellCurve, WavelengthDistribution, WavelengthPeak } from "../data/Wavelengths";
import Color from "color";
import { wavelengthToRGB as wavelengthToColor } from "../util/ColorConverter";
import { EventEmitter } from "../util/Util";

type Point = {x: number, y: number};

export class WavelengthDistViz {

    public readonly canvas: HTMLCanvasElement;

    public readonly onEdited = new EventEmitter<void>();

    private draggingPeak: WavelengthPeak | null = null;
    private originalPeak: WavelengthPeak | null = null;
    private startPosition: Point | null = null;

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

        this.canvas.addEventListener("mousedown", (e) => {
            this.draggingPeak = this.getClickedPeak(e.offsetX, e.offsetY);
            if (!this.draggingPeak) return;
            this.originalPeak = { ...this.draggingPeak };
            this.startPosition = { x: e.offsetX, y: e.offsetY };
        });
        window.addEventListener("mouseup", (e) => {
            this.resetDrag();
        });
        window.addEventListener("mousemove", (e) => {
            if (!this.draggingPeak || !this.startPosition || this.originalPeak == null) return;
            const deltaX = e.offsetX - this.startPosition.x;
            const deltaY = e.offsetY - this.startPosition.y;
            const deltaWavelength = deltaX / this.width * this.wavelengthRange();
            const deltaIntensity = deltaY / this.height;
            this.draggingPeak.mean = Math.min(Math.max(this.originalPeak.mean + deltaWavelength, this.minWaveLength), this.maxWaveLength);
            this.draggingPeak.intensity = Math.min(Math.max(this.originalPeak.intensity - deltaIntensity, 0), 1);
            this.render();
            this.onEdited.emit();
        });
        this.canvas.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            const peak = this.getClickedPeak(e.offsetX, e.offsetY);
            if (!peak) return;
            this.resetDrag();
            this.dist.peaks = this.dist.peaks.filter(p => p !== peak);
            this.render();
            this.onEdited.emit();
        });
        this.canvas.addEventListener("dblclick", (e) => {
            if (e.button !== 0) return;
            // Add a new peak at this location, based on the relative
            // x and y coordinates within the canvas.
            const wavelength = this.xToWavelength(e.offsetX);
            const intensity = 1 - e.offsetY / this.height;
            this.resetDrag();
            this.dist.peaks.push({ mean: wavelength, stdDev: 10, intensity });
            this.render();
            this.onEdited.emit();
        });

    }

    resetDrag() {
        this.draggingPeak = null;
        this.originalPeak = null;
        this.startPosition = null;
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

    getClickedPeak(x: number, y: number) {
        let closestPeak: WavelengthPeak | null = null;
        let closestDist = Infinity;
        for (let peak of this.dist.peaks) {
            const xPeak = this.wavelengthToX(peak.mean);
            const dist = Math.abs(xPeak - x);
            if (dist < closestDist) {
                closestPeak = peak;
                closestDist = dist;
            }
        }
        return closestPeak;
    }

    renderPeak({mean, stdDev, intensity}: WavelengthPeak) {
        let ctx = this.canvas.getContext("2d")!;
        const demiWidth = Math.floor(this.wavelengthRange() * 0.85);
        const meanColor = wavelengthToColor(mean);
        // console.log(meanColor.string());
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
