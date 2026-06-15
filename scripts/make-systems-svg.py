#!/usr/bin/env python3
"""
Animated SVG for agentic-systems: 5 systems, each a different agent topology.

Rows light up top-to-bottom; each shows its name, task, and a mini topology
glyph (single agent / 2-agent DAG / 3-agent DAG). SMIL, plays on GitHub.

Usage:  python scripts/make-systems-svg.py
Output: systems.svg in the repo root.
"""
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "systems.svg"

W, H = 900, 560
TOP, ROW_H = 120, 80
DUR = 11.0

# (num, name, task, topology, color)  topology in {single,dag2,dag3}
SYSTEMS = [
    ("01", "Research Agent",   "topic -> searches -> markdown brief",  "single", "#3fb950"),
    ("02", "Code Reviewer",    "audit a file, then generate fixes",    "dag2",   "#2dd4bf"),
    ("03", "Blog Generator",   "planner -> researcher -> writer",      "dag3",   "#38bdf8"),
    ("04", "Test Generator",   "function signature -> Jest tests",     "single", "#a855f7"),
    ("05", "Bug Triage",       "classify a report, route to a team",   "dag2",   "#ec4899"),
]


def opacity_anim(t_on):
    kt = [0, max(t_on - 0.001, 0), t_on, t_on + 0.05, 0.9, 1.0]
    vals = [0.18, 0.18, 0.18, 1, 1, 0.18]
    return (f'<animate attributeName="opacity" dur="{DUR}s" repeatCount="indefinite" '
            f'keyTimes="{";".join(f"{k:.4f}" for k in kt)}" '
            f'values="{";".join(str(v) for v in vals)}"/>')


def topo(kind, cx, cy, color):
    s = []
    def node(x, y, r=11):
        s.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{color}" fill-opacity="0.22" '
                 f'stroke="{color}" stroke-width="1.8"/>')
    def arrow(x1, y1, x2, y2):
        s.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" '
                 f'stroke-width="1.8" stroke-opacity="0.75"/>')
        # small arrowhead at end
        import math
        a = math.atan2(y2 - y1, x2 - x1)
        for da in (2.5, -2.5):
            s.append(f'<line x1="{x2}" y1="{y2}" x2="{x2-9*math.cos(a+da):.1f}" '
                     f'y2="{y2-9*math.sin(a+da):.1f}" stroke="{color}" stroke-width="1.8" '
                     f'stroke-opacity="0.75"/>')
    if kind == "single":
        node(cx, cy, 13)
    elif kind == "dag2":
        node(cx - 30, cy); arrow(cx - 17, cy, cx + 17, cy); node(cx + 30, cy)
    elif kind == "dag3":
        node(cx - 48, cy); arrow(cx - 35, cy, cx - 13, cy)
        node(cx, cy);      arrow(cx + 13, cy, cx + 35, cy); node(cx + 48, cy)
    return "".join(s)


def build():
    p = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
        f'viewBox="0 0 {W} {H}" font-family="Segoe UI, Helvetica, Arial, sans-serif">',
        f'<rect x="1" y="1" width="{W-2}" height="{H-2}" rx="16" fill="#0d1117" '
        f'stroke="#30363d" stroke-width="1.5"/>',
        f'<text x="40" y="54" font-size="30" font-weight="700" fill="#e6edf3">Agentic Systems</text>',
        f'<text x="40" y="84" font-size="16" fill="#8b949e">five systems you can clone and run — each a different agent topology</text>',
    ]
    for i, (num, name, task, kind, color) in enumerate(SYSTEMS):
        cy = TOP + ROW_H * i + ROW_H // 2
        t_on = 0.05 + i * 0.15
        g = [f'<g opacity="0.18">{opacity_anim(t_on)}']
        g.append(f'<circle cx="74" cy="{cy}" r="21" fill="{color}" fill-opacity="0.18" '
                 f'stroke="{color}" stroke-width="2"/>')
        g.append(f'<text x="74" y="{cy+5}" font-size="15" font-weight="700" fill="{color}" '
                 f'text-anchor="middle">{num}</text>')
        g.append(f'<text x="112" y="{cy-3}" font-size="21" font-weight="600" fill="#e6edf3">{name}</text>')
        g.append(f'<text x="112" y="{cy+20}" font-size="14" fill="#8b949e">{task}</text>')
        g.append(topo(kind, 770, cy, color))
        g.append('</g>')
        p.append("".join(g))
    p.append('</svg>')
    OUT.write_text("\n".join(p), encoding="utf-8")
    print(f"wrote {OUT}  ({OUT.stat().st_size/1024:.1f} KB)")


if __name__ == "__main__":
    build()
