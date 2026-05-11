import * as d3 from "d3";

export function make_production_comparison_chart(
  data,
  {
    width = 500,
    height = 750,
    relative = false
  } = {}
) {
  const margin = {
    top: 30,
    right: 20,
    bottom: 50,
    left: 70
  };

  const keys = [
    "Renewable",
    "Non-renewable"
  ];

  const colors = d3.scaleOrdinal()
    .domain(keys)
    .range([
      "#efb118",
      "#4269d0"
    ]);

  const x = d3.scaleBand()
    .domain(data.map(d => d.country))
    .range([margin.left, width - margin.right])
    .padding(0.35);

  const maxY = relative
    ? 1
    : d3.max(data, d => d.total);

  const y = d3.scaleLinear()
    .domain([0, maxY])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const stack = d3.stack()
    .keys(keys);

  const series = stack(data);

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height]);

  // stacked bars
  svg.append("g")
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("fill", d => colors(d.key))
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", d => x(d.data.country))
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth());

  // x-axis
  svg.append("g")
    .attr(
      "transform",
      `translate(0,${height - margin.bottom})`
    )
    .call(d3.axisBottom(x))
    .call(g => {
      g.selectAll("text")
        .attr("fill", "currentColor");

      g.selectAll("path,line")
        .attr("stroke", "currentColor");
    });

  // y-axis
  const yAxis = relative
    ? d3.axisLeft(y)
        .tickFormat(d3.format(".0%"))
    : d3.axisLeft(y);

  svg.append("g")
    .attr(
      "transform",
      `translate(${margin.left},0)`
    )
    .call(yAxis)
    .call(g => {
      g.selectAll("text")
        .attr("fill", "currentColor");

      g.selectAll("path,line")
        .attr("stroke", "currentColor");
    });

  // y-axis label
  svg.append("text")
    .attr(
      "transform",
      `translate(20, ${height / 2}) rotate(-90)`
    )
    .attr("text-anchor", "middle")
    .attr("fill", "currentColor")
    .style("font-size", "12px")
    .text(
      relative
        ? "Share of production"
        : "Electricity generation (GWh)"
    );

  // legend
  svg.append("g")
    .attr(
      "transform",
      `translate(${margin.left},10)`
    )
    .selectAll("g")
    .data(keys)
    .join("g")
    .attr(
      "transform",
      (_, i) => `translate(${i * 140},0)`
    )
    .call(g => {
      g.append("rect")
        .attr("width", 14)
        .attr("height", 14)
        .attr("fill", d => colors(d));

      g.append("text")
        .attr("x", 20)
        .attr("y", 11)
        .attr("fill", "currentColor")
        .style("font-size", "12px")
        .text(d => d);
    });

  return svg.node();
}