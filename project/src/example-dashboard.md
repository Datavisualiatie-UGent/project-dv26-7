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

<div>
  Money makes the world go round and for green energy this isn't any different. Without the right equipment, you cannot make the sun, wind, water or even municipal waste your ally. That is why investments in these technologies are necessary to shift the electricity production in a greener direction. Let's take a look at what Belgium does with it's government money.
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

<div>
   From this graph alone, we can already tell what the main focus for renewable energy is in Belgium: the big offshore windmills in the Belgian part of the North Sea. Over 3 billion US dollar was invested in these offshore windparks during the last 24 years. It is the obvious choice for Belgium to invest in this type of energy given our position on the map. If we were positioned a bit more to the south, then maybe Belgium could invest more into solar panels, but as of today solar panels and rain are not a super match.
</div>

---

<div>
  Of course, it could be handy if those investments actually payed off by using this green energy to produce electricity. Therefore you can take a look at the graph below to see the evolution of where the electricity in Belgium comes from.
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

<div>
  It is definitely obvious that the investments in (offshore) wind energy payed off. In 2018 the biggest offshore wind farm as of yet opened, which gave the electricity generation from wind energy a big boost.
</div>
<div>
  There are other interesting trends to see on this plot. You can see that from 2011 until 2023, the nuclear reactors started being unreliable, with the repair works that happened in 2014 to Doel 3 and Tihange 2, which lead to a big drop in electricity generation from nuclear energy. Eventually Doel 3 was officially closed in 2022, leading to a more than 10,000 GWh drop in the following year. From the graph, it is unclear how the government handled this drop, but other energy sources definitely did not compensate this shortfall.
</div>
<div>
  Another talking point is the evolution of electricity generated with fossil fuels. In 2009 there was the EU Renewable Energy Directive that wanted member states to reduce their use of fossil fuels. To see if Belgium actually started using less fossil fuels, there is also the possibility to look at the energy capacity that Belgium has for renewable and non-renewable energy and how this capacity evolved over the years. In the graph below you can see the the addition or reduction of the capacity for non-renewable and renewable energy compared to the year prior. 
</div>

<div class="grid grid-cols-1">
  <div class="card">${
    resize((width) =>
        make_capacity_changes_belgium
        (
            cap_bar_data,
            renewable_cap_changes,
            non_renewable_cap_changes,
            "Technology",
            "Electricity Production (GWh)",
            "type",
            150,
            {width}
        )
    )
  }</div>
</div>

<div>
  
</div>


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









