const { CompositionStage, useComposition, Easing, clamp } = window;

const C = {
  bg: 'oklch(96.8% 0.007 247.896)', paper: 'oklch(98.4% 0.003 247.858)', white: '#FFFFFF', ink: 'oklch(20.8% 0.042 265.755)', ink2: 'oklch(44.6% 0.043 257.281)', ink3: 'oklch(55.4% 0.046 257.417)',
  line: 'oklch(92.9% 0.013 255.508)', slot: 'oklch(95.4% 0.01 250)',
  brand: 'oklch(50% 0.134 242.749)', brandSub: 'oklch(97.7% 0.013 236.62)', brandMid: 'oklch(88.2% 0.059 254.128)',
  okBg: 'oklch(95.1% 0.026 236.824)', okInk: 'oklch(50% 0.134 242.749)',
  warnBg: 'oklch(98.7% 0.022 95.277)', warnInk: 'oklch(47.3% 0.137 46.201)',
  star: 'oklch(76.9% 0.188 70.08)', starOff: 'oklch(86.9% 0.022 252.894)',
};
const SANS = "'Geist', system-ui, sans-serif";
const MONO = "'Geist Mono', ui-monospace, monospace";

const MOTION = {
  enter: (T, s, d = 0.5) => Easing.easeOutCubic(clamp((T - s) / d, 0, 1)),
  draw: (T, s, d = 1) => Easing.easeInOutCubic(clamp((T - s) / d, 0, 1)),
  pop: (T, s, d = 0.45) => Easing.easeOutBack(clamp((T - s) / d, 0, 1)),
};
const lerp = (a, b, p) => a + (b - a) * p;
const rise = (p, d = 14) => ({ opacity: clamp(p, 0, 1), transform: `translateY(${(1 - p) * d}px)` });
const typed = (s, p) => s.slice(0, Math.round(s.length * clamp(p, 0, 1)));

function Grow({ p, children, gap = 10 }) {
  return (
    <div style={{ maxHeight: clamp(p, 0, 1) * 360, overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ ...rise(p), paddingTop: gap }}>{children}</div>
    </div>
  );
}

function Bubble({ me, children, width }) {
  return (
    <div style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
      <div style={{
        maxWidth: '84%', width, padding: '11px 14px', borderRadius: 18,
        borderBottomRightRadius: me ? 6 : 18, borderBottomLeftRadius: me ? 18 : 6,
        background: me ? C.ink : C.white, color: me ? C.white : C.ink,
        border: me ? 'none' : `1px solid ${C.line}`, font: `400 16px/1.4 ${SANS}`, textWrap: 'pretty',
      }}>{children}</div>
    </div>
  );
}

function Typing({ T }) {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex', gap: 5, padding: '14px 16px', borderRadius: 18, borderBottomLeftRadius: 6, background: C.white, border: `1px solid ${C.line}` }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: 4, background: C.ink3, opacity: 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(T * 9 - i * 1.1)) }} />
        ))}
      </div>
    </div>
  );
}

function Stars({ n = 5, size = 18, fill = [], gap = 3 }) {
  return (
    <div style={{ display: 'flex', gap }}>
      {Array.from({ length: n }).map((_, i) => {
        const f = fill[i] == null ? 1 : fill[i];
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 20 20" style={{ transform: `scale(${0.85 + 0.15 * f})` }}>
            <path d="M10 1.6l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.5l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z" fill={f > 0.5 ? C.star : C.starOff} />
          </svg>
        );
      })}
    </div>
  );
}

function Ripple({ T, at, x, y }) {
  const p = MOTION.enter(T, at, 0.6);
  if (T < at || p >= 1) return null;
  return <div style={{ position: 'absolute', left: x - 28, top: y - 28, width: 56, height: 56, borderRadius: 28, background: C.ink, opacity: 0.22 * (1 - p), transform: `scale(${0.3 + p})`, pointerEvents: 'none' }} />;
}

function Phone({ children, input = '', placeholder = 'Escriba un mensaje' }) {
  return (
    <div style={{ position: 'absolute', left: 260, top: 80, width: 380, height: 780, borderRadius: 56, background: C.ink, padding: 10, boxShadow: '0 30px 60px -20px rgba(15,23,42,0.35)' }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 46, background: C.paper, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', font: `500 14px ${MONO}`, color: C.ink }}>
          <span>9:41</span><span style={{ width: 90, height: 24, borderRadius: 12, background: C.ink }}></span><span>5G</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px 14px', borderBottom: `1px solid ${C.line}` }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: C.brand, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `600 17px ${SANS}` }}>C</div>
          <div style={{ flex: 1 }}>
            <div style={{ font: `600 16px ${SANS}`, color: C.ink }}>Clínica Dental</div>
            <div style={{ font: `400 13px ${SANS}`, color: C.ink3 }}>Responde al momento</div>
          </div>
          <div style={{ font: `500 11px ${MONO}`, letterSpacing: '0.06em', color: C.brand, background: C.brandSub, border: `1px solid ${C.brandMid}`, borderRadius: 999, padding: '4px 8px' }}>IA</div>
        </div>
        <div style={{ textAlign: 'center', font: `400 12.5px/1.4 ${SANS}`, color: C.ink2, background: C.slot, padding: '7px 18px', borderBottom: `1px solid ${C.line}` }}>
          Le atiende un asistente virtual con IA. Puede pedir hablar con una persona en cualquier momento.
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 14px 12px', overflow: 'hidden' }}>
          {children}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px 22px' }}>
          <div style={{ flex: 1, minHeight: 44, borderRadius: 22, background: C.white, border: `1px solid ${C.line}`, padding: '11px 16px', font: `400 15px/1.35 ${SANS}`, color: input ? C.ink : C.ink3 }}>{input || placeholder}</div>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 20 20"><path d="M3 10h12M10 4l6 6-6 6" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Camera({ s, cx, cy, children }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1600, height: 1000, transformOrigin: '0 0', transform: `translate(${800 - cx * s}px, ${500 - cy * s}px) scale(${s})` }}>
      {children}
    </div>
  );
}

function Caption({ T, items }) {
  const it = items.find(i => T >= i.at && T < i.until);
  if (!it) return null;
  const p = MOTION.enter(T, it.at, 0.45) * (1 - MOTION.enter(T, it.until - 0.35, 0.35));
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center', ...rise(p, 10) }}>
      <div style={{ font: `500 24px ${SANS}`, color: C.ink, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 999, padding: '10px 24px', whiteSpace: 'nowrap', boxShadow: '0 8px 24px -12px rgba(15,23,42,0.25)' }}>{it.text}</div>
    </div>
  );
}

