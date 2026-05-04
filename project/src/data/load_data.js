import { FileAttachment } from "observablehq:stdlib";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const country_data = await FileAttachment("../data/country.csv").csv();
const europe_country_data = country_data.filter(
  (row) => row["Region"] === "Europe",
);
const belgium_country_data = country_data.filter(
  (row) => row["Country"] === "Belgium",
);

function get_energy_data_by_year(data) {
  return Array.from(
    data
      .reduce((map, row) => {
        const year = row.Year;
        const value = Number(row["Electricity Generation (GWh)"]) || 0;

        if (!map.has(year)) {
          map.set(year, {
            year,
            renewable: 0,
            nonrenewable: 0,
          });
        }

        const entry = map.get(year);

        if (row["RE or Non-RE"] === "Total Renewable") {
          entry.renewable += value;
        }

        if (row["RE or Non-RE"] === "Total Non-Renewable") {
          entry.nonrenewable += value;
        }

        return map;
      }, new Map())
      .values(),
  )
    .map((d) => ({
      ...d,
      total: d.renewable + d.nonrenewable,
      nonrenewablePercentage:
        (d.nonrenewable / (d.renewable + d.nonrenewable)) * 100,
      renewablePercentage: (d.renewable / (d.renewable + d.nonrenewable)) * 100,
    }))
    .filter((row) => row.total !== 0)
    .flatMap((row) => [
      {
        year: Number(row.year),
        percentage: (row.renewable / row.total) * 100,
      },
    ])
    .toSorted((a, b) => a.year - b.year);
}

const energy_data_by_year_belgium =
  get_energy_data_by_year(belgium_country_data);
const energy_data_by_year_europe = get_energy_data_by_year(europe_country_data);
const energy_data_by_year_global = get_energy_data_by_year(country_data);

function max_vs_produced(data) {
  return Array.from(
    data
      .filter((r) => r["RE or Non-RE"] === "Total Renewable")
      .map((d) => ({
        Technology: d["Technology"],
        "Electricity Produced": d["Electricity Generation (GWh)"],
        "Max Production":
          (d["Electricity Installed Capacity (MW)"] * 24 * 365) / 1000,
      }))
      .filter((r) => r["Electricity Produced"] !== "")
      .filter((r) => r["Max Production"] !== 0)
      .reduce((map, row) => {
        const tech = row["Technology"];
        const produced = Number(row["Electricity Produced"]);
        const max = row["Max Production"];
        if (!map.has(tech)) {
          map.set(tech, { tech, produced: 0, max: 0 });
        }

        const entry = map.get(tech);
        entry.produced += produced;
        entry.max += max;

        return map;
      }, new Map())
      .values(),
  );
}

function get_totals_per_energy(data) {
  return data.reduce((acc, d) => {
    acc += d.max;
    return acc;
  }, 0);
}

function get_tech_shares(data, total) {
  return data
    .map((d) => ({
      tech: d.tech,
      share: Math.round((d.produced / total) * 100),
    }))
    .sort((a, b) => b.share - a.share);
}

const max_vs_produced_electricity_belgium_dict =
  max_vs_produced(belgium_country_data);
const max_vs_produced_electricity_europe_dict =
  max_vs_produced(europe_country_data);
const max_vs_produced_electricity_world_dict = max_vs_produced(country_data);
const totals_per_energy_belgium = get_totals_per_energy(
  max_vs_produced_electricity_belgium_dict,
);
const totals_per_energy_europe = get_totals_per_energy(
  max_vs_produced_electricity_europe_dict,
);
const totals_per_energy_world = get_totals_per_energy(
  max_vs_produced_electricity_world_dict,
);

const produced_and_max_per_year = belgium_country_data
  .filter((r) => r["RE or Non-RE"] === "Total Renewable")
  .filter((r) => r["Electricity Generation (GWh)"] !== "")
  .filter((r) => r["Electricity Installed Capacity (MW)"] !== "")
  .reduce((map, row) => {
    const year = row["Year"];
    const produced = Number(row["Electricity Generation (GWh)"]);
    const max = Number(row["Electricity Installed Capacity (MW)"]);

    if (!map.has(year)) {
      map.set(year, { produced: 0, max: 0 });
    }

    const entry = map.get(year);
    entry.produced += produced;
    entry.max += (max * 24 * 365) / 100;

    return map;
  }, new Map());

