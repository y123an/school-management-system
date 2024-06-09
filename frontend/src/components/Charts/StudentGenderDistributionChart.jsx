import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const StudentGenderDistributionChart = () => {
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:4000/overview/gender-distribution")
      .then((response) => {
        const { male, female } = response.data;
        setMaleCount(male);
        setFemaleCount(female);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const options = {
    chart: {
      type: "pie",
      toolbar: {
        show: false,
      },
    },
    labels: ["Male", "Female"],
    colors: ["#4e73df", "#f6c23e"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      markers: {
        radius: 12,
        height: 10,
        width: 10,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return `${opts.w.config.labels[opts.seriesIndex]}: ${Math.round(val)}%`;
      },
    },
  };

  const series = [maleCount, femaleCount];

  return (
    <div className="gender-distribution-chart">
      <h2 className="chart-title">Gender Distribution Chart of Students</h2>
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height={350}
      />
    </div>
  );
};

export default StudentGenderDistributionChart;
