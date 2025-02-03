import { allSources } from "./data/ColorsTypes";
import { dogVision, humanRedGreenColorBlind, humanTricolorVision, monochromat, panVision } from "./data/VisionTypes";
import { getPerception, WavelengthDistribution } from "./data/Wavelengths";
import { VizGrid } from "./viz/Grid";
import { PerceptionViz } from "./viz/PerceptionViz";
import { WavelengthDistViz } from "./viz/WavelengthViz";

console.log('Hello, TypeScript and Webpack!');

const visionTypes = [
    humanTricolorVision,
    // humanRedGreenColorBlind,
    dogVision,
    panVision,
    monochromat,
].map(v => ({ ...v }));

const minWavelength = 400;
const maxWavelength = 680;

const grid = new VizGrid(300, 200, visionTypes, allSources, minWavelength, maxWavelength);
document.body.appendChild(grid.container);
grid.render();


// const visionViz = new WavelengthDistViz(colorVision, 500, 400, minWavelength, maxWavelength);
// document.body.appendChild(visionViz.canvas);
// visionViz.render();

// const redGreenViz = new WavelengthDistViz(redGreen, 500, 400, minWavelength, maxWavelength);
// document.body.appendChild(redGreenViz.canvas);
// redGreenViz.render();

// const perceptions = getPerception(colorVision, redGreen);
// console.log(perceptions);

// const perceptionViz = new PerceptionViz(perceptions, 200, 200);
// document.body.appendChild(perceptionViz.canvas);
// perceptionViz.render();

// visionViz.onEdited.addListener(() => {
//     const perceptions = getPerception(colorVision, redGreen);
//     perceptionViz.update(perceptions);
//     perceptionViz.render();
// });

// redGreenViz.onEdited.addListener(() => {
//     const perceptions = getPerception(colorVision, redGreen);
//     perceptionViz.update(perceptions);
//     perceptionViz.render();
// });