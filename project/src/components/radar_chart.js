import * as d3 from "d3";

export function make_radar_chart(
  radarData,
  groupedCategories,
  title,
  { width = 350, height = 350 } = {}
) {
  const radius = width / 2 - 40;

  const svg = d3
    .create("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const angle = d3
    .scaleBand()
    .domain(groupedCategories)
    .range([0, 2 * Math.PI]);

  const r = d3.scaleLinear().domain([0, 1]).range([0, radius]);

  // grid
  svg.append("g")
    .selectAll("circle")
    .data([0.25, 0.5, 0.75, 1])
    .join("circle")
    .attr("r", (d) => r(d))
    .attr("fill", "none")
    .attr("stroke", "#ddd");

  // axes
  svg.append("g")
    .selectAll("line")
    .data(radarData)
    .join("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", (d) =>
      r(1) * Math.cos(angle(d.category) - Math.PI / 2)
    )
    .attr("y2", (d) =>
      r(1) * Math.sin(angle(d.category) - Math.PI / 2)
    )
    .attr("stroke", "#999");

  // labels
  svg.append("g")
    .selectAll("text")
    .data(radarData)
    .join("text")
    .attr("x", (d) =>
      (r(1) + 10) * Math.cos(angle(d.category) - Math.PI / 2)
    )
    .attr("y", (d) =>
      (r(1) + 10) * Math.sin(angle(d.category) - Math.PI / 2)
    )
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("font-size", "9px")
    .text((d) => d.category);

  // shape
  const line = d3.lineRadial()
    .angle((d) => angle(d.category))
    .radius((d) => r(d.share))
    .curve(d3.curveLinearClosed);

  svg.append("path")
    .datum(radarData)
    .attr("d", line)
    .attr("fill", "steelblue")
    .attr("fill-opacity", 0.4)
    .attr("stroke", "steelblue");

  // title
  svg.append("text")
    .attr("y", -height / 2 + 15)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .text(title);

  return svg.node();
}