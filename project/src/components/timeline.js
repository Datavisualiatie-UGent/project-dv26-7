import * as Plot from "npm:@observablehq/plot";

export function timeline(events, {width, height} = {}) {
  return Plot.plot({
    width,
    height,
    marginTop: 30,
    x: {nice: true, label: null, tickFormat: ""},
    y: {axis: null},
    marks: [
      Plot.ruleX(events, {x: "year", y: "y", markerEnd: "dot", strokeWidth: 2.5}),
      Plot.ruleY([0]),
      Plot.text(events, {x: "year", y: "y", text: "name", lineAnchor: "bottom", dy: -10, lineWidth: 10, fontSize: 12})
    ]
  });
}

export function timeline_per_region_per_year(
    data,
    {width, height} = {},
) {
  return Plot.plot({
    title: "Evolutie van de productie van groene energie doorheen de jaren",
    width,
    height,
    x: {
      label: "Year",
      tickFormat: d => d.toString(),
      ticks: 10
    },
    y: {
      label: "Productie groene energie ten opzichte van totale energieproductie (%)",
      domain: [0,100],
      grid: true
    },
    color: {legend: true},
    marks: [
        Plot.lineY(data, {
          x: "year",
          y: "percentage",
          stroke: "region",
          marker: true,
        })
    ]
  });
}