function TitleCard({ op, kicker, title, sub }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, opacity: op, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 140px', gap: 22, pointerEvents: 'none' }}>
      <div style={{ font: `500 22px ${MONO}`, letterSpacing: '0.08em', color: C.ink3 }}>{kicker}</div>
      <div style={{ font: `400 112px/1.02 ${SANS}`, letterSpacing: '-0.035em', color: C.ink, transform: `translateY(${(1 - op) * 12}px)` }}>{title}</div>
      <div style={{ font: `400 30px/1.4 ${SANS}`, color: C.ink2, maxWidth: 900 }}>{sub}</div>
      <div style={{ marginTop: 26, paddingTop: 22, borderTop: `1px solid ${C.line}`, display: 'flex', gap: 40, font: `500 20px ${MONO}`, letterSpacing: '0.06em', color: C.ink2 }}>
        <span>CONFORME AL REGLAMENTO EUROPEO DE IA</span><span>RGPD</span><span>DATOS ALOJADOS EN LA UE</span>
      </div>
    </div>
  );
}

const Panel = ({ left, top, width, height, children }) => (
  <div style={{ position: 'absolute', left, top, width, height, background: C.white, borderRadius: 20, border: `1px solid ${C.line}`, boxShadow: '0 20px 50px -28px rgba(15,23,42,0.3)', overflow: 'hidden' }}>{children}</div>
);

/* ---------------- VIDEO 1 · RESERVA ---------------- */
const DAYS = ['LUN 13', 'MAR 14', 'MIÉ 15', 'JUE 16', 'VIE 17'];
const APPTS = [[0, 9, 1, 'Revisión', 'R. Gil'], [0, 11, 0.75, 'Empaste', 'M. Sanz'], [1, 9.5, 1, 'Ortodoncia', 'J. Vidal'], [1, 12, 0.75, 'Revisión', 'A. Ruiz'], [2, 10, 1.5, 'Implante', 'C. Mora'], [3, 9, 1, 'Revisión', 'P. Díaz'], [3, 12, 0.75, 'Blanqueamiento', 'E. Gómez'], [4, 9.5, 0.75, 'Limpieza', 'L. Martín'], [4, 11, 1, 'Endodoncia', 'S. Prieto']];

