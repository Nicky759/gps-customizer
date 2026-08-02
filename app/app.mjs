import * as maplibregl from "https://unpkg.com/maplibre-gl@6.1.0/dist/maplibre-gl.mjs";

const STATUS_ELEMENT = document.querySelector("#status");

const COLORS = {
    grass: "#6aa84f",
    darkGrass: "#3f7f3b",
    sand: "#d8c77a",
    water: "#3f76e4",
    waterDark: "#2a55b0",
    stone: "#7d7d7d",
    cobblestoneDark: "#3f3f3f",
    label: "#202020",
    labelHalo: "#f1e6c8"
};

const map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.openfreemap.org/styles/liberty",

    // Assen
    center: [6.562, 52.992],
    zoom: 15,
    pitch: 55,
    bearing: -12,

    minZoom: 3,
    maxZoom: 19,
    maxPitch: 70,
    attributionControl: true
});

/*
 * Een lage pixelratio zorgt ervoor dat de kaart bewust op een kleiner canvas
 * wordt getekend. CSS schaalt dit canvas daarna met scherpe pixels op.
 */
map.setPixelRatio(0.75);

map.addControl(
    new maplibregl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true
    }),
    "top-right"
);

map.addControl(new maplibregl.FullscreenControl(), "top-right");
map.addControl(new maplibregl.ScaleControl({unit: "metric"}), "bottom-left");

map.on("load", () => {
    try {
        registerMinecraftTextures();
        applyMinecraftColors();
        addMinecraftBuildings();

        setStatus("Minecraftstijl geladen — sleep, zoom, draai en kantel de kaart.");
        console.info("Minecraftstijl is succesvol toegepast.");
    } catch (error) {
        console.error("De Minecraftstijl kon niet volledig worden toegepast:", error);
        setStatus("De kaart werkt, maar een deel van de Minecraftstijl kon niet laden.");
    }
});

map.on("error", (event) => {
    console.error("MapLibre-fout:", event.error);
});

function setStatus(message) {
    if (STATUS_ELEMENT) {
        STATUS_ELEMENT.textContent = message;
    }
}

function registerMinecraftTextures() {
    addTexture("minecraft-cobblestone", 16, drawCobblestone);
    addTexture("minecraft-grass", 16, drawGrass);
    addTexture("minecraft-dark-grass", 16, drawDarkGrass);
    addTexture("minecraft-sand", 16, drawSand);
    addTexture("minecraft-water", 16, drawWater);
    addTexture("minecraft-gravel", 16, drawGravel);
}

