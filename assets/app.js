/* ==========================================================================
   Anser — comportamiento
   Todo lo editable sin tocar código está en CONFIG y en content/*.json.
   ========================================================================== */

const CONFIG = {
  // WORDMARK: nombre comercial. Cambiar aquí (y los textos de reserva de index.html).
  nombre: 'Anser',
  // Preguntas que rotan en el hero (la respuesta es el nombre)
  preguntas: [
    '¿Quién diseña la marca y también el stand?',
    '¿Se puede ver el espacio antes de construirlo?',
    '¿Nos dejáis el modelo listo para imprimir en 3D?',
    '¿Quién nos hace la web y lleva las redes?',
    '¿Quién nos edita los vídeos del evento?',
    '¿Y un asistente con IA que atienda a nuestros clientes?',
  ],
  // Contacto. Vacío = se muestra "[PENDIENTE]".
  email: 'info@anser.studio',
  whatsapp: '34747441171',  // provisional; solo dígitos con prefijo
  // Imágenes de proyecto (ver img/proyectos/LEEME.txt)
  dirImagenes: 'img/proyectos/',
  extensiones: ['jpg', 'webp', 'png', 'jpeg', 'mp4'],
  maxImagenes: 12,
};

const $ = (sel, raiz = document) => raiz.querySelector(sel);
const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];

function crea(etiqueta, attrs = {}, hijos = []) {
  const el = document.createElement(etiqueta);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else el.setAttribute(k, v);
  }
  el.append(...hijos);
  return el;
}

async function carga(ruta) {
  const res = await fetch(ruta, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${ruta}: ${res.status}`);
  return res.json();
}

/* ---------- Marca y contacto ---------- */

function pintaMarca() {
  $$('[data-marca]').forEach((el) => { el.textContent = CONFIG.nombre; });
  if (CONFIG.nombre !== 'Anser') document.title = document.title.replaceAll('Anser', CONFIG.nombre);
  $('#anio').textContent = new Date().getFullYear();
}

function pintaContacto() {
  const email = $('[data-contacto="email"]');
  if (CONFIG.email) {
    email.href = `mailto:${CONFIG.email}`;
    $('.canal__valor', email).textContent = CONFIG.email;
  }
  const wa = $('[data-contacto="whatsapp"]');
  if (CONFIG.whatsapp) {
    wa.href = `https://wa.me/${CONFIG.whatsapp}`;
    wa.target = '_blank';
    wa.rel = 'noopener';
    $('.canal__valor', wa).textContent = `+${CONFIG.whatsapp.replace(/^(\d{2})(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3 $4')}`;
  }

  // Botón fijo: abre WhatsApp directamente y se esconde al llegar a la sección de contacto
  const flotante = $('#flotante');
  if (CONFIG.whatsapp) {
    flotante.href = `https://wa.me/${CONFIG.whatsapp}`;
    flotante.target = '_blank';
    flotante.rel = 'noopener';
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => flotante.classList.toggle('oculto', e.isIntersecting)).observe($('#contacto'));
  }
}

/* ---------- Navegación móvil ---------- */

function menu() {
  const boton = $('#menu');
  const cierra = () => {
    document.documentElement.classList.remove('nav-abierto');
    boton.setAttribute('aria-expanded', 'false');
    boton.textContent = 'Menú';
  };
  boton.addEventListener('click', () => {
    const abierto = document.documentElement.classList.toggle('nav-abierto');
    boton.setAttribute('aria-expanded', String(abierto));
    boton.textContent = abierto ? 'Cerrar' : 'Menú';
  });
  $$('#nav a').forEach((a) => a.addEventListener('click', cierra));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') cierra(); });
}

/* ---------- Hero: preguntas que rotan ---------- */

function preguntas() {
  const el = $('#pregunta');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || CONFIG.preguntas.length < 2) return;
  let i = 0;
  setInterval(() => {
    el.classList.add('sale');
    setTimeout(() => {
      i = (i + 1) % CONFIG.preguntas.length;
      el.textContent = CONFIG.preguntas[i];
      el.classList.remove('sale');
    }, 450);
  }, 3600);
}

/* ---------- Servicios (content/servicios.json) ---------- */

async function servicios() {
  const lista = $('#servicios-lista');
  try {
    const { servicios: areas } = await carga('content/servicios.json');
    lista.replaceChildren(...areas.map((s, i) => crea('li', { class: 'servicio' }, [
      crea('span', { class: 'mono servicio__num', text: String(i + 1).padStart(2, '0') }),
      crea('h3', { text: s.titulo }),
      crea('div', { class: 'servicio__txt' }, [
        crea('p', { text: s.frase }),
        crea('ul', { class: 'mono' }, (s.capacidades || []).map((c) => crea('li', { text: c }))),
      ]),
    ])));
  } catch (err) {
    console.error(err);
    lista.replaceChildren(crea('li', { class: 'aviso mono', text: 'No se han podido cargar los servicios.' }));
  }
}

