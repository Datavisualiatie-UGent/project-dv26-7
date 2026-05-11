import * as Plot from "npm:@observablehq/plot";
import { tech_shares_belgium } from "../data/load_data.js";
import { TECHNOLOGY_COLORS } from "../color.js";

const visible_colours = [
  "Wind energy",
  "Solar energy",
  "Bioenergy",
  "Hydropower",
];

export function make_waffle_chart(data, { width } = {}) {
  return Plot.plot({
    width,
    axis: null,
    height: 260,

    color: {
      legend: false,
      domain: visible_colours,
      range: visible_colours.map((d) => TECHNOLOGY_COLORS[d]),
    },

    marks: [
      Plot.waffleY(
        { length: 1 },
        {
          y: 100,
          fillOpacity: 0.2,
          multiple: 10,
        },
      ),

      // actual technology distribution
      Plot.waffleY(data, {
        y: "share",
        fill: "tech",
        multiple: 10,
      }),
    ],
  });
}

export function waffle_legend() {
  return Plot.legend({
    color: {
      domain: visible_colours,
      range: visible_colours.map((d) => TECHNOLOGY_COLORS[d]),
    },
    columns: 1,
    style: {
      fontSize: "20px",
      lineHeight: 1.5,
    },
  });
}
