import { useMemo } from 'react';

import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

import type { PerformanceInsight, TrendData } from '../../types';

import { Card } from './Card';

interface ChartProps {
  /** Chart nomi */
  title: string;
  /** Trend ma'lumotlari */
  data: TrendData[];
  /** Chart turi */
  type?: 'line' | 'bar' | 'area';
  /** Rang */
  color?: string;
  /** O'lcham */
  height?: number;
  /** Y-axis label */
  yAxisLabel?: string;
}

/**
 * Chart komponenti - Interaktiv grafiklar va diagrammalar
 * Soddalashtirilgan versiya (recharts o'rniga)
 */
export function Chart({
  title,
  data,
  type = 'line',
  color = '#2563EB',
  height = 200,
  yAxisLabel,
}: ChartProps) {
  // Ma'lumotlarni tayyorlash
  const chartData = useMemo(() => {
    if (data.length === 0) return [];

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    return data.map((item, index) => ({
      ...item,
      normalizedValue: range > 0 ? ((item.value - minValue) / range) * 100 : 50,
      x: (index / (data.length - 1 || 1)) * 100,
    }));
  }, [data]);

  // Trend hisoblash
  const trend = useMemo(() => {
    if (data.length < 2) return { value: 0, direction: 'stable' as const };

    const first = data[0].value;
    const last = data[data.length - 1].value;
    const change = last - first;
    const percentChange = first > 0 ? (change / first) * 100 : 0;

    return {
      value: Math.abs(percentChange),
      direction:
        percentChange > 2
          ? ('up' as const)
          : percentChange < -2
            ? ('down' as const)
            : ('stable' as const),
    };
  }, [data]);

  if (data.length === 0) {
    return (
      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        <div className="flex items-center justify-center h-48 text-gray-500">
          Ma'lumotlar mavjud emas
        </div>
      </Card>
    );
  }

  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          {trend.direction === 'up' && (
            <>
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">
                +{trend.value.toFixed(1)}%
              </span>
            </>
          )}
          {trend.direction === 'down' && (
            <>
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-500">
                -{trend.value.toFixed(1)}%
              </span>
            </>
          )}
          {trend.direction === 'stable' && (
            <>
              <Minus className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {trend.value.toFixed(1)}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Chart area */}
      <div className="relative" style={{ height: `${height}px` }}>
        <svg width="100%" height={height} className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <linearGradient
              id={`gradient-${color}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Y-axis labels */}
          {yAxisLabel && (
            <text
              x="10"
              y={height / 2}
              className="text-xs fill-gray-500 dark:fill-gray-400"
              transform={`rotate(-90, 10, ${height / 2})`}
            >
              {yAxisLabel}
            </text>
          )}

          {/* Chart line/bar */}
          {type === 'line' && chartData.length > 1 && (
            <>
              {/* Area fill */}
              <path
                d={`M ${chartData.map(d => `${d.x}%,${100 - d.normalizedValue}%`).join(' L ')} L ${chartData[chartData.length - 1].x}%,100% L 0%,100% Z`}
                fill={`url(#gradient-${color})`}
              />
              {/* Line */}
              <path
                d={`M ${chartData.map(d => `${d.x}%,${100 - d.normalizedValue}%`).join(' L ')}`}
                stroke={color}
                strokeWidth="2"
                fill="none"
                className="drop-shadow-sm"
              />
              {/* Points */}
              {chartData.map((item, index) => (
                <circle
                  key={index}
                  cx={`${item.x}%`}
                  cy={`${100 - item.normalizedValue}%`}
                  r="4"
                  fill={color}
                  className="hover:r-6 transition-all cursor-pointer"
                >
                  <title>
                    {item.label || item.date}: {item.value.toFixed(1)}
                  </title>
                </circle>
              ))}
            </>
          )}

          {type === 'bar' &&
            chartData.map((item, index) => (
              <g key={index}>
                <rect
                  x={`${item.x - 2}%`}
                  y={`${100 - item.normalizedValue}%`}
                  width="4%"
                  height={`${item.normalizedValue}%`}
                  fill={color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <title>
                    {item.label || item.date}: {item.value.toFixed(1)}
                  </title>
                </rect>
              </g>
            ))}

          {type === 'area' && chartData.length > 1 && (
            <>
              <path
                d={`M ${chartData.map(d => `${d.x}%,${100 - d.normalizedValue}%`).join(' L ')} L ${chartData[chartData.length - 1].x}%,100% L 0%,100% Z`}
                fill={`url(#gradient-${color})`}
              />
              <path
                d={`M ${chartData.map(d => `${d.x}%,${100 - d.normalizedValue}%`).join(' L ')}`}
                stroke={color}
                strokeWidth="2"
                fill="none"
              />
            </>
          )}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          {chartData
            .filter(
              (_, i) =>
                i % Math.ceil(chartData.length / 5) === 0 ||
                i === chartData.length - 1
            )
            .map((item, index) => (
              <span key={index} className="truncate max-w-[20%]">
                {item.label || item.date}
              </span>
            ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Min</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {Math.min(...data.map(d => d.value)).toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">O'rtacha</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(
              1
            )}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Max</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {Math.max(...data.map(d => d.value)).toFixed(1)}
          </p>
        </div>
      </div>
    </Card>
  );
}

/**
 * InsightCard komponenti - Performance insights ko'rsatish
 */
interface InsightCardProps {
  insight: PerformanceInsight;
  onClick?: () => void;
}

export function InsightCard({ insight, onClick }: InsightCardProps) {
  const trendIcon =
    insight.trend === 'up' ? (
      <TrendingUp className="w-5 h-5 text-green-500" />
    ) : insight.trend === 'down' ? (
      <TrendingDown className="w-5 h-5 text-red-500" />
    ) : (
      <Minus className="w-5 h-5 text-gray-500" />
    );

  const trendColor =
    insight.trend === 'up'
      ? 'text-green-500'
      : insight.trend === 'down'
        ? 'text-red-500'
        : 'text-gray-500';

  const priorityColor =
    insight.priority === 'high'
      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
      : insight.priority === 'medium'
        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';

  return (
    <Card
      padding="md"
      className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${onClick ? '' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          {trendIcon}
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {insight.title}
          </h4>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColor}`}>
          {insight.priority === 'high'
            ? 'Yuqori'
            : insight.priority === 'medium'
              ? "O'rtacha"
              : 'Past'}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {insight.description}
      </p>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {insight.value.toFixed(1)}%
          </p>
          <p className={`text-xs ${trendColor} flex items-center space-x-1`}>
            {insight.change > 0 ? '+' : ''}
            {insight.change.toFixed(1)}% o'zgarish
          </p>
        </div>
      </div>

      {insight.recommendation && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 italic">
            💡 {insight.recommendation}
          </p>
        </div>
      )}
    </Card>
  );
}
