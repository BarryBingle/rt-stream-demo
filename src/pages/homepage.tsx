import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { hrtime } from "process";

Chart.register(...registerables);

function StreamData() {
  const [data, setData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("/api/hr")
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((err) => console.log(err));

      fetch("/api/timestamps")
        .then((response) => response.json())
        .then((timestamps) => setTimestamps(timestamps))
        .catch((err) => console.log(err));
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Heart rate",
        data: [],
        backgroundColor: "rgba(255, 255, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
      },
    ],
  });

  useEffect(() => {
    if (data.length && timestamps.length) {
      setChartData({
        labels: timestamps,
        datasets: [
          {
            label: "Heart rate",
            data: data,
            backgroundColor: "rgba(255, 255, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
          },
        ],
      });
    }
  }, [data, timestamps]);

  let currhr = data[data.length - 1];

  const options = {
    scales: {
      y: {
        suggestedMin: 30,
        suggestedMax: 150,
      },
    },
  };

  return (
    <>
      <div className="w-full text-6xl text-red-700 align-center text-center">
        {currhr}
      </div>
      {getHeart(currhr)}

      <Bar data={chartData} options={options}/>
    </>
  );
}
function getHeart(currhr: Integer) {
  var canvas = document.getElementById('canvas') as HTMLCanvasElement;
  var context = canvas.getContext('2d')!;
  var i = 0;
  var j = 0.1;
  var t = 0;
  var col = new Array('green', 'blue', 'red', 'cyan', 'magenta', 'yellow');
  function timing() {
    t = t + 1;
    i = i + j;
    if (t > 5) { t = 0; }
    var x = 250 + 160*Math.sin(i)*Math.sin(i)*Math.sin(i); var y = -(-170+ 10*(13*Math.cos(i)- 5*Math.cos(2*i) - 2*Math.cos(3*i) - Math.cos(4*i)));
    context.beginPath();
    context.moveTo(250, 200);
    context.lineTo(x, y);
    context.lineCap = 'round';
    context.strokeStyle = 'rgba(0,0,255,0.6)';
    context.stroke();
    context.beginPath();
    context.moveTo(250, 200);
    context.arc(x, y, 8, 0, 2 * Math.PI);
    context.fillStyle = col[t];
    context.fill();
    if (i > 6.5) { j = -0.1; context.clearRect(0, 0, 500, 400); }
    if (i < -0.1) { j = 0.1; context.clearRect(0, 0, 500, 400);}
  }
  window.setInterval(() => timing(), 1000/currhr);
}
export function HomePage() {
  return (

    <>
      <StreamData />
    </>
  );
}
