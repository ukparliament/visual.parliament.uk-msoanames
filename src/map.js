/* global mapboxgl */

// Factories -----------------------------------------------------------------
const createMap = (long, lat) => {

    const longitude = (long == null || long == false) ? -0.116773 : long;
    const latitude = (lat == null || lat == false) ? 51.510357 : lat;

    mapboxgl.accessToken =
        "pk.eyJ1IjoiaGF3a2luc29ob2NsIiwiYSI6IjNmMmZkMzY4MTUw" +
        "ZGNiMjE4NTExOWQwNDBjNzg4NjAzIn0.bv8BBlUo7MtQR544YviGZQ";

    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/hawkinsohocl/cjkcm2ii04c9u2sqgjhzr0hwt",
        center: [longitude, latitude],
        zoom: 12.5
    });

    return map;
};

const createApp = (map) => ({

    suggestion: null,
    map: map,

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
                "url": "mapbox://hawkinsohocl.dqzrnokh"
            });

            map.addLayer({
                "id": "msoa-highlight",
                "type": "fill",
                "source": "msoa",
                "source-layer": "msoa-2011-polygons-hcl-0qsdgc",
                "paint": {
                    "fill-color": "#d83808",
                    "fill-opacity": 0
                },
                "minzoom": 8,
                "maxzoom": 22
            });
        });

        map.on("click", createClickHandler(this));

        map.on("zoom", () => {
            if (map.getZoom() < 8 && this.hasSuggestion()) {
                this.closeAndRemoveSuggestion();
            }
        });

        return this;
    },

    getSuggestion() {
        return this.suggestion;
    },

    setSuggestion(suggestion) {

        this.suggestion = suggestion;
        this.suggestion.open();
        return this;
    },

    removeSuggestion() {

        this.suggestion.clearAnimation();
        this.suggestion.deselect();
        this.suggestion = null;
        return this;
    },

    closeAndRemoveSuggestion() {

        this.suggestion.close();
        this.removeSuggestion();
        return this;
    },

    hasSuggestion() {
        return this.suggestion !== null;
    }
});

const createSuggestion = (map, createForm, properties, coordinates) => ({

    map: map,
    createForm: createForm,
    properties: properties,
    coordinates: coordinates,
    timestamp: Date.now(),
    window: null,
    animation: null,
    animating: false,

    getId() { return `${this.properties.msoa11cd}${this.timestamp}`; },
    getCode() { return this.properties.msoa11cd; },
    getName() { return this.properties.msoa11hclnm; },

    open() {

        // Highlight the suggestion's feature
        this.map.setPaintProperty(
            "msoa-highlight",
            "fill-opacity",
            ["case", ["==", ["get", "msoa11cd"],
                this.properties.msoa11cd], 0.2, 0.0]);

        // Open the suggestion window
        this.window = new mapboxgl.Popup({closeButton: false})
            .setLngLat(this.coordinates)
            .setDOMContent(this.createForm(this.properties))
            .addTo(this.map);

        this.window.on("close", () => this.clearAnimation());
    },

    close() {
        // Close the suggestion window if it exists
        if (this.window !== null) this.window.remove();
    },

    deselect() {
        // Remove the highlight from the suggestion's feature
        this.map.setPaintProperty("msoa-highlight", "fill-opacity", 0.0);
    },

    getAnimation() {

        const message = "Sending ";
        let output = message;
        let i = 0;

        return () => {

            if (i == 3) {
                output = message;
                i = 0;
            } else {
                output += ".";
                i = i + 1;
            }

            document.getElementById("statusmsg").innerHTML = "";
            document.getElementById("statusmsg").innerHTML = output;
        };
    },

    startAnimation() {
        if (! this.animating) {
            this.animating = true;
            this.animation = setInterval(this.getAnimation(), 330);
        }
    },

    endAnimation(statusMsg) {
        if (this.animating) {
            clearInterval(this.animation);
            this.animating = false;
            document.getElementById("statusmsg").innerHTML = statusMsg;
        }
    },

    clearAnimation() {
        if (this.animating) {
            clearInterval(this.animation);
            this.animating = false;
        }
    }
});

const createClickHandler = (app) => {

    const createForm = createFormFactory(app);

    return (e) => {

        // Get the feature under the pointer
        const feature = app.map.queryRenderedFeatures(
            e.point, {layers: ["msoa-highlight"]})[0];

        // If there is no feature under the pointer just remove the suggestion
        if (feature === undefined) {
            if (app.hasSuggestion()) {
                app.removeSuggestion();
            }
            return;
        }

        // Get the area code for the feature
        const clickedCode = feature.properties.msoa11cd;

        // If the click is on an open suggestion, remove it
        if (app.hasSuggestion() &&
            app.suggestion.getCode() == clickedCode) {
            app.removeSuggestion();
            return;
        }

        // Otherwise create a new suggestion
        app.setSuggestion(createSuggestion(
            app.map, createForm, feature.properties, e.lngLat));
    };
};

