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
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  Damages,
  type Advantage,
  type Attack,
  type Target,
} from "d20attack.js";
import { useStyles } from "../hooks/styles";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  SubTitle,
  Tooltip,
  Legend,
);

ChartJS.register(ArcElement, Tooltip, Legend);

export function AttackChart(props: {
  title: string;
  attack: Attack;
  target: Target;
  advantage: Advantage;
}) {
  const { attack, title, target, advantage } = props;
  const style = useStyles();

  const hitDistribution = Damages.distribution(attack.damages);
  const missDistribution = Damages.distribution(attack.missDamages);
  const critDistribution = Damages.distribution(attack.critDamages);

  const { miss, hit, crit } = attack.hitOdds(target, advantage);

  const min = Math.min(
    hitDistribution.min(),
    missDistribution.min(),
    critDistribution.min(),
  );

  const max = Math.max(
    hitDistribution.max(),
    missDistribution.max(),
    critDistribution.max(),
  );

  const hitActual = hitDistribution.transformValues((value) => value * hit);
  const missActual = missDistribution.transformValues((value) => value * miss);
  const critActual = critDistribution.transformValues((value) => value * crit);

  const mean = hitActual.mean() + missActual.mean() + critActual.mean();
  const stddev = Math.sqrt(
    hitActual.stddev() * hitActual.stddev() +
      missActual.stddev() * missActual.stddev() +
      critActual.stddev() * critActual.stddev(),
  );

  const labels = new Array(max + 1 - min).fill(0).map((_, i) => min + i);

  const options = {
    responsive: true,
    plugins: {
      legend: false,
      title: {
        display: true,
        text: title,
      },
      subtitle: {
        display: true,
        text: `mean ${mean.toFixed(2)}, standard deviation ${stddev.toFixed(
          2,
        )}`,
      },
    },
    scales: {
      y: {
        grid: { color: style.colors.gray.faint },
        stacked: true,
        ticks: {
          format: {
            style: "percent",
          },
        },
      },
      x: {
        grid: { color: style.colors.gray.faint },
        stacked: true,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Hit",
        data: labels.map((label) => hitActual.get(label)),
        backgroundColor: style.colors.blue,
      },
      {
        label: "Miss",
        data: labels.map((label) => missActual.get(label)),
        backgroundColor: style.colors.red,
      },
      {
        label: "Crit",
        data: labels.map((label) => critActual.get(label)),
        backgroundColor: style.colors.green,
      },
    ],
  };

  return (
    <div>
      <Bar options={options} data={data} />
    </div>
  );
}
