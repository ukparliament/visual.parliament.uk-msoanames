// Handle start-up -----------------------------------------------------------

const handleLocation = () => {
    const acceptform = document.getElementById("acceptform");
    const acceptbutton = document.getElementById("acceptbutton");
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                acceptform.long.value = position.coords.longitude.toFixed(6);
                acceptform.lat.value = position.coords.latitude.toFixed(6);
                acceptbutton.innerHTML = "Go to my location";
            },
            (error) => {
                if (error.code == error.PERMISSION_DENIED) {
                    acceptbutton.innerHTML = "Continue";
                }
            },
            { maximumAge: 300000 }
        );
    }
};

const getQueryString = (param) => {
    const qs = window.location.search.substring(1);
    const v = qs.split("&");
    for (let i = 0; i < v.length; i++) {
        const p = v[i].split("=");
        if (p["0"] == param) return p["1"];
    }
    return null;
};

// Exports -------------------------------------------------------------------
export { handleLocation, getQueryString };
