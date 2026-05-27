import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';

const GRADE_MAP = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' };

const GRADE_COLOR = {
  A: '#00CC44',
  B: '#FFD600',
  C: '#FF8C00',
  D: '#FF3333',
};

// 최근 N행 평균으로 grade 안정화
function stabilizeGrade(rows, window = 10) {
  return rows.map((row, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = rows.slice(start, i + 1);
    const avgHI = slice.reduce((s, r) => s + r.HI, 0) / slice.length;
    let stableGrade;
    if (avgHI < 0.25) stableGrade = 'A';
    else if (avgHI < 0.50) stableGrade = 'B';
    else if (avgHI < 0.75) stableGrade = 'C';
    else stableGrade = 'D';
    return { ...row, stableGrade };
  });
}

export function useHICycleData(csvPath = '/simulation_f.csv') {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Papa.parse(csvPath, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: ({ data, errors }) => {
        if (errors.length) {
          setError(errors[0].message);
        } else {
          // grade 숫자 → 문자 변환 + 안정화
          const parsed = data.map(row => ({
            ...row,
            grade: GRADE_MAP[row.grade] ?? 'A',
          }));
          setRaw(stabilizeGrade(parsed));
        }
        setLoading(false);
      },
      error: (err) => {
        setError(err.message);
        setLoading(false);
      },
    });
  }, [csvPath]);

  // 현재 상태 (마지막 행)
  const current = useMemo(() => raw[raw.length - 1] ?? null, [raw]);

  // grade D 진입 첫 인덱스
  const gradeDStartIndex = useMemo(
    () => raw.findIndex(r => r.stableGrade === 'D'),
    [raw]
  );

  // RUL 선형회귀 예측 (HI 기반, HI=1.0 도달 시점 추정)
  const rul = useMemo(() => {
    if (raw.length < 2) return null;
    const n = raw.length;
    const xs = raw.map(r => r.time);
    const ys = raw.map(r => r.HI);
    const sumX = xs.reduce((a, b) => a + b, 0);
    const sumY = ys.reduce((a, b) => a + b, 0);
    const sumXY = xs.reduce((s, x, i) => s + x * ys[i], 0);
    const sumX2 = xs.reduce((s, x) => s + x * x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const lastTime = xs[xs.length - 1];
    const timeToFailure = (1.0 - intercept) / slope; // HI=1 도달 시점(초)
    const remainingSec = Math.max(0, timeToFailure - lastTime);
    return {
      remainingSeconds: Math.round(remainingSec),
      remainingHours: +(remainingSec / 3600).toFixed(1),
      slope: +slope.toFixed(6),
      intercept: +intercept.toFixed(4),
    };
  }, [raw]);

  // 센서별 시계열 데이터 (차트용)
  const sensorSeries = useMemo(() => ({
    pressure:   raw.map(r => ({ time: r.time, value: r.pressure })),
    iso6:       raw.map(r => ({ time: r.time, value: r.iso6 })),
    drain:      raw.map(r => ({ time: r.time, value: r.drain })),
    temp:       raw.map(r => ({ time: r.time, value: r.temp })),
    vibration:  raw.map(r => ({ time: r.time, value: r.vibration })),
    HI:         raw.map(r => ({ time: r.time, value: r.HI, grade: r.stableGrade })),
  }), [raw]);

  return {
    data: raw,
    current,
    loading,
    error,
    rul,
    sensorSeries,
    gradeDStartIndex,
    GRADE_COLOR,
  };
}
