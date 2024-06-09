import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";

const ParentInvolvementChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/overview/parent-involvement")
      .then((response) => {
        console.log("API Response:", response.data); // Log API response
        setData(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  console.log("Chart Data:", data); // Log state data

  // Prepare series and categories for the chart
  const series = [
    {
      name: "Children Count",
      data: data.map((item) => item.childrenCount),
    },
  ];

  const categories = data.map((item) => item.parentName);

  const options = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: categories,
    },
  };

  return (
    <div>
      <h2>Parent Involvement Chart</h2>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default ParentInvolvementChart;
