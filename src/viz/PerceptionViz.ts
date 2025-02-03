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
        public dotDimension = 20,
    ) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
    }

    public update(perceptions: ColorPerceptions) {
        this.perceptions = perceptions;
        this.render();
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

        ctx.fillRect(0, 0, this.width, this.height);
        for (let i = 0; i < nDots; i++) {
            const x = i % this.dotDimension;
            const y = Math.floor(i / this.dotDimension);
            const dotColor = dots[i];
            ctx.fillStyle = dotColor.string();

            ctx.beginPath();
            ctx.ellipse(
                (x + 0.5) * this.width / this.dotDimension,
                (y + 0.5) * this.height / this.dotDimension,
                this.width / this.dotDimension / 2,
                this.height / this.dotDimension / 2,
                0, 0, 2 * Math.PI
            );
            ctx.fill();
            // ctx.fillRect(x * this.width / this.dotDimension, y * this.height / this.dotDimension, this.width / this.dotDimension + 0.5, this.height / this.dotDimension + 0.5);
        }
    }
}