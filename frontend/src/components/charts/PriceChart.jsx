import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

const MIN_VISIBLE = 5;
const MAX_VISIBLE = 200;

function generateCandles(basePrice, count) {
  const data = [];
  let lastClose = basePrice;
  for (let i = 0; i < count; i++) {
    const open = lastClose;
    const change = (Math.random() - 0.48) * 0.012 * open;
    const close = open + change;
    const volatility = 0.003 * open;
    const high = Math.max(open, close) + Math.random() * volatility;
    const low = Math.min(open, close) - Math.random() * volatility;
    const date = new Date(Date.now() - (count - 1 - i) * 60 * 1000);
    data.push({
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      ts: date.getTime(),
      open: parseFloat(open.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low: parseFloat(low.toFixed(4)),
      close: parseFloat(close.toFixed(4)),
      volume: parseFloat((Math.random() * 80 + 10 + Math.abs(change) * 200).toFixed(1)),
    });
    lastClose = close;
  }
  return data;
}

function sliceData(data, start, end) {
  return data.slice(Math.max(0, start), Math.min(data.length, end));
}

function computeDomain(visibleData) {
  if (!visibleData || visibleData.length === 0) return [0, 100];
  let min = Infinity, max = -Infinity;
  for (const d of visibleData) {
    if (d.low < min) min = d.low;
    if (d.high > max) max = d.high;
  }
  const pad = (max - min) * 0.08 || min * 0.01;
  return [min - pad, max + pad];
}

export default function PriceChart({
  data: externalData,
  currentPrice,
  height = "100%",
  label = "Price",
}) {
  const allCandles = useMemo(() => {
    if (externalData && externalData.length > 0) {
      return externalData.map((d) => ({
        ...d,
        volume: d.volume ?? parseFloat((Math.random() * 80 + 10).toFixed(1)),
        isUp: d.close >= d.open,
      }));
    }
    return generateCandles(currentPrice || 1.4231, 200).map((d) => ({
      ...d,
      isUp: d.close >= d.open,
    }));
  }, [externalData, currentPrice]);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState(0);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const panOffsetAtDragStart = useRef(0);

  const totalCandles = allCandles.length;
  const visibleCount = Math.max(MIN_VISIBLE, Math.round(MAX_VISIBLE / zoomLevel));

  const visibleEnd = totalCandles - panOffset;
  const visibleStart = Math.max(0, visibleEnd - visibleCount);
  const visibleData = useMemo(
    () => sliceData(allCandles, visibleStart, visibleEnd).map((d) => ({ ...d, isUp: d.close >= d.open })),
    [allCandles, visibleStart, visibleEnd]
  );

  useEffect(() => {
    if (panOffset + visibleCount > totalCandles) {
      setPanOffset(Math.max(0, totalCandles - visibleCount));
    }
  }, [zoomLevel, totalCandles, visibleCount, panOffset]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.85 : 1.18;
    const newZoom = Math.max(1, Math.min(MAX_VISIBLE / MIN_VISIBLE, zoomLevel * delta));
    setZoomLevel(newZoom);
  }, [zoomLevel]);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest(".recharts-tooltip-wrapper")) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    panOffsetAtDragStart.current = panOffset;
    e.preventDefault();
  }, [panOffset]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartX.current;
    const chartWidth = containerRef.current?.clientWidth || 600;
    const candlesPerPx = visibleCount / chartWidth;
    const candleDelta = Math.round(dx * candlesPerPx);
    const newPan = Math.max(0, Math.min(totalCandles - visibleCount, panOffsetAtDragStart.current - candleDelta));
    setPanOffset(newPan);
  }, [visibleCount, totalCandles]);

  const handleMouseUp = useCallback(() => { isDragging.current = false; }, []);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseUp, handleMouseMove]);

  const priceDomain = computeDomain(visibleData);
  const volumeMax = Math.max(...visibleData.map((d) => d.volume || 0), 10);
  const volumeDomain = [0, volumeMax];

  const UP = "#22c55e";
  const DOWN = "#ef4444";
  const GRID = "#1e293b";
  const TEXT = "#94a3b8";

  return (
    <div
      ref={containerRef}
      style={{ height, width: "100%", position: "relative", cursor: isDragging.current ? "grabbing" : "grab", userSelect: "none" }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Zoom controls */}
      <div style={{ position: "absolute", top: 4, right: 8, zIndex: 20, display: "flex", gap: 3, alignItems: "center" }}>
        <button
          onClick={() => setZoomLevel((z) => Math.max(1, z / 1.3))}
          style={{
            background: "#1e293b", border: "1px solid #334155", color: "#f8fafc",
            borderRadius: 2, padding: "1px 7px", fontSize: 13, cursor: "pointer",
            fontFamily: "monospace", lineHeight: "20px",
          }}
          title="Zoom out"
        >−</button>
        <span style={{ fontSize: 10, color: TEXT, fontFamily: "monospace", minWidth: 26, textAlign: "center" }}>
          {visibleCount}
        </span>
        <button
          onClick={() => setZoomLevel((z) => Math.min(MAX_VISIBLE / MIN_VISIBLE, z * 1.3))}
          style={{
            background: "#1e293b", border: "1px solid #334155", color: "#f8fafc",
            borderRadius: 2, padding: "1px 7px", fontSize: 13, cursor: "pointer",
            fontFamily: "monospace", lineHeight: "20px",
          }}
          title="Zoom in"
        >+</button>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={visibleData} barCategoryGap={0} margin={{ top: 4, right: 6, bottom: 2, left: 2 }}>
          <defs>
            <linearGradient id="volUpBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={UP} stopOpacity={0.5} />
              <stop offset="100%" stopColor={UP} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="volDownBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={DOWN} stopOpacity={0.5} />
              <stop offset="100%" stopColor={DOWN} stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="time"
            stroke={TEXT}
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: GRID, strokeWidth: 1 }}
            dy={6}
            interval="preserveStartEnd"
            minTickGap={60}
          />

          <YAxis
            yAxisId="price"
            domain={priceDomain}
            stroke={TEXT}
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => val.toFixed(2)}
            dx={2}
            width={56}
            orientation="right"
          />

          <YAxis yAxisId="volume" orientation="right" domain={volumeDomain} stroke="transparent" fontSize={1} tickLine={false} axisLine={false} tickFormatter={() => ""} width={0} />

          <Tooltip content={<CandleTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />

          {currentPrice != null && (
            <ReferenceLine
              y={currentPrice} yAxisId="price"
              stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1}
              label={{
                value: currentPrice.toFixed(4),
                position: "insideTopRight",
                fill: "#f59e0b", fontSize: 10, fontWeight: "bold",
              }}
            />
          )}

          {/* Volume bars */}
          <Bar
            yAxisId="volume" dataKey="volume" isAnimationActive={false}
            shape={(props) => {
              const { x, y, width: bw, height: bh, payload } = props;
              if (!payload) return null;
              const barW = Math.max(1, bw * 0.85);
              const cx = x + bw / 2;
              return (
                <rect
                  x={cx - barW / 2} y={y} width={barW} height={bh}
                  fill={payload.close >= payload.open ? "url(#volUpBar)" : "url(#volDownBar)"}
                  rx={0}
                />
              );
            }}
          />

          {/* Candlestick wicks + bodies */}
          <Bar
            yAxisId="price" dataKey="high" isAnimationActive={false}
            shape={(props) => {
              const { x, width: bw, payload, yAxis } = props;
              if (!payload || !yAxis) return null;
              const candleW = Math.max(3, bw * 0.75);
              const cx = x + bw / 2;
              const highY = yAxis.scale(payload.high);
              const lowY = yAxis.scale(payload.low);
              const openY = yAxis.scale(payload.open);
              const closeY = yAxis.scale(payload.close);
              const bodyTop = Math.min(openY, closeY);
              const bodyBottom = Math.max(openY, closeY);
              const bodyH = Math.max(bodyBottom - bodyTop, 1.5);
              const isUp = payload.close >= payload.open;
              const color = isUp ? UP : DOWN;
              return (
                <g>
                  <line x1={cx} y1={highY} x2={cx} y2={lowY} stroke={color} strokeWidth={1.2} />
                  <rect
                    x={cx - candleW / 2} y={bodyTop}
                    width={candleW} height={bodyH}
                    fill={color} fillOpacity={isUp ? 0.9 : 0.9}
                    rx={0.5}
                  />
                </g>
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div style={{
        position: "absolute", bottom: 3, left: 6, zIndex: 20,
        fontSize: 9, color: "#475569", fontFamily: "monospace",
        pointerEvents: "none", userSelect: "none",
      }}>
        scroll zoom · drag pan
      </div>
    </div>
  );
}

function CandleTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const isUp = d.close >= d.open;
  const UP = "#22c55e";
  const DOWN = "#ef4444";
  return (
    <div style={{
      background: "#0f172a", border: "1px solid #1e293b", borderRadius: 4,
      padding: "8px 12px", fontFamily: "SF Mono, Monaco, monospace",
      fontSize: 11, color: "#e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      minWidth: 120,
    }}>
      <div style={{ color: "#64748b", fontSize: 10, marginBottom: 6 }}>{d.time}</div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {[
            ["O", d.open, isUp ? UP : DOWN],
            ["H", d.high, UP],
            ["L", d.low, DOWN],
            ["C", d.close, isUp ? UP : DOWN],
          ].map(([l, v, c]) => (
            <tr key={l}>
              <td style={{ color: "#64748b", paddingRight: 12, fontWeight: 500 }}>{l}</td>
              <td style={{ textAlign: "right", color: c, fontWeight: 600 }}>{v}</td>
            </tr>
          ))}
          <tr>
            <td style={{ color: "#64748b", paddingRight: 12, paddingTop: 4, fontWeight: 500 }}>Vol</td>
            <td style={{ textAlign: "right", color: "#94a3b8", paddingTop: 4 }}>{d.volume?.toFixed(1)}K</td>
          </tr>
          <tr>
            <td style={{ color: "#64748b", paddingRight: 12, fontWeight: 500 }}>Chg</td>
            <td style={{ textAlign: "right", color: isUp ? UP : DOWN, fontWeight: 600 }}>
              {((d.close - d.open) / d.open * 100).toFixed(2)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}