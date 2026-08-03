"use strict";

console.log("app.js is geladen");

const statusElement = document.getElementById("status");

const map = new maplibregl.Map({
    container: "map",

    style: "https://tiles.openfreemap.org/styles/liberty",

    center: [6.562, 52.992],

    zoom: 15,
    pitch: 55,
    bearing: -12,

    minZoom: 3,
    maxZoom: 19,
    maxPitch: 70,

    attributionControl: true
});

map.addControl(
    new maplibregl.NavigationControl({
        showZoom: true,
        showCompass: true,
        visualizePitch: true
    }),
    "top-right"
);

map.addControl(
    new maplibregl.FullscreenControl(),
    "top-right"
);

map.addControl(
    new maplibregl.ScaleControl({
        unit: "metric"
    }),
    "bottom-left"
);

map.on("load", function () {
    try {
        registerMinecraftTextures();
        applyMinecraftStyle();
        addGreyBuildings();

        setStatus("Minecraftkaart geladen");

        console.log(
            "Minecraftstijl is succesvol geladen"
        );
    } catch (error) {
        console.error(
            "Minecraftstijl kon niet laden:",
            error
        );

        setStatus(
            "Minecraftstijl kon niet volledig laden"
        );
    }
});

map.on("error", function (event) {
    console.error(
        "MapLibre-fout:",
        event.error
    );
});

function setStatus(message) {
    if (statusElement) {
        statusElement.textContent = message;
    }
}

function registerMinecraftTextures() {
    addTexture(
        "minecraft-grass",
        createGrassTexture()
    );

    addTexture(
        "minecraft-dark-grass",
        createDarkGrassTexture()
    );

    addTexture(
        "minecraft-water",
        createWaterTexture()
    );

    addTexture(
        "minecraft-sand",
        createSandTexture()
    );
}

function addTexture(name, canvas) {
    if (map.hasImage(name)) {
        return;
    }

    const context = canvas.getContext(
        "2d",
        {
            willReadFrequently: true
        }
    );

    if (!context) {
        throw new Error(
            "Kon textuur niet aanmaken: " + name
        );
    }

    const imageData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );

    map.addImage(
        name,
        imageData,
        {
            pixelRatio: 1
        }
    );
}

function createTextureCanvas() {
    const canvas =
        document.createElement("canvas");

    canvas.width = 16;
    canvas.height = 16;

    const context =
        canvas.getContext("2d");

    if (!context) {
        throw new Error(
            "Canvas wordt niet ondersteund"
        );
    }

    context.imageSmoothingEnabled = false;

    return {
        canvas: canvas,
        context: context
    };
}

function createGrassTexture() {
    const texture = createTextureCanvas();
    const canvas = texture.canvas;
    const context = texture.context;

    context.fillStyle = "#5f9f3f";
    context.fillRect(0, 0, 16, 16);

    const pixels = [
        [0, 0, "#74b64d"],
        [3, 0, "#4b8532"],
        [6, 0, "#69a944"],
        [9, 0, "#7bbd53"],
        [12, 0, "#47802f"],
        [15, 0, "#68a543"],

        [1, 2, "#4f8d35"],
        [4, 2, "#78b950"],
        [7, 2, "#5a983b"],
        [10, 2, "#81c057"],
        [13, 2, "#4d8933"],

        [0, 4, "#65a440"],
        [3, 4, "#80bd55"],
        [6, 4, "#4b8531"],
        [9, 4, "#6dac46"],
        [12, 4, "#55923a"],
        [15, 4, "#79b950"],

        [1, 6, "#7fbd54"],
        [4, 6, "#4b8631"],
        [7, 6, "#65a441"],
        [10, 6, "#58983a"],
        [13, 6, "#75b54d"],

        [0, 8, "#4c8732"],
        [3, 8, "#73b24b"],
        [6, 8, "#55943a"],
        [9, 8, "#82c158"],
        [12, 8, "#4b8431"],
        [15, 8, "#68a744"],

        [1, 10, "#68a742"],
        [4, 10, "#7cb951"],
        [7, 10, "#4d8933"],
        [10, 10, "#70ae48"],
        [13, 10, "#55943a"],

        [0, 12, "#7ebc54"],
        [3, 12, "#4a8431"],
        [6, 12, "#69a844"],
        [9, 12, "#58963a"],
        [12, 12, "#79b850"],
        [15, 12, "#47802f"],

        [1, 14, "#57953a"],
        [4, 14, "#74b34b"],
        [7, 14, "#4b8632"],
        [10, 14, "#7dbb53"],
        [13, 14, "#65a441"]
    ];

    drawPixels(
        context,
        pixels,
        2
    );

    return canvas;
}

