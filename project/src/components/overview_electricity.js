import * as Plot from "npm:@observablehq/plot";

export function make_stacked_horizontal_bar_plot(
  data,
  category,
  value,
  separation,
  marginLeft,
  { width, height } = {},
) {
  Plot.plot({
    marks: [
      Plot.dot(result, {
        x: "Year",
        y: "Electricity Generation (GWh)",
        fill: "Group Technology",
      }),
    ],
    color: { legend: true },
  });
}
