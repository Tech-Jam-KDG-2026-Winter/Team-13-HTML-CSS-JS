/**
 * HTMLAnimation - 円形プログレスメーター
 */

function financial(x, fractionDigits = 2) {
    return Number.parseFloat(x).toFixed(fractionDigits);
}

function getValueName(className) {
    const match = className.match(/HTMLAnimation-valueName=([^\s]+)/);
    if (match) {
        return match[1];
    }
}

function getAnimationSpeed(className) {
    const match = className.match(/HTMLAnimation-animationSpeed=([^\s]+)/);
    if (match) {
        return Number(match[1]);
    }
}

function getAnimationMaxSpeed(className) {
    const match = className.match(/HTMLAnimation-animationMaxSpeed=([^\s]+)/);
    if (match) {
        return Number(match[1]);
    }
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function toColor(a) {
    return `rgb(${a[0]}, ${a[1]}, ${a[2]})`;
}

function gradient(colors, t) {
    if (colors.length == 1) return toColor(colors[0].color);
    if (colors[colors.length - 1].offset < t) return toColor(colors[colors.length - 1].color);
    let left = colors[0];
    let right = colors[0];
    for (const color of colors) {
        left = right;
        right = color;
        if (t < color.offset) break;
    }
    const sectionT = (t - left.offset) / (right.offset - left.offset);
    return toColor([
        lerp(left.color[0], right.color[0], sectionT),
        lerp(left.color[1], right.color[1], sectionT),
        lerp(left.color[2], right.color[2], sectionT)
    ]);
}

const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl(name, attrs = {}) {
    const el = document.createElementNS(SVG_NS, name);
    for (const [k, v] of Object.entries(attrs)) {
        el.setAttribute(k, v);
    }
    return el;
}

function updateHTMLAnimation() {
    const targetValueElements = document.getElementsByClassName("HTMLAnimation-value");
    const targetViewElements = document.getElementsByClassName("HTMLAnimation-view");
    const targetMeterElements = document.getElementsByClassName("HTMLAnimation-meter");
    const valuesMap = new Map();

    for (const element of targetValueElements) {
        if (element instanceof HTMLInputElement) {
            if (element.type == "number") {
                valuesMap.set(getValueName(element.className), {
                    value: Number(element.value),
                    max: Number(element.max),
                    min: Number(element.min)
                });
            }
        }
    }

    for (const element of targetViewElements) {
        const value = valuesMap.get(getValueName(element.className));
        if (!value) continue;

        let animationSpeed = getAnimationSpeed(element.className);
        if (!animationSpeed) animationSpeed = 0.2;
        let animationMaxSpeed = getAnimationMaxSpeed(element.className);
        if (!animationMaxSpeed) animationMaxSpeed = 0.5;

        if (!("value" in element.dataset)) element.dataset.value = value.min;
        const nowValue = Number(element.dataset.value);

        if (value.value - nowValue < 0.00001) {
            element.dataset.value = value.value;
        } else {
            element.dataset.value = Math.min(animationMaxSpeed, (value.value - nowValue) * animationSpeed) + nowValue;
        }
        element.textContent = financial(element.dataset.value, 0);
    }

    for (const element of targetMeterElements) {
        if (element instanceof HTMLDivElement) {
            const value = valuesMap.get(getValueName(element.className));
            if (!value) continue;

            let animationSpeed = getAnimationSpeed(element.className);
            if (!animationSpeed) animationSpeed = 0.2;
            let animationMaxSpeed = getAnimationMaxSpeed(element.className);
            if (!animationMaxSpeed) animationMaxSpeed = 0.5;

            const maxValue = value.max;
            const minValue = value.min;

            const radius = 75;
            const strokeWidth = 18;

            if (!("value" in element.dataset)) {
                element.dataset.value = 0;

                const percentageEl = element.querySelector('.percentage');
                if (percentageEl) {
                    // Already has percentage element
                }

                const svgSize = radius * 2 + strokeWidth;
                element.style.width = `${svgSize}px`;
                element.style.height = `${svgSize}px`;

                const svg = svgEl("svg", { width: svgSize, height: svgSize });
                svg.append(
                    svgEl("circle", {
                        cx: svgSize / 2,
                        cy: svgSize / 2,
                        r: radius,
                        stroke: "rgba(255, 255, 255, 0.1)",
                        "stroke-width": strokeWidth,
                        fill: "none"
                    }),
                    svgEl("circle", {
                        class: "progress",
                        cx: svgSize / 2,
                        cy: svgSize / 2,
                        r: radius,
                        "stroke-width": strokeWidth,
                        fill: "none"
                    })
                );
                element.appendChild(svg);
            }

            const nowValue = Number(element.dataset.value);
            if (value.value - nowValue < 0.00001) {
                element.dataset.value = value.value;
            } else {
                element.dataset.value = Math.min(animationMaxSpeed, (value.value - nowValue) * animationSpeed) + nowValue;
            }

            const percent = (Number(element.dataset.value) - minValue) / (maxValue - minValue);
            const circumference = 2 * Math.PI * radius;
            const offset = circumference * (1 - percent);

            const svg = element.querySelector('svg');
            if (svg) {
                const circles = svg.querySelectorAll('circle');
                if (circles.length >= 2) {
                    circles[1].setAttribute("stroke-dasharray", circumference);
                    circles[1].setAttribute("stroke-dashoffset", offset);
                    // Gold gradient for RIZAP theme
                    circles[1].setAttribute("stroke", gradient([
                        { offset: 0, color: [184, 134, 11] },    // Dark gold
                        { offset: 0.5, color: [212, 175, 55] },  // Gold
                        { offset: 1, color: [255, 215, 0] }      // Bright gold
                    ], percent));
                }
            }
        }
    }

    requestAnimationFrame(updateHTMLAnimation);
}

// Start animation loop
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateHTMLAnimation);
} else {
    updateHTMLAnimation();
}
