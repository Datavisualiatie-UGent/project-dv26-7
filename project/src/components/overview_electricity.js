import * as Plot from "npm:@observablehq/plot";
import * as d3 from "d3";
import { TECHNOLOGY_COLORS } from "../color.js";

export function make_overview_electricity_belgium(
  data,
  category,
  value,
  separation,
  marginLeft,
  { width, height } = {},
) {
  const groups = [...new Set(data.map((d) => d["Group Technology"]))];
  const visible_colours = [
    "Wind energy",
    "Solar energy",
    "Bioenergy",
    "Hydropower",
    "Fossil fuels",
    "Nuclear",
  ];

  return Plot.plot({
    width,
    height,
    x: { label: "Year", tickFormat: (d) => String(d) },
    y: { label: "Electricity Generation (GWh)", grid: true },
    marks: [
      Plot.ruleY([0]),

      // Label Doel 3
      Plot.ruleX([2022], {
        stroke: TECHNOLOGY_COLORS["Nuclear"],
        strokeDasharray: "4,4",
      }),
      Plot.text([{ Year: 2022, label: "Doel 3 closed" }], {
        x: "Year",
        y: d3.max(data, (elem) => elem["Electricity Generation (GWh)"]),
        text: "label",
        dy: -10,
        fill: TECHNOLOGY_COLORS["Nuclear"],
      }),

      // Label bouw windmolenpark
      Plot.ruleX([2018], {
        stroke: TECHNOLOGY_COLORS["Wind energy"],
        strokeDasharray: "4,4",
      }),
      Plot.text([{ Year: 2019, label: "Biggest offshore\nwind farm" }], {
        x: "Year",
        y: d3.max(data, (elem) => elem["Electricity Generation (GWh)"]),
        text: "label",
        dy: -10,
        dx: -40,
        fill: TECHNOLOGY_COLORS["Wind energy"],
      }),

      // Label nuclear out of service
      Plot.ruleX([2014], {
        stroke: TECHNOLOGY_COLORS["Nuclear"],
        strokeDasharray: "4,4",
      }),
      Plot.text(
        [{ Year: 2014, label: "Doel 3 and Tihange 2\nout of service" }],
        {
          x: "Year",
          y: d3.max(data, (elem) => elem["Electricity Generation (GWh)"]),
          text: "label",
          dy: -10,
          dx: 0,
          fill: TECHNOLOGY_COLORS["Nuclear"],
        },
      ),

      // Label nuclear out of service
      Plot.ruleX([2009], {
        stroke: TECHNOLOGY_COLORS["Fossil fuels"],
        strokeDasharray: "4,4",
      }),
      Plot.text([{ Year: 2009, label: "EU Renewable\nEnergy Directive" }], {
        x: "Year",
        y: d3.max(data, (elem) => elem["Electricity Generation (GWh)"]),
        text: "label",
        dy: -10,
        dx: 0,
        fill: TECHNOLOGY_COLORS["Fossil fuels"],
      }),

      Plot.dot(data, {
        x: "Year",
        y: "Electricity Generation (GWh)",
        fill: "Group Technology",
      }),

      Plot.line(data, {
        x: "Year",
        y: "Electricity Generation (GWh)",
        stroke: "Group Technology",
      }),
    ],
    color: {
      domain: visible_colours,
      range: visible_colours.map((d) => TECHNOLOGY_COLORS[d]),
      legend: true,
    },
  });
}
