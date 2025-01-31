import { getPerception, WavelengthDistribution } from "./data/Wavelengths";
import { PerceptionViz } from "./viz/PerceptionViz";
import { WavelengthDistViz } from "./viz/WavelengthViz";

console.log('Hello, TypeScript and Webpack!');

const colorVision = {
    peaks: [
        { mean: 440, stdDev: 30, intensity: 1 },
        { mean: 530, stdDev: 45, intensity: 1 },
        { mean: 560, stdDev: 50, intensity: 1 },
    ]
} as WavelengthDistribution;

const redGreen = {
    peaks: [
        { mean: 530, stdDev: 15, intensity: .8 },
        { mean: 650, stdDev: 25, intensity: .5 },
    ]
}

const minWavelength = 400;
const maxWavelength = 700;

const visionViz = new WavelengthDistViz(colorVision, 500, 400, minWavelength, maxWavelength);
document.body.appendChild(visionViz.canvas);
visionViz.render();

const redGreenViz = new WavelengthDistViz(redGreen, 500, 400, minWavelength, maxWavelength);
document.body.appendChild(redGreenViz.canvas);
redGreenViz.render();

const perceptions = getPerception(colorVision, redGreen);
console.log(perceptions);

const perceptionViz = new PerceptionViz(perceptions, 200, 200);
document.body.appendChild(perceptionViz.canvas);
perceptionViz.render();

visionViz.onEdited.addListener(() => {
    const perceptions = getPerception(colorVision, redGreen);
    perceptionViz.update(perceptions);
    perceptionViz.render();
});

redGreenViz.onEdited.addListener(() => {
    const perceptions = getPerception(colorVision, redGreen);
    perceptionViz.update(perceptions);
    perceptionViz.render();
});