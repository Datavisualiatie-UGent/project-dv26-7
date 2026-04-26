import * as Plot from "npm:@observablehq/plot";

export function make_overview_electricity_belgium(
  data,
  category,
  value,
  separation,
  marginLeft,
  { width, height } = {},
) {
  return Plot.plot({
    width,
    height,
    marks: [
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
    color: { legend: true },
  });
}
