import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";

const ClassDistributionChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/overview/class-distribution")
      .then((response) => {
        console.log("API Response:", response.data);
        setData(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  console.log("Chart Data:", data);

  // Prepare series and categories for the chart
  const series = [
    {
      name: "Students",
      data: data.map((item) => item.studentCount),
    },
  ];

  const categories = data.map((item) => item.className);

  const options = {
    chart: {
      type: "bar",
      stacked: true,
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
        text: "Student Count",
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
      text: "Class-wise Distribution",
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

export default ClassDistributionChart;
