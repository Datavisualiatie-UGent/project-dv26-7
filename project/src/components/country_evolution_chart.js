import * as Plot from "npm:@observablehq/plot";

export function make_country_evolution_chart(
  data,
  { width = 900, height = 400 } = {}
) {
  return Plot.plot({
    width,
    height,
    marginLeft: 70,
    marginBottom: 50,

    x: {
      label: "Year",
      tickFormat: d => d.toString(),
    },

    y: {
      grid: true,
      label: "Electricity generation (GWh)"
    },

    color: {
      legend: true,
      label: "Energy source"
    },

    marks: [
      Plot.barY(
        data,
        Plot.stackY({
          x: "year",
          y: "value",
          fill: "category",
          tip: true
        })
      )
    ]
  });
}