function Agenda({ T, drop, toast }) {
  const HH = 104, X0 = 64, DW = 108, Y0 = 0;
  const p = MOTION.pop(T, drop, 0.55), pt = MOTION.enter(T, toast, 0.5);
  return (
    <Panel left={790} top={150} width={640} height={700}>
      <div style={{ padding: '24px 28px 18px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: `1px solid ${C.line}` }}>
        <div>
          <div style={{ font: `500 13px ${MONO}`, letterSpacing: '0.08em', color: C.ink3 }}>AGENDA · DRA. PÉREZ</div>
          <div style={{ font: `500 28px ${SANS}`, letterSpacing: '-0.02em', color: C.ink, marginTop: 4 }}>Semana del 13 de octubre</div>
        </div>
        <div style={{ font: `500 13px ${MONO}`, color: C.ink2 }}>9 + {T >= drop ? 1 : 0} CITAS</div>
      </div>
      <div style={{ display: 'flex', paddingLeft: X0, borderBottom: `1px solid ${C.line}` }}>
        {DAYS.map((d, i) => <div key={d} style={{ width: DW, padding: '10px 8px', font: `500 12px ${MONO}`, letterSpacing: '0.05em', color: i === 3 && T >= drop ? C.brand : C.ink3 }}>{d}</div>)}
      </div>
      <div style={{ position: 'relative', height: 520 }}>
        {[9, 10, 11, 12, 13].map((h, i) => (
          <div key={h} style={{ position: 'absolute', left: 0, right: 0, top: Y0 + i * HH, borderTop: i ? `1px dashed ${C.line}` : 'none', font: `400 12px ${MONO}`, color: C.ink3, paddingLeft: 16, paddingTop: 6 }}>{h}:00</div>
        ))}
        {APPTS.map(([d, h, dur, what, who], i) => (
          <div key={i} style={{ position: 'absolute', left: X0 + d * DW + 4, top: (h - 9) * HH + 4, width: DW - 8, height: dur * HH - 8, background: C.slot, borderRadius: 10, padding: '8px 10px', overflow: 'hidden' }}>
            <div style={{ font: `500 13px/1.25 ${SANS}`, color: C.ink }}>{what}</div>
            <div style={{ font: `400 12px ${SANS}`, color: C.ink2 }}>{who}</div>
          </div>
        ))}
        {T >= drop && (
          <div style={{ position: 'absolute', left: X0 + 3 * DW + 4, top: 1.5 * HH + 4, width: DW - 8, height: 0.75 * HH - 8, background: C.brand, borderRadius: 10, padding: '8px 10px', opacity: clamp(p * 2, 0, 1), transform: `translateY(${(1 - p) * -40}px) scale(${0.9 + 0.1 * p})`, boxShadow: `0 0 0 ${4 + 4 * Math.max(0, Math.sin((T - drop) * 4)) * (1 - MOTION.enter(T, drop + 2, 1))}px ${C.brandMid}` }}>
            <div style={{ font: `600 13px/1.25 ${SANS}`, color: C.white }}>Limpieza</div>
            <div style={{ font: `400 12px ${SANS}`, color: C.white }}>Lucía M.</div>
          </div>
        )}
      </div>
      {T >= toast && (
        <div style={{ position: 'absolute', left: 28, right: 28, bottom: 20, ...rise(pt, 16), display: 'flex', alignItems: 'center', gap: 12, background: C.ink, color: C.white, borderRadius: 14, padding: '14px 18px', font: `400 15px ${SANS}` }}>
          <div style={{ width: 24, height: 24, borderRadius: 12, background: C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 20 20"><path d="M4 10.5l4 4 8-9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <span style={{ flex: 1 }}>Nueva cita creada desde el chat · jueves 16, 10:30</span>
          <span style={{ font: `500 12px ${MONO}`, color: C.brandMid }}>SIN LLAMADAS</span>
        </div>
      )}
    </Panel>
  );
}

function ReservaPiece() {
  const { T, CUES: c, authoredTotal } = useComposition();
  const end = authoredTotal || (c.Cierre + 3);
  const cam = MOTION.draw(T, c.Confirmada + 0.6, 1.2);
  const s = lerp(1.12, 1, cam), cx = lerp(450, 845, cam), cy = lerp(470, 500, cam);

  const m1 = 'Hola, ¿tienen hueco para una limpieza esta semana?';
  const t1 = c.Mensaje + 0.3, send1 = c.Mensaje + 2.1;
  const tap = c.Opciones + 2.0;
  const input = T >= t1 && T < send1 ? typed(m1, (T - t1) / 1.6) : '';
  const slots = ['Mar 14 · 17:00', 'Jue 16 · 10:30', 'Vie 17 · 12:00'];
  const typing1 = MOTION.enter(T, send1 + 0.3, 0.3) * (1 - MOTION.enter(T, c.Opciones + 0.05, 0.25));
  const typing2 = MOTION.enter(T, tap + 0.8, 0.3) * (1 - MOTION.enter(T, c.Confirmada - 0.05, 0.25));
  const titleOp = 1 - MOTION.enter(T, 1.3, 0.6) + MOTION.enter(T, end - 1.1, 0.7);

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, fontFamily: SANS }}>
      <Camera s={s} cx={cx} cy={cy}>
        <Agenda T={T} drop={c.Confirmada + 1.5} toast={c.Confirmada + 2.0} />
        <Phone input={input}>
          {T >= send1 && <Grow p={MOTION.enter(T, send1, 0.45)}><Bubble me>{m1}</Bubble></Grow>}
          {typing1 > 0 && <Grow p={typing1}><Typing T={T} /></Grow>}
          {T >= c.Opciones && (
            <Grow p={MOTION.enter(T, c.Opciones + 0.1, 0.5)}>
              <Bubble>
                Claro. Tengo estos huecos con la Dra. Pérez:
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10, position: 'relative' }}>
                  {slots.map((sl, i) => {
                    const pp = MOTION.pop(T, c.Opciones + 0.6 + i * 0.15, 0.4), on = i === 1 && T >= tap + 0.1;
                    return (
                      <div key={sl} style={{ opacity: clamp(pp, 0, 1), transform: `scale(${0.92 + 0.08 * pp})`, transformOrigin: 'left center', minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', borderRadius: 12, border: `1.5px solid ${on ? C.brand : C.line}`, background: on ? C.brand : C.paper, color: on ? C.white : C.ink, font: `500 15px ${SANS}` }}>
                        <span>{sl}</span><span style={{ font: `400 12px ${MONO}`, color: on ? C.white : C.ink3 }}>45 MIN</span>
                      </div>
                    );
                  })}
                  <Ripple T={T} at={tap} x={120} y={74} />
                </div>
              </Bubble>
            </Grow>
          )}
          {T >= tap + 0.5 && <Grow p={MOTION.enter(T, tap + 0.5, 0.45)}><Bubble me>El jueves a las 10:30, por favor.</Bubble></Grow>}
          {typing2 > 0 && <Grow p={typing2}><Typing T={T} /></Grow>}
          {T >= c.Confirmada && (
            <Grow p={MOTION.enter(T, c.Confirmada, 0.5)}>
              <Bubble>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: `600 16px ${SANS}` }}>
                  <span style={{ width: 22, height: 22, borderRadius: 11, background: C.okBg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="13" height="13" viewBox="0 0 20 20"><path d="M4 10.5l4 4 8-9" stroke={C.okInk} strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  Cita confirmada
                </div>
                <div style={{ marginTop: 8, padding: '10px 12px', background: C.paper, borderRadius: 10, border: `1px solid ${C.line}`, font: `400 14px/1.5 ${SANS}`, color: C.ink2 }}>
                  Limpieza dental · Dra. Pérez<br /><span style={{ color: C.ink, fontWeight: 500 }}>Jueves 16 de octubre, 10:30</span>
                </div>
                <div style={{ marginTop: 8, font: `400 14px ${SANS}`, color: C.ink2 }}>Le enviaré un recordatorio el día antes.</div>
              </Bubble>
            </Grow>
          )}
        </Phone>
      </Camera>
      <Caption T={T} items={[
        { at: c.Mensaje + 0.2, until: c.Opciones, text: 'El paciente escribe cuando le viene bien' },
        { at: c.Opciones + 0.2, until: c.Confirmada, text: 'El asistente ofrece huecos reales de la agenda' },
        { at: c.Confirmada + 1.6, until: end - 1.2, text: 'La cita entra sola en la agenda de la clínica' },
      ]} />
      <TitleCard op={clamp(titleOp, 0, 1)} kicker="CLÍNICA DENTAL · 01 / GESTIÓN DE CITAS" title="Reserva por chat" sub="Un asistente con IA atiende al paciente, consulta la agenda y cierra la cita sin una sola llamada." />
    </div>
  );
}

/* ---------------- VIDEO 2 · RESEÑA ---------------- */
const REVIEWS = [
  ['Me atendieron enseguida y sin esperas. Muy recomendable.', 'Marta S.', 'hace 2 días · Doctoralia'],
  ['Trato excelente, la Dra. Pérez explica todo con calma.', 'Jorge V.', 'hace 5 días · Google'],
  ['Clínica limpia y puntual. Volveré para la revisión.', 'Ana R.', 'hace 1 semana · Top Doctors'],
];

function ReviewRow({ text, who, when, fresh }) {
  return (
    <div style={{ padding: '16px 28px', borderTop: `1px solid ${C.line}`, background: fresh ? C.brandSub : 'transparent' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Stars size={16} gap={2} />
        {fresh && <span style={{ font: `500 11px ${MONO}`, letterSpacing: '0.06em', color: C.brand, border: `1px solid ${C.brandMid}`, background: C.white, borderRadius: 999, padding: '2px 8px' }}>NUEVA</span>}
      </div>
      <div style={{ font: `400 17px/1.4 ${SANS}`, color: C.ink, marginTop: 6 }}>{text}</div>
      <div style={{ font: `400 13px ${SANS}`, color: C.ink3, marginTop: 4 }}>{who} · {when}</div>
    </div>
  );
}

function ResenaPiece() {
  const { T, CUES: c, authoredTotal } = useComposition();
  const end = authoredTotal || (c.Cierre + 2.5);
  const toPhone = MOTION.draw(T, c.Mensaje - 0.1, 1.0), out = MOTION.draw(T, c.Publicada + 0.3, 1.1);
  let s = lerp(1.45, 1.1, toPhone), cx = lerp(1110, 450, toPhone), cy = lerp(225, 470, toPhone);
  s = lerp(s, 1, out); cx = lerp(cx, 845, out); cy = lerp(cy, 500, out);

  const done = c.Visita + 0.9, sched = c.Visita + 1.5;
  const ask = c.Mensaje + 1.0;
  const starAt = i => c.Valoracion + 0.2 + i * 0.14;
  const tapStar = c.Valoracion + 0.1, tapBtn = c.Valoracion + 2.5;
  const m2 = 'Muy amables y puntuales. Me explicaron todo.';
  const t2 = c.Valoracion + 2.8, send2 = c.Publicada;
  const input = T >= t2 && T < send2 ? typed(m2, (T - t2) / 1.0) : '';
  const typing = MOTION.enter(T, c.Valoracion + 1.0, 0.3) * (1 - MOTION.enter(T, c.Valoracion + 1.55, 0.25));
  const drop = c.Publicada + 1.4, upd = MOTION.draw(T, drop + 0.3, 0.8);
  const titleOp = 1 - MOTION.enter(T, 1.3, 0.6) + MOTION.enter(T, end - 1.1, 0.7);
  const statusOk = T >= done;

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, fontFamily: SANS }}>
      <Camera s={s} cx={cx} cy={cy}>
        <Panel left={790} top={150} width={640} height={150}>
          <div style={{ padding: '22px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ font: `500 22px ${MONO}`, color: C.ink, width: 70 }}>10:30</div>
            <div style={{ flex: 1 }}>
              <div style={{ font: `500 20px ${SANS}`, color: C.ink }}>Lucía M. · Limpieza dental</div>
              <div style={{ font: `400 15px ${SANS}`, color: C.ink3, marginTop: 2 }}>Dra. Pérez · Gabinete 2</div>
            </div>
            <div style={{ font: `500 14px ${SANS}`, borderRadius: 999, padding: '7px 14px', background: statusOk ? C.okBg : C.warnBg, color: statusOk ? C.okInk : C.warnInk, transform: `scale(${statusOk ? 0.94 + 0.06 * MOTION.pop(T, done, 0.4) : 1})` }}>{statusOk ? 'Atendida' : 'En consulta'}</div>
          </div>
          <div style={{ margin: '0 28px', paddingTop: 12, borderTop: `1px dashed ${C.line}`, font: `500 13px ${MONO}`, letterSpacing: '0.04em', color: C.brand, ...rise(MOTION.enter(T, sched, 0.5), 8) }}>
            → PETICIÓN DE VALORACIÓN PROGRAMADA · 12:40
          </div>
        </Panel>
        <Panel left={790} top={320} width={640} height={540}>
          <div style={{ padding: '20px 28px 18px', display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 12 }}>
            {[['Google', null, null], ['Doctoralia', '4,8', '96'], ['Top Doctors', '4,9', '41']].map(([name, r, n], i) => (
              <div key={name} style={{ border: `1px solid ${i === 0 && T >= drop ? C.brand : C.line}`, background: i === 0 && T >= drop ? C.brandSub : C.paper, borderRadius: 14, padding: '12px 14px' }}>
                <div style={{ font: `500 12px ${MONO}`, letterSpacing: '0.06em', color: C.ink3 }}>{name.toUpperCase()}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                  {i === 0 ? (
                    <div style={{ font: `400 40px/1 ${SANS}`, letterSpacing: '-0.03em', color: C.ink, height: 40, overflow: 'hidden' }}>
                      <div style={{ transform: `translateY(${-40 * upd}px)` }}><div>4,6</div><div>4,7</div></div>
                    </div>
                  ) : <div style={{ font: `400 40px/1 ${SANS}`, letterSpacing: '-0.03em', color: C.ink }}>{r}</div>}
                  <Stars n={1} size={18} />
                </div>
                <div style={{ font: `400 13px ${SANS}`, color: C.ink2, marginTop: 4 }}>{i === 0 ? Math.round(lerp(212, 213, upd)) : n} reseñas</div>
              </div>
            ))}
          </div>
          {T >= drop && <Grow p={MOTION.enter(T, drop, 0.6)} gap={0}><ReviewRow text={m2} who="Lucía M." when="ahora · Google" fresh /></Grow>}
          {REVIEWS.map(r => <ReviewRow key={r[1]} text={r[0]} who={r[1]} when={r[2]} />)}
        </Panel>
        <Phone input={input}>
          <div style={{ alignSelf: 'center', font: `500 11px ${MONO}`, color: C.ink3, letterSpacing: '0.06em', paddingTop: 6 }}>HOY · 12:40</div>
          {T >= ask && (
            <Grow p={MOTION.enter(T, ask, 0.5)}>
              <Bubble>
                Hola, Lucía. Gracias por venir hoy. ¿Cómo valoraría su visita con la Dra. Pérez?
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', padding: '8px 0', background: C.paper, borderRadius: 12, border: `1px solid ${C.line}`, position: 'relative' }}>
                  <Stars size={34} gap={8} fill={[0, 1, 2, 3, 4].map(i => (T >= starAt(i) ? MOTION.pop(T, starAt(i), 0.35) : 0))} />
                  <Ripple T={T} at={tapStar + 0.5} x={232} y={25} />
                </div>
              </Bubble>
            </Grow>
          )}
          {typing > 0 && <Grow p={typing}><Typing T={T} /></Grow>}
          {T >= c.Valoracion + 1.6 && (
            <Grow p={MOTION.enter(T, c.Valoracion + 1.6, 0.5)}>
              <Bubble>
                ¡Muchas gracias! ¿Le importaría contarlo? Elija dónde y le dejo el enlace listo:
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {['Google', 'Doctoralia', 'Top Doctors'].map((p, i) => (
                    <div key={p} style={{ position: 'relative', minHeight: 44, borderRadius: 12, background: i === 0 ? (T >= tapBtn + 0.1 ? C.ink : C.brand) : C.paper, border: i === 0 ? 'none' : `1px solid ${C.line}`, color: i === 0 ? C.white : C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `500 15px ${SANS}` }}>
                      Reseñar en {p}
                      {i === 0 && <Ripple T={T} at={tapBtn} x={120} y={22} />}
                    </div>
                  ))}
                </div>
              </Bubble>
            </Grow>
          )}
          {T >= send2 && <Grow p={MOTION.enter(T, send2, 0.45)}><Bubble me>{m2}</Bubble></Grow>}
        </Phone>
      </Camera>
      <Caption T={T} items={[
        { at: c.Visita + 0.2, until: c.Mensaje, text: 'Termina la visita y el asistente lo sabe' },
        { at: c.Mensaje + 0.5, until: c.Valoracion, text: 'Pide la valoración en el momento justo' },
        { at: c.Valoracion + 0.2, until: c.Publicada, text: 'Si la experiencia fue buena, invita a publicarla' },
        { at: c.Publicada + 1.3, until: end - 1.2, text: 'Más reseñas en Google y en los portales médicos' },
      ]} />
      <TitleCard op={clamp(titleOp, 0, 1)} kicker="CLÍNICA DENTAL · 02 / RECOGIDA DE RESEÑAS" title="Reseña tras la visita" sub="Al salir de consulta, el asistente pide la opinión al paciente y le lleva a publicarla en Google o en su portal médico." />
    </div>
  );
}

/* ---------------- VIDEO 3 · CAMBIAR O CANCELAR ---------------- */
function AgendaCambio({ T, move, free, wait, fill, toast }) {
  const HH = 104, X0 = 64, DW = 108;
  const mv = MOTION.draw(T, move, 0.9), pf = MOTION.pop(T, fill, 0.5), pt = MOTION.enter(T, toast, 0.5);
  const bx = lerp(X0 + 3 * DW + 4, X0 + 4 * DW + 4, mv), by = lerp(1.5 * HH + 4, 3 * HH + 4, mv);
  return (
    <Panel left={790} top={150} width={640} height={700}>
      <div style={{ padding: '24px 28px 18px', borderBottom: `1px solid ${C.line}` }}>
        <div style={{ font: `500 13px ${MONO}`, letterSpacing: '0.08em', color: C.ink3 }}>AGENDA · DRA. PÉREZ</div>
        <div style={{ font: `500 28px ${SANS}`, letterSpacing: '-0.02em', color: C.ink, marginTop: 4 }}>Semana del 13 de octubre</div>
      </div>
      <div style={{ display: 'flex', paddingLeft: X0, borderBottom: `1px solid ${C.line}` }}>
        {DAYS.map(d => <div key={d} style={{ width: DW, padding: '10px 8px', font: `500 12px ${MONO}`, letterSpacing: '0.05em', color: C.ink3 }}>{d}</div>)}
      </div>
      <div style={{ position: 'relative', height: 520 }}>
        {[9, 10, 11, 12, 13].map((h, i) => (
          <div key={h} style={{ position: 'absolute', left: 0, right: 0, top: i * HH, borderTop: i ? `1px dashed ${C.line}` : 'none', font: `400 12px ${MONO}`, color: C.ink3, paddingLeft: 16, paddingTop: 6 }}>{h}:00</div>
        ))}
        {APPTS.map(([d, h, dur, what, who], i) => (
          <div key={i} style={{ position: 'absolute', left: X0 + d * DW + 4, top: (h - 9) * HH + 4, width: DW - 8, height: dur * HH - 8, background: C.slot, borderRadius: 10, padding: '8px 10px', overflow: 'hidden' }}>
            <div style={{ font: `500 13px/1.25 ${SANS}`, color: C.ink }}>{what}</div>
            <div style={{ font: `400 12px ${SANS}`, color: C.ink2 }}>{who}</div>
          </div>
        ))}
        {T >= free && (
          <div style={{ position: 'absolute', left: X0 + 3 * DW + 4, top: 1.5 * HH + 4, width: DW - 8, height: 0.75 * HH - 8, borderRadius: 10, border: `1.5px dashed ${T >= fill ? 'transparent' : C.brand}`, background: T >= fill ? C.ink : C.brandSub, padding: '8px 10px', opacity: MOTION.enter(T, free, 0.4), transform: `scale(${T >= fill ? 0.92 + 0.08 * pf : 1})` }}>
            <div style={{ font: `600 12.5px/1.25 ${SANS}`, color: T >= fill ? C.white : C.brand }}>{T >= fill ? 'Pablo R.' : T >= wait ? 'Avisando a 3' : 'Hueco libre'}</div>
            <div style={{ font: `400 11.5px/1.3 ${SANS}`, color: T >= fill ? C.white : C.ink2 }}>{T >= fill ? 'Lista de espera' : T >= wait ? 'lista de espera' : 'Jue 10:30'}</div>
          </div>
        )}
        <div style={{ position: 'absolute', left: bx, top: by, width: DW - 8, height: 0.75 * HH - 8, background: C.brand, borderRadius: 10, padding: '8px 10px', boxShadow: `0 ${10 * Math.sin(mv * Math.PI)}px ${20 * Math.sin(mv * Math.PI)}px rgba(15,23,42,0.25)` }}>
          <div style={{ font: `600 13px/1.25 ${SANS}`, color: C.white }}>Limpieza</div>
          <div style={{ font: `400 12px ${SANS}`, color: C.white }}>Lucía M.</div>
        </div>
      </div>
      {T >= toast && (
        <div style={{ position: 'absolute', left: 28, right: 28, bottom: 20, ...rise(pt, 16), display: 'flex', alignItems: 'center', gap: 12, background: C.ink, color: C.white, borderRadius: 14, padding: '14px 18px', font: `400 15px ${SANS}` }}>
          <span style={{ flex: 1 }}>Hueco del jueves recuperado desde la lista de espera</span>
          <span style={{ font: `500 12px ${MONO}`, color: C.brandMid }}>EN 4 MIN</span>
        </div>
      )}
    </Panel>
  );
}

function CambioPiece() {
  const { T, CUES: c, authoredTotal } = useComposition();
  const end = authoredTotal || (c.Cierre + 2.5);
  const cam = MOTION.draw(T, c.Hueco + 0.2, 1.1);
  const s = lerp(1.12, 1, cam), cx = lerp(450, 845, cam), cy = lerp(470, 500, cam);
  const rem = c.Recordatorio + 0.3, tap1 = c.Recordatorio + 2.3;
  const m1 = 'Mejor el viernes, si puede ser.';
  const t1 = c.Cambio + 0.1, send1 = c.Cambio + 1.2, tap2 = c.Cambio + 2.9;
  const input = T >= t1 && T < send1 ? typed(m1, (T - t1) / 0.9) : '';
  const typing1 = MOTION.enter(T, send1 + 0.2, 0.3) * (1 - MOTION.enter(T, send1 + 0.75, 0.25));
  const titleOp = 1 - MOTION.enter(T, 1.3, 0.6) + MOTION.enter(T, end - 1.1, 0.7);
  const opts = ['Confirmar asistencia', 'Cambiar la cita', 'Cancelar la cita'];
  const slots = ['Vie 17 · 12:00', 'Lun 20 · 9:30'];
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, fontFamily: SANS }}>
      <Camera s={s} cx={cx} cy={cy}>
        <AgendaCambio T={T} move={c.Hueco + 0.9} free={c.Hueco + 1.4} wait={c.Hueco + 2.0} fill={c.Hueco + 2.9} toast={c.Hueco + 3.1} />
        <Phone input={input}>
          <div style={{ alignSelf: 'center', font: `500 11px ${MONO}`, color: C.ink3, letterSpacing: '0.06em', paddingTop: 6 }}>MIÉ 15 · 10:30 · RECORDATORIO</div>
          {T >= rem && (
            <Grow p={MOTION.enter(T, rem, 0.5)}>
              <Bubble>
                Hola, Lucía. Le recuerdo su cita de mañana, jueves 16, a las 10:30 con la Dra. Pérez.
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {opts.map((o, i) => {
                    const pp = MOTION.pop(T, rem + 0.5 + i * 0.12, 0.4), on = i === 1 && T >= tap1 + 0.1;
                    return (
                      <div key={o} style={{ position: 'relative', opacity: clamp(pp, 0, 1), minHeight: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `500 15px ${SANS}`, border: `1.5px solid ${on ? C.brand : C.line}`, background: on ? C.brand : C.paper, color: on ? C.white : C.ink }}>
                        {o}{i === 1 && <Ripple T={T} at={tap1} x={120} y={22} />}
                      </div>
                    );
                  })}
                </div>
              </Bubble>
            </Grow>
          )}
          {T >= send1 && <Grow p={MOTION.enter(T, send1, 0.45)}><Bubble me>{m1}</Bubble></Grow>}
          {typing1 > 0 && <Grow p={typing1}><Typing T={T} /></Grow>}
          {T >= send1 + 0.8 && (
            <Grow p={MOTION.enter(T, send1 + 0.8, 0.5)}>
              <Bubble>
                Sin problema. Tengo estos huecos:
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                  {slots.map((sl, i) => {
                    const on = i === 0 && T >= tap2 + 0.1;
                    return (
                      <div key={sl} style={{ position: 'relative', minHeight: 44, display: 'flex', alignItems: 'center', padding: '0 14px', borderRadius: 12, border: `1.5px solid ${on ? C.brand : C.line}`, background: on ? C.brand : C.paper, color: on ? C.white : C.ink, font: `500 15px ${SANS}` }}>
                        {sl}{i === 0 && <Ripple T={T} at={tap2} x={110} y={22} />}
                      </div>
                    );
                  })}
                </div>
              </Bubble>
            </Grow>
          )}
          {T >= c.Hueco && (
            <Grow p={MOTION.enter(T, c.Hueco, 0.5)}>
              <Bubble>
                <div style={{ font: `600 16px ${SANS}` }}>Cita cambiada</div>
                <div style={{ marginTop: 4, font: `400 14px/1.5 ${SANS}`, color: C.ink2 }}>Ahora: <span style={{ color: C.ink, fontWeight: 500 }}>viernes 17, 12:00</span>. Su hueco del jueves ya está libre para otro paciente.</div>
              </Bubble>
            </Grow>
          )}
        </Phone>
      </Camera>
      <Caption T={T} items={[
        { at: c.Recordatorio + 0.4, until: c.Cambio, text: 'Recordatorio el día antes, con respuesta en un toque' },
        { at: c.Cambio + 0.2, until: c.Hueco, text: 'Cambiar o cancelar sin llamar a recepción' },
        { at: c.Hueco + 1.3, until: end - 1.2, text: 'El hueco libre se ofrece a la lista de espera' },
      ]} />
      <TitleCard op={clamp(titleOp, 0, 1)} kicker="CLÍNICA DENTAL · 03 / CAMBIOS Y CANCELACIONES" title="Cambiar o cancelar" sub="El paciente reprograma desde el recordatorio y el asistente rellena el hueco con la lista de espera." />
    </div>
  );
}
function VideoCambio() {
  return <CompositionStage width={1600} height={1000} bg={C.bg} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}><CambioPiece /></CompositionStage>;
}