const createFormFactory = (app) => {

    const suggestionHandler = (e) => {

        const sendButton = document.getElementById("sendbutton");

        if (e.srcElement.value == 0) {

            sendButton.disabled = true;
            sendButton.style.background = "#c0c0c0";
            sendButton.style.borderColor = "#c0c0c0";

        } else{

            sendButton.disabled = false;
            sendButton.style.background = "#d06040";
            sendButton.style.borderColor = "#d06040";
        }
    };

    const sendHandler = () => {

        const sid = app.getSuggestion().getId();
        const msoa11cd = document.getElementById("msoa11cd").value;
        const msoa11nm = document.getElementById("msoa11nm").value;
        const msoa11hclnm = document.getElementById("msoa11hclnm").value;
        const suggestion = document.getElementById("suggestion").value;
        const reason = document.getElementById("reason").value;

        // Check input lengths are sane
        if (msoa11cd.length == 0 || msoa11nm.length == 0 ||
            msoa11hclnm.length == 0 || suggestion.length == 0 ) {
            return;
        }

        if (msoa11cd.length > 64 || msoa11nm.length > 64 ||
            msoa11hclnm.length > 64 || suggestion.length > 64 ||
            reason.length > 1024) {
            return;
        }

        // Change the form content to the status box
        const contentBox = document.getElementById("contentbox");
        contentBox.innerHTML = "";
        contentBox.appendChild(createStatus());
        app.getSuggestion().startAnimation();

        // Send the request
        const formData = new FormData();
        formData.append("msoa11cd", msoa11cd);
        formData.append("msoa11nm", msoa11nm);
        formData.append("msoa11hclnm", msoa11hclnm);
        formData.append("suggestion", suggestion);
        formData.append("reason", reason);

        const request = new XMLHttpRequest();
        request.timeout = 20000;

        request.onload = () => {

            if (app.hasSuggestion() && sid == app.getSuggestion().getId()) {
                app.getSuggestion().endAnimation("All done!");
            }
        };

        request.ontimeout = () => {

            if (app.hasSuggestion() && sid == app.getSuggestion().getId()) {
                app.getSuggestion().endAnimation("Could not reach the server.");
            }
        };

        request.onerror = () => {

            if (app.hasSuggestion() && sid == app.getSuggestion().getId()) {
                app.getSuggestion().endAnimation("Could not reach the server.");
            }
        };

        request.open("POST", "/submit");
        request.send(formData);
    };

    const closeHandler = () => {
        app.closeAndRemoveSuggestion();
    };

    const createStatus = () => {

        const html = `
            <p>Thank you very much for your suggestion for this area.</p>
            <p id="statusmsg">Sending </p>
            <button class="closebutton" type="button">Close</button>`;

        const status = document.createElement("div");
        status.className = "statusbox";
        status.innerHTML = html;

        const closeButton = status.getElementsByClassName("closebutton")[0];
        closeButton.addEventListener("click", closeHandler, false);

        return status;
    };

    return (properties) => {

        const suggestion = "Your suggestion (required)";
        const reason = "Why you think this would be a good name";
        const message = "Please note that we cannot accept suggestions for " +
            "boundary changes.";

        const html = `
            <form method="post" action="/submit">
                <input type="hidden" id="msoa11cd"
                    value="${properties.msoa11cd}">
                <input type="hidden" id="msoa11nm"
                        value="${properties.msoa11nm}">
                <input type="hidden" id="msoa11hclnm"
                        value="${properties.msoa11hclnm}">
                <div id="namebox">
                    <p>${properties.msoa11hclnm}</p>
                </div>
                <div id="contentbox">
                    <div>
                        <input type="text" id="suggestion" class="suggestion"
                            placeholder="${suggestion}" maxlength="64" required>
                    </div>
                    <div>
                        <textarea id="reason" placeholder="${reason}"
                            maxlength="1024"></textarea>
                    </div>
                    <div class="buttonbox">
                        <button id="sendbutton" class="sendbutton"
                            type="button" disabled>Submit</button>
                        <button class="closebutton"
                            type="button">Close</button>
                    </div>
                    <div id="messagebox">
                        <p>${message}</p>
                    </div>
                </div>
            </form>`;

        const form = document.createElement("div");
        form.className = "formbox";
        form.innerHTML = html;

        const suggestionInput = form.getElementsByClassName("suggestion")[0];
        suggestionInput.addEventListener("input", suggestionHandler, false);

        const sendButton = form.getElementsByClassName("sendbutton")[0];
        sendButton.addEventListener("click", sendHandler, false);

        const closeButton = form.getElementsByClassName("closebutton")[0];
        closeButton.addEventListener("click", closeHandler, false);

        return form;
    };
};

// Exports -------------------------------------------------------------------
export { createMap, createApp };
