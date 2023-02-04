import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function StreamData() {
  const [data, setData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    fetch("/api/hr")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("/api/timestamps")
      .then((response) => response.json())
      .then((timestamps) => setTimestamps(timestamps))
      .catch((err) => console.log(err));
  }, []);

  const [chartData, setChartData] = useState({
    labels: timestamps,
    datasets: [
      {
        label: "Data",
        data: data,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
      },
    ],
  });

  const options = {
    scales: {
      y: [
        {
          type: "Heart rate",
          ticks: {
            min: 0,
            max: 150,
            stepSize: 10
          },
          
        },
      ],
    },
  };

  return (
    <>
      <Line data={chartData} />
      <div>
        {data.map((samples: number) => (
          <div key={samples}>{samples.toString()}</div>
        ))}
      </div>
    </>
  );
}

export function HomePage() {
  return (
    <>
      <div className="flex flex-col md:w-[32rem] text-3xl md:text-4xl font-bold text-center md:mt-32 mb-7">
        FAQ - Updated throughout the challenge
      </div>
      <StreamData />
    </>
  );
}
