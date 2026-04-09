import {FileAttachment} from "observablehq:stdlib";

const country_data = await FileAttachment("../data/country.csv").csv();
const europe_country_data = country_data.filter(row => row["Region"] === "Europe");
const belgium_country_data = country_data.filter(row => row["Country"] === "Belgium");

function get_energy_data_by_year(data) {
    return Array.from(
        data.reduce((map, row) => {
            const year = row.Year;
            const value = Number(row["Electricity Generation (GWh)"]) || 0;

            if (!map.has(year)) {
                map.set(year, {
                    year,
                    renewable: 0,
                    nonrenewable: 0
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
        }, new Map()).values()
    ).map(d => ({
        ...d,
        total: d.renewable + d.nonrenewable,
        nonrenewablePercentage:
            (d.nonrenewable / (d.renewable + d.nonrenewable)) * 100,
        renewablePercentage:
            (d.renewable / (d.renewable + d.nonrenewable)) * 100,
    })).filter(row => row.total !== 0).flatMap(row => [
        {
            year: Number(row.year),
            percentage: (row.renewable / row.total) * 100
        }
    ]).toSorted(
        (a, b) => a.year - b.year
    );
}

const energy_data_by_year_belgium = get_energy_data_by_year(belgium_country_data);
const energy_data_by_year_europe = get_energy_data_by_year(europe_country_data);
const energy_data_by_year_global = get_energy_data_by_year(country_data);

export const combined_energy_data_by_year = [
    ...energy_data_by_year_belgium.map(d => ({...d, region: "Belgium"})),
    ...energy_data_by_year_europe.map(d => ({...d, region: "Europe"})),
    ...energy_data_by_year_global.map(d => ({...d, region: "World"})),
]