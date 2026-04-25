import * as Plot from "npm:@observablehq/plot";

export function make_stacked_horizontal_bar_plot(
    data,
    category,
    value,
    separation,
    marginLeft,
    {width, height} = {}
){
    return Plot.plot({
        title: "Actual Production Of Electricity Using Green Energy Sources Versus Installed Capacity",
        width,
        height,
        marginLeft,
        marginTop: -20,
        color: {
            legend: true
        },
        marks: [
            Plot.barX(data, {
                y: category,
                x: value,
                fill: separation,
                sort: {y: "-x"}
            })
        ]
    })
}