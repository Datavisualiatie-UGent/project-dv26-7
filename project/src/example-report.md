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
import TomSelect from "npm:tom-select";

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
    computeCountryEvolutionData,
    buildCountryMaps
} from "./data/load_data.js";

const world = await loadWorld();
const country = country_data
  .map(d => ({
    ...d,
    "Group Technology":
      d["Group Technology"]
        ?.trim()
        .replace(/\*$/, "")
  }))
  .filter(d => +d.Year <= 2023);

const { name_to_iso, iso_to_name } = await buildCountryMaps();

const isoToM49 = buildIsoToM49(country);
const categories = [
    "Bioenergy",
    "Fossil fuels",
    "Geothermal energy",
    "Hydropower",
    "Marine energy",
    "Nuclear",
    "Other non-renewable energy",
    "Pumped storage",
    "Solar energy",
    "Wind energy"
];

const categoryInput = html`
  <label
    style="
      display: block;
      width: 100%;
      font: 14px sans-serif;
      font-weight: 700;
    "
  >
    Energy category:
    
    <input
      list="categories"
      value="Solar energy"
      style="
        display: block;
        width: 100%;
        box-sizing: border-box;
        margin-top: 8px;
        padding: 10px 12px;
        border-radius: 8px;
        border: 2px solid #4269d0;
        background: var(--theme-background);
        color: currentColor;
        outline: none;
      "
    >

    <datalist id="categories">
      ${categories.map(c => html`
        <option value="${c}">
      `)}
    </datalist>
  </label>
`;

const category = Generators.input(
    categoryInput.querySelector("input")
);

display(categoryInput);

const MAX_YEAR = 2023;

const yearExtent = d3.extent(
    country.filter(d => +d.Year <= MAX_YEAR),
    d => +d.Year
);

const energyYearInput = html`
  <div
    style="
      width: 100%;
      font: 14px sans-serif;
    "
  >
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      "
    >
      <label style="font-weight: 700;">
        Year
      </label>

      <div
        style="
          display: flex;
          align-items: center;
          gap: 6px;
        "
      >
        <button
          id="minus"
          style="
            width: 28px;
            height: 28px;
            border: 2px solid #4269d0;
            border-radius: 6px;
            background: var(--theme-background);
            color: currentColor;
            cursor: pointer;
            font-weight: 700;
          "
        >
          −
        </button>

        <span
          id="year-label"
          style="
            min-width: 48px;
            text-align: center;
            font-weight: 600;
          "
        >
          ${yearExtent[1]}
        </span>

        <button
          id="plus"
          style="
            width: 28px;
            height: 28px;
            border: 2px solid #4269d0;
            border-radius: 6px;
            background: var(--theme-background);
            color: currentColor;
            cursor: pointer;
            font-weight: 700;
          "
        >
          +
        </button>
      </div>
    </div>

    <input
      type="range"
      min="${yearExtent[0]}"
      max="${yearExtent[1]}"
      step="1"
      value="${yearExtent[1]}"
      style="
        width: 100%;
        accent-color: #4269d0;
        cursor: pointer;
      "
    >
  </div>
`;

const slider =
    energyYearInput.querySelector("input");

const label =
    energyYearInput.querySelector("#year-label");

const minusBtn =
    energyYearInput.querySelector("#minus");

const plusBtn =
    energyYearInput.querySelector("#plus");

function updateYear(value) {
    slider.value = value;
    label.textContent = value;

    slider.dispatchEvent(
        new Event("input", { bubbles: true })
    );
}

// slider interaction
slider.addEventListener("input", () => {
    label.textContent = slider.value;
});

// minus button
minusBtn.addEventListener("click", () => {
    const next = Math.max(
        +slider.min,
        +slider.value - 1
    );

    updateYear(next);
});

// plus button
plusBtn.addEventListener("click", () => {
    const next = Math.min(
        +slider.max,
        +slider.value + 1
    );

    updateYear(next);
});

const energyYear = Generators.input(slider);

display(energyYearInput);

