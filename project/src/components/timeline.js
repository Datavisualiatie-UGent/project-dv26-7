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
    title: "Evolutie van de productie van electriciteit via groene energie doorheen de jaren",
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

export function stacked_area_chart_timeline(data, {width}={})
{
  return Plot.plot({
    width,
    height: 300,

    y: {
      label: "Energy (GWh)",
      tickFormat: d => `${(d / 1e6).toFixed(1)}M`
    },
    x: {
      label: "Year",
      tickFormat: d => String(d)
    },

    color: {
      domain: ["produced", "max"],
      range: ["#fde725", "#440154"],
      legend: true
    },

    marks: [
      Plot.areaY(
          Array.from(data, ([year, d]) => ({
            year: +year,
            value: d.max,
            type: "max"
          })),
          {
            x: "year",
            y: "value",
            fill: "type",
            fillOpacity: 1
          }
      ),

      Plot.areaY(
          Array.from(data, ([year, d]) => ({
            year: +year,
            value: d.produced,
            type: "produced"
          })),
          {
            x: "year",
            y: "value",
            fill: "type",
            fillOpacity: 1
          }
      )
    ]
  })
}