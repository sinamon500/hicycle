import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';

const GRADE_MAP = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' };

export const GRADE_COLOR = {
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
    if      (avgHI < 0.25) stableGrade = 'A';
    else if (avgHI < 0.50) stableGrade = 'B';
    else if (avgHI < 0.75) stableGrade = 'C';
    else                   stableGrade = 'D';
    return { ...row, stableGrade };
  });
}

// 20001행 → 차트용 다운샘플 (maxPoints 기준)
export function downsample(arr, maxPoints = 334) {
  if (arr.length <= maxPoints) return arr;
  const step = Math.ceil(arr.length / maxPoints);
  return arr.filter((_, i) => i % step === 0);
}

export function useHICycleData(csvPath = '/HI_CYCLE_e_2.csv') {
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
        if (errors.length && errors[0].type !== 'Delimiter') {
          setError(errors[0].message);
          setLoading(false);
          return;
        }
        const parsed = data.map(row => ({
          ...row,
          grade: GRADE_MAP[row.grade] ?? 'A',
          // HI_score: CSV에 이미 있음 (0~100), 없으면 HI로 계산
          HI_score: row.HI_score != null ? +row.HI_score : +(row.HI * 100).toFixed(2),
        }));
        setRaw(stabilizeGrade(parsed));
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

  // RUL 선형회귀 (HI 기반, HI=1.0 도달 시점)
  // 20001행이라 다운샘플 후 계산
  const rul = useMemo(() => {
    if (raw.length < 2) return null;
    const sampled = downsample(raw, 500);
    const n   = sampled.length;
    const xs  = sampled.map(r => r.time);
    const ys  = sampled.map(r => r.HI);
    const sumX  = xs.reduce((a, b) => a + b, 0);
    const sumY  = ys.reduce((a, b) => a + b, 0);
    const sumXY = xs.reduce((s, x, i) => s + x * ys[i], 0);
    const sumX2 = xs.reduce((s, x) => s + x * x, 0);
    const slope     = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const lastTime  = xs[xs.length - 1];
    // time 단위가 스텝(1스텝=1초 가정) → 시간 변환
    const timeToFailure = (1.0 - intercept) / slope;
    const remainingSteps = Math.max(0, timeToFailure - lastTime);
    const remainingSec   = remainingSteps; // 1스텝 = 1초
    return {
      remainingSeconds: Math.round(remainingSec),
      remainingHours:   +(remainingSec / 3600).toFixed(1),
      slope:     +slope.toFixed(6),
      intercept: +intercept.toFixed(4),
    };
  }, [raw]);

  // 센서별 시계열 — 차트용 다운샘플 적용
  const sensorSeries = useMemo(() => {
    const s = downsample(raw, 334);
    return {
      pressure:  s.map(r => ({ time: r.time, value: r.pressure })),
      iso6:      s.map(r => ({ time: r.time, value: r.iso6 })),
      drain:     s.map(r => ({ time: r.time, value: r.drain })),
      temp:      s.map(r => ({ time: r.time, value: r.temp })),
      vibration: s.map(r => ({ time: r.time, value: r.vibration })),
      HI:        s.map(r => ({ time: r.time, value: r.HI, grade: r.stableGrade })),
    };
  }, [raw]);

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