const investmentYearInput = html`
  <div
    style="
      width: 100%;
      font: 14px sans-serif;
    "
  >
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      "
    >
      <label style="font-weight: 700;">
        Investment year
      </label>

      <div
        style="
          display: flex;
          align-items: center;
          gap: 6px;
        "
      >
        <button
          id="minus"
          style="
            width: 28px;
            height: 28px;
            border: 2px solid #4269d0;
            border-radius: 6px;
            background: var(--theme-background);
            color: currentColor;
            cursor: pointer;
            font-weight: 700;
          "
        >
          −
        </button>

        <span
          id="year-label"
          style="
            min-width: 48px;
            text-align: center;
            font-weight: 600;
          "
        >
          ${yearExtent[1]}
        </span>

        <button
          id="plus"
          style="
            width: 28px;
            height: 28px;
            border: 2px solid #4269d0;
            border-radius: 6px;
            background: var(--theme-background);
            color: currentColor;
            cursor: pointer;
            font-weight: 700;
          "
        >
          +
        </button>
      </div>
    </div>

    <input
      type="range"
      min="${yearExtent[0]}"
      max="${yearExtent[1]}"
      step="1"
      value="${yearExtent[1]}"
      style="
        width: 100%;
        accent-color: #4269d0;
        cursor: pointer;
      "
    >
  </div>
`;

const slideri =
    investmentYearInput.querySelector("input");

const labeli =
    investmentYearInput.querySelector("#year-label");

const minusBtni =
    investmentYearInput.querySelector("#minus");

const plusBtni =
    investmentYearInput.querySelector("#plus");

function updateYeari(value) {
    slideri.value = value;
    labeli.textContent = value;

    slideri.dispatchEvent(
        new Event("input", { bubbles: true })
    );
}

// slider interaction
slideri.addEventListener("input", () => {
    labeli.textContent = slideri.value;
});

// minus button
minusBtni.addEventListener("click", () => {
    const next = Math.max(
        +slideri.min,
        +slideri.value - 1
    );

    updateYeari(next);
});

// plus button
plusBtni.addEventListener("click", () => {
    const next = Math.min(
        +slideri.max,
        +slideri.value + 1
    );

    updateYeari(next);
});

const investmentYear = Generators.input(slideri);

display(investmentYearInput);

const radarYearInput = html`
  <div
    style="
      width: 100%;
      font: 14px sans-serif;
    "
  >
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      "
    >
      <label style="font-weight: 700;">
        Year
      </label>

      <div
        style="
          display: flex;
          align-items: center;
          gap: 6px;
        "
      >
        <button
          id="minus"
          style="
            width: 28px;
            height: 28px;
            border: 2px solid #4269d0;
            border-radius: 6px;
            background: var(--theme-background);
            color: currentColor;
            cursor: pointer;
            font-weight: 700;
          "
        >
          −
        </button>

        <span
          id="year-label"
          style="
            min-width: 48px;
            text-align: center;
            font-weight: 600;
          "
        >
          ${yearExtent[1]}
        </span>

        <button
          id="plus"
          style="
            width: 28px;
            height: 28px;
            border: 2px solid #4269d0;
            border-radius: 6px;
            background: var(--theme-background);
            color: currentColor;
            cursor: pointer;
            font-weight: 700;
          "
        >
          +
        </button>
      </div>
    </div>

    <input
      type="range"
      min="${yearExtent[0]}"
      max="${yearExtent[1]}"
      step="1"
      value="${yearExtent[1]}"
      style="
        width: 100%;
        accent-color: #4269d0;
        cursor: pointer;
      "
    >
  </div>
`;

const sliderr =
    radarYearInput.querySelector("input");

const labelr =
    radarYearInput.querySelector("#year-label");

const minusBtnr =
    radarYearInput.querySelector("#minus");

const plusBtnr =
    radarYearInput.querySelector("#plus");

function updateYearr(value) {
    sliderr.value = value;
    labelr.textContent = value;

    sliderr.dispatchEvent(
        new Event("input", { bubbles: true })
    );
}

// slider interaction
sliderr.addEventListener("input", () => {
    labelr.textContent = sliderr.value;
});

// minus button
minusBtnr.addEventListener("click", () => {
    const next = Math.max(
        +sliderr.min,
        +sliderr.value - 1
    );

    updateYearr(next);
});

