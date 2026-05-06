---
theme: dashboard
title: Global Energy Dashboard
toc: false
---

# 🌍 Global Energy Dashboard

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
    groupedCategories
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
    label: "Energy category",
    value: "Solar energy"
});
const category = Generators.input(categoryInput);

const yearExtent = d3.extent(country, d => d.Year);

const yearInput = range(yearExtent, {
    step: 1,
    label: "Year",
    value: yearExtent[1]
});
const year = Generators.input(yearInput);

const investmentYearInput = range(yearExtent, {
    step: 1,
    label: "Investment year",
    value: yearExtent[1]
});
const investmentYear = Generators.input(investmentYearInput);

const countriesList = Array.from(
    new Set(country.map(d => d["ISO3 code"]))
).sort();


const countryAInput = select(countriesList, {label: "Country A"});
const countryBInput = select(countriesList, {label: "Country B"});

const countryA = Generators.input(countryAInput);
const countryB = Generators.input(countryBInput);

// --- Generation map ---
const categoryData = computeCategoryData(
    country,
    category,
    year
);

const categoryDataM49 = mapToM49(categoryData, isoToM49);

const countriesWithData = attachDataToCountries(
    world,
    categoryDataM49
);

const categoryMax = computeCategoryMax(
    country,
    category
);

// --- Investment map ---
const investmentData = computeInvestmentData(
    country,
    investmentYear
);

const investmentDataM49 = mapToM49(
    investmentData,
    isoToM49
);

const countriesWithInvestmentData = attachDataToCountries(
    world,
    investmentDataM49
);

const investmentMax = computeInvestmentMax(country);

```

<div class="grid grid-cols-3"> <div class="card">${categoryInput}</div> <div class="card">${yearInput}</div> <div class="card">${investmentYear}</div> </div>

<div class="grid grid-cols-1"> <div class="card"> ${ resize((width) => make_generation_map( countriesWithData, categoryMax, {width} ) ) } </div> </div>

<div class="grid grid-cols-1"> <div class="card"> ${ resize((width) => make_investment_map( countriesWithInvestmentData, investmentMax, {width} ) ) } </div> </div>

<div class="grid grid-cols-2"> <div class="card">${countryAInput}</div> <div class="card">${countryBInput}</div> </div> 
<div class="grid grid-cols-2"> <div class="card"> <div style="display: flex; justify-content: space-around;"> ${make_radar_chart(computeRadarData(country, countryA, year), groupedCategories, countryA)}</div> </div> <div class="card"> ${make_radar_chart(computeRadarData(country, countryB, year), groupedCategories, countryB)}</div> </div>