/* ---------- Proyectos: galería con filtro y ficha (content/proyectos.json) ---------- */

const estado = { todos: [], visibles: [], actual: 0 };

const existe = (src) => /\.(mp4|webm)$/i.test(src)
  ? fetch(src, { method: 'HEAD' }).then((r) => (r.ok ? src : null), () => null)
  : new Promise((ok) => {
  const img = new Image();
  img.onload = () => ok(src);
  img.onerror = () => ok(null);
  img.src = src;
});

// Si el JSON no lista imágenes, busca <slug>-1.jpg, <slug>-2.jpg…
async function buscaImagenes(p) {
  if (p.imagenes?.length) {
    return p.imagenes.map((f) => (typeof f === 'string'
      ? { src: CONFIG.dirImagenes + f }
      : { ...f, src: /^(\/|borradores\/)/.test(f.src) ? f.src : CONFIG.dirImagenes + f.src }));
  }
  const encontradas = [];
  for (let n = 1; n <= CONFIG.maxImagenes; n++) {
    let src = null;
    for (const ext of CONFIG.extensiones) {
      src = await existe(`${CONFIG.dirImagenes}${p.slug}-${n}.${ext}`);
      if (src) break;
    }
    if (!src) break;
    encontradas.push({ src });
  }
  return encontradas;
}

const esVideo = (src) => /\.(mp4|webm)$/i.test(src);

const esAnimacion = (src) => /\.html(\?|$)/i.test(src);

// Web navegable: la página real dentro de un marco de navegador, con su propio scroll
function webViva(i, alt) {
  const marco = crea('div', { class: 'ficha__web ancha' }, [
    crea('div', { class: 'ficha__web-barra mono' }, [crea('span', { text: i.url || '' }), crea('span', { text: 'Web navegable' })]),
    crea('iframe', { src: i.src, title: alt, loading: 'lazy' }),
  ]);
  return marco;
}

function medio(src, alt, perezoso) {
  // Pieza animada: una página propia dentro de un marco 16:10
  if (esAnimacion(src)) return crea('iframe', { src, title: alt, class: 'ficha__anim ancha', loading: 'lazy' });
  return esVideo(src)
    ? crea('video', { src, controls: '', playsinline: '', preload: 'metadata', 'aria-label': alt })
    : apaisada(crea('img', { src, alt, loading: perezoso ? 'lazy' : 'eager' }));
}

// Las imágenes horizontales ocupan todo el ancho; las verticales van de dos en dos
function apaisada(img) {
  img.addEventListener('load', () => img.classList.toggle('ancha', img.naturalWidth >= img.naturalHeight));
  return img;
}

// Imagen o vídeo de la ficha, con pie de foto si lo lleva
function pieza(i, alt, perezoso) {
  const m = i.web ? webViva(i, alt) : medio(i.src, alt, perezoso);
  // "ancha": true en el JSON fuerza el ancho completo (láminas verticales largas)
  if (i.ancha) m.addEventListener('load', () => m.classList.add('ancha'));
  if (i.aspecto) m.style.aspectRatio = i.aspecto;
  if (!i.pie) return m;
  const fig = crea('figure', {}, [m, crea('figcaption', { text: i.pie })]);
  if (esAnimacion(i.src) || i.ancha || i.web) fig.classList.add('ancha');
  else m.addEventListener('load', () => fig.classList.toggle('ancha', m.naturalWidth >= m.naturalHeight));
  return fig;
}

const meta = (p) => [p.tipo, p.cliente && `Cliente ${p.cliente.toLowerCase()}`, p.lugar, p.anio].filter(Boolean).join(' · ');
const etiquetaNda = (p) => crea('span', { class: 'nda mono', text: p.via || 'Caso confidencial' });

function pintaPieza(p) {
  // Caso bajo NDA: sin imágenes; la pieza es tipográfica y lleva la etiqueta destacada
  const marco = p.nda
    ? crea('span', { class: 'pieza__img pieza__img--nda' }, [etiquetaNda(p), crea('span', { class: 'pieza__lema', text: p.resumen || p.tipo })])
    : crea('span', { class: 'pieza__img' }, [crea('span', { class: 'mono', text: '[PENDIENTE] Imágenes' })]);
  const boton = crea('button', { class: 'pieza', type: 'button' }, [
    marco,
    crea('span', { class: 'pieza__pie' }, [
      crea('span', { class: 'pieza__titulo', text: p.titulo }),
      crea('span', { class: 'mono pieza__meta', text: meta(p) }),
      ...(p.via && !p.nda ? [crea('span', { class: 'mono pieza__meta', text: `vía ${p.via}` })] : []),
    ]),
  ]);
  boton.addEventListener('click', () => abreFicha(estado.visibles.indexOf(p)));
  p.el = crea('li', {}, [boton]);

  p.listas = (p.nda ? Promise.resolve([]) : buscaImagenes(p)).then((imgs) => {
    const portada = p.portada ? CONFIG.dirImagenes + p.portada : imgs.find((i) => !esVideo(i.src) && !esAnimacion(i.src))?.src;
    if (portada) marco.replaceChildren(crea('img', { src: portada, alt: `${p.titulo} — ${p.tipo}`, loading: 'lazy' }));
    return imgs;
  });
  return p.el;
}

