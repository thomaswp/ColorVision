import Color from "color";
import { ColorPerceptions } from "../data/Wavelengths";
import { wavelengthToRGB } from "../util/ColorConverter";
import { shuffle } from "../util/Util";

export class PerceptionViz {
    public readonly canvas: HTMLCanvasElement;
    
    constructor(
        private perceptions: ColorPerceptions, 
        public readonly width: number, 
        public readonly height: number,
        public readonly minWaveLength: number,
        public readonly maxWaveLength: number,
        public dotDimension = 10,
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

        const nDots = this.dotDimension * this.dotDimension;
        const dotsPerColor = nDots / this.perceptions.length;
        const dots = [];
        for (let i = 0; i < nDots; i++) {
            const colorIndex = Math.floor(i / nDots * this.perceptions.length);
            const perception = this.perceptions[colorIndex];
            const dotIndexInColor = i % dotsPerColor;
            if ((dotIndexInColor + 0.5) / dotsPerColor < perception.intensity) {
                dots.push(wavelengthToRGB(perception.wavelength));
            } else {
                dots.push(Color.rgb(0, 0, 0));
            }
        }
        shuffle(dots, "1234");

        for (let i = 0; i < nDots; i++) {
            const x = i % this.dotDimension;
            const y = Math.floor(i / this.dotDimension);
            const dotColor = dots[i];
            ctx.fillStyle = dotColor.string();
            ctx.fillRect(x * this.width / this.dotDimension, y * this.height / this.dotDimension, this.width / this.dotDimension, this.height / this.dotDimension);
        }
    }
}