function get_overview_electricity(data) {
  let electricity_belgium = data.filter(
    (row) => row["Electricity Generation (GWh)"] !== "",
  );

  let electricity_rollup_group_technology = electricity_belgium.reduce(
    (acc, row) => {
      const group = row["Group Technology"];
      const year = row["Year"];
      const value = +row["Electricity Generation (GWh)"];

      if (Number.isNaN(value)) return acc;

      // Ensure group exists
      if (!acc.has(group)) {
        acc.set(group, new Map());
      }

      const groupMap = acc.get(group);

      // Ensure year exists
      if (!groupMap.has(year)) {
        groupMap.set(year, 0);
      }

      // Add value
      groupMap.set(year, groupMap.get(year) + value);

      return acc;
    },
    new Map(),
  );

  let result = Array.from(
    electricity_rollup_group_technology,
    ([group, years]) =>
      Array.from(years, ([year, total]) => ({
        "Group Technology": group,
        Year: Number(year),
        "Electricity Generation (GWh)": total,
      })),
  )
    .flat()
    .filter((elem) => elem["Electricity Generation (GWh)"] !== 0)
    .filter(
      (elem) =>
        elem["Group Technology"] !== "Other non-renewable energy" &&
        elem["Group Technology"] !== "Pumped storage",
    )
    .sort((a, b) => a.Year - b.Year);

  return result;
}

function get_investment_data(data) {
  let investements_belgium = data.filter(
    (row) => !Number.isNaN(row["Public Flows (2022 USD M)"]),
  );

  let grouped = d3.rollup(
    investements_belgium,
    (v) => d3.sum(v, (d) => +d["Public Flows (2022 USD M)"]),
    (d) => d["Technology"],
  );

  let result = Array.from(grouped, ([group, investements]) => ({
    "Group Technology":
      group === "Multiple renewables*" ? "Other renewables" : group,
    Investment: investements,
  }))
    .flat()
    .filter((d) => d.Investment !== 0)
    .sort((a, b) => b.Investment - a.Investment);

  return result;
}

function get_changes_capacity_data_belgium(data) {
  let capacity = data.filter(
    (elem) => !Number.isNaN(elem["Electricity Installed Capacity (MW)"]),
  );

  let grouped_capacity = d3.rollup(
    capacity,
    (v) => d3.sum(v, (d) => +d["Electricity Installed Capacity (MW)"]),
    (d) => d["RE or Non-RE"],
    (d) => d["Year"],
  );

  let flat = Array.from(grouped_capacity, ([type, years]) =>
    Array.from(years, ([year, value]) => ({
      type,
      year: +year,
      capacity: value,
    })),
  )
    .flat()
    .map((d) => ({
      ...d,
      type:
        d.type === "Total Renewable"
          ? "Renewable Energy"
          : "Non-Renewable Energy",
    }));

  let growth = flat
    .sort((a, b) => a.type.localeCompare(b.type) || a.year - b.year)
    .map((d, i, arr) => {
      if (i === 0 || arr[i - 1].type !== d.type) {
        return { ...d, growth: 0 }; // first year = no growth
      }

      return {
        ...d,
        growth: d.capacity - arr[i - 1].capacity,
      };
    });

  return growth.filter((d) => d["year"] !== 2000);
}

function get_renewable_growth_capacity(data) {
  let growth = get_changes_capacity_data_belgium(data);
  return growth.filter((d) => d.type === "Renewable Energy");
}

function get_non_renewable_growth_capacity(data) {
  let growth = get_changes_capacity_data_belgium(data);
  return growth.filter((d) => d.type === "Non-Renewable Energy");
}

function get_capacity_changes_bar_data(data) {
  let growth = get_changes_capacity_data_belgium(data);
  return growth.map((elem) => {
    if (elem.type === "Renewable Energy") {
      let corresponding = growth.filter(
        (d) =>
          d["type"] === "Non-Renewable Energy" && d["year"] === elem["year"],
      )[0];
      if (corresponding["growth"] > 0) {
        return {
          ...elem,
          growth: elem.growth - corresponding.growth,
        };
      }
    }
    return elem;
  });
}

export const produced_vs_max_per_year_structured = produced_and_max_per_year;
export const tech_shares_belgium = get_tech_shares(
  max_vs_produced_electricity_belgium_dict,
  totals_per_energy_belgium,
);
export const tech_shares_europe = get_tech_shares(
  max_vs_produced_electricity_europe_dict,
  totals_per_energy_europe,
);
export const tech_shares_world = get_tech_shares(
  max_vs_produced_electricity_world_dict,
  totals_per_energy_world,
);

export const max_vs_produced_electricity_belgium =
  max_vs_produced_electricity_belgium_dict.flatMap((d) => [
    {
      Technology: d["tech"],
      type: "Produced",
      "Electricity Production (GWh)": d["produced"],
    },
    {
      Technology: d["tech"],
      type: "Capacity",
      "Electricity Production (GWh)": d["max"] - d["produced"],
    },
  ]);

