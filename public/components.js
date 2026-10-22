export const money = (cents) =>
  new Intl.NumberFormat("fr-LU", { style: "currency", currency: "EUR" }).format(
    cents / 100,
  );
export const escapeHtml = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const paths = {
  arrow: "M4 12h15m-6-6 6 6-6 6",
  plus: "M12 5v14M5 12h14",
  close: "m6 6 12 12M6 18 18 6",
  menu: "M4 6h16M4 12h16M4 18h16",
  search: "m20 20-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  bag: "M5 7h14l1 14H4L5 7Zm3 0V5a4 4 0 0 1 8 0v2",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  coffee:
    "M4 8h13v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Zm13 1h2a3 3 0 0 1 0 6h-2M7 2v3m4-3v3m4-3v3",
  leaf: "M20 3C6 2 2 8 6 16c6 8 15 2 14-13ZM5 21 16 9",
  star: "m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z",
  heart: "M20 4c-3-2-6 0-8 2-2-2-5-4-8-2-7 5 8 16 8 16S27 9 20 4Z",
  check: "m5 12 4 4L19 6",
  info: "M12 11v6m0-10v1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  user: "M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 22v-2a8 8 0 0 1 16 0v2",
};
export const icon = (name) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.coffee}"/></svg>`;
export function logo() {
  return `<svg class="logo" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="32" fill="#00754a"/><circle cx="32" cy="32" r="27" fill="none" stroke="white" stroke-width="1"/><path d="m24 17 3 5h10l3-5-6 2-2-7-2 7-6-2Zm2 10c0-8 12-8 12 0v8c0 8-12 8-12 0Z" fill="white"/><path d="M20 24c-7 5-3 10-6 15m30-15c7 5 3 10 6 15M22 27c-5 8 0 12-5 18m25-18c5 8 0 12 5 18M24 37l-5 13m21-13 5 13M28 41l-2 12m10-12 2 12" stroke="white" stroke-width="3" fill="none"/><path d="M29 29h1m4 0h1m-5 6q2 2 4 0" stroke="#00754a" stroke-width="1.4" stroke-linecap="round"/></svg>`;
}
export function drinkArt(p) {
  const id = p.id + "-" + Math.random().toString(36).slice(2, 8);
  if (p.kind === "bakery")
    return `<svg class="drink-art" viewBox="0 0 300 300" aria-hidden="true"><defs><linearGradient id="${id}" x2=".5" y2="1"><stop stop-color="#f8d18b"/><stop offset="1" stop-color="#ae5624"/></linearGradient></defs><ellipse cx="150" cy="241" rx="88" ry="12" fill="#6b3b1c" opacity=".13"/><g fill="url(#${id})" stroke="#b97435" stroke-width="1"><path d="M60 218C10 150 90 95 150 103c68-8 140 58 84 117l-39-32c29-46-66-67-88 0Z"/><path d="m94 126 29 67 35-9-7-81Zm57-23 7 81 35 12 22-64Z"/><path d="m58 156 48 35-17 27-32-23Zm157-24-22 64 23 22 30-24Z"/></g></svg>`;
  if (p.kind === "cookie")
    return `<svg class="drink-art" viewBox="0 0 300 300" aria-hidden="true"><ellipse cx="150" cy="240" rx="80" ry="12" fill="#5e311b" opacity=".12"/><circle cx="150" cy="154" r="90" fill="#bb7c43"/><circle cx="150" cy="147" r="88" fill="#dba365"/><g fill="#513123">${[
      [110, 100],
      [165, 88],
      [199, 132],
      [156, 149],
      [100, 165],
      [180, 204],
      [130, 212],
      [216, 178],
    ]
      .map(
        ([x, y]) =>
          `<rect x="${x - 8}" y="${y - 8}" width="18" height="15" rx="4" transform="rotate(20 ${x} ${y})"/>`,
      )
      .join("")}</g></svg>`;
  const iced = ["iced", "matcha", "frappe"].includes(p.kind);
  const fill =
    p.kind === "matcha"
      ? "#8da06a"
      : p.id === "coldbrew"
        ? "#673923"
        : p.id === "mocha"
          ? "#8e604b"
          : "#c39161";
  return `<svg class="drink-art" viewBox="0 0 300 300" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2=".2"><stop stop-color="${iced ? "#fff8e5" : "#eee9df"}"/><stop offset=".45" stop-color="${iced ? fill : "#fffef7"}"/><stop offset="1" stop-color="${iced ? fill : "#d8d5cb"}"/></linearGradient><linearGradient id="${id}b" x2="0" y2="1"><stop stop-color="${fill}"/><stop offset="1" stop-color="${p.kind === "matcha" ? "#c7d4a4" : "#e8cba4"}"/></linearGradient></defs><ellipse cx="153" cy="262" rx="65" ry="9" fill="#3d2920" opacity=".12"/>${iced ? `<path d="m91 91 16 159q44 17 88 0l16-159Z" fill="url(#${id}b)"/><path d="m91 91 16 159q44 17 88 0l16-159Z" fill="url(#${id})" opacity=".45"/><ellipse cx="151" cy="93" rx="60" ry="14" fill="${fill}"/>${p.kind === "frappe" ? `<path d="M100 91c-11-12 4-22 18-22-7-11 5-23 18-20-5-15 16-27 22-19 4 8-2 15 14 18 15 3 15 14 10 21 19-3 34 12 21 23Z" fill="#fff7e8"/><path d="m118 72 58-11m-57 22 69-8" fill="none" stroke="#ba7e42" stroke-width="4"/>` : `<g fill="#fff" opacity=".35"><rect x="108" y="103" width="25" height="22" rx="5" transform="rotate(15 108 103)"/><rect x="155" y="104" width="25" height="22" rx="5" transform="rotate(-10 155 104)"/><rect x="135" y="129" width="25" height="22" rx="5"/></g><path d="m176 29-10 65" stroke="#00754a" stroke-width="7"/><ellipse cx="151" cy="92" rx="63" ry="15" fill="none" stroke="#f5efdd" stroke-width="5"/>`}<path d="m101 109 12 122" stroke="white" stroke-opacity=".5" stroke-width="4"/>` : `<path d="m87 85 22 164q42 16 84 0l22-164Z" fill="url(#${id})"/><path d="m87 92 5 28h118l5-28Z" fill="#dedbd2" opacity=".5"/><path d="M80 77q71-25 142 0l-5 15H85Z" fill="#f7f4ec"/><path d="M93 75V61q59-18 117 0v14Z" fill="#eeebe2"/><ellipse cx="151" cy="61" rx="58" ry="11" fill="#fffdf5"/><path d="M116 67h28" stroke="#99958b" stroke-width="4" stroke-linecap="round"/>`}<circle cx="151" cy="172" r="30" fill="#00754a"/><circle cx="151" cy="172" r="25" fill="none" stroke="#fff" stroke-width="1"/><path d="m143 156 4 5h8l4-5-6 1-2-6-2 6-6-1Zm3 9c0-6 10-6 10 0v8c0 6-10 6-10 0Z" fill="#fff"/><path d="m140 166-5 15m27-15 5 15m-24-4-4 11m20-11 4 11m-14-9-2 12m8-12 2 12" stroke="#fff" stroke-width="2.5"/></svg>`;
}
