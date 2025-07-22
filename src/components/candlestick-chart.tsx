import { CandlestickSeries, ColorType, createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";

export type CandlestickChartProps = {
  data: {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
  colors?: {
    backgroundColor?: string;
    textColor?: string;
    areaBottomColor?: string;
    upColor?: string;
    downColor?: string;
    wickUpColor?: string;
    wickDownColor?: string;
  };
  width?: number;
  height?: number;
};

const CandlestickChart = ({
  data,
  colors = {},
  width,
  height,
}: CandlestickChartProps) => {
  const {
    backgroundColor = "#171717",
    textColor = "#e5e5e5",
    areaBottomColor = "#2962ff47",
    upColor = "#26a69a",
    downColor = "#ef5350",
    wickUpColor = "#26a69a",
    wickDownColor = "#ef5350",
  } = colors;

  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: width || chartContainerRef.current.clientWidth,
      height: height || 300,
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addSeries(CandlestickSeries, {
      upColor,
      downColor,
      wickUpColor,
      wickDownColor,
    });
    newSeries.setData(data);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [data, backgroundColor, textColor, areaBottomColor]);

  return <div ref={chartContainerRef} />;
};

export default CandlestickChart;
