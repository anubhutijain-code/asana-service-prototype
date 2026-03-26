// ─── StatCard — borderless + sparkline ────────────────────────────────────────

import { useState } from 'react';
import { AreaChart, Area, YAxis, ResponsiveContainer } from 'recharts';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// ── StatCard ───────────────────────────────────────────────────────────────────

export default function StatCard({ label, value, trend, trendGood, spark = [] }) {
  const [hov, setHov] = useState(false);
  const strokeColor = 'var(--selected-background-strong)';
  const fillColor   = 'var(--selected-background-strong)';
  const trendColor  = trendGood ? 'var(--success-text)' : 'var(--danger-text)';
  const trendPrefix = trendGood ? '↑' : '↓';

  const data = spark.map((v, i) => ({ i, v }));
  const minV = Math.min(...spark);
  const maxV = Math.max(...spark);
  const domain = [minV - (maxV - minV) * 0.2, maxV + (maxV - minV) * 0.2];

  return (
    <div
      className="flex-1 min-w-0"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--background-weak)',
        borderRadius: 10,
        padding: '18px 20px 0',
        border: '1px solid var(--border)',
        boxShadow: hov ? 'var(--elevation-md)' : 'var(--elevation-sm)',
        transition: 'box-shadow 0.15s',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 140,
        overflow: 'hidden',
      }}
    >
      {/* Label */}
      <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: '0 0 8px', lineHeight: '16px' }}>
        {label}
      </p>

      {/* Value */}
      <p style={{
        fontFamily: '"SF Pro Display"', fontSize: 38, fontWeight: 500,
        color: 'var(--text)', lineHeight: 1, letterSpacing: '0.38px',
        margin: '0 0 6px',
        fontFeatureSettings: "'liga' off, 'clig' off",
      }}>
        {value}
      </p>

      {/* Trend text */}
      <p style={{ fontSize: 12, color: trendColor, fontFamily: SFT, margin: '0 0 10px', lineHeight: '18px' }}>
        {trendPrefix} {trend}
      </p>

      {/* Sparkline — flush to card edges, no padding */}
      {data.length > 1 && (
        <div style={{ marginLeft: -20, marginRight: -20, marginTop: 'auto', lineHeight: 0, height: 44 }}>
          <ResponsiveContainer width="100%" height={44}>
            <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
              <YAxis domain={domain} hide />
              <Area
                type="monotone"
                dataKey="v"
                stroke={strokeColor}
                fill={fillColor}
                fillOpacity={0.12}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
