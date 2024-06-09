import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";

const PerformanceOverTimeChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/overview/exam-results")
      .then((response) => {
        console.log("API Response:", response.data);
        setData(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Prepare series and categories for the chart
  const series = [
    {
      name: "Average Marks",
      data: data.map((item) => item.averageMarks),
    },
  ];

  const categories = data.map((item) => item.subject);

  const options = {
    chart: {
      type: "line",
      toolbar: {
        show: false, // Hide toolbar for cleaner appearance
      },
    },
    stroke: {
      width: 3, // Increase line width for better visibility
      curve: "smooth", // Apply smooth curve to lines
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: "14px", // Adjust label font size
        },
      },
    },
    yaxis: {
      title: {
        text: "Average Marks",
        style: {
          fontSize: "16px", // Adjust axis title font size
        },
      },
      labels: {
        style: {
          fontSize: "14px", // Adjust label font size
        },
      },
    },
    title: {
      text: "Student Performance Over Time",
      align: "center", // Center align chart title
      style: {
        fontSize: "20px", // Adjust chart title font size
      },
    },
    tooltip: {
      enabled: true, // Enable tooltips for data points
      style: {
        fontSize: "14px", // Adjust tooltip font size
      },
    },
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default PerformanceOverTimeChart;
