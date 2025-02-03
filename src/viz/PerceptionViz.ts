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
        public dotDimension = 15,
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

        const dotDimensionY = this.dotDimension;
        const dotDimensionX = Math.floor(this.dotDimension * this.width / this.height);
        console.log(dotDimensionX, dotDimensionY);

        const nDots = dotDimensionX * dotDimensionY;
        const dotsPerColor = nDots / this.perceptions.length;
        const dots = [];
        for (let i = 0; i < nDots; i++) {
            const colorIndex = Math.floor(i / nDots * this.perceptions.length);
            const perception = this.perceptions[colorIndex];
            const dotIndexInColor = i % dotsPerColor;
            if ((dotIndexInColor + 0.5) / dotsPerColor < perception.intensity) {
                dots.push(wavelengthToRGB(perception.wavelength).desaturate(0.05).darken(0.05));
            } else {
                dots.push(Color.rgb(39, 39, 39));
            }
        }
        shuffle(dots, "1234");

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.width, this.height);

        for (let x = 0; x < dotDimensionX; x++) {
            for (let y = 0; y < dotDimensionY; y++) {
                const i = x * dotDimensionY + y;
                const dotColor = dots[i];
                ctx.fillStyle = dotColor.string();

                ctx.beginPath();
                ctx.ellipse(
                    (x + 0.5) * this.width / dotDimensionX,
                    (y + 0.5) * this.height / dotDimensionY,
                    this.width / dotDimensionX / 2,
                    this.height / dotDimensionY / 2,
                    0, 0, 2 * Math.PI
                );
                ctx.fill();
                // ctx.fillRect(x * this.width / this.dotDimension, y * this.height / this.dotDimension, this.width / this.dotDimension + 0.5, this.height / this.dotDimension + 0.5);
            }
        }
    }
}