function createDarkGrassTexture() {
    const texture = createTextureCanvas();
    const canvas = texture.canvas;
    const context = texture.context;

    context.fillStyle = "#356f35";
    context.fillRect(0, 0, 16, 16);

    const pixels = [
        [0, 0, "#478747"],
        [3, 0, "#295d2c"],
        [6, 0, "#50944d"],
        [9, 0, "#316a33"],
        [12, 0, "#438142"],
        [15, 0, "#285b2b"],

        [1, 3, "#2e6531"],
        [4, 3, "#4c8e49"],
        [7, 3, "#377438"],
        [10, 3, "#52964e"],
        [13, 3, "#2b602e"],

        [0, 6, "#468645"],
        [3, 6, "#2c622f"],
        [6, 6, "#51954d"],
        [9, 6, "#326c34"],
        [12, 6, "#438242"],
        [15, 6, "#285c2b"],

        [1, 9, "#367238"],
        [4, 9, "#4c8d49"],
        [7, 9, "#295e2d"],
        [10, 9, "#4f924b"],
        [13, 9, "#326b34"],

        [0, 12, "#4b8d48"],
        [3, 12, "#2a602e"],
        [6, 12, "#3e7c3f"],
        [9, 12, "#51944d"],
        [12, 12, "#2e6531"],
        [15, 12, "#448544"],

        [1, 15, "#2b612e"],
        [4, 15, "#4c8e49"],
        [7, 15, "#367238"],
        [10, 15, "#285b2b"],
        [13, 15, "#4b8d48"]
    ];

    drawPixels(
        context,
        pixels,
        2
    );

    return canvas;
}

function createWaterTexture() {
    const texture = createTextureCanvas();
    const canvas = texture.canvas;
    const context = texture.context;

    context.fillStyle = "#2456b3";
    context.fillRect(0, 0, 16, 16);

    context.fillStyle = "#2862c4";
    context.fillRect(0, 0, 16, 2);
    context.fillRect(4, 6, 12, 2);
    context.fillRect(0, 12, 10, 2);

    context.fillStyle = "#3675d6";
    context.fillRect(0, 2, 7, 2);
    context.fillRect(9, 4, 7, 2);
    context.fillRect(0, 8, 6, 2);
    context.fillRect(8, 10, 8, 2);
    context.fillRect(2, 14, 12, 2);

    context.fillStyle = "#5a8be3";
    context.fillRect(1, 2, 4, 1);
    context.fillRect(10, 4, 4, 1);
    context.fillRect(1, 8, 3, 1);
    context.fillRect(9, 10, 5, 1);
    context.fillRect(3, 14, 6, 1);

    context.fillStyle = "#1c469d";
    context.fillRect(7, 2, 9, 2);
    context.fillRect(0, 4, 9, 2);
    context.fillRect(0, 6, 4, 2);
    context.fillRect(6, 8, 10, 2);
    context.fillRect(0, 10, 8, 2);
    context.fillRect(10, 12, 6, 2);
    context.fillRect(0, 14, 2, 2);
    context.fillRect(14, 14, 2, 2);

    return canvas;
}

