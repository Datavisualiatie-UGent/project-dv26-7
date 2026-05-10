---
toc: false
---

<div class="hero">
  <h1>Green Energy</h1>
  <h2>Electrification is a buzzing topic nowadays. With the climbing global temperature, more and more people - except those that like to live in their own world - begin to realize that the time is running out. Of course, it is always easier said than done. There is no advantage to driving your new electric car if the electricity that was needed to put those wheels in motion came from a dead dinosaur or their prehistoric picnic leftovers. Electricity from GREEN energy sources, that is the way things should be headed. Therefore, it is important to get a grasp of how countries all over the world generate their electricity. Are they still relying on ancient life or can this life finally rest for good? What do their investments look like? Do they keep investing in ancient technology, dreading to use sun, wind, or water as one of their energy sources? These are some of the questions that will get answered by looking at the graphs and data on this website.
  </h2>
</div>

<div>
  In the graph below, you can see the evolution of the production of electricity using green energy sources. On the y-axis, the percentage of green electricity production in relation to all the produced electricity, including non-renewable sources, is shown. Throughout the years it is clear that Belgium lagged behind in its green electricity production. Up until 2011, less than 10% of all produced electricity, came from renewable energy sources. In the next 7 years however, Belgium was able to double that production. In 2023, Belgium produced more than 30% of its electricity through renewable sources, thereby surpassing the world and catching up to Europe, where almost 40% of the produced electricity is sustainable. 
</div>

```js
import {combined_energy_data_by_year} from "./data/load_data.js";
import {timeline_per_region_per_year} from "./components/timeline.js";
```

<div class="grid grid-cols-1" style="grid-auto-rows: 504px;">
  <div class="card">${
    resize((width) => timeline_per_region_per_year
        (
            combined_energy_data_by_year,
            {width}
        )
    )
  }</div>
</div>
 
 ---
 <div>
  The next page helps us understand where Belgium gets its renewable electricity from. Have a look!
 </div>

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>
