import * as Plot from "npm:@observablehq/plot";
import * as d3 from "d3";

export function make_capacity_changes_belgium(
  bar_data,
  renewable_growth,
  non_renewable_growth,
  category,
  value,
  separation,
  marginLeft,
  { width, height } = {},
) {
  return Plot.plot({
    title:
      "Energy capacity additions per year in Belgium (Non-Renewable Energy VS Renewable Energy)",
    x: { label: "Year", tickFormat: (d) => String(d) },
    y: {
      label: "Capacity change (MW)",
      labelArrow: false,
      domain: [
        d3.min(bar_data, (d) => d.growth) * 1.2,
        d3.max(bar_data, (d) => d.growth),
      ],
    },
    width,
    height,
    marks: [
      Plot.ruleY([0]),

      Plot.barY(bar_data, {
        x: "year",
        y: "growth",
        fill: "type",
      }),

      Plot.text(renewable_growth, {
        x: "year",
        y: "growth",
        text: (d) => d3.format("+,.0f")(d.growth),
        dy: -8,
        fontSize: 14,
        textAnchor: "middle",
        fill: "type",
      }),

      Plot.text(non_renewable_growth, {
        x: "year",
        y: (d) => (d.growth < 0 ? d.growth : 0),
        text: (d) => d3.format("+,.0f")(d.growth),
        dy: +8,
        fontSize: 14,
        textAnchor: "middle",
        fill: "type",
      }),
    ],
    color: { legend: true },
  });
}