function filtra(area) {
  estado.visibles = estado.todos.filter((p) => area === 'Todos' || (p.areas || []).includes(area));
  estado.todos.forEach((p) => { p.el.hidden = !estado.visibles.includes(p); });
  $$('#filtros button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.area === area)));
}

function pintaFiltros() {
  const areas = [...new Set(estado.todos.flatMap((p) => p.areas || []))];
  if (areas.length < 2) return;
  $('#filtros').replaceChildren(...['Todos', ...areas].map((a) => {
    const n = a === 'Todos' ? estado.todos.length : estado.todos.filter((p) => (p.areas || []).includes(a)).length;
    const b = crea('button', { type: 'button', 'data-area': a, 'aria-pressed': 'false' }, [a, crea('sup', { class: 'mono', text: String(n) })]);
    b.addEventListener('click', () => filtra(a));
    return b;
  }));
}

async function abreFicha(i) {
  const ficha = $('#ficha');
  const n = estado.visibles.length;
  estado.actual = (i + n) % n;
  const p = estado.visibles[estado.actual];
  const imgs = await p.listas;

  const datos = [['Tipo', p.tipo], ['Cliente', p.cliente], ['Lugar', p.lugar], ['Año', p.anio], ['Vía', !p.nda && p.via]].filter(([, v]) => v);
  $('#ficha-pos').textContent = `${String(estado.actual + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
  $('#ficha-cuerpo').replaceChildren(
    crea('div', { class: 'ficha__txt' }, [
      ...(p.nda ? [etiquetaNda(p)] : []),
      crea('h2', { text: p.titulo }),
      ...(p.resumen ? [crea('p', { class: 'ficha__resumen', text: p.resumen })] : []),
      ...[p.descripcion, p.detalle].flat().filter(Boolean).map((t) => crea('p', { text: t })),
      crea('dl', { class: 'mono' }, datos.flatMap(([k, v]) => [crea('dt', { text: k }), crea('dd', { text: v })])),
      ...(p.entregables?.length ? [crea('div', { class: 'ficha__hecho mono' }, [
        crea('p', { text: 'Qué hicimos' }),
        crea('ul', {}, p.entregables.map((e) => crea('li', { text: e }))),
      ])] : []),
    ]),
    ...(p.nda ? [] : [crea('div', { class: `ficha__imgs ${p.formato === 'vertical' ? 'ficha__imgs--vertical' : ''}` }, imgs.length
      ? imgs.map((i, k) => pieza(i, i.pie || `${p.titulo} — pieza ${k + 1}`, k > 0))
      : [crea('p', { class: 'pendiente mono', text: '[PENDIENTE] Imágenes del proyecto' })])]),
  );
  $('#ficha-cuerpo').classList.toggle('ficha__cuerpo--nda', Boolean(p.nda));
  if (!ficha.open) ficha.showModal();
  ficha.scrollTop = 0;
}

function iniciaFicha() {
  const ficha = $('#ficha');
  ficha.addEventListener('click', (e) => {
    const accion = e.target.closest('[data-ficha]')?.dataset.ficha;
    if (accion === 'ant') abreFicha(estado.actual - 1);
    else if (accion === 'sig') abreFicha(estado.actual + 1);
    else if (accion === 'cerrar') ficha.close();
  });
  ficha.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') abreFicha(estado.actual - 1);
    if (e.key === 'ArrowRight') abreFicha(estado.actual + 1);
  });
}

async function proyectos() {
  const galeria = $('#galeria');
  try {
    const { proyectos: todos } = await carga('content/proyectos.json');
    const lista = todos.filter((p) => !p.oculto);
    estado.todos = lista;
    galeria.replaceChildren(...lista.map(pintaPieza));
    pintaFiltros();
    filtra('Todos');
    // Para enlazar un proyecto concreto: index.html#p=slug
    const slug = new URLSearchParams(location.hash.slice(1)).get('p');
    const i = lista.findIndex((p) => p.slug === slug);
    if (i >= 0) abreFicha(i);
  } catch (err) {
    console.error(err);
    galeria.replaceChildren(crea('li', {
      class: 'aviso mono',
      text: 'No se han podido cargar los proyectos. Abre la web desde un servidor (no con doble clic sobre el archivo).',
    }));
  }
}

/* ---------- Arranque ---------- */

pintaMarca();
pintaContacto();
menu();
preguntas();
iniciaFicha();
servicios();
proyectos();
