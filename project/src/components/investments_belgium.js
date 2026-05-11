import * as Plot from "npm:@observablehq/plot";
import * as d3 from "d3";
import { TECHNOLOGY_COLORS } from "../color.js";

export function investments_belgium(
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
    x: {
      label: "Investment (Million USD 2022)",
      labelArrow: false,
      labelAnchor: "center",
      insetLeft: 10,
    },
    y: {
      label: null,
      domain: data.map((d) => d["Group Technology"]),
      tickSize: 0,
    },
    marks: [
      // stick
      Plot.ruleY(data, {
        x: "Investment",
        y: "Group Technology",
      }),

      // dot
      Plot.dot(data, {
        x: "Investment",
        y: "Group Technology",
        fill: "Group Technology",
        r: 5,
      }),

      Plot.text(data, {
        x: "Investment",
        y: "Group Technology",
        text: (d) => `${d3.format(".4")(d.Investment)} M`,
        dx: 10,
        textAnchor: "start",
      }),
    ],
    color: {
      domain: Object.keys(TECHNOLOGY_COLORS),
      range: Object.values(TECHNOLOGY_COLORS),
      legend: false,
    },
    margin: 120,
    marginTop: 0,
    marginBottom: 40,
  });
}
