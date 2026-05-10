import * as Plot from "npm:@observablehq/plot";
import * as d3 from "d3";

export function make_generation_map(
  title,
  countriesWithData,
  categoryMax,
  {
    width,
    height,
    onCountryClick = () => {}
  } = {}
) {
  const color = d3.scaleSequential(d3.interpolateYlGnBu)
    .domain([0, categoryMax]);

  const plot = Plot.plot({
    title,
    projection: "equal-earth",
    width,
    height,

    color: {
      legend: true,
      label: "Generation (GWh)",
      type: "linear",
      scheme: "ylgnbu",
      domain: [0, categoryMax],
    },

    marks: [
      Plot.geo(countriesWithData, {
        fill: d =>
          d.value != null
            ? color(d.value)
            : "#eee",

        stroke: "white",
        strokeWidth: 0.5,

        title: d =>
          `${d.properties.name}\n${
            d.value != null
              ? d.value.toFixed(1) + " GWh"
              : "No data"
          }`
      }),

      Plot.graticule(),
      Plot.geo({ type: "Sphere" })
    ]
  });

  return plot;
}