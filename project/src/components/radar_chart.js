import * as d3 from "d3";

export function make_radar_chart(
  radarData,
  groupedCategories,
  title,
  { width = 350, height = 350 } = {}
) {
  // slightly reduce radius to leave room for labels/title
  const radius = width / 2 - 60;

  const svg = d3
    .create("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .style("background", "transparent");

  const angle = d3
    .scaleBand()
    .domain(groupedCategories)
    .range([0, 2 * Math.PI]);

  const r = d3.scaleLinear()
    .domain([0, 1])
    .range([0, radius]);

  const ticks = [0.25, 0.5, 0.75, 1];

  // grid circles
  svg.append("g")
    .selectAll("circle")
    .data(ticks)
    .join("circle")
    .attr("r", (d) => r(d))
    .attr("fill", "none")
    .attr("stroke", "#666");

  // radial percentage labels
  svg.append("g")
    .selectAll("text.grid-label")
    .data(ticks)
    .join("text")
    .attr("class", "grid-label")
    .attr("x", 5)
    .attr("y", (d) => -r(d))
    .attr("fill", "white")
    .style("font-size", "8px")
    .text((d) => `${d * 100}%`);

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
    .attr("stroke", "#888");

  // category labels
  svg.append("g")
    .selectAll("text.category-label")
    .data(radarData)
    .join("text")
    .attr("class", "category-label")
    .attr("x", (d) => {
      const a = angle(d.category) - Math.PI / 2;
      return (r(1) + 22) * Math.cos(a);
    })
    .attr("y", (d) => {
      const a = angle(d.category) - Math.PI / 2;
      return (r(1) + 22) * Math.sin(a);
    })
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("fill", "white")
    .style("font-size", "10px")
    .text((d) => d.category);

  // radar shape
  const line = d3.lineRadial()
    .angle((d) => angle(d.category))
    .radius((d) => r(d.share))
    .curve(d3.curveLinearClosed);

  svg.append("path")
    .datum(radarData)
    .attr("d", line)
    .attr("fill", "steelblue")
    .attr("fill-opacity", 0.4)
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2);

  // point markers
  svg.append("g")
    .selectAll("circle.data-point")
    .data(radarData)
    .join("circle")
    .attr("class", "data-point")
    .attr("cx", (d) =>
      r(d.share) * Math.cos(angle(d.category) - Math.PI / 2)
    )
    .attr("cy", (d) =>
      r(d.share) * Math.sin(angle(d.category) - Math.PI / 2)
    )
    .attr("r", 3)
    .attr("fill", "white");

  // title moved higher to avoid overlap
  svg.append("text")
    .attr("y", -height / 2 + 8)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .style("font-weight", "bold")
    .style("font-size", "14px")
    .text(title);

  return svg.node();
}