// plus button
plusBtnr.addEventListener("click", () => {
    const next = Math.min(
        +sliderr.max,
        +sliderr.value + 1
    );

    updateYearr(next);
});

const radarYear = Generators.input(sliderr);

display(radarYearInput);

const countriesList = Array.from(
    new Set(country.map(d => d["Country"]))
).sort();

function makeCountryInput(label, defaultValue = "") {
    const input = html`
    <label
      style="
        display: block;
        width: 100%;
        font: 14px sans-serif;
        font-weight: 700;
      "
    >
      ${label}

      <input
        list="${label.replace(/\s+/g, "-")}-list"
        value="${defaultValue}"
        style="
          display: block;
          width: 100%;
          box-sizing: border-box;
          margin-top: 8px;
          padding: 10px 12px;
          border-radius: 8px;
          border: 2px solid #4269d0;
          background: var(--theme-background);
          color: currentColor;
          outline: none;
        "
      >

      <datalist id="${label.replace(/\s+/g, "-")}-list">
        ${countriesList.map(c => html`
          <option value="${c}">
        `)}
      </datalist>
    </label>
  `;

    return input;
}

// Country
const countryInput =
    makeCountryInput("Country:", countriesList[0]);

const countrySelection = Generators.input(
    countryInput.querySelector("input")
);

display(countryInput);

// Country A
const countryAInput =
    makeCountryInput("Country A:", countriesList[0]);

const countryA = Generators.input(
    countryAInput.querySelector("input")
);

display(countryAInput);

// Country B
const countryBInput =
    makeCountryInput("Country B:", countriesList[1]);

const countryB = Generators.input(
    countryBInput.querySelector("input")
);

display(countryBInput);

// --- Investment map ---
const investmentMax = computeInvestmentMax(country);

const relativeInput = html`
  <label
    style="
      display: block;
      width: 100%;
      font: 14px sans-serif;
      font-weight: 700;
    "
  >
    Production mode

    <div style="position: relative; margin-top: 8px;">
      <select
        style="
          width: 100%;
          box-sizing: border-box;
          padding: 10px 36px 10px 12px;
          border-radius: 8px;
          border: 2px solid #4269d0;
          background: var(--theme-background);
          color: currentColor;
          font: inherit;
          appearance: none;
          cursor: pointer;
          outline: none;
        "
      >
        <option>Absolute</option>
        <option>Relative</option>
      </select>

      <!-- custom dropdown arrow -->
      <div
        style="
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #4269d0;
          font-size: 12px;
        "
      >
        ▼
      </div>
    </div>
  </label>
`;

const selectEl =
    relativeInput.querySelector("select");

const relativeMode =
    Generators.input(selectEl);

display(relativeInput);
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

<div>
Where the plot above may show the trends for the entire world throughout the years, it is also interesting to take a look at individual countries. Below, you can observe the evolution of an entire country.
</div>

<div class="grid grid-cols-1">
  <div class="card">${countryInput}</div>
</div> 

<div class="grid grid-cols-1">
    <div class="card">
        <h2 style="font-weight: bold; max-width: 100%">Evolution of electricity generated per country</h2>
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

<div>
But let's also take a look at the investments made by each country. 
</div>

<div class="grid grid-cols-1">
    <div class="card">
        ${investmentYearInput}
    </div> 
</div>


<div class="grid grid-cols-1"> 
    <div class="card"> 
    <h2 style="font-weight: bold; max-width: 100%">Worldwide investments in renewable energy</h2>
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

<div>
Now that we have a sense of the global trends, maybe it is interesting to take a closer look at the countries themselves. From what sources do countries get there renewable energy and how much of their total energy production is renewable?
</div>

<div>
Below you can select 2 countries and analyze where they get their renewable energy from. But don't be bamboozled, these percentages are relative and don't show what share of their production is renewable as well as how large their production is. For that comparison, you can take a closer look at the bar chart underneath to get a better idea. 
</div>

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
      <h2 style="font-weight: bold; max-width: 100%">Comparison of proportions renewable/non-renewable electricity generation of the selected countries</h2>
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