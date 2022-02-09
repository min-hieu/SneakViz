import { useState, useEffect } from 'react';
import * as d3 from 'd3';

const styles = {

}

const makeGraph = async () => {

  let data = await d3.csv("./data/graph.csv");

  var margin = { top: 20, right: 20, bottom: 50, left: 70 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  x.domain(d3.extent(data, (d) => { return d.year; }));
  y.domain([0, d3.max(data, (d) => { return d.pca; })]);

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));
  svg.append("g")
    .call(d3.axisLeft(y));

  var valueLine = d3.line()
               .x((d) => { return x(d.date); })
               .y((d) => { return y(d.value); });

  svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", valueLine)
};

export function Graph() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    makeGraph().then((d) => {
      setData(d);
      setLoading(false);
    });
    return () => undefined;
  }, []);

  return (
    <></>
  )
};
