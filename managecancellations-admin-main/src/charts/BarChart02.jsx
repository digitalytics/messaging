import React, { useRef, useEffect } from "react";

import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  ArcElement,
  RadarController,
  ScatterController,
  LineElement,
  PointElement,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  CategoryScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Title,
} from "chart.js";
import "chartjs-adapter-moment";

// Import utilities
import { formatValue } from "../Utils/Utils";

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);

function BarChart02({ data, width, height, options }) {
  const canvas = useRef(null);

  useEffect(() => {
    const ctx = canvas.current;
    // eslint-disable-next-line no-unused-vars
    const chart = new Chart(ctx, {
      type: "bar",
      data: data,
      options: {
        ...options,
        layout: {
          padding: {
            top: 12,
            bottom: 16,
            left: 20,
            right: 20,
          },
        },
        scales: {
          y: {
            stacked: true,
            border: {
              display: false,
            },
            beginAtZero: true,
            ticks: {
              maxTicksLimit: 5,
              color:"#fff",
              // Include a dollar sign in the ticks
              callback: function(value, index, ticks) {
                  return '฿ ' + value;
              }
          },           
          },
          x: {
            border: {
              display: false,
            },
            grid: {
              display: false,
            },
            ticks: {
              // autoSkipPadding: 48,
              color:"#fff",
              maxRotation: 0,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: () => false, // Disable tooltip title
              label: (context) => `${formatValue(context?.parsed?.y)}`,
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "nearest",
        },
        animation: {
          duration: 2000,
        },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
    });
    return () => chart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvas} width={width} height={height}></canvas>;
}

export default BarChart02;
