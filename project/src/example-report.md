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
  loadCountryData,
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
const country = await loadCountryData();

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

const category = select(categories, {
  label: "Energy category",
  value: "Solar energy"
});

const yearExtent = d3.extent(country, d => d.Year);

const year = range(yearExtent, {
  step: 1,
  label: "Year",
  value: yearExtent[1]
});

const investmentYear = range(yearExtent, {
  step: 1,
  label: "Investment year",
  value: yearExtent[1]
});

const countriesList = Array.from(
  new Set(country.map(d => d["ISO3 code"]))
).sort();

const countryA = select(countriesList, {label: "Country A"});
const countryB = select(countriesList, {label: "Country B"});

// --- Generation map ---
const categoryData = computeCategoryData(
  country,
  category.value,
  year.value
);

const categoryDataM49 = mapToM49(categoryData, isoToM49);

const countriesWithData = attachDataToCountries(
  world,
  categoryDataM49
);

const categoryMax = computeCategoryMax(
  country,
  category.value
);

// --- Investment map ---
const investmentData = computeInvestmentData(
  country,
  investmentYear.value
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

// --- Radar ---
const radarA = computeRadarData(
  country,
  countryA.value,
  year.value
);

const radarB = computeRadarData(
  country,
  countryB.value,
  year.value
);

console.log(world.objects);

```

<div class="grid grid-cols-3"> <div class="card">${category}</div> <div class="card">${year}</div> <div class="card">${investmentYear}</div> </div>

<div class="grid grid-cols-1"> <div class="card"> ${ resize((width) => make_generation_map( countriesWithData, categoryMax, {width} ) ) } </div> </div>

<div class="grid grid-cols-1"> <div class="card"> ${ resize((width) => make_investment_map( countriesWithInvestmentData, investmentMax, {width} ) ) } </div> </div>

<div class="grid grid-cols-2"> <div class="card">${countryA}</div> <div class="card">${countryB}</div> </div> <div class="grid grid-cols-1"> <div class="card"> <div style="display: flex; justify-content: space-around;"> ${make_radar_chart(radarA, groupedCategories, countryA.value)} ${make_radar_chart(radarB, groupedCategories, countryB.value)} </div> </div> </div>