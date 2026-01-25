import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  SubTitle,
  LineElement,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  SubTitle,
  Tooltip,
  Legend,
);

ChartJS.register(ArcElement, Tooltip, Legend);

export function LineChart(props: {
  title: string;
  entries: [string | number, number][];
  xtitle?: string;
  ytitle?: string;
}) {
  const { entries, title, xtitle, ytitle } = props;

  const options = {
    responsive: true,
    plugins: {
      legend: false,
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        title: { display: true, text: xtitle },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        title: { display: true, text: ytitle },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  const labels = entries.map((e) => e[0]);
  const values = entries.map((e) => e[1]);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: "#2a7dadff",
        borderColor: "#2a7dadbd",
      },
    ],
  };

  return (
    <div>
      <Line options={options} data={data} />
    </div>
  );
}