function createSandTexture() {
    const texture = createTextureCanvas();
    const canvas = texture.canvas;
    const context = texture.context;

    context.fillStyle = "#d8c77a";
    context.fillRect(0, 0, 16, 16);

    const pixels = [
        [1, 1, "#eadb91"],
        [5, 2, "#c7b669"],
        [10, 1, "#e5d487"],
        [14, 3, "#c2b064"],

        [3, 6, "#e8d88d"],
        [8, 5, "#c5b468"],
        [12, 7, "#eadb91"],

        [1, 10, "#c2b064"],
        [6, 11, "#e5d487"],
        [10, 9, "#c7b669"],
        [14, 12, "#eadb91"],

        [3, 14, "#e8d88d"],
        [8, 14, "#c2b064"],
        [12, 15, "#e5d487"]
    ];

    drawPixels(
        context,
        pixels,
        2
    );

    return canvas;
}

function drawPixels(
    context,
    pixels,
    pixelSize
) {
    for (const pixel of pixels) {
        const x = pixel[0];
        const y = pixel[1];
        const color = pixel[2];

        context.fillStyle = color;

        context.fillRect(
            x,
            y,
            pixelSize,
            pixelSize
        );
    }
}

function applyMinecraftStyle() {
    const style = map.getStyle();
    const layers = style.layers || [];

    for (const layer of layers) {
        const id =
            layer.id.toLowerCase();

        const type =
            layer.type;

        const sourceLayer =
            layer["source-layer"];

        if (type === "background") {
            safeSetPaint(
                layer.id,
                "background-color",
                "#5f9f3f"
            );

            continue;
        }

        if (sourceLayer === "water") {
            styleWaterLayer(layer);
            continue;
        }

        if (
            sourceLayer === "landcover" ||
            sourceLayer === "landuse"
        ) {
            styleLandLayer(
                layer,
                id
            );

            continue;
        }

        if (
            sourceLayer === "transportation" &&
            type === "line"
        ) {
            styleRoadLayer(
                layer,
                id
            );

            continue;
        }

        if (
            sourceLayer === "boundary" &&
            type === "line"
        ) {
            safeSetPaint(
                layer.id,
                "line-color",
                "#353535"
            );

            safeSetPaint(
                layer.id,
                "line-blur",
                0
            );

            continue;
        }

        if (type === "symbol") {
            styleLabelLayer(
                layer,
                id
            );
        }
    }
}

function styleWaterLayer(layer) {
    if (layer.type === "fill") {
        safeSetPaint(
            layer.id,
            "fill-pattern",
            "minecraft-water"
        );

        safeSetPaint(
            layer.id,
            "fill-opacity",
            1
        );

        safeSetPaint(
            layer.id,
            "fill-antialias",
            false
        );
    }

    if (layer.type === "line") {
        safeSetPaint(
            layer.id,
            "line-color",
            "#1c469d"
        );

        safeSetPaint(
            layer.id,
            "line-blur",
            0
        );

        safeSetLayout(
            layer.id,
            "line-cap",
            "butt"
        );

        safeSetLayout(
            layer.id,
            "line-join",
            "bevel"
        );
    }
}

function styleLandLayer(layer, id) {
    if (layer.type !== "fill") {
        return;
    }

    let pattern =
        "minecraft-grass";

    if (
        id.includes("forest") ||
        id.includes("wood")
    ) {
        pattern =
            "minecraft-dark-grass";
    }

    if (
        id.includes("sand") ||
        id.includes("beach") ||
        id.includes("dune")
    ) {
        pattern =
            "minecraft-sand";
    }

    safeSetPaint(
        layer.id,
        "fill-pattern",
        pattern
    );

    safeSetPaint(
        layer.id,
        "fill-opacity",
        1
    );

    safeSetPaint(
        layer.id,
        "fill-antialias",
        false
    );
}

