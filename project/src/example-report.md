---
theme: dashboard
title: Global Energy
toc: false
---

# 🌍 Global Energy

```js
import * as d3 from "d3";
import {select, range} from "@observablehq/inputs";
import {resize} from "@observablehq/stdlib";
import {Generators} from "observablehq:stdlib";

import {
    make_generation_map
} from "./components/map_generation.js";

import {
    make_investment_map
} from "./components/map_investments.js";

import {
    make_radar_chart
} from "./components/radar_chart.js";

import {
    make_production_comparison_chart
} from "./components/production_comparison_chart.js";

import {
    make_country_evolution_chart
} from "./components/country_evolution_chart.js";

import {
    loadWorld,
    country_data,
    buildIsoToM49,
    computeCategoryData,
    mapToM49,
    attachDataToCountries,
    computeCategoryMax,
    computeInvestmentData,
    computeInvestmentMax,
    computeRadarData,
    groupedCategories,
    computeProductionComparisonData,
    computeCountryEvolutionData
} from "./data/load_data.js";

const world = await loadWorld();
const country = country_data;

const isoToM49 = buildIsoToM49(country);
const categories = [
    "Bioenergy",
    "Fossil fuels",
    "Geothermal energy",
    "Hydropower (excl. Pumped Storage)",
    "Marine energy",
    "Multiple renewables*",
    "Nuclear",
    "Other non-renewable energy",
    "Other renewable energy",
    "Pumped storage",
    "Solar energy",
    "Wind energy"
];

const categoryInput = select(categories, {
    label: "Energy category: ",
    value: "Solar energy"
});
const category = Generators.input(categoryInput);

const yearExtent = d3.extent(country, d => d.Year);

const energyYearInput = range(yearExtent, {
    step: 1,
    label: "Year",
    value: yearExtent[1]
});
const energyYear = Generators.input(energyYearInput);

const investmentYearInput = range(yearExtent, {
    step: 1,
    label: "Investment year",
    value: yearExtent[1]
});
const investmentYear = Generators.input(investmentYearInput);

const radarYearInput = range(yearExtent, {
    step: 1,
    label: "Year",
    value: yearExtent[1]
});
const radarYear = Generators.input(radarYearInput);

const countriesList = Array.from(
    new Set(country.map(d => d["ISO3 code"]))
).sort();

const countryInput = select(countriesList, {label: "Country: "});
const countrySelection = Generators.input(countryInput);

const countryAInput = select(countriesList, {label: "Country A: "});
const countryBInput = select(countriesList, {label: "Country B: "});

const countryA = Generators.input(countryAInput);
const countryB = Generators.input(countryBInput);

// --- Investment map ---
const investmentMax = computeInvestmentMax(country);

const relativeInput = select(
    ["Absolute", "Relative"],
    {
        label: "Production mode",
        value: "Absolute"
    }
);

const relativeMode =
    Generators.input(relativeInput);
```
---

<h2>
Global overview
</h2>

<div>
The shift to the production and use of renewable energy sources in the world is as important as ever. With scientists everywhere warning about the consequences of global warming, many countries attempt to increase their share of renewable energy. But how are they doing that and how have they evolved over the years?
</div>
<div>
Using the visualisation below, you can select the category of renewables in which you are interested and look at the electricity production throughout the years. The worldmap shows the absolute production of electricity per category for each country.
</div>

<div class="grid grid-cols-2"> 
    <div class="card">
        ${categoryInput}
    </div> 
    <div class="card">
        ${energyYearInput}
    </div>
</div>

<div class="grid grid-cols-1"> 
    <div class="card">
        <h2 style="font-weight: bold">Electricity generation for each country per category and year</h2>
        ${ resize((width) => make_generation_map(
            category,
            attachDataToCountries(
                world, 
                mapToM49(
                    computeCategoryData(
                        country, 
                        category, 
                        energyYear
                    ), 
                    isoToM49
                )
            ), 
            computeCategoryMax(
                country, 
                category
            ), 
            { width } 
        ))} 
    </div> 
</div>

---

## Selected country evolution

<p>
Where the plot above may show the trends for the entire world throughout the years, it is also interesting to take a look at individual countries. Below, you can observe the evolution of an entire country.
</p>

<div class="grid grid-cols-1">
  <div class="card">${countryInput}</div>
</div> 

<div class="grid grid-cols-1">
    <div class="card">
        ${
            resize((width) =>
                make_country_evolution_chart(
                    computeCountryEvolutionData(
                        country,
                        countrySelection
                    ),
                    { width }
                )
            )
        }
    </div>
</div>

<p>
But let's also take a look at the investments made by each country. 
</p>

<div class="grid grid-cols-1">
    <div class="card">
        ${investmentYearInput}
    </div> 
</div>


<div class="grid grid-cols-1"> 
    <div class="card"> 
        ${ resize((width) => make_investment_map( 
            attachDataToCountries(
                world, 
                mapToM49(
                    computeInvestmentData(
                        country, 
                        investmentYear
                    ), 
                    isoToM49
                )
            ), 
            investmentMax, 
            {width} 
        ))} 
    </div> 
</div>

---

<h2>
Comparison of countries
</h2>

<p>
Now that we have a sense of the global trends, maybe it is interesting to take a closer look at the countries themselves. From what sources do countries get there renewable energy and how much of their total energy production is renewable?
</p>

<p>
Below you can select 2 countries and analyze where they get their renewable energy from. But don't be bamboozled, these percentages are relative and don't show what share of their production is renewable as well as how large their production is. For that comparison, you can take a closer look at the bar chart underneath to get a better idea. 
</p>

<div class="grid grid-cols-1"> 
  <div class="card">${radarYearInput}</div>
</div>
<div class="grid grid-cols-2">
  <div class="card">${countryAInput}</div>
  <div class="card">${countryBInput}</div>
</div> 
<div class="grid grid-cols-2"> 
    <div class="card"> 
        ${make_radar_chart(computeRadarData(country, countryA, radarYear), groupedCategories, countryA)}
    </div> 
    <div class="card"> 
        ${make_radar_chart(computeRadarData(country, countryB, radarYear), groupedCategories, countryB)}
    </div> 
</div>


<div class="grid grid-cols-1">
    <div class="card">
        ${relativeInput}
    </div>
</div>

<div class="grid grid-cols-1">
    <div class="card">
      <h2 style="font-weight: bold">Comparison of proportions renewable/non-renewable electricity generation of the selected countries</h2>
        ${
            resize((width) =>
                make_production_comparison_chart(
                    computeProductionComparisonData(
                        country,
                        [countryA, countryB],
                        radarYear,
                        relativeMode === "Relative"
                    ),
                    {
                        width,
                        relative:
                            relativeMode === "Relative"
                    }
                )
            )
        }
    </div>
</div>