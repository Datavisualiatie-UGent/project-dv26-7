import * as Plot from "npm:@observablehq/plot";
import * as d3 from "d3";

export function make_overview_electricity_belgium(
  data,
  category,
  value,
  separation,
  marginLeft,
  { width, height } = {},
) {
  const groups = [...new Set(data.map((d) => d["Group Technology"]))];

  const color = d3
    .scaleOrdinal()
    .domain([...new Set(data.map((d) => d["Group Technology"]))])
    .range(d3.quantize(d3.interpolateViridis, groups.length));

  return Plot.plot({
    width,
    height,
    title: "Electricity generation in Belgium with different kinds of energy",
    x: { label: "Year", tickFormat: (d) => String(d) },
    y: { label: "Electricity Generation (GWh)" },
    marks: [
      Plot.ruleY([0]),

      // Label Doel 3
      Plot.ruleX([2022], {
        stroke: color("Nuclear"),
        strokeDasharray: "4,4",
      }),
      Plot.text([{ Year: 2022, label: "Doel 3 closed" }], {
        x: "Year",
        y: d3.max(data, (elem) => elem["Electricity Generation (GWh)"]),
        text: "label",
        dy: -10,
        fill: color("Nuclear"),
      }),

      // Label bouw windmolenpark
      Plot.ruleX([2018], {
        stroke: color("Wind energy"),
        strokeDasharray: "4,4",
      }),
      Plot.text([{ Year: 2019, label: "Biggest offshore windpark" }], {
        x: "Year",
        y: d3.max(data, (elem) => elem["Electricity Generation (GWh)"]),
        text: "label",
        dy: -10,
        dx: -40,
        fill: color("Wind energy"),
      }),

      // Label nuclear out of service
      Plot.ruleX([2014], {
        stroke: color("Nuclear"),
        strokeDasharray: "4,4",
      }),
      Plot.text(
        [{ Year: 2014, label: "Doel 3 and Tihange 2 out of service" }],
        {
          x: "Year",
          y: d3.max(data, (elem) => elem["Electricity Generation (GWh)"]),
          text: "label",
          dy: -10,
          dx: 0,
          fill: color("Nuclear"),
        },
      ),

      // Label nuclear out of service
      Plot.ruleX([2009], {
        stroke: color("Fossil fuels"),
        strokeDasharray: "4,4",
      }),
      Plot.text([{ Year: 2009, label: "Energy decree" }], {
        x: "Year",
        y: d3.max(data, (elem) => elem["Electricity Generation (GWh)"]),
        text: "label",
        dy: -10,
        dx: 0,
        fill: color("Fossil fuels"),
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
    color: { legend: true, domain: color.domain(), range: color.range() },
  });
}