function styleRoadLayer(layer, id) {
    let color = "#777777";

    if (
        id.includes("motorway") ||
        id.includes("trunk")
    ) {
        color = "#c7b26d";
    } else if (
        id.includes("primary") ||
        id.includes("secondary")
    ) {
        color = "#aaa06c";
    } else if (
        id.includes("path") ||
        id.includes("track")
    ) {
        color = "#846747";
    } else if (
        id.includes("rail")
    ) {
        color = "#333333";
    }

    safeSetPaint(
        layer.id,
        "line-color",
        color
    );

    safeSetPaint(
        layer.id,
        "line-opacity",
        1
    );

    safeSetPaint(
        layer.id,
        "line-blur",
        0
    );

    safeSetLayout(
        layer.id,
        "line-cap",
        "butt"
    );

    safeSetLayout(
        layer.id,
        "line-join",
        "bevel"
    );
}

function styleLabelLayer(layer, id) {
    if (
        id.includes("poi") ||
        id.includes("shop") ||
        id.includes("airport")
    ) {
        safeSetLayout(
            layer.id,
            "visibility",
            "none"
        );

        return;
    }

    safeSetPaint(
        layer.id,
        "text-color",
        "#202020"
    );

    safeSetPaint(
        layer.id,
        "text-halo-color",
        "#f4edce"
    );

    safeSetPaint(
        layer.id,
        "text-halo-width",
        2
    );

    safeSetPaint(
        layer.id,
        "text-halo-blur",
        0
    );
}

function addGreyBuildings() {
    const style = map.getStyle();
    const layers = style.layers || [];

    const buildingReference =
        layers.find(function (layer) {
            return (
                layer["source-layer"] ===
                    "building" &&
                layer.source
            );
        });

    if (!buildingReference) {
        console.warn(
            "Geen gebouwenlaag gevonden"
        );

        return;
    }

    for (const layer of layers) {
        if (
            layer["source-layer"] ===
            "building"
        ) {
            safeSetLayout(
                layer.id,
                "visibility",
                "none"
            );
        }
    }

    const firstLabelLayer =
        layers.find(function (layer) {
            return layer.type === "symbol";
        });

    const beforeLayerId =
        firstLabelLayer
            ? firstLabelLayer.id
            : undefined;

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

    addLayerBeforeLabels(
        {
            id: "minecraft-building-ground",

            type: "fill",

            source:
                buildingReference.source,

            "source-layer": "building",

            minzoom: 13,

            paint: {
                "fill-color": "#777777",
                "fill-opacity": 1,
                "fill-antialias": false
            }
        },
        beforeLayerId
    );

    addLayerBeforeLabels(
        {
            id: "minecraft-building-outline",

            type: "line",

            source:
                buildingReference.source,

            "source-layer": "building",

            minzoom: 13,

            layout: {
                "line-cap": "butt",
                "line-join": "bevel"
            },

            paint: {
                "line-color": "#252525",
                "line-width": 2,
                "line-opacity": 1,
                "line-blur": 0
            }
        },
        beforeLayerId
    );

    addLayerBeforeLabels(
        {
            id: "minecraft-buildings-3d",

            type: "fill-extrusion",

            source:
                buildingReference.source,

            "source-layer": "building",

            minzoom: 14,

            paint: {
                "fill-extrusion-color":
                    "#777777",

                "fill-extrusion-height":
                    buildingHeight,

                "fill-extrusion-base":
                    buildingBase,

                "fill-extrusion-opacity":
                    1,

                "fill-extrusion-vertical-gradient":
                    false
            }
        },
        beforeLayerId
    );
}

function addLayerBeforeLabels(
    layer,
    beforeLayerId
) {
    if (map.getLayer(layer.id)) {
        return;
    }

    if (beforeLayerId) {
        map.addLayer(
            layer,
            beforeLayerId
        );
    } else {
        map.addLayer(layer);
    }
}

function safeSetPaint(
    layerId,
    property,
    value
) {
    try {
        map.setPaintProperty(
            layerId,
            property,
            value
        );
    } catch (error) {
        console.debug(
            "Paint property overgeslagen:",
            layerId,
            property
        );
    }
}

function safeSetLayout(
    layerId,
    property,
    value
) {
    try {
        map.setLayoutProperty(
            layerId,
            property,
            value
        );
    } catch (error) {
        console.debug(
            "Layout property overgeslagen:",
            layerId,
            property
        );
    }
}
