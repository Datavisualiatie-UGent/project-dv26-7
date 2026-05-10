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
  Money makes the world go round and for green energy this isn't any different. Without the right equipment, you cannot make the sun, wind, water or even municipal waste your ally. That is why investments in these technologies are necessary to shift the electricity production in a greener direction. Let's take a look at what Belgium does with its government money.
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
   From this graph alone, we can tell what the main focus for renewable energy is in Belgium: the big offshore windmills in the Belgian part of the North Sea. Over 3 billion USD/euros were invested in these offshore windparks during the last 24 years. It is the obvious choice for Belgium to invest in this type of energy given our position on the map. If we were positioned a bit more to the south, then maybe Belgium could invest more into solar panels, but as of today solar panels and rain are not a great match.
</div>

---

<div>
  Of course, it could be handy if those investments actually paid off by using this green energy to produce electricity. Therefore you can take a look at the graph below to see the evolution of where the electricity in Belgium comes from.
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
  It is definitely obvious that the investments in (offshore) wind energy paid off. In 2018 the biggest offshore wind farm as of yet opened, which gave the electricity generation from wind energy a big boost.
</div>
<div>
  There are other interesting trends to see on this plot. You can see that from 2011 until 2023, the nuclear reactors started being unreliable, with the repair works that happened in 2014 to Doel 3 and Tihange 2, which led to a big drop in electricity generation from nuclear energy. Eventually Doel 3 was officially closed in 2022, leading to a more than 10,000 GWh drop in the following year. From the graph, it is unclear how the government handled this drop, but other energy sources definitely did not compensate this shortfall.
</div>
<div>
  Another talking point is the evolution of electricity generated with fossil fuels. In 2009 there was the EU Renewable Energy Directive that wanted member states to reduce their use of fossil fuels. The graph shows a decrease in production of fossil fuels in the years after the EU directive, a trend that also shows itself in the evolution of the installed capacity per energy source. The next graph shows this evolution, it compares the yearly increase/decrease in installed capacity of non-renewable and renewable energy sources. 
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
  This graph clearly shows that the capacity additions in renewable energy outweigh the additions of the non-renewable energy capacity. The investments in renewable energy are also reflected in the growth of the renewable energy capacity.
  Belgium seems to follow the 2009 EU directive, because it slowly removes some of its non-renewable energy capacity, meaning that it can also produce less electricity with these types of energy.
</div>

---

<div>
  In the previous graph you could clearly see the growth in renewable energy capacity. A big question that now remains is which renewable energy source has the most capacity and how does this capacity relate to the actual production of electricity with this energy source? As you will see in the following graph, capacity and what is actually produced are really not the same thing. This graph will show you the total electricity produced from 2000 to 2023 in relation to the total capacity from 2000 to 2023. The capacity is the electricity that could have been produced during this period. 
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

<div>
  As you can see, Belgium has a lot of solar capacity. This means that in theory Belgium could be able to generate over 500,000 GWh of electricity by just using solar energy. Of course this is an unreachable goal given that the sun does not always shine and of course there is also the fact that this is still Belgium. A lot of people have solar panels on their roofs, adding to the total capacity, but given the weather conditions in Belgium and the day-night cycle, the ratio of production versus capacity is quite low for solar energy sources. For wind energy this capacity is far less than the solar energy capacity, given that not every person in Belgium has a windmill in their backyard. Wind energy in general shows a much smaller gap between its capacity and what it actually produces in terms of electricity. This is because in contrast to the sun, there can be wind at any time. 
  You may also notice that solid biofuels, biogas and renewable municipal waste are very close to their theoretical electricity production. This is because these types of renewable energy can be used day and night and are thus more reliable than solar or wind energy. Solid biofuels can for example contain wood or wood pellets that can be burned to generate heat and this heat can be transformed into electricity. 
</div>

---

<div>
  Last but not least, it is also insightful to compare the Belgian renewable energy sources and their capacities against what Europe or even the world does. This can be seen in the last graph.
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

<div>
  In the waffle chart about Belgium you can see that about 5% of the maximal theoretical electricity production using renewable energy is produced by solid biofuels, another 5% by solar energy, 10% because of wind energy and 3% with biogas, renewable municipal waste and renewable hydropower. That means that 23% of the total capacity was actually produced in Belgium during 2000 until 2023. Comparing these results from Belgium to the results from Europe and the world, we can conclude that Belgium uses its capacity in a less efficient way. Also interesting to note, is that both Europe and the world rely heavily on renewable hydropower for their electricity production, while this is barely used in Belgium. Again, this is associated with Belgium's geography, which lends itself more to wind energy than to hydropower.
</div>

---

<div>
  If you have made it this far, then you probably cannot wait to investigate all this data yourself. Luckily for you, on our next page, you can fulfill this wish!
</div>









