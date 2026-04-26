import { FileAttachment } from "observablehq:stdlib";
import * as d3 from "d3";

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
    .sort((a, b) => b.Investment - a.Investment);

  return result;
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
