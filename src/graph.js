import { useState, useEffect, useRef } from 'react';
import { LineChart } from './LineChart';
import graphData from './data/graph.csv';
import * as d3 from 'd3';

const styles = {

}

const loadGraph = async () => {

  const parsedate = d3.timeParse("%d/%m/%Y");

  let data = await d3.csv(graphData, (d) => {
    d.date = parsedate(d.date);
    if (d.date != null) {
      d.value = Number(d.value);
      return d;
    }
  });

  data = data.sort((a,b)=>(a.date-b.date));
  console.log(data)

  return data
};

export function Graph() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedChart, setLoadedChart] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    loadGraph().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const brandColor = {
    'Nike': "#8a0000",
    'adidas': "#949494",
    'Jordan': "#000000",
    'Reebok': "#b84000",
    'Vans': "#9c0343",
    'New Balance': "#d40838",
    'Converse': "#4e0075",
  }

  useEffect(() => {
    if (!loading && !loadedChart) {
      const ymin = d3.min(data, d => d.value);
      const ymax = d3.max(data, d => d.value);
      const xmin = d3.min(data, d => d.date);
      const xmax = d3.max(data, d => d.date);
      console.log(data)
      let chart = LineChart(data, {
        x: d => d.date,
        y: d => d.value,
        z: d => d.brand,
        yLabel: "color embedding over time",
        xDomain: [xmin, xmax],
        yDomain: [ymin*2, ymax*2],
        height: 500,
        width: 1000,
        color: z => brandColor[z],
      })
      ref.current.appendChild(chart);
      setLoadedChart(false);
    } 
  }, [loading]);


  return (
    <div ref={ref}/>
  )
};
