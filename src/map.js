/* global mapboxgl */

// Factories -----------------------------------------------------------------
const createMap = (long, lat, zoom) => {

    // Check the parameters are sane and set to defaults if not
    const getFloatParam = (val, defVal) => {
        if (val == null || val == false || isNaN(parseFloat(val))) {
            return defVal;
        } else {
            return parseFloat(val);
        }
    };

    const longitude = getFloatParam(long, -0.116773);
    const latitude = getFloatParam(lat, 51.510356);
    const zoomLevel = getFloatParam(zoom, 12.5);

    mapboxgl.accessToken =
        "pk.eyJ1IjoiaGF3a2luc29ob2NsIiwiYSI6ImNraDBtYW9ja" +
        "TB6YXkycm52Y2t6MTB2anEifQ.G4BRLK2Zb9BwnHsVRdAeGQ";

    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/hawkinsohocl/ckh0lqfxr5be419pdep8v99ar", 
        center: [longitude, latitude],
        zoom: zoomLevel
    });

    return map;
};

const createApp = (map, csrf) => ({

    selection: null,
    map: map,
    csrf: csrf,

    run() {

        // Set up the map
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        // map.addControl(new mapboxgl.GeolocateControl({
        //     showUserLocation: false,
        //     fitBoundsOptions: {maxZoom: 12.5}
        // }));

        map.getCanvas().style.cursor = "pointer";

        this.map.on("load", () => {

            map.addSource("msoa", {
                "type": "vector",
                "url": "mapbox://hawkinsohocl.6nredeqq" 
            });

            map.addLayer({
                "id": "msoa-highlight",
                "type": "fill",
                "source": "msoa",
                "source-layer": "msoa-2011-polygons-hcl-54m0f4",
                "paint": {
                    "fill-color": "#682f7f",
                    "fill-opacity": 0
                },
                "minzoom": 8.5,
                "maxzoom": 22
            });
        });

        // Click-handler in now disabled
        map.on("click", createClickHandler(this));

        // Remove any open selection when the map zooms out too far
        map.on("zoom", () => {
            if (map.getZoom() < 8.5 && this.hasSelection()) {
                this.closeAndRemoveSelection();
            }
        });

        // Update the query string with the current map position
        map.on("moveend", () => {
            const c = map.getCenter();
            const z = map.getZoom();
            const url = `/msoanames/map?long=${c.lng}&lat=${c.lat}&zoom=${z}`;
            history.replaceState(null, null, url);
        });

        return this;
    },

    getSelection() {
        return this.selection;
    },

    setSelection(selection) {

        this.selection = selection;
        this.selection.open();
        return this;
    },

    removeSelection() {

        this.selection.deselect();
        this.selection = null;
        return this;
    },

    closeAndRemoveSelection() {

        this.selection.close();
        this.removeSelection();
        return this;
    },

    hasSelection() {
        return this.selection !== null;
    },

    getCSRF() {
        return this.csrf;
    }
});

const createSelection = (map, createMessage, properties, coordinates) => ({

    map: map,
    createMessage: createMessage,
    properties: properties,
    coordinates: coordinates,
    window: null,

    getCode() { return this.properties.msoa11cd; },
    getName() { return this.properties.msoa11hclnm; },

    open() {

        // Highlight the selection's feature
        this.map.setPaintProperty(
            "msoa-highlight",
            "fill-opacity",
            ["case", ["==", ["get", "msoa11cd"],
                this.properties.msoa11cd], 0.2, 0.0]);

        // Open the selection window
        this.window = new mapboxgl.Popup({closeButton: false})
            .setLngLat(this.coordinates)
            .setDOMContent(this.createMessage(this.properties))
            .addTo(this.map);

        this.window.on("close", () => {});
    },

    close() {
        // Close the selection window if it exists
        if (this.window !== null) this.window.remove();
    },

    deselect() {
        // Remove the highlight from the selection's feature
        this.map.setPaintProperty("msoa-highlight", "fill-opacity", 0.0);
    }
});

const createClickHandler = (app) => {

    const createMessage = createMessageFactory(app);

    return (e) => {

        // Get the feature under the pointer
        const feature = app.map.queryRenderedFeatures(
            e.point, {layers: ["msoa-highlight"]})[0];

        // If there is no feature under the pointer just remove the selection
        if (feature === undefined) {
            if (app.hasSelection()) {
                app.removeSelection();
            }
            return;
        }

        // Get the area code for the feature
        const clickedCode = feature.properties.msoa11cd;

        // If the click is on an open selection, remove it
        if (app.hasSelection() &&
            app.selection.getCode() == clickedCode) {
            app.removeSelection();
            return;
        }

        // Otherwise create a new selection
        app.setSelection(createSelection(
            app.map, createMessage, feature.properties, e.lngLat));
    };
};

const createMessageFactory = (app) => {

    const closeHandler = () => {
        app.closeAndRemoveSelection();
    };

    return (properties) => {

        const html = `
            <div id="namebox">
                <p>${properties.msoa11hclnm}</p>
            </div>
            <div id="contentbox">
                <p>${properties.msoa11nm}</p>
                <p>${properties.msoa11cd}</p>
                <p>
                    <a href="/msoanames/static/MSOA-Names-1.7.xlsx">Excel</a> /
                    <a href="/msoanames/static/MSOA-Names-1.7.csv">CSV</a>
                </p>
            </div>
            <div id="buttonbox">
                <button class="closebutton" type="button">Close</button>
            </div>`;

        const message = document.createElement("div");
        message.className = "messagebox";
        message.innerHTML = html;

        const closeButton = message.getElementsByClassName("closebutton")[0];
        closeButton.addEventListener("click", closeHandler, false);

        return message;
    };
};

// Exports -------------------------------------------------------------------
export { createMap, createApp };