export const combined_energy_data_by_year = [
  ...energy_data_by_year_belgium.map((d) => ({ ...d, region: "Belgium" })),
  ...energy_data_by_year_europe.map((d) => ({ ...d, region: "Europe" })),
  ...energy_data_by_year_global.map((d) => ({ ...d, region: "World" })),
];

export const overview_electricity_belgium =
  get_overview_electricity(belgium_country_data);

export const investment_data_belgium =
  get_investment_data(belgium_country_data);

export const renewable_cap_changes =
  get_renewable_growth_capacity(belgium_country_data);

export const non_renewable_cap_changes =
  get_non_renewable_growth_capacity(belgium_country_data);

export const cap_bar_data = get_capacity_changes_bar_data(belgium_country_data);


//--------------
// dynamic data
//--------------

export async function loadWorld() {
  const world = await fetch(
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
  ).then((r) => r.json());

  const key = Object.keys(world.objects)[0]; // safest fix

  return topojson.feature(world, world.objects[key]);
}

export async function loadCountryData() {
  return FileAttachment("country.csv").csv({ typed: true });
}

export function buildIsoToM49(country) {
  return new Map(
    country.map((d) => [
      d["ISO3 code"],
      String(d["M49 code"]).padStart(3, "0"),
    ])
  );
}

export function computeCategoryData(country, category, year) {
  const filtered = country.filter(
    (d) =>
      d["Year"] === year &&
      d["Group Technology"] === category
  );

  return d3.rollup(
    filtered,
    (values) =>
      d3.sum(values, (d) => d["Electricity Generation (GWh)"] || 0),
    (d) => d["ISO3 code"]
  );
}

export function mapToM49(categoryData, isoToM49) {
  return new Map(
    Array.from(categoryData, ([iso, value]) => [
      isoToM49.get(iso),
      value,
    ])
  );
}

export function attachDataToCountries(countries, dataMap) {
  return countries.features.map((f) => ({
    ...f,
    value: dataMap.get(f.id),
  }));
}

export function computeCategoryMax(country, category) {
  const filtered = country.filter(
    (d) => d["Group Technology"] === category
  );

  const byCountryYear = d3.rollup(
    filtered,
    (values) =>
      d3.sum(values, (d) => d["Electricity Generation (GWh)"] || 0),
    (d) => d["ISO3 code"],
    (d) => d.Year
  );

  return d3.max(
    Array.from(byCountryYear.values(), (countryMap) =>
      d3.max(countryMap.values())
    )
  );
}

export function computeInvestmentData(country, year) {
  const filtered = country.filter((d) => d["Year"] === year);

  return d3.rollup(
    filtered,
    (values) =>
      d3.sum(values, (d) => d["Public Flows (2022 USD M)"] || 0),
    (d) => d["ISO3 code"]
  );
}

export function computeInvestmentMax(country) {
  const byCountryYear = d3.rollup(
    country,
    (values) =>
      d3.sum(values, (d) => d["Public Flows (2022 USD M)"] || 0),
    (d) => d["ISO3 code"],
    (d) => d.Year
  );

  return d3.max(
    Array.from(byCountryYear.values(), (countryMap) =>
      d3.max(countryMap.values())
    )
  );
}

export const categoryMap = new Map([
  ["Bioenergy", "Bioenergy"],
  ["Hydropower (excl. Pumped Storage)", "Hydropower"],
  ["Pumped storage", "Hydropower"],
  ["Wind energy", "Wind"],
  ["Solar energy", "Solar"],
  ["Geothermal energy", "Other renewables"],
  ["Marine energy", "Other renewables"],
  ["Multiple renewables*", "Other renewables"],
  ["Other renewable energy", "Other renewables"],
  ["Fossil fuels", null],
  ["Nuclear", null],
  ["Other non-renewable energy", null],
]);

export const groupedCategories = [
  "Bioenergy",
  "Hydropower",
  "Wind",
  "Solar",
  "Other renewables",
];

export function computeRadarData(country, iso3, year) {
  const filtered = country.filter(
    (d) => d.Year === year && d["ISO3 code"] === iso3
  );

  const renewableOnly = filtered.filter(
    (d) => categoryMap.get(d["Group Technology"]) !== null
  );

  const byCategory = d3.rollup(
    renewableOnly,
    (v) =>
      d3.sum(v, (d) => d["Electricity Generation (GWh)"] || 0),
    (d) => categoryMap.get(d["Group Technology"])
  );

  const total = d3.sum(byCategory.values());

  return groupedCategories.map((category) => {
    const value = byCategory.get(category) || 0;

    return {
      category,
      value,
      share: total > 0 ? value / total : 0,
    };
  });
}