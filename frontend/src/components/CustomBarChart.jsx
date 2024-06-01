import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const CustomTooltipContent = ({ active, payload, dataKey }) => {
  if (active && payload && payload.length) {
    const {
      subject,
      attendancePercentage,
      totalClasses,
      attendedClasses,
      marksObtained,
      subName,
    } = payload[0].payload;

    return (
      <div className="bg-white rounded-lg p-4 shadow-lg">
        {dataKey === "attendancePercentage" ? (
          <>
            <h2 className="font-bold text-black">{subject}</h2>
            <p className="font-bold text-gray-900">
              Attended: ({attendedClasses}/{totalClasses})
            </p>
            <p className="font-bold text-gray-900">{attendancePercentage}%</p>
          </>
        ) : (
          <>
            <h2 className="font-bold text-black">{subName.subName}</h2>
            <p className="font-bold text-gray-900">Marks: {marksObtained}</p>
          </>
        )}
      </div>
    );
  }

  return null;
};

const CustomBarChart = ({ chartData, dataKey }) => {
  const subjects = chartData.map((data) => data.subject);
  const distinctColors = generateDistinctColors(subjects.length);

  return (
    <BarChart width={500} height={500} data={chartData}>
      <XAxis
        dataKey={dataKey === "marksObtained" ? "subName.subName" : "subject"}
      />
      <YAxis domain={[0, 100]} />
      <Tooltip content={<CustomTooltipContent dataKey={dataKey} />} />
      <Bar dataKey={dataKey}>
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={distinctColors[index]} />
        ))}
      </Bar>
    </BarChart>
  );
};

// Helper function to generate distinct colors
const generateDistinctColors = (count) => {
  const colors = [];
  const goldenRatioConjugate = 0.618033988749895;

  for (let i = 0; i < count; i++) {
    const hue = (i * goldenRatioConjugate) % 1;
    const color = hslToRgb(hue, 0.6, 0.6);
    colors.push(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
  }

  return colors;
};

// Helper function to convert HSL to RGB
const hslToRgb = (h, s, l) => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // Achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

export default CustomBarChart;
