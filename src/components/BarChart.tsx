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
import { Bar } from "react-chartjs-2";
import { useStyles } from "../hooks/styles";

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

export function BarChart(props: {
  title: string;
  entries: [string | number, number][];
  xtitle?: string;
  ytitle?: string;
  maxy?: number;
}) {
  const { entries, title, xtitle, ytitle } = props;
  const style = useStyles();

  const options: object = {
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
        grid: { color: style.colors.gray.faint },
      },
      y: {
        title: { display: true, text: ytitle },
        grid: { color: style.colors.gray.faint },
        max: props.maxy,
        ticks: {
          format: {
            style: "percent",
          },
        },
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
        backgroundColor: style.colors.blue,
        borderColor: style.colors.blue,
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
