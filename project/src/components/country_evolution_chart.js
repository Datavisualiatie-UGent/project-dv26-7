import * as Plot from "npm:@observablehq/plot";

function generateColors(n) {
  return Array.from({ length: n }, (_, i) =>
    `hsl(${(i * 360) / n}, 70%, 55%)`
  );
}

export function make_country_evolution_chart(
  data,
  { width = 900, height = 400 } = {}
) {
  const categories = [...new Set(data.map(d => d.category))];

  return Plot.plot({
    width,
    height,
    marginLeft: 70,
    marginBottom: 50,

    x: {
      label: "Year",
      tickFormat: d => String(d)
    },

    y: {
      grid: true,
      label: "Electricity generation (GWh)"
    },

    color: {
      legend: true,
      label: "Energy source",

      // Explicit domain + range
      domain: categories,
      range: generateColors(categories.length)
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