# ReGEN — 건설기계 바이백 + 디지털 트윈 (React)

흑/백/그린(#00E600) 시스템 기반 모바일 UI. Pretendard 타이포, React 18 + React Router 6, 라이트/다크 모드 전역 지원.

## 빠른 시작

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production 빌드 → dist/
```

## 폴더 구조

```
react-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # 엔트리 — ThemeProvider + BrowserRouter
    ├── App.jsx               # 라우트 + 폰 셸
    ├── styles.css            # CSS 변수 (라이트/다크 토큰) + 클래스
    ├── theme.jsx             # ThemeProvider / useTheme + HF 토큰 export
    ├── components.jsx        # UI 프리미티브 모음 (Gauge, Chart, TabBar, Pill, …)
    └── screens/
        ├── Splash.jsx
        ├── Onboard.jsx
        ├── Login.jsx
        ├── Dashboard.jsx     # 홈 (메인)
        ├── SensorDetail.jsx
        ├── RUL.jsx
        ├── DigitalTwin.jsx
        ├── Recovery.jsx
        ├── Credit.jsx
        └── Profile.jsx
```

## 라우트 매핑

| 경로 | 화면 |
|---|---|
| `/` → `/splash` | 자동 진입 (1.6s 후 onboard) |
| `/onboard` | 온보딩 |
| `/login` | 로그인 |
| `/dashboard` | 홈 대시보드 |
| `/sensor` | 센서 상세 |
| `/rul` | RUL 차트 |
| `/twin` | 디지털 트윈 |
| `/recovery` | 회수 현황 |
| `/credit` | 바이백 크레딧 |
| `/profile` | 내 정보 (다크모드 토글 포함) |

## 테마 사용

```jsx
import { useTheme } from './theme.jsx';

function MyComponent() {
  const { theme, toggle, setTheme } = useTheme();
  // theme: 'dark' | 'light'
  // localStorage에 자동 저장
}
```

테마는 `<html data-theme="dark|light">` 속성으로 적용되며, CSS 변수가 자동 전환됩니다.

## 디자인 토큰

`src/theme.jsx`의 `HF` 객체로 모든 색을 일관성 있게 참조하세요:

```jsx
import { HF } from './theme.jsx';

<div style={{ color: HF.text, background: HF.glass, borderColor: HF.greenBd }}>
  …
</div>
```

테마-동적 값은 CSS 변수로 자동 변환되어 라이트/다크 전환 시 함께 바뀝니다.

## 기존 프로젝트에 이식

`src/` 폴더 안의 파일을 기존 React 프로젝트에 복사하고:
1. `react-router-dom@^6` 의존성 추가
2. `main.jsx`의 `ThemeProvider` + `BrowserRouter` 래핑을 본인 진입점에 적용
3. `styles.css` 임포트 + Pretendard / JetBrains Mono `<link>`를 `index.html`에 추가

## 변경하지 말아야 할 디자인 원칙

- 메인 액센트는 `#00E600` 단일 그린
- 등급: A=그린 / B=화이트 / C=앰버 / D=레드
- 배경은 순수 블랙 (다크) 또는 소프트 화이트 (라이트)
- 모든 텍스트는 Pretendard, 수치는 JetBrains Mono
