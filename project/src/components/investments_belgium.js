import * as Plot from "npm:@observablehq/plot";
import * as d3 from "d3";

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
      label: "Investment (Million USD)",
      labelArrow: false,
      labelAnchor: "center",
      insetLeft: 10,
    },
    y: {
      label: null,
      domain: data.map((d) => d["Group Technology"]),
      tickSize: 0,
    },
    title: "Investments in Belgium for renewable energy (2000-2024)",
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
    color: { legend: false, scheme: "viridis" },
    margin: 120,
    marginTop: 0,
    marginBottom: 40,
  });
}