/* ---------------- VIDEO 4 · HORARIOS DEL EQUIPO ---------------- */
const DOCS = [
  ['Dra. Pérez', 'Odontología general', ['9–14', '9–14', '16–20', '9–14', '9–14']],
  ['Dr. Navarro', 'Odontología general', ['16–20', '16–20', '9–14', '9–14', '9–14']],
  ['Dra. Ibáñez', 'Ortodoncia', ['9–14', '', '9–14', '16–20', '16–20']],
];
const AFECT = [['Lucía M.', '12:00', 'Limpieza'], ['Tomás G.', '9:30', 'Revisión'], ['Elena F.', '10:30', 'Empaste']];

function Chip({ kind, children, p = 1 }) {
  const k = { warn: [C.warnBg, C.warnInk], info: [C.brandSub, C.brand], ok: [C.ink, C.white] }[kind];
  return <span style={{ font: `500 13px ${SANS}`, borderRadius: 999, padding: '6px 12px', background: k[0], color: k[1], whiteSpace: 'nowrap', display: 'inline-block', transform: `scale(${0.9 + 0.1 * p})` }}>{children}</span>;
}

function HorariosPiece() {
  const { T, CUES: c, authoredTotal } = useComposition();
  const end = authoredTotal || (c.Cierre + 2.5);
  const a = MOTION.draw(T, c.Afectadas - 0.2, 0.9), b = MOTION.draw(T, c.Aviso - 0.1, 1.0), o = MOTION.draw(T, c.Resuelto - 0.2, 1.1);
  let s = lerp(1.3, 1.25, a), cx = 1110, cy = lerp(370, 560, a);
  s = lerp(s, 1.1, b); cx = lerp(cx, 450, b); cy = lerp(cy, 470, b);
  s = lerp(s, 1, o); cx = lerp(cx, 845, o); cy = lerp(cy, 500, o);

  const sync = c.Ausencia + 0.6, absent = c.Ausencia + 1.6;
  const msg = c.Aviso + 0.6, tap = c.Aviso + 2.5, reply = c.Aviso + 2.9, conf = c.Aviso + 3.5;
  const syncing = T >= sync && T < absent;
  const pa = MOTION.pop(T, absent, 0.45);
  const status = i => {
    const r = [conf, c.Resuelto + 0.7, c.Resuelto + 1.2][i], av = [msg, msg + 0.3, msg + 0.6][i];
    if (T >= r) return ['ok', i === 2 ? 'Llamada programada' : 'Reubicada', MOTION.pop(T, r, 0.4)];
    if (T >= av) return ['info', 'Avisada', MOTION.pop(T, av, 0.4)];
    return ['warn', 'Afectada', 1];
  };
  const opts = ['Vie 17 · 12:00 · Dr. Navarro', 'Lun 20 · 9:30 · Dra. Pérez', 'Prefiero que me llamen'];
  const typing = MOTION.enter(T, msg - 0.5, 0.3) * (1 - MOTION.enter(T, msg - 0.05, 0.2));
  const typing2 = MOTION.enter(T, reply + 0.2, 0.3) * (1 - MOTION.enter(T, conf - 0.05, 0.2));
  const pt = MOTION.enter(T, c.Resuelto + 1.7, 0.5);
  const titleOp = 1 - MOTION.enter(T, 1.3, 0.6) + MOTION.enter(T, end - 1.1, 0.7);

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, fontFamily: SANS }}>
      <Camera s={s} cx={cx} cy={cy}>
        <Panel left={790} top={120} width={640} height={760}>
          <div style={{ padding: '24px 28px 18px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: `1px solid ${C.line}` }}>
            <div>
              <div style={{ font: `500 13px ${MONO}`, letterSpacing: '0.08em', color: C.ink3 }}>HORARIOS DEL EQUIPO</div>
              <div style={{ font: `500 26px ${SANS}`, letterSpacing: '-0.02em', color: C.ink, marginTop: 4 }}>Semana del 13 de octubre</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: `500 12px ${MONO}`, letterSpacing: '0.04em', color: syncing ? C.brand : C.ink2 }}>
              <span style={{ width: 9, height: 9, borderRadius: 5, background: C.brand, opacity: syncing ? 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(T * 10)) : 1 }}></span>
              {syncing ? 'SINCRONIZANDO…' : T >= absent ? 'ACTUALIZADO AHORA' : 'SINCRONIZADO · HACE 14 MIN'}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '150px repeat(5, 1fr)', padding: '0 20px' }}>
            <div></div>
            {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE'].map(d => <div key={d} style={{ padding: '12px 4px 8px', font: `500 12px ${MONO}`, letterSpacing: '0.05em', color: C.ink3, textAlign: 'center' }}>{d}</div>)}
            {DOCS.map(([name, esp, hs], r) => (
              <React.Fragment key={name}>
                <div style={{ padding: '12px 4px', borderTop: `1px solid ${C.line}` }}>
                  <div style={{ font: `500 15px ${SANS}`, color: C.ink }}>{name}</div>
                  <div style={{ font: `400 12px ${SANS}`, color: C.ink3 }}>{esp}</div>
                </div>
                {hs.map((h, d) => {
                  const isAbs = r === 0 && d === 4 && T >= absent;
                  return (
                    <div key={d} style={{ padding: '12px 4px', borderTop: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isAbs ? (
                        <div style={{ width: '100%', textAlign: 'center', borderRadius: 8, padding: '6px 0', background: C.warnBg, color: C.warnInk, font: `500 12.5px ${SANS}`, transform: `scale(${0.85 + 0.15 * pa})`, boxShadow: `0 0 0 ${3 * (1 - MOTION.enter(T, absent + 1, 1))}px ${C.warnInk}` }}>Ausente</div>
                      ) : h ? (
                        <div style={{ width: '100%', textAlign: 'center', borderRadius: 8, padding: '6px 0', background: C.brandSub, border: `1px solid ${C.brandMid}`, color: C.ink, font: `500 13px ${MONO}` }}>{h}</div>
                      ) : <div style={{ font: `400 13px ${MONO}`, color: C.ink3 }}>—</div>}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div style={{ margin: '14px 28px 0', font: `400 13px ${SANS}`, color: C.ink2, opacity: MOTION.enter(T, absent + 0.3, 0.4) }}>Dra. Pérez · viernes 17 · congreso. Cambio recibido desde el programa de gestión de la clínica.</div>
          <div style={{ margin: '22px 28px 0', paddingTop: 18, borderTop: `1px solid ${C.line}`, ...rise(MOTION.enter(T, c.Afectadas, 0.5), 10) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ font: `500 13px ${MONO}`, letterSpacing: '0.08em', color: C.ink3 }}>CITAS AFECTADAS · VIE 17</div>
              <div style={{ font: `500 13px ${MONO}`, color: C.ink2 }}>3</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}>
              {AFECT.map(([who, h, what], i) => {
                const [k, label, p] = status(i);
                return (
                  <div key={who} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderTop: i ? `1px solid ${C.line}` : 'none', ...rise(MOTION.enter(T, c.Afectadas + 0.2 + i * 0.15, 0.4), 8) }}>
                    <div style={{ font: `500 15px ${MONO}`, color: C.ink, width: 56 }}>{h}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ font: `500 16px ${SANS}`, color: C.ink }}>{who}</div>
                      <div style={{ font: `400 13px ${SANS}`, color: C.ink3 }}>{what}</div>
                    </div>
                    <Chip kind={k} p={p}>{label}</Chip>
                  </div>
                );
              })}
            </div>
          </div>
          {T >= c.Resuelto + 1.7 && (
            <div style={{ position: 'absolute', left: 28, right: 28, bottom: 20, ...rise(pt, 16), display: 'flex', alignItems: 'center', gap: 12, background: C.ink, color: C.white, borderRadius: 14, padding: '14px 18px', font: `400 15px ${SANS}` }}>
              <span style={{ flex: 1 }}>3 pacientes avisados · 2 citas reubicadas</span>
              <span style={{ font: `500 12px ${MONO}`, color: C.brandMid }}>EN 3 MIN</span>
            </div>
          )}
        </Panel>
        <Phone>
          <div style={{ alignSelf: 'center', font: `500 11px ${MONO}`, color: C.ink3, letterSpacing: '0.06em', paddingTop: 6 }}>MIÉ 15 · 18:05</div>
          {typing > 0 && <Grow p={typing}><Typing T={T} /></Grow>}
          {T >= msg && (
            <Grow p={MOTION.enter(T, msg, 0.5)}>
              <Bubble>
                Hola, Lucía. La Dra. Pérez no pasará consulta el viernes 17. Para no perder su cita de las 12:00, le propongo:
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {opts.map((op, i) => {
                    const pp = MOTION.pop(T, msg + 0.5 + i * 0.12, 0.4), on = i === 0 && T >= tap + 0.1;
                    return (
                      <div key={op} style={{ position: 'relative', opacity: clamp(pp, 0, 1), minHeight: 44, borderRadius: 12, display: 'flex', alignItems: 'center', padding: '0 14px', font: `500 14.5px ${SANS}`, border: `1.5px solid ${on ? C.brand : C.line}`, background: on ? C.brand : C.paper, color: on ? C.white : C.ink }}>
                        {op}{i === 0 && <Ripple T={T} at={tap} x={130} y={22} />}
                      </div>
                    );
                  })}
                </div>
              </Bubble>
            </Grow>
          )}
          {T >= reply && <Grow p={MOTION.enter(T, reply, 0.45)}><Bubble me>Con el Dr. Navarro, perfecto.</Bubble></Grow>}
          {typing2 > 0 && <Grow p={typing2}><Typing T={T} /></Grow>}
          {T >= conf && (
            <Grow p={MOTION.enter(T, conf, 0.5)}>
              <Bubble>
                <div style={{ font: `600 16px ${SANS}` }}>Hecho</div>
                <div style={{ marginTop: 4, font: `400 14px/1.5 ${SANS}`, color: C.ink2 }}><span style={{ color: C.ink, fontWeight: 500 }}>Viernes 17, 12:00 con el Dr. Navarro.</span> Le enviaré un recordatorio el día antes.</div>
              </Bubble>
            </Grow>
          )}
        </Phone>
      </Camera>
      <Caption T={T} items={[
        { at: c.Ausencia + 0.3, until: c.Afectadas, text: 'Los horarios del equipo se sincronizan solos' },
        { at: c.Afectadas + 0.2, until: c.Aviso, text: 'El asistente detecta las citas afectadas' },
        { at: c.Aviso + 0.3, until: c.Resuelto, text: 'Avisa a cada paciente y le ofrece alternativas' },
        { at: c.Resuelto + 0.6, until: end - 1.2, text: 'Recepción solo revisa el resultado' },
      ]} />
      <TitleCard op={clamp(titleOp, 0, 1)} kicker="CLÍNICA DENTAL · 04 / HORARIOS DEL EQUIPO" title="Cambia un horario" sub="Si un médico se ausenta, el asistente reorganiza su agenda y avisa a los pacientes sin que nadie descuelgue el teléfono." />
    </div>
  );
}
function VideoHorarios() {
  return <CompositionStage width={1600} height={1000} bg={C.bg} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}><HorariosPiece /></CompositionStage>;
}

function VideoReserva() {
  return <CompositionStage width={1600} height={1000} bg={C.bg} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}><ReservaPiece /></CompositionStage>;
}
function VideoResena() {
  return <CompositionStage width={1600} height={1000} bg={C.bg} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}><ResenaPiece /></CompositionStage>;
}
Object.assign(window, { VideoReserva, VideoResena, VideoCambio, VideoHorarios });
