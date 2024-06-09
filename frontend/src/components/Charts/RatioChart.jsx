import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";

const RatioChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/overview/ratio")
      .then((response) => {
        console.log("API Response:", response.data);
        setData(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Prepare series and categories for the chart
  const series = [
    {
      name: "Ratio",
      data: data.map((item) => item.ratio),
    },
  ];

  const categories = data.map((item) => item.className);

  const options = {
    chart: {
      type: "bar",
      toolbar: {
        show: false, // Hide toolbar for cleaner appearance
      },
    },
    plotOptions: {
      bar: {
        horizontal: false, // Vertical bars for better readability
        borderRadius: 4, // Rounded corners for a modern look
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels for cleaner appearance
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
        text: "Ratio",
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
      text: "Teacher to Student Ratio",
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
        type="bar"
        height={350}
      />
    </div>
  );
};

export default RatioChart;
