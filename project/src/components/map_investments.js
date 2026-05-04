import * as Plot from "npm:@observablehq/plot";
import * as d3 from "d3";

export function make_investment_map(
  countriesWithInvestmentData,
  investmentMax,
  { width, height } = {}
) {
  const color = d3.scaleSequential(d3.interpolateYlGnBu)
    .domain([0, investmentMax]);

  return Plot.plot({
    projection: "equal-earth",
    width,
    height,
    color: {
      legend: true,
      label: "Investment (M USD)",
      type: "linear",
      scheme: "ylgnbu",
      domain: [0, investmentMax],
    },
    marks: [
      Plot.geo(countriesWithInvestmentData, {
        fill: (d) =>
          d.value != null ? color(d.value) : "#eee",
        stroke: "white",
        strokeWidth: 0.5,
        title: (d) =>
          `${d.properties.name}\n${
            d.value != null
              ? d.value.toFixed(1) + " M USD"
              : "No data"
          }`,
      }),
      Plot.graticule(),
      Plot.geo({ type: "Sphere" }),
    ],
  });
}