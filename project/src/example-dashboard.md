---
theme: dashboard
title: België
toc: false
---

# België 🇧🇪

```js
import {make_stacked_horizontal_bar_plot} from "./components/stacked_horizontal_bar_plot.js"
import {make_overview_electricity_belgium} from "./components/overview_electricity.js"
import {investments_belgium} from "./components/investments_belgium.js"
import {make_capacity_changes_belgium} from "./components/capacity_changes.js"
import {stacked_area_chart_timeline} from "./components/timeline.js"
import {make_waffle_chart, waffle_legend} from "./components/waffle_chart.js"
import {max_vs_produced_electricity_belgium, tech_shares_belgium, tech_shares_europe, tech_shares_world, produced_vs_max_per_year_structured, overview_electricity_belgium, investment_data_belgium, renewable_cap_changes, non_renewable_cap_changes, cap_bar_data} from "./data/load_data.js"
```

<div class="grid grid-cols-1">
  <div class="card">
    <h2 style="margin-bottom: 10px; font-weight: bold;">Actual Production Of Electricity Using Green Energy Sources Versus Installed Capacity</h2>
    ${
    resize((width) =>
        make_stacked_horizontal_bar_plot
        (
            max_vs_produced_electricity_belgium,
            "Technology",
            "Electricity Production (GWh)",
            "type",
            150,
            {width}
        )
    )
  }</div>
</div>

<div class="grid grid-cols-4">
  <div class="card">
    <h2 style="margin-bottom: 30px; font-weight: bold;">Technology</h2>
    ${
    resize((width) =>
        waffle_legend()
    )
  }</div>
  <div class="card">
    <h2 style="font-weight: bold">Actual production of green energy versus capacity</h2>
    <h3 style="margin-bottom: 10px">Belgium</h3>
    ${
    resize((width) =>
        make_waffle_chart
        (
            tech_shares_belgium,
            {width}
        )
    )
  }</div>
  <div class="card">
    <h2 style="font-weight: bold">Actual production of green energy versus capacity</h2>
    <h3 style="margin-bottom: 10px">Europe</h3>
    ${
    resize((width) =>
        make_waffle_chart
        (
            tech_shares_europe,
            {width}
        )
    )
  }</div>
  <div class="card">
    <h2 style="font-weight: bold">Actual production of green energy versus capacity</h2>
    <h3 style="margin-bottom: 10px">World</h3>
    ${
    resize((width) =>
        make_waffle_chart
        (
            tech_shares_world,
            {width}
        )
    )
  }</div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    <h2 style="margin-bottom: 10px; font-weight: bold;">Evolution of capacity and actual production of green energy in Belgium</h2>
    ${
    resize((width) =>
        stacked_area_chart_timeline
        (
            produced_vs_max_per_year_structured,
            {width}
        )
    )
  }</div>
</div>

<div class="grid grid-cols-1">
  <div class="card">${
    resize((width) =>
        make_overview_electricity_belgium
        (
            overview_electricity_belgium,
            "Technology",
            "Electricity Production (GWh)",
            "type",
            150,
            {width}
        )
    )
  }</div>
</div>


<div class="grid grid-cols-1">
  <div class="card">${
    resize((width) =>
        investments_belgium
        (
            investment_data_belgium,
            "Technology",
            "Electricity Production (GWh)",
            "type",
            150,
            {width}
        )
    )
  }</div>
</div>


<div class="grid grid-cols-1">
  <div class="card">${
    resize((width) =>
        make_capacity_changes_belgium
        (
            cap_bar_data,
            non_renewable_cap_changes,
            renewable_cap_changes,
            "Technology",
            "Electricity Production (GWh)",
            "type",
            150,
            {width}
        )
    )
  }</div>
</div>

<!-- Load and transform the data -->

```js
const launches = FileAttachment("data/launches.csv").csv({typed: true});
```

<!-- A shared color scale for consistency, sorted by the number of launches -->

```js
const color = Plot.scale({
    color: {
        type: "categorical",
        domain: d3.groupSort(launches, (D) => -D.length, (d) => d.state).filter((d) => d !== "Other"),
        unknown: "var(--theme-foreground-muted)"
    }
});
```

<!-- Cards with big numbers -->

<div class="grid grid-cols-4">
  <div class="card">
    <h2>United States 🇺🇸</h2>
    <span class="big">${launches.filter((d) => d.stateId === "US").length.toLocaleString("en-US")}</span>
  </div>
  <div class="card">
    <h2>Russia 🇷🇺 <span class="muted">/ Soviet Union</span></h2>
    <span class="big">${launches.filter((d) => d.stateId === "SU" || d.stateId === "RU").length.toLocaleString("en-US")}</span>
  </div>
  <div class="card">
    <h2>China 🇨🇳</h2>
    <span class="big">${launches.filter((d) => d.stateId === "CN").length.toLocaleString("en-US")}</span>
  </div>
  <div class="card">
    <h2>Other</h2>
    <span class="big">${launches.filter((d) => d.stateId !== "US" && d.stateId !== "SU" && d.stateId !== "RU" && d.stateId !== "CN").length.toLocaleString("en-US")}</span>
  </div>
</div>

<!-- Plot of launch history -->

```js
function launchTimeline(data, {width} = {}) {
    return Plot.plot({
        title: "Launches over the years",
        width,
        height: 300,
        y: {grid: true, label: "Launches"},
        color: {...color, legend: true},
        marks: [
            Plot.rectY(data, Plot.binX({y: "count"}, {x: "date", fill: "state", interval: "year", tip: true})),
            Plot.ruleY([0])
        ]
    });
}
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => launchTimeline(launches, {width}))}
  </div>
</div>

<!-- Plot of launch vehicles -->

```js
function vehicleChart(data, {width}) {
    return Plot.plot({
        title: "Popular launch vehicles",
        width,
        height: 300,
        marginTop: 0,
        marginLeft: 50,
        x: {grid: true, label: "Launches"},
        y: {label: null},
        color: {...color, legend: true},
        marks: [
            Plot.rectX(data, Plot.groupY({x: "count"}, {y: "family", fill: "state", tip: true, sort: {y: "-x"}})),
            Plot.ruleX([0])
        ]
    });
}
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => vehicleChart(launches, {width}))}
  </div>
</div>

Data: Jonathan C. McDowell, [General Catalog of Artificial Space Objects](https://planet4589.org/space/gcat)
