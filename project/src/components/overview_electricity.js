import * as Plot from "npm:@observablehq/plot";

export function make_overview_electricity_belgium(
  data,
  category,
  value,
  separation,
  marginLeft,
  { width, height } = {},
) {
  Plot.plot({
    width,
    height,
    marks: [
      Plot.dot(data, {
        x: "Year",
        y: "Electricity Generation (GWh)",
        fill: "Group Technology",
      }),
    ],
    color: { legend: true },
  });
}
