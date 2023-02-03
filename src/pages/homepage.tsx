import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const MyComponent: React.FC = () => {
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  const chartData = {
    labels: data.map((_, i) => i.toString()),
    datasets: [
      {
        data,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    // <Line data={chartData} />
    <div>
      {data.map((datum) => (
        <div key={datum}>{datum}</div>
      ))}
    </div>
  );
};

export default MyComponent;

// function updateChart(this: any) {
//   const node = this.node;
//   const data = this.state.data;

//   const margin = { top: 20, right: 20, bottom: 20, left: 50 };
//   const width = 500 - margin.left - margin.right;
//   const height = 300 - margin.top - margin.bottom;

//   const x = d3.scaleLinear().range([0, width]);
//   const y = d3.scaleLinear().range([height, 0]);

//   const line = d3
//     .line<number>()
//     .x((d, i) => x(i))
//     .y((d) => y(d));

//   // x.domain(d3.extent(data, (d, i) => i));
//   // y.domain(d3.extent(data, d => d));

//   const svg = d3
//     .select(node)
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

//   svg
//     .append("g")
//     .attr("transform", `translate(0, ${height})`)
//     .call(d3.axisBottom(x));

//   svg.append("g").call(d3.axisLeft(y));

//   svg
//     .append("path")
//     .datum(data)
//     .attr("fill", "none")
//     .attr("stroke", "steelblue")
//     .attr("stroke-width", 1.5)
//     .attr("d", line);
// }

// function Render(this: any) {
//   return <svg ref={(node) => (this.node = node)} />;
// }

export function HomePage() {
  return (
    <>
      <div className="flex flex-col md:w-[32rem] text-3xl md:text-4xl font-bold text-center md:mt-32 mb-7">
        FAQ - Updated throughout the challenge
      </div>
      <MyComponent />
    </>
  );
}
