import { getPerception, WavelengthDistribution } from "../data/Wavelengths";
import { PerceptionViz } from "./PerceptionViz";
import { WavelengthDistViz } from "./WavelengthViz";

export class VizGrid {

    public readonly container: HTMLDivElement;
    public readonly padding = 10;

    constructor(
        public cellWidth: number,
        public cellHeight: number,
        public visionTypes: WavelengthDistribution[],
        public sources: WavelengthDistribution[],
        public minWavelength: number,
        public maxWavelength: number,
    ) {
        this.container = document.createElement("div");
        this.container.style.display = "grid";
        this.container.style.gridTemplateColumns = `repeat(${visionTypes.length + 1}, ${cellWidth}px)`;
        this.container.style.gridTemplateRows = `repeat(${sources.length + 1}, ${cellHeight}px)`;
        
        // Create visionTypes + 1 columns that autosize
        // this.container.style.gridTemplateColumns = `repeat(${visionTypes.length + 1}, auto)`;

        this.container.style.gap = `${this.padding}px`;
    }

    public render() {
        // Top-left corner is empty
        this.container.appendChild(document.createElement("div"));

        const visionVizes: WavelengthDistViz[] = [];
        for (let i = 0; i < this.visionTypes.length; i++) {
            const visionViz = new WavelengthDistViz(this.visionTypes[i], this.cellWidth, this.cellHeight, this.minWavelength, this.maxWavelength, false);
            this.container.appendChild(visionViz.canvas);
            visionViz.render();
            visionVizes.push(visionViz);
        }

        for (let i = 0; i < this.sources.length; i++) {
            const sourceViz = new WavelengthDistViz(this.sources[i], this.cellWidth, this.cellHeight, this.minWavelength, this.maxWavelength, true);
            this.container.appendChild(sourceViz.canvas);
            sourceViz.render();

            for (let j = 0; j < this.visionTypes.length; j++) {
                const perceptions = getPerception(this.visionTypes[j], this.sources[i]);
                const perceptionViz = new PerceptionViz(perceptions, this.cellWidth, this.cellHeight);
                this.container.appendChild(perceptionViz.canvas);
                perceptionViz.render();

                const updatePerception = () => {
                    const perceptions = getPerception(this.visionTypes[j], this.sources[i]);
                    perceptionViz.update(perceptions);
                    perceptionViz.render();
                }

                sourceViz.onEdited.addListener(updatePerception);
                visionVizes[j].onEdited.addListener(updatePerception);
            }
        }
    }
}