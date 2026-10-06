const { CompositionStage, useComposition, Easing, animate, interpolate } = window;

const MOTION = {
  enter: Easing.easeOutCubic,
  travel: Easing.easeInOutCubic,
  fade: Easing.easeInOutSine,
};
const PINK = '#F8C8DC';
const FS = 190, FONT = 'Outfit';
const WORDS = ['pilates', 'princess'];
const K = 460 / 260;            // bow scale (px per unit)
const BOW = { x: 960, y: 300 };  // bow landing point
const START = { x: 260, y: 980 };
const BASE = [620, 783];

function useLetterX() {
  const refs = [React.useRef(null), React.useRef(null)];
  const [xs, setXs] = React.useState(null);
  React.useLayoutEffect(() => {
    let alive = true;
    const measure = () => {
      if (!alive || !refs[0].current) return;
      setXs(refs.map((r, w) => WORDS[w].split('').map((_, i) => r.current.getStartPositionOfChar(i).x)));
    };
    measure();
    (document.fonts?.ready || Promise.resolve()).then(measure);
    return () => { alive = false; };
  }, []);
  const probes = WORDS.map((w, i) => (
    <text key={i} ref={refs[i]} x="960" y="-500" textAnchor="middle" fontFamily={FONT} fontWeight="600" fontSize={FS} letterSpacing={-0.045 * FS} style={{ visibility: 'hidden' }}>{w}</text>
  ));
  return [xs, probes];
}

function Wing({ mirror }) {
  return (
    <g transform={`scale(${mirror ? -K : K},${K}) translate(-9,0) rotate(-45)`}>
      <text x="-11.7" y="91" fontFamily={FONT} fontWeight="700" fontSize="130" fill={PINK}>P</text>
    </g>
  );
}

function Piece() {
  const { T, CUES, authoredTotal } = useComposition();
  const [xs, probes] = useLetterX();
  const out = animate({ from: 1, to: 0, start: authoredTotal - 0.6, end: authoredTotal, ease: MOTION.fade })(T);

  // butterfly flight — erratic flapping path, glides, slow approach, landing, resting wing beats
  const t = T - CUES.Flutter;
  const tLand = CUES.Land - CUES.Flutter + 0.2;
  const kf = (x, pts) => { if (x <= pts[0][0]) return pts[0][1]; for (let i = 1; i < pts.length; i++) { if (x <= pts[i][0]) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; let u = (x - x0) / (x1 - x0); u = u * u * (3 - 2 * u); return y0 + (y1 - y0) * u; } } return pts[pts.length - 1][1]; };
  // wingbeat frequency (Hz) and amplitude over time: flap, glide, flap, slow approach, rest beats
  const freq = (x) => kf(x, [[0, 3.6], [0.85, 4.8], [1.0, 2.2], [1.3, 2.2], [1.45, 5.0], [2.0, 4.6], [tLand - 0.2, 2.4], [tLand + 0.2, 1.5], [tLand + 1.4, 1.2]]);
  const amp = (x) => kf(x, [[0, 1], [0.85, 1], [1.0, 0.18], [1.3, 0.18], [1.45, 1], [tLand - 0.15, 0.95], [tLand + 0.15, 0.55], [tLand + 0.9, 0.4], [tLand + 1.4, 0]]);
  let ph = 0; const dt = 1 / 240; for (let x = 0; x < Math.max(0, t); x += dt) ph += freq(x) * dt;
  const A = amp(Math.max(0, t));
  const c = ph - Math.floor(ph);
  // asymmetric stroke: fast powerful downstroke (40%), slower upstroke (60%)
  const open = c < 0.4 ? 1 - Math.pow(c / 0.4, 1.6) : Math.pow((c - 0.4) / 0.6, 0.8);
  const angle = (1 - open) * 82 * A;                       // wing elevation in degrees
  const flap = Math.max(0.12, Math.cos(angle * Math.PI / 180)); // projected wing width
  const lift = c < 0.4 ? Math.sin(Math.PI * c / 0.4) : 0;  // body rises on each downstroke
  // flight path (Catmull-Rom through waypoints), slowing into the landing
  const W = [[-160, 1180], [300, 820], [620, 900], [880, 640], [700, 470], [1010, 380], [1230, 250], [1090, 190], [BOW.x, BOW.y]];
  const pos = (u) => { const n = W.length - 1, f = Math.min(n - 1e-6, Math.max(0, u) * n), i = Math.floor(f), q = f - i;
    const p0 = W[Math.max(0, i - 1)], p1 = W[i], p2 = W[i + 1], p3 = W[Math.min(n, i + 2)];
    return [0, 1].map(k => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * q + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * q * q + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * q * q * q)); };
  const prog = (x) => { const v = Math.min(1, Math.max(0, x / tLand)); return 1 - Math.pow(1 - v, 2.2); };
  const [px, py] = pos(prog(t)); const [qx, qy] = pos(prog(t - 0.05));
  const airborne = 1 - kf(t, [[tLand - 0.25, 0], [tLand, 1]]);
  const X = px;
  const Y = py - lift * 14 * A * airborne + Math.sin(t * 2 * Math.PI * 1.3) * 18 * airborne;
  const tilt = Math.max(-24, Math.min(24, (px - qx) * 0.35)) * airborne + Math.sin(t * 2 * Math.PI * 0.9) * 6 * airborne;
  const size = kf(t, [[0, 0.42], [tLand, 1]]);
  const bowOp = animate({ from: 0, to: 1, start: CUES.Flutter, end: CUES.Flutter + 0.3, ease: MOTION.enter })(T);
  const wingY = 1 - (1 - flap) * 0.08; // slight foreshortening of height

  // the name writes itself underneath once the bow has landed
  let k = 0;
  const lines = xs && WORDS.map((w, li) => (
    <g key={li}>
      <clipPath id={'ln' + li}><rect x="0" y={BASE[li] - FS * 0.95} width="1920" height={FS * 1.25}></rect></clipPath>
      <g clipPath={`url(#ln${li})`}>
        {w.split('').map((c, i) => {
          const s0 = CUES.Write + (k++) * 0.065;
          const p = animate({ from: 0, to: 1, start: s0, end: s0 + 0.45, ease: MOTION.enter })(T);
          return (
            <text key={i} x={xs[li][i]} y={BASE[li]} transform={`translate(0,${(1 - p) * FS * 0.6})`} opacity={p}
              fontFamily={FONT} fontWeight="600" fontSize={FS} fill={PINK}>{c}</text>
          );
        })}
      </g>
    </g>
  ));

  const claim = animate({ from: 0, to: 1, start: CUES.Claim, end: CUES.Claim + 0.8, ease: MOTION.enter })(T);

  return (
    <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{ position: 'absolute', inset: 0, opacity: out }}>
      {probes}
      <g transform={`translate(${X},${Y}) rotate(${tilt}) scale(${size})`} opacity={bowOp}>
        <g transform={`scale(${flap},${wingY})`}><Wing mirror /></g>
        <g transform={`scale(${flap},${wingY})`}><Wing /></g>
      </g>
      {lines}
      <text x="960" y="880" textAnchor="middle" fontFamily="Geist Mono" fontSize="26" fill={PINK} opacity={claim}
        letterSpacing={(0.6 - 0.28 * claim) * 26}>SLOW &amp; STRONG</text>
    </svg>
  );
}

function LogoAnimApp() {
  return (
    <CompositionStage width={1920} height={1080} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#7A1E2C">
      <Piece />
    </CompositionStage>
  );
}

window.LogoAnimApp = LogoAnimApp;