function addTexture(name, size, drawTexture) {
    if (map.hasImage(name)) {
        return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d", {willReadFrequently: true});

    if (!context) {
        throw new Error(`Geen canvascontext beschikbaar voor ${name}.`);
    }

    context.imageSmoothingEnabled = false;
    drawTexture(context, size);

    map.addImage(
        name,
        context.getImageData(0, 0, size, size),
        {pixelRatio: 1}
    );
}

function drawCobblestone(context, size) {
    context.fillStyle = COLORS.cobblestoneDark;
    context.fillRect(0, 0, size, size);

    const stones = [
        [1, 1, 6, 4, "#898989"],
        [8, 1, 7, 5, "#717171"],
        [1, 6, 4, 5, "#696969"],
        [6, 7, 7, 4, "#969696"],
        [14, 7, 1, 5, "#777777"],
        [1, 12, 7, 3, "#8f8f8f"],
        [9, 12, 6, 3, "#626262"]
    ];

    for (const [x, y, width, height, color] of stones) {
        context.fillStyle = color;
        context.fillRect(x, y, width, height);

        context.fillStyle = "rgba(255, 255, 255, 0.18)";
        context.fillRect(x, y, width, 1);

        context.fillStyle = "rgba(0, 0, 0, 0.22)";
        context.fillRect(x, y + height - 1, width, 1);
    }
}

function drawGrass(context, size) {
    context.fillStyle = COLORS.grass;
    context.fillRect(0, 0, size, size);

    drawPixels(context, [
        [1, 2, "#78b857"], [5, 1, "#4f913e"], [9, 3, "#80ba5b"],
        [13, 2, "#4d8c3a"], [3, 7, "#559a40"], [7, 9, "#7db657"],
        [12, 7, "#4a8938"], [1, 13, "#80b95b"], [10, 14, "#55963f"]
    ]);
}

function drawDarkGrass(context, size) {
    context.fillStyle = COLORS.darkGrass;
    context.fillRect(0, 0, size, size);

    drawPixels(context, [
        [2, 2, "#4c9144"], [7, 1, "#2f6630"], [12, 4, "#55994a"],
        [4, 8, "#326f32"], [10, 9, "#4d9145"], [14, 13, "#2f652f"],
        [1, 14, "#559748"]
    ]);
}

function drawSand(context, size) {
    context.fillStyle = COLORS.sand;
    context.fillRect(0, 0, size, size);

    drawPixels(context, [
        [2, 2, "#ead98d"], [7, 4, "#c6b56a"], [13, 2, "#ead98d"],
        [4, 10, "#c3b166"], [10, 12, "#ead98d"], [14, 8, "#c8b86d"]
    ]);
}

function drawWater(context, size) {
    context.fillStyle = COLORS.water;
    context.fillRect(0, 0, size, size);

    context.fillStyle = "#5b8ff0";
    context.fillRect(0, 2, 7, 2);
    context.fillRect(9, 8, 7, 2);
    context.fillRect(2, 13, 9, 1);

    context.fillStyle = COLORS.waterDark;
    context.fillRect(5, 5, 9, 1);
    context.fillRect(0, 10, 6, 2);
}

function drawGravel(context, size) {
    context.fillStyle = "#777777";
    context.fillRect(0, 0, size, size);

    drawPixels(context, [
        [1, 1, "#a0a0a0"], [4, 3, "#555555"], [8, 1, "#8c8c8c"],
        [13, 4, "#4e4e4e"], [2, 8, "#626262"], [6, 11, "#aaaaaa"],
        [11, 8, "#5c5c5c"], [14, 13, "#999999"], [3, 14, "#494949"]
    ], 2);
}

function drawPixels(context, pixels, pixelSize = 1) {
    for (const [x, y, color] of pixels) {
        context.fillStyle = color;
        context.fillRect(x, y, pixelSize, pixelSize);
    }
}

function applyMinecraftColors() {
    const layers = map.getStyle().layers ?? [];

    for (const layer of layers) {
        const id = layer.id.toLowerCase();
        const type = layer.type;
        const sourceLayer = layer["source-layer"];

        if (type === "background") {
            safeSetPaint(layer.id, "background-color", COLORS.grass);
            continue;
        }

        if (sourceLayer === "water") {
            styleWaterLayer(layer);
            continue;
        }

        if (sourceLayer === "landcover" || sourceLayer === "landuse") {
            styleLandLayer(layer, id);
            continue;
        }

        if (sourceLayer === "transportation" && type === "line") {
            styleRoadLayer(layer, id);
            continue;
        }

        if (sourceLayer === "boundary" && type === "line") {
            safeSetPaint(layer.id, "line-color", "#3f3f3f");
            safeSetPaint(layer.id, "line-blur", 0);
            continue;
        }

        if (type === "symbol") {
            styleLabelLayer(layer);
        }
    }
}

function styleWaterLayer(layer) {
    if (layer.type === "fill") {
        safeSetPaint(layer.id, "fill-pattern", "minecraft-water");
        safeSetPaint(layer.id, "fill-opacity", 1);
        safeSetPaint(layer.id, "fill-antialias", false);
    }

    if (layer.type === "line") {
        safeSetPaint(layer.id, "line-color", COLORS.waterDark);
        safeSetPaint(layer.id, "line-blur", 0);
        safeSetLayout(layer.id, "line-cap", "butt");
        safeSetLayout(layer.id, "line-join", "bevel");
    }
}

function styleLandLayer(layer, id) {
    if (layer.type !== "fill") {
        return;
    }

    let pattern = "minecraft-grass";

    if (id.includes("forest") || id.includes("wood")) {
        pattern = "minecraft-dark-grass";
    } else if (
        id.includes("sand") ||
        id.includes("beach") ||
        id.includes("dune")
    ) {
        pattern = "minecraft-sand";
    }

    safeSetPaint(layer.id, "fill-pattern", pattern);
    safeSetPaint(layer.id, "fill-opacity", 1);
    safeSetPaint(layer.id, "fill-antialias", false);
}

function styleRoadLayer(layer, id) {
    const isMotorway = id.includes("motorway") || id.includes("trunk");
    const isMainRoad = id.includes("primary") || id.includes("secondary");
    const isPath = id.includes("path") || id.includes("track");
    const isRail = id.includes("rail");

    let color = COLORS.stone;

    if (isMotorway) {
        color = "#d4b04c";
    } else if (isMainRoad) {
        color = "#baa574";
    } else if (isPath) {
        color = "#8a6845";
    } else if (isRail) {
        color = "#353535";
    }

    safeSetPaint(layer.id, "line-color", color);
    safeSetPaint(layer.id, "line-opacity", 1);
    safeSetPaint(layer.id, "line-blur", 0);

    safeSetLayout(layer.id, "line-cap", "butt");
    safeSetLayout(layer.id, "line-join", "bevel");
}

function styleLabelLayer(layer) {
    safeSetPaint(layer.id, "text-color", COLORS.label);
    safeSetPaint(layer.id, "text-halo-color", COLORS.labelHalo);
    safeSetPaint(layer.id, "text-halo-width", 2);
    safeSetPaint(layer.id, "text-halo-blur", 0);

    safeSetPaint(layer.id, "icon-halo-color", COLORS.labelHalo);
    safeSetPaint(layer.id, "icon-halo-width", 1);
}

function addMinecraftBuildings() {
    const layers = map.getStyle().layers ?? [];
    const buildingReference = layers.find(
        (layer) => layer["source-layer"] === "building" && layer.source
    );

    if (!buildingReference) {
        console.warn("Er is geen building-source-layer in de geladen stijl gevonden.");
        return;
    }

    for (const layer of layers) {
        if (layer["source-layer"] === "building") {
            safeSetLayout(layer.id, "visibility", "none");
        }
    }

    const firstLabelLayer = layers.find((layer) => layer.type === "symbol");
    const beforeLayerId = firstLabelLayer?.id;

    const buildingHeight = [
        "*",
        3,
        [
            "ceil",
            [
                "/",
                [
                    "to-number",
                    [
                        "coalesce",
                        ["get", "render_height"],
                        ["get", "height"],
                        9
                    ],
                    9
                ],
                3
            ]
        ]
    ];

    const buildingBase = [
        "*",
        3,
        [
            "floor",
            [
                "/",
                [
                    "to-number",
                    [
                        "coalesce",
                        ["get", "render_min_height"],
                        ["get", "min_height"],
                        0
                    ],
                    0
                ],
                3
            ]
        ]
    ];

    addLayerBeforeLabels({
        id: "minecraft-building-footprints",
        type: "fill",
        source: buildingReference.source,
        "source-layer": "building",
        minzoom: 13,
        paint: {
            "fill-pattern": "minecraft-cobblestone",
            "fill-opacity": 1,
            "fill-antialias": false
        }
    }, beforeLayerId);

    addLayerBeforeLabels({
        id: "minecraft-building-outlines",
        type: "line",
        source: buildingReference.source,
        "source-layer": "building",
        minzoom: 13,
        layout: {
            "line-cap": "butt",
            "line-join": "bevel"
        },
        paint: {
            "line-color": "#272727",
            "line-width": 1.5,
            "line-opacity": 1,
            "line-blur": 0
        }
    }, beforeLayerId);

    addLayerBeforeLabels({
        id: "minecraft-buildings-3d",
        type: "fill-extrusion",
        source: buildingReference.source,
        "source-layer": "building",
        minzoom: 14,
        paint: {
            "fill-extrusion-pattern": "minecraft-cobblestone",
            "fill-extrusion-height": buildingHeight,
            "fill-extrusion-base": buildingBase,
            "fill-extrusion-opacity": 1,
            "fill-extrusion-vertical-gradient": false
        }
    }, beforeLayerId);
}

function addLayerBeforeLabels(layer, beforeLayerId) {
    if (map.getLayer(layer.id)) {
        return;
    }

    if (beforeLayerId) {
        map.addLayer(layer, beforeLayerId);
    } else {
        map.addLayer(layer);
    }
}

function safeSetPaint(layerId, property, value) {
    try {
        map.setPaintProperty(layerId, property, value);
    } catch (error) {
        console.debug(`Kon ${property} niet instellen voor ${layerId}.`, error);
    }
}

function safeSetLayout(layerId, property, value) {
    try {
        map.setLayoutProperty(layerId, property, value);
    } catch (error) {
        console.debug(`Kon ${property} niet instellen voor ${layerId}.`, error);
    }
}
