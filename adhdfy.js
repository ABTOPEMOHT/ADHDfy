(async function GifManager() {
    if (!Spicetify.Platform || !Spicetify.Topbar || !Spicetify.PopupModal) {
        setTimeout(GifManager, 100);
        return;
    }

    if (!document.getElementById("gif-manager-style")) {
        const style = document.createElement("style");
        style.id = "gif-manager-style";
        style.innerHTML = `
            generic-modal .main-embedWidgetGenerator-container,
            generic-modal .main-trackCreditsModal-container {
                max-height: 85vh !important;
                display: flex !important;
                flex-direction: column !important;
            }
            generic-modal .main-trackCreditsModal-mainSection {
                overflow-y: auto !important;
                min-height: 0 !important;
            }
            generic-modal.gif-manager-info-active .os-scrollbar {
                display: none !important;
            }
            generic-modal.gif-manager-info-active *::-webkit-scrollbar {
                width: 0px !important;
                display: none !important;
            }
            .gif-manager-slider {
                -webkit-appearance: none;
                background: transparent;
            }
            .gif-manager-slider::-webkit-slider-runnable-track {
                height: 4px;
                border-radius: 2px;
                background: var(--spice-button-disabled);
            }
            .gif-manager-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                height: 12px;
                width: 12px;
                border-radius: 50%;
                background: var(--spice-button);
                cursor: pointer;
                margin-top: -4px;
                box-shadow: 0 0 5px rgba(0,0,0,0.2);
            }
            @keyframes gifManagerRainbow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            .gif-manager-rainbow-text {
                background: linear-gradient(90deg, #ff2a2a, #ff7a00, #ffc500, #43ea43, #0b96ff, #5e00ff, #d600ff);
                background-size: 200% 200%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: gifManagerRainbow 2s linear infinite;
                padding-bottom: 2px;
            }
            .adhdfy-info-btn {
                background: transparent;
                border: none;
                color: var(--spice-subtext);
                cursor: default;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 8px;
                position: relative;
                top: 1px;
                transition: color 0.15s, transform 0.15s;
            }

            .adhdfy-toast-container {
                position: fixed;
                top: 30px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 2147483647;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            }
            .adhdfy-toast {
                background: var(--spice-button);
                color: #000;
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: bold;
                font-size: 13px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.8);
                opacity: 0;
                transform: translateY(-20px);
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .adhdfy-toast--visible {
                opacity: 1;
                transform: translateY(0);
            }
            .adhdfy-toast--error {
                background: #e22134;
                color: #fff;
            }

            .adhdfy-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                backdrop-filter: blur(10px);
                -webkit-app-region: no-drag;
            }
            .adhdfy-dialog {
                background: var(--spice-main);
                padding: 30px;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                gap: 15px;
                text-align: center;
                min-width: 300px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.6);
            }
            .adhdfy-dialog-title {
                margin: 0;
                color: var(--spice-text);
                font-size: 22px;
                font-weight: bold;
            }
            .adhdfy-dialog-desc {
                margin: 0;
                color: var(--spice-subtext);
                font-size: 14px;
                line-height: 1.5;
            }
            .adhdfy-dialog-buttons {
                display: flex;
                gap: 15px;
                justify-content: flex-end;
                margin-top: 20px;
            }

            .adhdfy-btn {
                padding: 6px 10px;
                border-radius: 4px;
                border: none;
                cursor: pointer;
                font-size: 12px;
                transition: transform 0.1s ease;
            }
            .adhdfy-btn:hover {
                transform: scale(1.05);
            }
            .adhdfy-btn--primary {
                background: var(--spice-button);
                color: #000;
            }
            .adhdfy-btn--danger {
                background: #e91e63;
                color: white;
            }
            .adhdfy-btn--ghost {
                background: transparent;
                color: var(--spice-text);
            }
            .adhdfy-btn--secondary {
                background: var(--spice-card);
                color: var(--spice-text);
            }
            .adhdfy-btn--effects {
                background: linear-gradient(90deg, #ff2a2a, #ff7a00, #ffc500, #43ea43, #0b96ff, #5e00ff, #d600ff);
                color: white;
                font-weight: bold;
                text-shadow: 0 1px 3px rgba(0,0,0,0.8);
            }
            .adhdfy-btn--toggle {
                min-width: 30px;
                padding: 2px 5px;
            }
            .adhdfy-btn--lg {
                padding: 12px 24px;
                font-size: 14px;
                font-weight: bold;
            }
            .adhdfy-btn--md {
                padding: 10px 20px;
                font-size: 14px;
            }

            .adhdfy-input {
                padding: 8px;
                border-radius: 4px;
                border: 1px solid var(--spice-button-disabled);
                background: var(--spice-main);
                color: var(--spice-text);
            }
            .adhdfy-number-input {
                width: 45px;
                background: var(--spice-main);
                color: var(--spice-text);
                border: 1px solid var(--spice-button-disabled);
                border-radius: 4px;
                padding: 2px 4px;
                font-size: 12px;
            }
            .adhdfy-qty-input {
                width: 38px;
                background: var(--spice-main);
                color: var(--spice-text);
                border: 1px solid var(--spice-button-disabled);
                border-radius: 4px;
                padding: 2px 2px 2px 4px;
                font-size: 11px;
                text-align: center;
            }
            .adhdfy-color-input {
                width: 40%;
                height: 20px;
                border: none;
                padding: 0;
                background: transparent;
                cursor: pointer;
            }
            .adhdfy-slider-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 5px;
            }
            .adhdfy-slider-label {
                display: flex;
                align-items: center;
                gap: 5px;
                width: 55%;
            }
            .adhdfy-sliders-container {
                display: flex;
                flex-direction: column;
                gap: 6px;
                font-size: 12px;
                margin-top: 5px;
            }
            .adhdfy-speed-container {
                display: flex;
                align-items: center;
                gap: 5px;
                width: 40%;
            }

            .adhdfy-modal-content {
                display: flex;
                flex-direction: column;
                gap: 15px;
                color: var(--spice-text);
            }
            .adhdfy-preset-form {
                display: flex;
                gap: 10px;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 10px;
                border-bottom: 1px solid var(--spice-button-disabled);
            }
            .adhdfy-section-title {
                margin: 0;
                font-weight: bold;
            }
            .adhdfy-btn-group {
                display: flex;
                gap: 10px;
            }
            .adhdfy-manage-header-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-top: 5px;
            }
            .adhdfy-hr {
                border-color: var(--spice-button-disabled);
                width: 100%;
                margin: 0;
            }
            .adhdfy-header-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .adhdfy-list-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .adhdfy-info-content {
                color: var(--spice-text);
                display: none;
                flex-direction: column;
                gap: 10px;
                font-size: 14px;
            }

            .adhdfy-card {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 10px;
                background: var(--spice-card);
                border-radius: 8px;
                transition: outline 0.2s ease;
                outline: 2px solid transparent;
                outline-offset: -2px;
            }
            .adhdfy-card:hover {
                outline: 2px solid white;
            }
            .adhdfy-card-top {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .adhdfy-preview-img {
                width: 32px;
                height: 32px;
                object-fit: cover;
                border-radius: 4px;
                background: #000;
            }
            .adhdfy-card-preview {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .adhdfy-card-type {
                font-size: 13px;
                color: var(--spice-text);
            }
            .adhdfy-card-buttons {
                display: flex;
                gap: 5px;
                flex-wrap: wrap;
            }
            .adhdfy-effects-container {
                display: flex;
                flex-direction: column;
                gap: 6px;
                padding: 6px 0 0 0;
                font-size: 12px;
            }
            .adhdfy-empty-text {
                color: gray;
                margin: 0;
                font-size: 14px;
            }

            .adhdfy-cropper-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                backdrop-filter: blur(10px);
                gap: 20px;
                -webkit-app-region: no-drag;
            }
            .adhdfy-cropper-title {
                margin: 0;
                color: var(--spice-text);
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            }
            .adhdfy-cropper-preview {
                background: repeating-conic-gradient(#333 0% 25%, #111 0% 50%) 50% / 20px 20px;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.6);
            }
            .adhdfy-cropper-img-wrapper {
                position: relative;
                display: inline-block;
                line-height: 0;
                user-select: none;
            }
            .adhdfy-cropper-img {
                max-height: 60vh;
                max-width: 70vw;
                display: block;
            }
            .adhdfy-cropper-mask {
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                overflow: hidden;
                pointer-events: none;
            }
            .adhdfy-cropper-shadow {
                position: absolute;
                box-shadow: 0 0 0 9999px rgba(0,0,0,0.6);
            }
            .adhdfy-cropper-box {
                position: absolute;
                border: 2px dashed var(--spice-button);
                box-sizing: border-box;
                cursor: grab;
            }
            .adhdfy-cropper-handle {
                position: absolute;
                width: 14px;
                height: 14px;
                background: #fff;
                border: 2px solid var(--spice-button);
                border-radius: 50%;
                box-shadow: 0 0 4px rgba(0,0,0,0.5);
                z-index: 10;
            }
            .adhdfy-cropper-label {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 16px;
                font-weight: bold;
                text-shadow: 0 2px 4px black;
                pointer-events: none;
                white-space: nowrap;
            }

            .adhdfy-form-column {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .adhdfy-form-row {
                display: flex;
                gap: 10px;
            }
            .adhdfy-form-btn {
                padding: 8px 15px;
                border-radius: 4px;
                border: 1px solid var(--spice-button-disabled);
                background: var(--spice-card);
                color: var(--spice-text);
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .adhdfy-form-btn--primary {
                background: var(--spice-button);
                color: #000;
            }
            .adhdfy-add-btn {
                padding: 10px;
                border-radius: 8px;
                background: var(--spice-button);
                color: #000;
                font-weight: bold;
                cursor: pointer;
                border: none;
            }
            .adhdfy-tenor-container {
                display: none;
                flex-direction: column;
                gap: 10px;
                background: var(--spice-card);
                padding: 10px;
                border-radius: 8px;
                border: 1px solid var(--spice-button-disabled);
            }
            .adhdfy-tenor-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 5px;
                max-height: 250px;
                overflow-y: auto;
            }
            .adhdfy-tenor-load-more {
                display: none;
                padding: 8px;
                text-align: center;
                background: var(--spice-button);
                color: #000;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                margin-top: 5px;
                transition: all 0.2s ease;
            }
            .adhdfy-tenor-loading {
                display: none;
                text-align: center;
                color: var(--spice-subtext);
                font-size: 12px;
                padding: 5px;
            }
            .adhdfy-tenor-img {
                width: 100%;
                height: 80px;
                object-fit: cover;
                border-radius: 4px;
                cursor: pointer;
                transition: transform 0.2s ease;
            }
            .adhdfy-tenor-img:hover {
                transform: scale(1.05);
            }
            .adhdfy-tenor-no-results {
                grid-column: 1 / -1;
                text-align: center;
                color: var(--spice-subtext);
            }
            .adhdfy-tenor-error {
                grid-column: 1 / -1;
                text-align: center;
                color: #e22134;
            }

            .adhdfy-media-wrapper {
                position: fixed;
                z-index: 9999;
                line-height: 0;
                -webkit-app-region: no-drag;
            }
            .adhdfy-media-wrapper--clone {
                z-index: 9998;
                pointer-events: none;
            }
            .adhdfy-media-img {
                display: block;
                pointer-events: none;
            }
            .adhdfy-border-box {
                position: absolute;
                pointer-events: none;
                box-sizing: border-box;
                transition: outline 0.2s ease, box-shadow 0.2s ease;
            }
        `;
        document.head.appendChild(style);
    }

    const STORAGE_INDEX_KEY = "adhdfy-slot-index";
    const STORAGE_ACTIVE_KEY = "adhdfy-slot-active";
    const OLD_STORAGE_KEY = "MyCustomGifs";

    const GIF_DEFAULTS = {
        anchor: "[data-testid='now-playing-widget']",
        flipped: false,
        opacity: 1,
        rotation: 0,
        visible: true,
        tint: false,
        tintColor: "#e91e63",
        rainbow: false,
        rainbowSpeed: 5,
        spin: false,
        spinSpeed: 5,
        autoFlip: false,
        flipSpeed: 5,
        attachedToProgress: false,
        followMouse: false,
        dvdBounce: false,
        dvdSpeed: 5,
        rainFall: false,
        rainSpeed: 5,
        rainCount: 15,
        beatSync: false,
        beatSyncStrength: 5,
        crop: { t: 0, r: 0, b: 0, l: 0 }
    };

    // Migrate Legacy LocalStorage
    if (!Spicetify.LocalStorage.get(STORAGE_INDEX_KEY) && Spicetify.LocalStorage.get("adhdfy-layout")) {
        Spicetify.LocalStorage.set("adhdfy-layout-Default", Spicetify.LocalStorage.get("adhdfy-layout"));
        Spicetify.LocalStorage.set(STORAGE_INDEX_KEY, JSON.stringify(["Default"]));
        Spicetify.LocalStorage.set(STORAGE_ACTIVE_KEY, "Default");
        Spicetify.LocalStorage.remove("adhdfy-layout");
    } else if (!Spicetify.LocalStorage.get(STORAGE_INDEX_KEY)) {
        Spicetify.LocalStorage.set(STORAGE_INDEX_KEY, JSON.stringify(["Default"]));
        Spicetify.LocalStorage.set(STORAGE_ACTIVE_KEY, "Default");
    }

    let slotIndex = JSON.parse(Spicetify.LocalStorage.get(STORAGE_INDEX_KEY) || '["Default"]');
    let activeSlot = Spicetify.LocalStorage.get(STORAGE_ACTIVE_KEY) || "Default";

    console.log("ADHDfy v1.0.5.2 loaded");

    function applyDefaults(gif) {
        const result = { ...GIF_DEFAULTS, ...gif };
        if (gif.opacity === undefined) result.opacity = GIF_DEFAULTS.opacity;
        if (gif.visible === undefined) result.visible = GIF_DEFAULTS.visible;
        if (!gif.crop) result.crop = { ...GIF_DEFAULTS.crop };
        if (!result.id) result.id = Math.random().toString(36).substring(2, 10);
        return result;
    }

    function saveCurrentLayout() {
        Spicetify.LocalStorage.set(`adhdfy-layout-${activeSlot}`, JSON.stringify(savedGifs));
    }

    let savedGifs = JSON.parse(Spicetify.LocalStorage.get(`adhdfy-layout-${activeSlot}`) || "[]").map(applyDefaults);

    const PHYSICS = {
        DT_MAX: 3,
        FOLLOW_SMOOTHING: 0.982,
        FOLLOW_MAX_SPEED: 0.28,
        FOLLOW_MIN_SPEED: 0.09,
        FOLLOW_SPEED_DIVISOR: 40,
        FOLLOW_MOVE_THRESHOLD: 3,
        FOLLOW_STEP_ACCEL: 0.15,
        FOLLOW_STEP_DECAY: 0.60,
        FOLLOW_STEP_IDLE: 0.05,
        FOLLOW_STEP_EPSILON: 0.01,
        BOB_AMPLITUDE: 8,
        WOBBLE_ANGLE: 12,
        DVD_SPEED_MULT: 0.5,
        RAIN_SPEED_MULT: 1.5,
        RAIN_SPEED_RANGE: { min: 0.5, max: 1.5 },
        RAIN_ROT_RANGE: 5,
        RAIN_SCALE_RANGE: { min: 0.4, max: 1.2 },
        RAIN_SPAWN_JITTER: 200,
        RAINBOW_SPEED_MULT: 0.2,
        SPIN_SPEED_MULT: 0.3,
        FLIP_SPEED_MULT: 0.005,
        FLIP_SNAP_SMOOTHING: 0.85,
        TINT_SATURATE: 5,
        TINT_HUE_OFFSET: 40
    };

    function hexToHSL(hex) {
        const r = parseInt(hex.substr(1, 2), 16) / 255;
        const g = parseInt(hex.substr(3, 2), 16) / 255;
        const b = parseInt(hex.substr(5, 2), 16) / 255;
        const cmax = Math.max(r, g, b), cmin = Math.min(r, g, b), delta = cmax - cmin;
        let h = 0, s = 0, l = (cmax + cmin) / 2;
        if (delta !== 0) {
            s = delta / (1 - Math.abs(2 * l - 1));
            if (cmax === r) h = ((g - b) / delta) % 6;
            else if (cmax === g) h = (b - r) / delta + 2;
            else h = (r - g) / delta + 4;
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;
        return { h, s, l };
    }

    let renderedElements = [];
    let isEditMode = false;
    let globalMouseX = window.innerWidth / 2;
    let globalMouseY = window.innerHeight / 2;

    document.addEventListener("mousemove", (e) => {
        globalMouseX = e.clientX;
        globalMouseY = e.clientY;
    });

    const TOAST = {
        CONTAINER_ID: "gif-manager-toast-container",
        SHOW_DURATION: 3000,
        FADE_DURATION: 300
    };

    // Utility Functions

    function getMediaType(url) {
        if (!url) return "GIF";
        if (url.startsWith("data:")) {
            const mime = url.substring(5, url.indexOf(";"));
            if (mime.includes("image/webp")) return "WEBP";
            if (mime.includes("image/jpeg") || mime.includes("image/jpg")) return "JPG";
            if (mime.includes("image/png")) return "PNG";
            if (mime.includes("image/gif")) return "GIF";
            return "IMG";
        }
        const lowerUrl = url.toLowerCase().split('?')[0];
        if (lowerUrl.endsWith(".webp")) return "WEBP";
        if (lowerUrl.endsWith(".jpg") || lowerUrl.endsWith(".jpeg")) return "JPG";
        if (lowerUrl.endsWith(".png")) return "PNG";
        if (lowerUrl.endsWith(".gif")) return "GIF";
        return "IMG";
    }

    function createMediaElement(url) {
        const el = document.createElement("img");
        el.src = url;
        return el;
    }

    function getTransformString(flipped, rotation) {
        return (flipped ? 'scaleX(-1) ' : 'scaleX(1) ') + `rotate(${rotation}deg)`;
    }

    function showCustomNotification(message, isError = false) {
        let container = document.getElementById(TOAST.CONTAINER_ID);
        if (!container) {
            container = document.createElement("div");
            container.id = TOAST.CONTAINER_ID;
            container.className = "adhdfy-toast-container";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = isError ? "adhdfy-toast adhdfy-toast--error" : "adhdfy-toast";
        toast.innerText = message;
        container.appendChild(toast);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.add("adhdfy-toast--visible");
            });
        });

        setTimeout(() => {
            toast.classList.remove("adhdfy-toast--visible");
            setTimeout(() => {
                toast.remove();
                if (container.children.length === 0) {
                    container.remove();
                }
            }, TOAST.FADE_DURATION);
        }, TOAST.SHOW_DURATION);
    }

    function createMediaWrapper(gifData, isClone = false) {
        const wrapper = document.createElement("div");
        wrapper.className = isClone ? "adhdfy-media-wrapper adhdfy-media-wrapper--clone" : "adhdfy-media-wrapper";
        wrapper.style.opacity = gifData.opacity;
        wrapper.style.transform = getTransformString(gifData.flipped, gifData.rotation);
        if (!isClone) {
            wrapper.ondragstart = () => false;
            wrapper.dataset.dragging = "false";
        }

        const img = createMediaElement(gifData.url);
        img.style.width = `${gifData.size}px`;
        img.className = "adhdfy-media-img";

        if (!isClone) {
            img.onerror = () => {
                showCustomNotification("Failed to load Media", true);
                if (img.tagName === "IMG") {
                    img.src = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e91e63'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'/%3E%3C/svg%3E";
                }
            };
        }

        const cropContainer = document.createElement("div");
        cropContainer.style.width = "100%";
        cropContainer.style.height = "100%";
        cropContainer.style.overflow = "hidden";
        cropContainer.style.position = "absolute";
        cropContainer.style.top = "0";
        cropContainer.style.left = "0";

        cropContainer.appendChild(img);
        wrapper.appendChild(cropContainer);

        const borderBox = document.createElement("div");
        borderBox.className = "adhdfy-border-box";
        borderBox.style.top = "0";
        borderBox.style.left = "0";
        borderBox.style.width = "100%";
        borderBox.style.height = "100%";
        wrapper.appendChild(borderBox);

        return { wrapper, img, borderBox };
    }

    function setupEditMode(wrapper, borderBox, gifData) {
        wrapper.style.pointerEvents = "auto";
        wrapper.style.cursor = "grab";
        borderBox.style.outline = "2px dashed var(--spice-button)";
        borderBox.style.background = "rgba(255, 255, 255, 0.1)";

        wrapper.onmousedown = function (event) {
            event.preventDefault();
            wrapper.dataset.dragging = "true";
            wrapper.style.cursor = "grabbing";
            borderBox.style.transition = 'none';

            const activeModal = document.querySelector("generic-modal");
            if (activeModal) {
                activeModal.style.transition = "opacity 0.2s ease";
                activeModal.style.opacity = "0.2";
                activeModal.style.pointerEvents = "none";
            }

            let lastMouseX = event.clientX;
            let lastMouseY = event.clientY;

            function onMouseMove(event) {
                const currentLeft = parseFloat(wrapper.style.left) || 0;
                const currentTop = parseFloat(wrapper.style.top) || 0;

                const dx = event.clientX - lastMouseX;
                const dy = event.clientY - lastMouseY;

                lastMouseX = event.clientX;
                lastMouseY = event.clientY;

                wrapper.style.left = (currentLeft + dx) + 'px';
                wrapper.style.top = (currentTop + dy) + 'px';
                wrapper.style.bottom = 'auto';
            }

            document.addEventListener('mousemove', onMouseMove);

            document.onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove);
                wrapper.style.cursor = "grab";
                wrapper.dataset.dragging = "false";
                borderBox.style.transition = 'outline 0.2s ease, box-shadow 0.2s ease';

                if (activeModal) {
                    activeModal.style.opacity = "1";
                    activeModal.style.pointerEvents = "auto";
                }

                document.onmouseup = null;

                const anchorEl = document.querySelector(gifData.anchor) || document.body;
                const rect = anchorEl.getBoundingClientRect();

                const physicalLeft = parseFloat(wrapper.style.left);
                const physicalTop = parseFloat(wrapper.style.top);

                const imgCenterX = physicalLeft + (wrapper.offsetWidth / 2);
                const imgCenterY = physicalTop + (wrapper.offsetHeight / 2);

                gifData.xPct = (imgCenterX - rect.left) / (rect.width || 1);
                gifData.yPct = (imgCenterY - rect.top) / (rect.height || 1);

                saveCurrentLayout();
            };
        };

        if (gifData.attachedToProgress || gifData.followMouse || gifData.dvdBounce || gifData.rainFall) {
            wrapper.style.pointerEvents = "none";
            borderBox.style.outline = gifData.followMouse ? "2px solid #0b96ff" : (gifData.dvdBounce ? "2px solid #ffc500" : (gifData.rainFall ? "2px solid #a855f7" : "2px solid #1ed760"));
            wrapper.onmousedown = null;
        }
    }

    function renderGifs() {
        const oldStates = {};
        renderedElements.forEach(item => {
            const id = item.cloneId || item.data.id;
            if (id) {
                oldStates[id] = {
                    oldW: item.img.offsetWidth,
                    oldH: item.img.offsetHeight,
                    currentX: item.currentX,
                    currentY: item.currentY,
                    dvdVx: item.dvdVx,
                    dvdVy: item.dvdVy,
                    rainX: item.rainX,
                    rainY: item.rainY,
                    rainScale: item.rainScale,
                    rainRot: item.rainRot,
                    rainSpeedMult: item.rainSpeedMult,
                    rainRotSpeed: item.rainRotSpeed,
                    stepPhase: item.stepPhase,
                    stepAmp: item.stepAmp,
                    bobY: item.bobY,
                    wobbleRot: item.wobbleRot,
                    currentSpin: item.currentSpin,
                    currentHueOffset: item.currentHueOffset,
                    flipPhase: item.flipPhase,
                    currentScaleX: item.currentScaleX
                };
            }
        });

        renderedElements.forEach(item => item.img.remove());
        renderedElements = [];

        savedGifs.forEach((gifData) => {
            if (!gifData.id) {
                gifData.id = Math.random().toString(36).substring(2, 10);
            }
            const { wrapper, img, borderBox } = createMediaWrapper(gifData);

            if (isEditMode) {
                setupEditMode(wrapper, borderBox, gifData);
            } else {
                wrapper.style.pointerEvents = "none";
                borderBox.style.outline = "none";
                borderBox.style.background = "transparent";
                wrapper.onmousedown = null;
            }

            document.body.appendChild(wrapper);
            const stateObj = oldStates[gifData.id] || {};
            renderedElements.push({ img: wrapper, realImg: img, borderBox: borderBox, data: gifData, ...stateObj });

            if (gifData.rainFall) {
                const clonesCount = Math.max(0, (gifData.rainCount || 15) - 1);
                for (let i = 0; i < clonesCount; i++) {
                    const clone = createMediaWrapper(gifData, true);

                    document.body.appendChild(clone.wrapper);
                    const cloneId = gifData.id + "_clone" + i;
                    const cloneStateObj = oldStates[cloneId] || {};
                    renderedElements.push({ img: clone.wrapper, realImg: clone.img, borderBox: clone.borderBox, data: gifData, isRainClone: true, cloneId: cloneId, ...cloneStateObj });
                }
            }
        });

        trackAnchors(performance.now(), true);
    }

    // Animation Update Functions

    function updateFollowMouse(item, w, h, dt) {
        item.currentX = item.currentX !== undefined ? item.currentX : globalMouseX;
        item.currentY = item.currentY !== undefined ? item.currentY : globalMouseY;

        const dx = globalMouseX - item.currentX;
        const dy = globalMouseY - item.currentY;
        const dist = Math.hypot(dx, dy);

        item.currentX += dx * (1 - Math.pow(PHYSICS.FOLLOW_SMOOTHING, dt));
        item.currentY += dy * (1 - Math.pow(PHYSICS.FOLLOW_SMOOTHING, dt));

        if (dist > PHYSICS.FOLLOW_MOVE_THRESHOLD) {
            let curSpeed = Math.min(PHYSICS.FOLLOW_MAX_SPEED, (dist / PHYSICS.FOLLOW_SPEED_DIVISOR) * PHYSICS.FOLLOW_MAX_SPEED);
            if (curSpeed < PHYSICS.FOLLOW_MIN_SPEED) curSpeed = PHYSICS.FOLLOW_MIN_SPEED;
            item.stepPhase = (item.stepPhase || 0) + (curSpeed * dt);

            item.stepAmp = (item.stepAmp || 0) + PHYSICS.FOLLOW_STEP_ACCEL * dt;
            if (item.stepAmp > 1) item.stepAmp = 1;
        } else {
            if (item.stepAmp) {
                item.stepAmp *= Math.pow(PHYSICS.FOLLOW_STEP_DECAY, dt);
                if (item.stepAmp < PHYSICS.FOLLOW_STEP_EPSILON) item.stepAmp = 0;
                item.stepPhase += PHYSICS.FOLLOW_STEP_IDLE * dt;
            }
        }

        const amp = item.stepAmp || 0;
        item.bobY = amp ? -Math.abs(Math.sin(item.stepPhase)) * PHYSICS.BOB_AMPLITUDE * amp : 0;
        item.wobbleRot = amp ? Math.sin(item.stepPhase) * PHYSICS.WOBBLE_ANGLE * amp : 0;

        item.img.style.left = `${item.currentX - (w / 2)}px`;
        item.img.style.top = `${item.currentY - (h / 2)}px`;
        item.img.style.bottom = 'auto';
        item.img.style.display = "block";
    }

    function updateDvdBounce(item, w, h, dt) {
        item.currentX = item.currentX !== undefined ? item.currentX : window.innerWidth / 2;
        item.currentY = item.currentY !== undefined ? item.currentY : window.innerHeight / 2;

        const speed = (item.data.dvdSpeed || 5) * PHYSICS.DVD_SPEED_MULT;
        if (item.dvdVx === undefined) {
            item.dvdVx = (Math.random() > 0.5 ? speed : -speed);
            item.dvdVy = (Math.random() > 0.5 ? speed : -speed);
        } else {
            item.dvdVx = Math.sign(item.dvdVx || 1) * speed;
            item.dvdVy = Math.sign(item.dvdVy || 1) * speed;
        }

        item.currentX += item.dvdVx * dt;
        item.currentY += item.dvdVy * dt;

        const leftBound = w / 2;
        const rightBound = window.innerWidth - w / 2;
        const topBound = h / 2;
        const bottomBound = window.innerHeight - h / 2;

        if (item.currentX <= leftBound) { item.currentX = leftBound; item.dvdVx = Math.abs(item.dvdVx); }
        if (item.currentX >= rightBound) { item.currentX = rightBound; item.dvdVx = -Math.abs(item.dvdVx); }
        if (item.currentY <= topBound) { item.currentY = topBound; item.dvdVy = Math.abs(item.dvdVy); }
        if (item.currentY >= bottomBound) { item.currentY = bottomBound; item.dvdVy = -Math.abs(item.dvdVy); }

        item.img.style.left = `${item.currentX - w / 2}px`;
        item.img.style.top = `${item.currentY - h / 2}px`;
        item.img.style.bottom = 'auto';
        item.img.style.display = "block";
    }

    function updateRainFall(item, w, h, dt) {
        if (item.rainY === undefined) {
            item.rainX = Math.random() * window.innerWidth;
            item.rainY = -(Math.random() * window.innerHeight * 1.5);
            item.rainSpeedMult = PHYSICS.RAIN_SPEED_RANGE.min + Math.random();
            item.rainRotSpeed = (Math.random() - 0.5) * PHYSICS.RAIN_ROT_RANGE;
            item.rainRot = Math.random() * 360;
            item.rainScale = PHYSICS.RAIN_SCALE_RANGE.min + Math.random() * (PHYSICS.RAIN_SCALE_RANGE.max - PHYSICS.RAIN_SCALE_RANGE.min);
        }

        const speed = (item.data.rainSpeed || 5) * PHYSICS.RAIN_SPEED_MULT * item.rainSpeedMult;
        item.rainY += speed * dt;
        item.rainRot += item.rainRotSpeed * dt;

        const hScaled = h * item.rainScale;
        if (item.rainY > window.innerHeight + hScaled) {
            item.rainY = -hScaled - (Math.random() * PHYSICS.RAIN_SPAWN_JITTER);
            item.rainX = Math.random() * window.innerWidth;
            item.rainSpeedMult = PHYSICS.RAIN_SPEED_RANGE.min + Math.random();
            item.rainScale = PHYSICS.RAIN_SCALE_RANGE.min + Math.random() * (PHYSICS.RAIN_SCALE_RANGE.max - PHYSICS.RAIN_SCALE_RANGE.min);
        }

        item.img.style.left = `${item.currentX = item.rainX - (w / 2)}px`;
        item.img.style.top = `${item.currentY = item.rainY - (h / 2)}px`;
        item.img.style.bottom = 'auto';
        item.img.style.display = "block";

        item.currentScaleX = (item.data.flipped ? -1 : 1) * item.rainScale;
        item.currentSpin = item.rainRot;
    }

    function updateProgressAttach(item, w, h) {
        const progBar = document.querySelector('[data-testid="playback-progressbar"]') || document.querySelector('.playback-bar');
        if (progBar && Spicetify.Player && typeof Spicetify.Player.getDuration === "function" && Spicetify.Player.getDuration() > 0) {
            const progRect = progBar.getBoundingClientRect();
            const duration = Spicetify.Player.getDuration();
            const progress = Spicetify.Player.getProgress();

            let pct = progress / duration;
            if (pct < 0) pct = 0;
            if (pct > 1) pct = 1;

            const centerTargetX = progRect.left + (progRect.width * pct);
            const centerTargetY = progRect.top + (progRect.height / 2);

            item.img.style.left = `${centerTargetX - (w / 2)}px`;
            item.img.style.top = `${centerTargetY - (h / 2)}px`;
            item.img.style.bottom = 'auto';
            item.img.style.display = "block";
        } else {
            item.img.style.display = "none";
        }
    }

    function updateAnchorPosition(item, w, h) {
        const anchorEl = document.querySelector(item.data.anchor) || document.body;
        const rect = anchorEl.getBoundingClientRect();

        if (rect.width === 0) {
            item.img.style.display = "none";
        } else {
            item.img.style.display = "block";
            if (item.data.xPct !== undefined) {
                const centerTargetX = rect.left + (rect.width * item.data.xPct);
                const centerTargetY = rect.top + (rect.height * item.data.yPct);

                item.img.style.left = `${centerTargetX - (w / 2)}px`;
                item.img.style.top = `${centerTargetY - (h / 2)}px`;
                item.img.style.bottom = 'auto';
            } else {
                const screenLeft = rect.left + item.data.x;
                const screenBottom = (window.innerHeight - rect.bottom) + item.data.y;
                item.img.style.left = `${screenLeft}px`;
                item.img.style.bottom = `${screenBottom}px`;
                item.img.style.top = 'auto';
            }
        }
    }

    function updateVisualEffects(item, dt) {
        let filterStr = "";

        if (item.data.tint) {
            const hsl = hexToHSL(item.data.tintColor || "#e91e63");
            const saturate = hsl.s * PHYSICS.TINT_SATURATE;
            const brightness = hsl.l * 2;
            filterStr += `grayscale(1) sepia(1) saturate(${saturate}) hue-rotate(${hsl.h - PHYSICS.TINT_HUE_OFFSET}deg) brightness(${brightness}) `;
        }

        if (item.data.rainbow) {
            item.currentHueOffset = (item.currentHueOffset || 0) + ((item.data.rainbowSpeed || 5) * PHYSICS.RAINBOW_SPEED_MULT * dt);
            filterStr += `hue-rotate(${item.currentHueOffset}deg) `;
        } else {
            item.currentHueOffset = 0;
        }

        if (item.realImg) {
            item.realImg.style.filter = filterStr;
        } else {
            item.img.style.filter = filterStr;
        }

        if (item.data.spin) {
            item.currentSpin = (item.currentSpin || 0) + ((item.data.spinSpeed || 5) * PHYSICS.SPIN_SPEED_MULT * dt);
        } else {
            item.currentSpin = 0;
        }

        if (item.data.autoFlip) {
            item.flipPhase = (item.flipPhase || 0) + ((item.data.flipSpeed || 5) * PHYSICS.FLIP_SPEED_MULT * dt);
            item.currentScaleX = Math.cos(item.flipPhase);
            if (item.data.flipped) item.currentScaleX *= -1;
        } else {
            if (item.currentScaleX === undefined) item.currentScaleX = item.data.flipped ? -1 : 1;
            const targetScaleX = item.data.flipped ? -1 : 1;
            item.currentScaleX += (targetScaleX - item.currentScaleX) * (1 - Math.pow(PHYSICS.FLIP_SNAP_SMOOTHING, dt));
        }

        let beatScaleMult = 1;
        if (item.data.beatSync && globalBeatScale !== undefined) {
            const minStrength = 0.05;
            const strength = Math.max(minStrength, (item.data.beatSyncStrength || 5) * 0.05);
            beatScaleMult += (globalBeatScale * strength);
        }

        const rot = (item.data.rotation || 0) + (item.currentSpin || 0) + (item.wobbleRot || 0);
        const bobbing = item.bobY ? `translateY(${item.bobY}px) ` : "";
        item.img.style.transform = `${bobbing}scaleX(${item.currentScaleX * beatScaleMult}) scaleY(${beatScaleMult}) rotate(${rot}deg)`;
    }

    let currentAudioBeats = [];
    let currentBeatIndex = 0;

    async function fetchAudioBeats() {
        try {
            const uri = Spicetify.Player?.data?.item?.uri || Spicetify.Player?.data?.track?.uri;
            if (!uri || uri.includes("local")) {
                currentAudioBeats = [];
                return;
            }
            let data = null;
            if (typeof Spicetify.getAudioData === 'function') {
                data = await Spicetify.getAudioData(uri);
            } else {
                const id = uri.split(":")[2];
                data = await Spicetify.CosmosAsync.get(`wg://audio-attributes/v1/audio-analysis/${id}`);
            }
            currentAudioBeats = data?.beats || [];
            currentBeatIndex = 0;
        } catch (err) {
            currentAudioBeats = [];
        }
    }

    if (Spicetify.Player) {
        Spicetify.Player.addEventListener("songchange", fetchAudioBeats);
        fetchAudioBeats();
    }

    let lastTime = performance.now();
    let audioPulseValue = 0;
    let audioPulseVelocity = 0;
    let lastTrackedBeatIndex = -1;

    let lastFetchedUri = "";

    function trackAnchors(timestamp, isSyncUpdate = false) {
        if (!timestamp) timestamp = performance.now();
        let dt = (timestamp - lastTime) / (1000 / 60);
        if (dt > PHYSICS.DT_MAX) dt = PHYSICS.DT_MAX;
        if (dt < 0) dt = 0;
        lastTime = timestamp;

        if (Spicetify.Player) {
            const currentUri = Spicetify.Player.data?.item?.uri || Spicetify.Player.data?.track?.uri;
            if (currentUri && currentUri !== lastFetchedUri) {
                lastFetchedUri = currentUri;
                fetchAudioBeats();
            }
        }

        try {
            if (currentAudioBeats.length > 0 && Spicetify.Player) {
                const positionMs = Spicetify.Player.getProgress();
                const positionSec = positionMs / 1000;

                if (currentBeatIndex >= currentAudioBeats.length) currentBeatIndex = currentAudioBeats.length - 1;
                if (currentBeatIndex < 0) currentBeatIndex = 0;

                while (currentBeatIndex < currentAudioBeats.length - 1 && positionSec >= currentAudioBeats[currentBeatIndex].start + currentAudioBeats[currentBeatIndex].duration) {
                    currentBeatIndex++;
                }
                while (currentBeatIndex > 0 && positionSec < currentAudioBeats[currentBeatIndex].start) {
                    currentBeatIndex--;
                }

                if (currentBeatIndex >= currentAudioBeats.length) currentBeatIndex = currentAudioBeats.length - 1;

                const BEAT_LOOKAHEAD = 0.08;
                let targetBeatIndex = currentBeatIndex;

                if (currentBeatIndex < currentAudioBeats.length - 1) {
                    const nextBeat = currentAudioBeats[currentBeatIndex + 1];
                    if (positionSec >= nextBeat.start - BEAT_LOOKAHEAD) {
                        targetBeatIndex = currentBeatIndex + 1;
                    }
                }

                const targetBeat = currentAudioBeats[targetBeatIndex];
                if (targetBeat && positionSec >= targetBeat.start - BEAT_LOOKAHEAD) {
                    if (targetBeatIndex !== lastTrackedBeatIndex) {
                        lastTrackedBeatIndex = targetBeatIndex;
                        let conf = targetBeat.confidence || 0.5;
                        audioPulseVelocity += 0.5 + (conf * 0.5);
                    }
                }
            } else {
                lastTrackedBeatIndex = -1;
            }

            const springTension = 0.12;
            const springDamping = 0.5;

            const force = -springTension * audioPulseValue;
            audioPulseVelocity += force * dt;
            audioPulseVelocity *= Math.pow(springDamping, dt);
            audioPulseValue += audioPulseVelocity * dt;

            if (audioPulseValue < -0.2) audioPulseValue = -0.2;
            globalBeatScale = audioPulseValue;
        } catch (err) {
            console.error("ADHDfy: audio physics error", err);
            globalBeatScale = 0;
        }


        renderedElements.forEach(item => {
            try {
                if (item.data.visible === false) {
                    item.img.style.display = "none";
                    return;
                }

                if (item.img.style.display === "none") {
                    item.img.style.display = "block";
                }

                if (item.img.dataset.dragging === "true") return;

                const origW = item.data.size;
                const origH = item.realImg.offsetHeight;
                let w = origW;
                let h = origH;

                if (origH) {
                    const crop = item.data.crop || { t: 0, r: 0, b: 0, l: 0 };
                    const cropL_px = origW * (crop.l / 100);
                    const cropT_px = origH * (crop.t / 100);
                    const cropR_px = origW * (crop.r / 100);
                    const cropB_px = origH * (crop.b / 100);

                    w = origW - cropL_px - cropR_px;
                    h = origH - cropT_px - cropB_px;

                    item.img.style.width = `${w}px`;
                    item.img.style.height = `${h}px`;

                    item.realImg.style.marginLeft = `-${cropL_px}px`;
                    item.realImg.style.marginTop = `-${cropT_px}px`;
                } else {
                    w = item.img.offsetWidth || item.oldW || item.data.size;
                    h = item.img.offsetHeight || item.oldH || item.data.size;
                }

                item.bobY = 0;
                item.wobbleRot = 0;

                if (item.data.followMouse) {
                    updateFollowMouse(item, w, h, dt);
                } else if (item.data.dvdBounce) {
                    updateDvdBounce(item, w, h, dt);
                } else if (item.data.rainFall) {
                    updateRainFall(item, w, h, dt);
                } else if (item.data.attachedToProgress) {
                    updateProgressAttach(item, w, h);
                } else {
                    updateAnchorPosition(item, w, h);
                }

                updateVisualEffects(item, dt);
            } catch (err) {
                console.error("ADHDfy: trackAnchors render loop error for element", err);
            }
        });

        if (!isSyncUpdate) {
            requestAnimationFrame(trackAnchors);
        }
    }
    trackAnchors();

    // UI Helpers

    function createButton(text, variant = "primary") {
        const btn = document.createElement("button");
        btn.innerText = text;
        btn.className = `adhdfy-btn adhdfy-btn--${variant}`;
        return btn;
    }

    // Cropper Overlay

    function openCropperOverlay(gif, onSave) {
        const overlay = document.createElement("div");
        overlay.className = "adhdfy-cropper-overlay";

        const title = document.createElement("h2");
        title.innerText = "Drag edges and corners to crop";
        title.className = "adhdfy-cropper-title";

        const previewContainer = document.createElement("div");
        previewContainer.className = "adhdfy-cropper-preview";

        const imgWrapper = document.createElement("div");
        imgWrapper.className = "adhdfy-cropper-img-wrapper";

        const previewImg = createMediaElement(gif.url);
        previewImg.className = "adhdfy-cropper-img";
        previewImg.ondragstart = () => false;

        let tempCrop = { ...(gif.crop || { t: 0, r: 0, b: 0, l: 0 }) };

        const maskBox = document.createElement("div");
        maskBox.className = "adhdfy-cropper-mask";

        const shadowHole = document.createElement("div");
        shadowHole.className = "adhdfy-cropper-shadow";
        maskBox.appendChild(shadowHole);

        const cropBox = document.createElement("div");
        cropBox.className = "adhdfy-cropper-box";

        function createHandle(cursor, top, right, bottom, left) {
            const h = document.createElement("div");
            h.className = "adhdfy-cropper-handle";
            h.style.cursor = cursor;
            if (top !== null) h.style.top = top;
            if (right !== null) h.style.right = right;
            if (bottom !== null) h.style.bottom = bottom;
            if (left !== null) h.style.left = left;
            return h;
        }

        const tl = createHandle("nwse-resize", "-7px", null, null, "-7px");
        const tr = createHandle("nesw-resize", "-7px", "-7px", null, null);
        const bl = createHandle("nesw-resize", null, null, "-7px", "-7px");
        const br = createHandle("nwse-resize", null, "-7px", "-7px", null);

        const topEdge = createHandle("ns-resize", "-7px", "calc(50% - 7px)", null, null);
        const bottomEdge = createHandle("ns-resize", null, "calc(50% - 7px)", "-7px", null);
        const leftEdge = createHandle("ew-resize", "calc(50% - 7px)", null, null, "-7px");
        const rightEdge = createHandle("ew-resize", "calc(50% - 7px)", "-7px", null, null);

        [tl, tr, bl, br, topEdge, bottomEdge, leftEdge, rightEdge].forEach(h => cropBox.appendChild(h));

        const labelText = document.createElement("div");
        labelText.className = "adhdfy-cropper-label";
        cropBox.appendChild(labelText);

        cropBox.style.cursor = "grab";

        function updatePreview() {
            cropBox.style.top = `${tempCrop.t}%`;
            cropBox.style.bottom = `${tempCrop.b}%`;
            cropBox.style.left = `${tempCrop.l}%`;
            cropBox.style.right = `${tempCrop.r}%`;

            shadowHole.style.top = `${tempCrop.t}%`;
            shadowHole.style.bottom = `${tempCrop.b}%`;
            shadowHole.style.left = `${tempCrop.l}%`;
            shadowHole.style.right = `${tempCrop.r}%`;

            const nw = previewImg.naturalWidth || previewImg.videoWidth || 0;
            const nh = previewImg.naturalHeight || previewImg.videoHeight || 0;
            const pxW = Math.round(nw * (100 - tempCrop.l - tempCrop.r) / 100);
            const pxH = Math.round(nh * (100 - tempCrop.t - tempCrop.b) / 100);
            labelText.innerText = `${pxW} x ${pxH} px`;

            if ((100 - tempCrop.l - tempCrop.r) < 15 || (100 - tempCrop.t - tempCrop.b) < 15) {
                labelText.style.display = "none";
            } else {
                labelText.style.display = "block";
            }
        }

        previewImg.onload = updatePreview;
        previewImg.onloadeddata = updatePreview;

        imgWrapper.appendChild(previewImg);
        imgWrapper.appendChild(maskBox);
        imgWrapper.appendChild(cropBox);
        previewContainer.appendChild(imgWrapper);

        let activeHandle = null;
        let startCrop = null;
        let startMouseX = 0;
        let startMouseY = 0;

        cropBox.onmousedown = (e) => {
            if (e.target !== cropBox && e.target !== labelText) return;
            e.preventDefault();
            activeHandle = "move";
            startCrop = { ...tempCrop };
            startMouseX = e.clientX;
            startMouseY = e.clientY;
            cropBox.style.cursor = "grabbing";
        };

        function attachDrag(el, handleName) {
            el.onmousedown = (e) => {
                e.preventDefault();
                e.stopPropagation();
                activeHandle = handleName;
            };
        }

        attachDrag(tl, "tl"); attachDrag(tr, "tr"); attachDrag(bl, "bl"); attachDrag(br, "br");
        attachDrag(topEdge, "t"); attachDrag(bottomEdge, "b"); attachDrag(leftEdge, "l"); attachDrag(rightEdge, "r");

        const onMouseMove = (e) => {
            if (!activeHandle) return;
            const rect = imgWrapper.getBoundingClientRect();

            if (activeHandle === "move") {
                const dxPct = ((e.clientX - startMouseX) / rect.width) * 100;
                const dyPct = ((e.clientY - startMouseY) / rect.height) * 100;

                const cropW = 100 - startCrop.l - startCrop.r;
                const cropH = 100 - startCrop.t - startCrop.b;

                let newL = startCrop.l + dxPct;
                let newT = startCrop.t + dyPct;

                if (newL < 0) newL = 0;
                if (newT < 0) newT = 0;
                if (newL + cropW > 100) newL = 100 - cropW;
                if (newT + cropH > 100) newT = 100 - cropH;

                tempCrop.l = newL;
                tempCrop.r = 100 - newL - cropW;
                tempCrop.t = newT;
                tempCrop.b = 100 - newT - cropH;
            } else {
                let pctX = ((e.clientX - rect.left) / rect.width) * 100;
                let pctY = ((e.clientY - rect.top) / rect.height) * 100;

                pctX = Math.max(0, Math.min(100, pctX));
                pctY = Math.max(0, Math.min(100, pctY));

                if (activeHandle === "tl") {
                    tempCrop.l = Math.min(pctX, 100 - tempCrop.r - 2);
                    tempCrop.t = Math.min(pctY, 100 - tempCrop.b - 2);
                } else if (activeHandle === "tr") {
                    tempCrop.r = Math.min(100 - pctX, 100 - tempCrop.l - 2);
                    tempCrop.t = Math.min(pctY, 100 - tempCrop.b - 2);
                } else if (activeHandle === "bl") {
                    tempCrop.l = Math.min(pctX, 100 - tempCrop.r - 2);
                    tempCrop.b = Math.min(100 - pctY, 100 - tempCrop.t - 2);
                } else if (activeHandle === "br") {
                    tempCrop.r = Math.min(100 - pctX, 100 - tempCrop.l - 2);
                    tempCrop.b = Math.min(100 - pctY, 100 - tempCrop.t - 2);
                } else if (activeHandle === "t") {
                    tempCrop.t = Math.min(pctY, 100 - tempCrop.b - 2);
                } else if (activeHandle === "b") {
                    tempCrop.b = Math.min(100 - pctY, 100 - tempCrop.t - 2);
                } else if (activeHandle === "l") {
                    tempCrop.l = Math.min(pctX, 100 - tempCrop.r - 2);
                } else if (activeHandle === "r") {
                    tempCrop.r = Math.min(100 - pctX, 100 - tempCrop.l - 2);
                }
            }
            updatePreview();
        };

        const onMouseUp = () => {
            activeHandle = null;
            cropBox.style.cursor = "grab";
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        const btnContainer = document.createElement("div");
        btnContainer.className = "adhdfy-dialog-buttons";

        const cancelBtn = createButton("Cancel", "secondary");
        cancelBtn.classList.add("adhdfy-btn--md");
        cancelBtn.onclick = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            overlay.remove();
        };

        const saveBtn = createButton("Apply Crop", "primary");
        saveBtn.classList.add("adhdfy-btn--md");
        saveBtn.style.fontWeight = "bold";
        saveBtn.onclick = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            gif.crop = { ...tempCrop };
            overlay.remove();
            onSave();
        };

        btnContainer.appendChild(cancelBtn);
        btnContainer.appendChild(saveBtn);

        overlay.appendChild(title);
        overlay.appendChild(previewContainer);
        overlay.appendChild(btnContainer);
        document.body.appendChild(overlay);

        updatePreview();
    }

    // Modal DOM Factory


    let modalContent, presetForm, addForm, listContainer, mainModalContainer, infoContent;
    let toggleAllBtn, deleteAllBtn;

    function buildModalDOM() {
        modalContent = document.createElement("div");
        modalContent.className = "adhdfy-modal-content";

        presetForm = document.createElement("div");
        presetForm.className = "adhdfy-preset-form";

        const presetTitle = document.createElement("p");
        presetTitle.innerText = "Layouts:";
        presetTitle.className = "adhdfy-section-title";
        presetTitle.style.marginBottom = "0";

        const slotControls = document.createElement("div");
        slotControls.style.display = "flex";
        slotControls.style.gap = "5px";
        slotControls.style.alignItems = "center";
        slotControls.style.flexWrap = "wrap";

        const exportBtn = createButton("Save", "primary");
        exportBtn.onclick = () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedGifs, null, 2));
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", `adhdfy_${activeSlot}.json`);
            document.body.appendChild(dlAnchorElem);
            dlAnchorElem.click();
            dlAnchorElem.remove();
            showCustomNotification("Layout Exported!");
        };

        const importBtn = createButton("Load", "primary");
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json";
        fileInput.style.display = "none";

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    if (Array.isArray(parsed)) {
                        let newName = file.name.replace(/\.json$/i, "");

                        let counter = 1;
                        let baseName = newName;
                        while (slotIndex.includes(newName)) {
                            newName = `${baseName} (${counter})`;
                            counter++;
                        }

                        slotIndex.unshift(newName);
                        Spicetify.LocalStorage.set("adhdfy-slot-index", JSON.stringify(slotIndex));
                        activeSlot = newName;
                        Spicetify.LocalStorage.set("adhdfy-slot-active", activeSlot);

                        savedGifs = parsed;
                        saveCurrentLayout();
                        populateDropdown();
                        renderGifs();
                        updateListUI();
                        showCustomNotification(`Imported as: ${newName}`);
                    } else {
                        showCustomNotification("Invalid layout format.", true);
                    }
                } catch (err) {
                    showCustomNotification("Failed to parse JSON", true);
                }
            };
            reader.readAsText(file);
            fileInput.value = "";
        };
        importBtn.onclick = () => fileInput.click();

        const addSlotBtn = createButton("New", "primary");
        addSlotBtn.onclick = () => {
            const overlay = document.createElement("div");
            overlay.className = "adhdfy-overlay";
            const dialog = document.createElement("div");
            dialog.className = "adhdfy-dialog";

            const title = document.createElement("h2");
            title.innerText = "New Layout";
            title.className = "adhdfy-dialog-title";

            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Enter layout name...";
            input.className = "adhdfy-input";
            input.style.width = "100%";
            input.style.marginTop = "10px";

            const btnContainer = document.createElement("div");
            btnContainer.className = "adhdfy-dialog-buttons";

            const cancelBtn = createButton("Cancel", "ghost");
            cancelBtn.classList.add("adhdfy-btn--lg");
            cancelBtn.onclick = () => overlay.remove();

            const confirmBtn = createButton("Create", "primary");
            confirmBtn.classList.add("adhdfy-btn--lg");
            confirmBtn.onclick = () => {
                let name = input.value.trim();
                if (!name) return;
                if (slotIndex.includes(name)) {
                    showCustomNotification("Layout name already exists!", true);
                    return;
                }
                slotIndex.push(name);
                Spicetify.LocalStorage.set("adhdfy-slot-index", JSON.stringify(slotIndex));
                activeSlot = name;
                Spicetify.LocalStorage.set("adhdfy-slot-active", activeSlot);
                saveCurrentLayout();
                populateDropdown();
                showCustomNotification(`Switched to new layout: ${name}`);
                overlay.remove();
            };

            btnContainer.appendChild(cancelBtn);
            btnContainer.appendChild(confirmBtn);
            dialog.appendChild(title);
            dialog.appendChild(input);
            dialog.appendChild(btnContainer);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            requestAnimationFrame(() => input.focus());
        };

        const slotDropdown = document.createElement("select");
        slotDropdown.className = "adhdfy-input";
        slotDropdown.style.padding = "4px 8px";
        slotDropdown.style.boxSizing = "border-box";
        slotDropdown.style.height = "31px";
        slotDropdown.style.fontSize = "12px";
        slotDropdown.style.width = "225px";

        function populateDropdown() {
            slotDropdown.innerHTML = "";
            slotIndex.forEach(slot => {
                const opt = document.createElement("option");
                opt.value = slot;
                opt.innerText = slot;
                if (slot === activeSlot) opt.selected = true;
                slotDropdown.appendChild(opt);
            });
        }
        populateDropdown();

        slotDropdown.onchange = (e) => {
            activeSlot = e.target.value;
            Spicetify.LocalStorage.set("adhdfy-slot-active", activeSlot);
            savedGifs = JSON.parse(Spicetify.LocalStorage.get(`adhdfy-layout-${activeSlot}`) || "[]").map(applyDefaults);
            renderGifs();
            updateListUI();
        };

        const renameSlotBtn = createButton("Rename", "primary");
        renameSlotBtn.onclick = () => {
            const overlay = document.createElement("div");
            overlay.className = "adhdfy-overlay";
            const dialog = document.createElement("div");
            dialog.className = "adhdfy-dialog";

            const title = document.createElement("h2");
            title.innerText = "Rename Layout";
            title.className = "adhdfy-dialog-title";

            const input = document.createElement("input");
            input.type = "text";
            input.value = activeSlot;
            input.className = "adhdfy-input";
            input.style.width = "100%";
            input.style.marginTop = "10px";

            const btnContainer = document.createElement("div");
            btnContainer.className = "adhdfy-dialog-buttons";

            const cancelBtn = createButton("Cancel", "ghost");
            cancelBtn.classList.add("adhdfy-btn--lg");
            cancelBtn.onclick = () => overlay.remove();

            const confirmBtn = createButton("Rename", "primary");
            confirmBtn.classList.add("adhdfy-btn--lg");
            confirmBtn.onclick = () => {
                let newName = input.value.trim();
                if (!newName || newName === activeSlot) {
                    overlay.remove();
                    return;
                }
                if (slotIndex.includes(newName)) {
                    showCustomNotification("Layout name already exists!", true);
                    return;
                }

                const layoutData = Spicetify.LocalStorage.get(`adhdfy-layout-${activeSlot}`);
                Spicetify.LocalStorage.set(`adhdfy-layout-${newName}`, layoutData || "[]");
                Spicetify.LocalStorage.remove(`adhdfy-layout-${activeSlot}`);

                const activeIdx = slotIndex.indexOf(activeSlot);
                if (activeIdx !== -1) {
                    slotIndex[activeIdx] = newName;
                } else {
                    slotIndex.push(newName);
                }

                Spicetify.LocalStorage.set("adhdfy-slot-index", JSON.stringify(slotIndex));
                activeSlot = newName;
                Spicetify.LocalStorage.set("adhdfy-slot-active", activeSlot);

                populateDropdown();
                showCustomNotification(`Renamed to: ${newName}`);
                overlay.remove();
            };

            btnContainer.appendChild(cancelBtn);
            btnContainer.appendChild(confirmBtn);
            dialog.appendChild(title);
            dialog.appendChild(input);
            dialog.appendChild(btnContainer);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            requestAnimationFrame(() => {
                input.focus();
                input.select();
            });
        };

        const deleteSlotBtn = createButton("Delete", "danger");
        deleteSlotBtn.onclick = () => {
            if (slotIndex.length <= 1) {
                showCustomNotification("Cannot delete the last layout!", true);
                return;
            }

            const overlay = document.createElement("div");
            overlay.className = "adhdfy-overlay";
            const dialog = document.createElement("div");
            dialog.className = "adhdfy-dialog";

            const title = document.createElement("h2");
            title.innerText = "Delete Layout?";
            title.className = "adhdfy-dialog-title";

            const desc = document.createElement("p");
            desc.innerText = `Are you sure you want to delete '${activeSlot}' forever?\nThis action cannot be undone.`;
            desc.className = "adhdfy-dialog-desc";

            const btnContainer = document.createElement("div");
            btnContainer.className = "adhdfy-dialog-buttons";

            const cancelBtn = createButton("Cancel", "ghost");
            cancelBtn.classList.add("adhdfy-btn--lg");
            cancelBtn.onclick = () => overlay.remove();

            const confirmBtn = createButton("Delete", "danger");
            confirmBtn.classList.add("adhdfy-btn--lg");
            confirmBtn.onclick = () => {
                Spicetify.LocalStorage.remove(`adhdfy-layout-${activeSlot}`);
                slotIndex = slotIndex.filter(s => s !== activeSlot);
                Spicetify.LocalStorage.set("adhdfy-slot-index", JSON.stringify(slotIndex));
                activeSlot = slotIndex[0];
                Spicetify.LocalStorage.set("adhdfy-slot-active", activeSlot);
                savedGifs = JSON.parse(Spicetify.LocalStorage.get(`adhdfy-layout-${activeSlot}`) || "[]").map(applyDefaults);
                populateDropdown();
                renderGifs();
                updateListUI();
                overlay.remove();
            };

            btnContainer.appendChild(cancelBtn);
            btnContainer.appendChild(confirmBtn);
            dialog.appendChild(title);
            dialog.appendChild(desc);
            dialog.appendChild(btnContainer);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
        };

        slotControls.appendChild(exportBtn);
        slotControls.appendChild(importBtn);
        slotControls.appendChild(fileInput);
        slotControls.appendChild(addSlotBtn);
        slotControls.appendChild(slotDropdown);
        slotControls.appendChild(renameSlotBtn);
        slotControls.appendChild(deleteSlotBtn);

        presetForm.appendChild(presetTitle);
        presetForm.appendChild(slotControls);

        addForm = document.createElement("div");
        addForm.innerHTML = `
            <div class="adhdfy-form-column">
                <p class="adhdfy-section-title">Add new Image (URL, Local File, or Search):</p>
                <div class="adhdfy-form-row">
                    <input id="gif-url" type="text" placeholder="Paste direct link (URL)..." class="adhdfy-input" style="flex: 1;">
                    <button id="search-gif-btn" class="adhdfy-form-btn">Search GIFs</button>
                    <button id="browse-file-btn" class="adhdfy-form-btn">Browse File</button>
                </div>
                <div id="tenor-search-container" class="adhdfy-tenor-container">
                    <div class="adhdfy-form-row" style="gap: 5px;">
                        <input id="tenor-search-input" type="text" placeholder="Type to search GIFs and press Enter..." class="adhdfy-input" style="flex: 1; box-sizing: border-box;">
                        <button id="tenor-execute-btn" class="adhdfy-form-btn adhdfy-form-btn--primary">Search</button>
                    </div>
                    <div id="tenor-results-grid" class="adhdfy-tenor-grid"></div>
                    <div id="tenor-load-more" class="adhdfy-tenor-load-more">Load More</div>
                    <div id="tenor-loading" class="adhdfy-tenor-loading">Searching...</div>
                </div>
                <input id="file-input-hidden" type="file" accept="image/*" style="display: none;">
                <div class="adhdfy-form-row">
                    <input id="gif-size" type="number" placeholder="Size (px, default: 50)" class="adhdfy-input" style="width: 100%;">
                </div>
                <button id="add-gif-btn" class="adhdfy-add-btn">Add</button>
            </div>
        `;

        const manageHeaderContainer = document.createElement("div");
        manageHeaderContainer.className = "adhdfy-manage-header-container";

        const hr = document.createElement("hr");
        hr.className = "adhdfy-hr";

        const manageHeader = document.createElement("div");
        manageHeader.className = "adhdfy-header-row";

        const manageTitle = document.createElement("p");
        manageTitle.innerText = "Manage GIFs:";
        manageTitle.className = "adhdfy-section-title";

        toggleAllBtn = createButton("Hide All", "primary");
        toggleAllBtn.onclick = () => {
            const anyVisible = savedGifs.some(g => g.visible);
            savedGifs.forEach(g => g.visible = !anyVisible);
            saveCurrentLayout();
            renderGifs();
            updateListUI();
        };

        deleteAllBtn = createButton("Delete All", "danger");
        deleteAllBtn.onclick = () => {
            const overlay = document.createElement("div");
            overlay.className = "adhdfy-overlay";

            const dialog = document.createElement("div");
            dialog.className = "adhdfy-dialog";

            const title = document.createElement("h2");
            title.innerText = "Delete All GIFs?";
            title.className = "adhdfy-dialog-title";

            const desc = document.createElement("p");
            desc.innerText = "Are you sure you want to delete all GIFs?\nThis action cannot be undone.";
            desc.className = "adhdfy-dialog-desc";

            const btnContainer = document.createElement("div");
            btnContainer.className = "adhdfy-dialog-buttons";

            const cancelBtn = createButton("Cancel", "ghost");
            cancelBtn.classList.add("adhdfy-btn--lg");
            cancelBtn.onclick = () => overlay.remove();

            const confirmBtn = createButton("Delete", "danger");
            confirmBtn.classList.add("adhdfy-btn--lg");
            confirmBtn.onclick = () => {
                savedGifs = [];
                saveCurrentLayout();
                renderGifs();
                updateListUI();
                overlay.remove();
            };

            btnContainer.appendChild(cancelBtn);
            btnContainer.appendChild(confirmBtn);

            dialog.appendChild(title);
            dialog.appendChild(desc);
            dialog.appendChild(btnContainer);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
        };

        const headerButtons = document.createElement("div");
        headerButtons.className = "adhdfy-btn-group";
        headerButtons.appendChild(toggleAllBtn);
        headerButtons.appendChild(deleteAllBtn);

        manageHeader.appendChild(manageTitle);
        manageHeader.appendChild(headerButtons);
        manageHeaderContainer.appendChild(hr);
        manageHeaderContainer.appendChild(manageHeader);

        listContainer = document.createElement("div");
        listContainer.id = "gif-list-container";
        listContainer.className = "adhdfy-list-container";

        modalContent.appendChild(presetForm);
        modalContent.appendChild(addForm);
        modalContent.appendChild(manageHeaderContainer);
        modalContent.appendChild(listContainer);

        mainModalContainer = document.createElement("div");
        mainModalContainer.appendChild(modalContent);

        infoContent = document.createElement("div");
        infoContent.className = "adhdfy-info-content";

        infoContent.innerHTML = `
            <p style="margin: 0;">Add your gifs or images by pasting a link, uploading a local file, or searching gifs with Tenor.</p>
            <p style="margin: 0;"><strong>Important:</strong> Local uploads have a strict 2.5MB limit due to Spotify constraints. For unlimited file sizes, it's best to add your media using direct links or the search tool instead.</p>
            <p style="margin: 0;">Once added, you can move the images anywhere on the screen by dragging them around while this menu is open.</p>
            <p style="margin: 0;">Tweak the look with sliders to adjust the size, opacity, and rotation of your media.</p>
            <p style="margin: 0;">Use the buttons to easily hide, crop, flip, duplicate, or delete your items.</p>
            <p style="margin: 0;">Turn on motion effects like Rainbow, Auto-Spin, DVD Bounce, Prog Bar tracking, or Rain Fall.</p>
            <p style="margin: 0;">Save your custom layout as a file to share or import it back later.</p>
            <p style="margin-top: 20px; margin-bottom: 0;">handcrafted with love by <a href="https://github.com/ABTOPEMOHT" target="_blank" style="color: var(--spice-button); text-decoration: none; font-weight: bold;">АВТOРЕМОНТ</a></p>
        `;

        mainModalContainer.appendChild(infoContent);
    }


    // Card UI Factories

    function createSlider(label, min, max, step, value, unit, onChange) {
        const wrapper = document.createElement("div");
        wrapper.className = "adhdfy-slider-row";

        const labelContainer = document.createElement("div");
        labelContainer.className = "adhdfy-slider-label";

        const labelText = document.createElement("span");
        labelText.innerText = `${label}:`;

        const numberInput = document.createElement("input");
        numberInput.type = "number";
        numberInput.min = min;
        numberInput.max = max;
        numberInput.step = step;
        numberInput.value = value;
        numberInput.className = "adhdfy-number-input";

        const unitText = document.createElement("span");
        unitText.innerText = unit;

        labelContainer.appendChild(labelText);
        labelContainer.appendChild(numberInput);
        labelContainer.appendChild(unitText);

        const rangeSlider = document.createElement("input");
        rangeSlider.type = "range";
        rangeSlider.min = min;
        rangeSlider.max = max;
        rangeSlider.step = step;
        rangeSlider.value = value;
        rangeSlider.className = "gif-manager-slider";
        rangeSlider.style.width = "40%";

        const updateValue = (newVal) => {
            let parsed = parseFloat(newVal);
            if (isNaN(parsed)) return;
            if (parsed < min) parsed = min;
            if (parsed > max) parsed = max;

            rangeSlider.value = parsed;
            numberInput.value = parsed;
            onChange(parsed);
        };

        rangeSlider.oninput = (e) => updateValue(e.target.value);
        numberInput.onchange = (e) => updateValue(e.target.value);

        wrapper.appendChild(labelContainer);
        wrapper.appendChild(rangeSlider);
        return wrapper;
    }

    function createEffectToggle(gif, title, isColorPicker, activeField, speedField, qtyField = null) {
        const wrapper = document.createElement("div");
        wrapper.className = "adhdfy-slider-row";

        const leftContainer = document.createElement("div");
        leftContainer.className = "adhdfy-slider-label";

        const labelText = document.createElement("span");
        labelText.innerText = `${title}:`;

        let isActive = gif[activeField];
        const toggleBtn = createButton(isActive ? "ON" : "OFF", "primary");
        toggleBtn.classList.add("adhdfy-btn--toggle");
        if (!isActive) {
            toggleBtn.style.background = "var(--spice-button-disabled)";
            toggleBtn.style.color = "var(--spice-text)";
        }

        toggleBtn.onclick = (e) => {
            e.preventDefault();

            const exclusives = ["attachedToProgress", "followMouse", "dvdBounce", "rainFall"];
            if (exclusives.includes(activeField)) {
                if (!gif[activeField]) {
                    if (activeField === "attachedToProgress" || activeField === "followMouse") {
                        savedGifs.forEach(g => g[activeField] = false);
                    }
                    exclusives.forEach(ef => gif[ef] = false);
                    gif[activeField] = true;
                } else {
                    gif[activeField] = false;
                }
                saveCurrentLayout();
                renderGifs();
                setTimeout(() => { updateListUI(); }, 10);
                return;
            }

            isActive = !isActive;
            gif[activeField] = isActive;
            toggleBtn.innerText = isActive ? "ON" : "OFF";
            toggleBtn.style.background = isActive ? "var(--spice-button)" : "var(--spice-button-disabled)";
            toggleBtn.style.color = isActive ? "#000" : "var(--spice-text)";
            saveCurrentLayout();
        };

        leftContainer.appendChild(labelText);
        leftContainer.appendChild(toggleBtn);

        if (qtyField) {
            const qtyInput = document.createElement("input");
            qtyInput.type = "number";
            qtyInput.min = "1";
            qtyInput.max = "150";
            qtyInput.value = gif[qtyField] || 15;
            qtyInput.className = "adhdfy-qty-input";

            qtyInput.onchange = (e) => {
                gif[qtyField] = parseInt(e.target.value) || 15;
                saveCurrentLayout();
                if (gif[activeField]) renderGifs();
            };
            leftContainer.appendChild(qtyInput);
        }

        wrapper.appendChild(leftContainer);

        if (isColorPicker) {
            const colorInput = document.createElement("input");
            colorInput.type = "color";
            colorInput.value = gif.tintColor || "#e91e63";
            colorInput.className = "adhdfy-color-input";

            colorInput.oninput = (e) => {
                gif.tintColor = e.target.value;
                if (!isActive) {
                    isActive = true;
                    gif[activeField] = true;
                    toggleBtn.innerText = "ON";
                    toggleBtn.style.background = "var(--spice-button)";
                    toggleBtn.style.color = "#000";
                }
                saveCurrentLayout();
            };
            wrapper.appendChild(colorInput);
        } else if (speedField) {
            const rightContainer = document.createElement("div");
            rightContainer.className = "adhdfy-speed-container";

            const slider = document.createElement("input");
            slider.type = "range";
            slider.min = "1";
            slider.max = "30";
            slider.step = "1";
            slider.value = (gif[speedField] !== undefined) ? gif[speedField] : 5;
            slider.className = "gif-manager-slider";
            slider.style.flex = "1 1 100%";

            slider.oninput = (e) => {
                gif[speedField] = parseInt(e.target.value);
                saveCurrentLayout();
            };
            rightContainer.appendChild(slider);
            wrapper.appendChild(rightContainer);
        }

        return wrapper;
    }

    function createGifCard(gif, index) {
        const item = document.createElement("div");
        item.className = "adhdfy-card";

        item.onmouseenter = () => {
            renderedElements.filter(el => el.data === gif).forEach(element => {
                if (element.borderBox) {
                    element.borderBox.dataset.prevOutline = element.borderBox.style.outline;
                    element.borderBox.style.outline = "4px solid white";
                    element.borderBox.style.boxShadow = "0 0 15px white";
                }
            });
        };

        item.onmouseleave = () => {
            renderedElements.filter(el => el.data === gif).forEach(element => {
                if (element.borderBox) {
                    element.borderBox.style.outline = element.borderBox.dataset.prevOutline || "none";
                    element.borderBox.style.boxShadow = "none";
                }
            });
        };

        const topRow = document.createElement("div");
        topRow.className = "adhdfy-card-top";

        const previewImg = createMediaElement(gif.url);
        previewImg.className = "adhdfy-preview-img";
        previewImg.style.transform = getTransformString(gif.flipped, gif.rotation);
        if (gif.crop && (gif.crop.t > 0 || gif.crop.r > 0 || gif.crop.b > 0 || gif.crop.l > 0)) {
            previewImg.style.clipPath = `inset(${gif.crop.t}% ${gif.crop.r}% ${gif.crop.b}% ${gif.crop.l}%)`;
        }

        const previewContainer = document.createElement("div");
        previewContainer.className = "adhdfy-card-preview";
        previewContainer.appendChild(previewImg);

        const type = getMediaType(gif.url);
        const textInfo = document.createElement("div");
        textInfo.className = "adhdfy-card-type";
        textInfo.innerText = `${type} #${index + 1}`;
        previewContainer.appendChild(textInfo);

        const buttonGroup = document.createElement("div");
        buttonGroup.className = "adhdfy-card-buttons";

        const visBtn = createButton(gif.visible ? "Hide" : "Show", "primary");
        visBtn.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            gif.visible = !gif.visible;
            saveCurrentLayout();
            visBtn.innerText = gif.visible ? "Hide" : "Show";
            updateListUI();
        };

        const cropBtn = createButton("Crop", "primary");
        cropBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            openCropperOverlay(gif, () => {
                saveCurrentLayout();
                renderGifs();
                updateListUI();
            });
        };

        const flipBtn = createButton("Flip", "primary");
        flipBtn.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            gif.flipped = !gif.flipped;
            saveCurrentLayout();

            renderedElements.filter(el => el.data === gif).forEach(element => {
                element.img.style.transform = getTransformString(gif.flipped, gif.rotation);
            });
            previewImg.style.transform = getTransformString(gif.flipped, gif.rotation);
        };

        const duplicateBtn = createButton("Duplicate", "primary");
        duplicateBtn.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();

            const clonedGif = { ...gif };
            clonedGif.id = Math.random().toString(36).substring(2, 10);
            clonedGif.xPct = Math.min(0.95, clonedGif.xPct + 0.05);
            clonedGif.yPct = Math.min(0.95, clonedGif.yPct + 0.05);

            savedGifs.splice(index + 1, 0, clonedGif);
            saveCurrentLayout();

            renderGifs();
            setTimeout(() => { updateListUI(); }, 10);
        };

        const resetBtn = createButton("Reset", "primary");
        resetBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            const el = renderedElements.find(i => i.data === gif);
            if (el && el.img) {
                el.currentSpin = 0;
                el.currentHueOffset = 0;
                el.flipPhase = 0;
            }

            const { url, xPct, yPct, anchor, id } = gif;
            Object.assign(gif, GIF_DEFAULTS, { url, xPct, yPct, anchor, id, size: 50, crop: { ...GIF_DEFAULTS.crop } });
            saveCurrentLayout();

            renderGifs();
            setTimeout(() => { updateListUI(); }, 10);
        };

        const deleteBtn = createButton("Delete", "danger");
        deleteBtn.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();

            savedGifs.splice(index, 1);
            saveCurrentLayout();
            renderGifs();

            setTimeout(() => { updateListUI(); }, 10);
        };

        const effectsBtn = createButton("Effects", "effects");

        [effectsBtn, visBtn, cropBtn, flipBtn, duplicateBtn, resetBtn, deleteBtn].forEach(b => buttonGroup.appendChild(b));

        topRow.appendChild(previewContainer);
        topRow.appendChild(buttonGroup);

        const slidersContainer = document.createElement("div");
        slidersContainer.className = "adhdfy-sliders-container";

        const sizeSlider = createSlider("Size", 10, 500, 1, gif.size, "px",
            (val) => {
                gif.size = parseInt(val);
                saveCurrentLayout();
                renderedElements.filter(el => el.data === gif).forEach(el => {
                    if (el.realImg) el.realImg.style.width = `${val}px`;
                    else el.img.style.width = `${val}px`;
                });
            }
        );

        const currentOpacityPercent = Math.round(gif.opacity * 100);
        const opacitySlider = createSlider("Opacity", 10, 100, 1, currentOpacityPercent, "%",
            (val) => {
                const decimalVal = parseFloat(val) / 100;
                gif.opacity = decimalVal;
                saveCurrentLayout();
                renderedElements.filter(el => el.data === gif).forEach(el => el.img.style.opacity = decimalVal);
            }
        );

        const rotationSlider = createSlider("Rotation", 0, 360, 1, gif.rotation, "°",
            (val) => {
                gif.rotation = parseInt(val);
                saveCurrentLayout();
                renderedElements.filter(el => el.data === gif).forEach(el => {
                    el.img.style.transform = getTransformString(gif.flipped, gif.rotation);
                });
                previewImg.style.transform = getTransformString(gif.flipped, gif.rotation);
            }
        );

        slidersContainer.appendChild(sizeSlider);
        slidersContainer.appendChild(opacitySlider);
        slidersContainer.appendChild(rotationSlider);

        const effectsContainer = document.createElement("div");
        effectsContainer.className = "adhdfy-effects-container";
        effectsContainer.style.display = gif.uiEffectsOpen ? "flex" : "none";
        effectsBtn.onclick = (e) => {
            e.preventDefault();
            gif.uiEffectsOpen = !gif.uiEffectsOpen;
            effectsContainer.style.display = gif.uiEffectsOpen ? "flex" : "none";
        };

        effectsContainer.appendChild(createEffectToggle(gif, "Color", true, "tint", "tintColor"));
        effectsContainer.appendChild(createEffectToggle(gif, "Rainbow", false, "rainbow", "rainbowSpeed"));
        effectsContainer.appendChild(createEffectToggle(gif, "Auto-Spin", false, "spin", "spinSpeed"));
        effectsContainer.appendChild(createEffectToggle(gif, "3D Flip", false, "autoFlip", "flipSpeed"));

        effectsContainer.appendChild(createEffectToggle(gif, "Beat Sync", false, "beatSync", "beatSyncStrength"));

        effectsContainer.appendChild(createEffectToggle(gif, "DVD Bounce", false, "dvdBounce", "dvdSpeed"));
        effectsContainer.appendChild(createEffectToggle(gif, "Follow Mouse", false, "followMouse", null));
        effectsContainer.appendChild(createEffectToggle(gif, "Prog Bar", false, "attachedToProgress", null));
        effectsContainer.appendChild(createEffectToggle(gif, "Rain Fall", false, "rainFall", "rainSpeed", "rainCount"));

        item.appendChild(topRow);
        item.appendChild(slidersContainer);
        item.appendChild(effectsContainer);
        return item;
    }

    function updateListUI() {
        listContainer.innerHTML = "";

        if (savedGifs.length === 0) {
            listContainer.innerHTML = "<p class='adhdfy-empty-text'>Empty for now. Add your first GIF above!</p>";
            toggleAllBtn.style.display = "none";
            deleteAllBtn.style.display = "none";
            return;
        }

        toggleAllBtn.style.display = "block";
        deleteAllBtn.style.display = "block";
        const anyVisible = savedGifs.some(g => g.visible);
        toggleAllBtn.innerText = anyVisible ? "Hide All" : "Show All";

        savedGifs.forEach((gif, index) => {
            listContainer.appendChild(createGifCard(gif, index));
        });
    }

    // Modal Lifecycle

    function toggleInfo() {
        const isInfoVisible = infoContent.style.display === "flex";

        if (isInfoVisible) {
            infoContent.style.display = "none";
            modalContent.style.display = "flex";
            isEditMode = true;

            const modal = document.querySelector("generic-modal");
            if (modal) {
                modal.classList.remove("gif-manager-info-active");
                const titleEl = modal.querySelector("h1");
                if (titleEl && titleEl.dataset.originalHTML) {
                    titleEl.innerHTML = titleEl.dataset.originalHTML;

                    const versionBadge = titleEl.querySelector('#adhdfy-version-badge');
                    if (versionBadge) {
                        versionBadge.onclick = () => showChangelogModal();
                        versionBadge.onmouseover = () => versionBadge.style.color = "var(--spice-text)";
                        versionBadge.onmouseout = () => versionBadge.style.color = "rgba(180, 180, 180, 0.6)";
                    }
                }
            }
        } else {
            isEditMode = false;
            modalContent.style.display = "none";
            infoContent.style.display = "flex";

            const modal = document.querySelector("generic-modal");
            if (modal) {
                modal.classList.add("gif-manager-info-active");
                const titleEl = modal.querySelector("h1");
                if (titleEl) {
                    if (!titleEl.dataset.originalHTML) {
                        titleEl.dataset.originalHTML = titleEl.innerHTML;
                    }
                    titleEl.innerHTML = "How it works";
                }
            }
        }
        renderGifs();
    }

    let tenorNextToken = "";
    let currentTenorQuery = "";

    function injectModalHeader() {
        const tryInject = () => {
            const modal = document.querySelector("generic-modal");
            if (!modal) return false;
            const closeBtn = modal.querySelector('button[aria-label="Close"], button[aria-label="Закрыть"], .main-trackCreditsModal-closeBtn');
            if (!closeBtn) return false;

            if (!document.getElementById("gif-manager-info-btn")) {
                const header = closeBtn.parentNode;
                const titleEl = header.querySelector("h1");
                if (titleEl) {
                    titleEl.style.marginRight = "auto";
                    titleEl.style.display = "flex";
                    titleEl.style.alignItems = "baseline";
                    titleEl.style.gap = "0px";
                    titleEl.innerHTML = '<span class="gif-manager-rainbow-text">ADHDfy</span><span id="adhdfy-version-badge" style="font-size: 12px; color: rgba(180, 180, 180, 0.6); font-weight: normal; margin-left: 6px; line-height: 1; cursor: pointer; transition: color 0.15s ease;">v. 1.0.5.2</span>';

                    const versionBadge = titleEl.querySelector('#adhdfy-version-badge');
                    if (versionBadge) {
                        versionBadge.onclick = () => showChangelogModal();
                        versionBadge.onmouseover = () => versionBadge.style.color = "var(--spice-text)";
                        versionBadge.onmouseout = () => versionBadge.style.color = "rgba(180, 180, 180, 0.6)";
                    }
                }

                const infoBtn = document.createElement("button");
                infoBtn.id = "gif-manager-info-btn";
                infoBtn.className = "adhdfy-info-btn";
                infoBtn.innerHTML = `<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

                infoBtn.onmouseover = () => {
                    infoBtn.style.color = "var(--spice-text)";
                    infoBtn.style.transform = "scale(1.1)";
                };
                infoBtn.onmouseout = () => {
                    infoBtn.style.color = "var(--spice-subtext)";
                    infoBtn.style.transform = "scale(1)";
                };

                infoBtn.onclick = toggleInfo;
                header.insertBefore(infoBtn, closeBtn);
            }
            return true;
        };

        if (!tryInject()) {
            const observer = new MutationObserver((mutations, obs) => {
                if (tryInject()) obs.disconnect();
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => observer.disconnect(), 2000);
        }
    }

    function watchModalClose() {
        const checkCloseInterval = setInterval(() => {
            if (!document.body.contains(mainModalContainer)) {
                clearInterval(checkCloseInterval);
                isEditMode = false;
                renderGifs();
                const oldBtn = document.getElementById("gif-manager-info-btn");
                if (oldBtn) oldBtn.remove();
            }
        }, 200);
    }

    function openSettings() {
        if (!mainModalContainer) buildModalDOM();

        modalContent.style.display = "flex";
        infoContent.style.display = "none";
        updateListUI();

        isEditMode = true;
        renderGifs();

        Spicetify.PopupModal.display({
            title: "ADHDfy",
            content: mainModalContainer,
            isLarge: true
        });

        injectModalHeader();
        watchModalClose();

        const browseBtn = addForm.querySelector("#browse-file-btn");
        const fileInputHidden = addForm.querySelector("#file-input-hidden");
        const gifUrlInputRef = addForm.querySelector("#gif-url");
        let pendingDirectUploadBase64 = null;

        function resetBrowseBtn() {
            pendingDirectUploadBase64 = null;
            if (browseBtn) {
                browseBtn.style.background = "var(--spice-card)";
                browseBtn.style.color = "var(--spice-text)";
                browseBtn.style.border = "1px solid var(--spice-button-disabled)";
                browseBtn.innerText = "Browse File";
            }
            if (fileInputHidden) fileInputHidden.value = "";
        }

        setupFileBrowser();
        setupTenorSearch();
        setupAddGifButton();

        function setupFileBrowser() {
            if (!browseBtn || !fileInputHidden) return;

            resetBrowseBtn();

            browseBtn.onclick = (e) => {
                e.preventDefault();
                fileInputHidden.click();
            };

            fileInputHidden.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const validExt = /\.(jpg|jpeg|png|gif|webp)$/i;
                if (!validExt.test(file.name)) {
                    showCustomNotification("Error: Unsupported file format. Please use JPG, PNG, GIF, or WEBP.", true);
                    fileInputHidden.value = "";
                    return;
                }

                if (file.size > 2.5 * 1024 * 1024) {
                    showCustomNotification("Warning: Files larger than 2.5MB might exceed limits.", true);
                }

                browseBtn.style.background = "#1ed760";
                browseBtn.style.color = "#000";
                browseBtn.style.border = "1px solid transparent";
                browseBtn.innerText = "Selected";

                if (gifUrlInputRef) gifUrlInputRef.value = "";

                const reader = new FileReader();
                reader.onload = (ev) => {
                    pendingDirectUploadBase64 = ev.target.result;
                };
                reader.readAsDataURL(file);
            };

            if (gifUrlInputRef) {
                gifUrlInputRef.oninput = () => {
                    if (pendingDirectUploadBase64) resetBrowseBtn();
                };
            }
        }

        function setupTenorSearch() {
            const searchBtn = addForm.querySelector("#search-gif-btn");
            const tenorContainer = addForm.querySelector("#tenor-search-container");
            const tenorInput = addForm.querySelector("#tenor-search-input");
            const tenorGrid = addForm.querySelector("#tenor-results-grid");
            const tenorLoading = addForm.querySelector("#tenor-loading");
            const tenorLoadMoreBtn = addForm.querySelector("#tenor-load-more");

            if (!searchBtn || !tenorContainer) return;

            const performTenorSearch = (query, isLoadMore = false) => {
                if (!query.trim()) return;

                if (!isLoadMore) {
                    tenorGrid.innerHTML = "";
                    tenorNextToken = "";
                    currentTenorQuery = query;
                    if (tenorLoadMoreBtn) tenorLoadMoreBtn.style.display = "none";
                    tenorLoading.style.display = "block";
                } else {
                    if (tenorLoadMoreBtn) tenorLoadMoreBtn.innerText = "Loading...";
                }

                let fetchUrl = `https://g.tenor.com/v1/search?q=${encodeURIComponent(query)}&key=LIVDSRZULELA&limit=24`;
                if (isLoadMore && tenorNextToken) {
                    fetchUrl += `&pos=${tenorNextToken}`;
                }

                fetch(fetchUrl)
                    .then(res => res.json())
                    .then(data => {
                        if (!isLoadMore) {
                            tenorLoading.style.display = "none";
                            tenorGrid.innerHTML = "";
                        } else {
                            if (tenorLoadMoreBtn) tenorLoadMoreBtn.innerText = "Load More";
                        }

                        if (!data.results || data.results.length === 0) {
                            if (!isLoadMore) {
                                tenorGrid.innerHTML = "<p class='adhdfy-tenor-no-results'>No results found.</p>";
                            }
                            if (tenorLoadMoreBtn) tenorLoadMoreBtn.style.display = "none";
                            return;
                        }

                        tenorNextToken = data.next || "";
                        if (tenorLoadMoreBtn) {
                            tenorLoadMoreBtn.style.display = (tenorNextToken && data.results.length >= 24) ? "block" : "none";
                        }

                        data.results.forEach(item => {
                            const img = document.createElement("img");
                            img.src = item.media[0].tinygif.url;
                            img.className = "adhdfy-tenor-img";

                            img.onclick = () => {
                                if (gifUrlInputRef) gifUrlInputRef.value = item.media[0].gif.url;
                                if (pendingDirectUploadBase64) resetBrowseBtn();

                                tenorContainer.style.display = "none";
                                searchBtn.style.background = "var(--spice-card)";
                                searchBtn.style.color = "var(--spice-text)";
                                showCustomNotification("Media Selected! Click Add to import.", false);
                            };
                            tenorGrid.appendChild(img);
                        });
                    })
                    .catch(err => {
                        if (isLoadMore) {
                            if (tenorLoadMoreBtn) tenorLoadMoreBtn.innerText = "Load More";
                        } else {
                            tenorLoading.style.display = "none";
                            tenorGrid.innerHTML = "<p class='adhdfy-tenor-error'>Failed to load GIFs. Check connection.</p>";
                        }
                        console.error("GifManager Tenor API Error:", err);
                    });
            };

            if (tenorLoadMoreBtn) {
                tenorLoadMoreBtn.onclick = (e) => {
                    e.preventDefault();
                    performTenorSearch(currentTenorQuery, true);
                };
            }

            const executeBtn = addForm.querySelector("#tenor-execute-btn");
            if (executeBtn) {
                executeBtn.onclick = (e) => {
                    e.preventDefault();
                    if (tenorInput.value.trim()) performTenorSearch(tenorInput.value);
                };
            }

            searchBtn.onclick = (e) => {
                e.preventDefault();
                const isHidden = getComputedStyle(tenorContainer).display === "none";
                tenorContainer.style.display = isHidden ? "flex" : "none";
                if (isHidden) {
                    searchBtn.style.background = "var(--spice-button)";
                    searchBtn.style.color = "#000";
                    tenorInput.focus();
                    if (tenorGrid.innerHTML === "") {
                        performTenorSearch("memes");
                    }
                } else {
                    searchBtn.style.background = "var(--spice-card)";
                    searchBtn.style.color = "var(--spice-text)";
                }
            };

            tenorInput.onkeydown = (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    if (tenorInput.value.trim()) performTenorSearch(tenorInput.value);
                }
            };
        }

        function setupAddGifButton() {
            const addGifBtn = addForm.querySelector("#add-gif-btn");
            if (!addGifBtn) return;

            addGifBtn.onclick = () => {
                let url = addForm.querySelector("#gif-url").value;
                if (pendingDirectUploadBase64) {
                    url = pendingDirectUploadBase64;
                }

                const sizeInput = addForm.querySelector("#gif-size");
                const size = sizeInput && sizeInput.value ? sizeInput.value : 50;

                if (url) {
                    const anchor = "[data-testid='now-playing-widget']";
                    const anchorEl = document.querySelector(anchor);

                    let startXPct = 0.5;
                    let startYPct = 0.5;

                    if (anchorEl && anchorEl.getBoundingClientRect().width > 0) {
                        const rect = anchorEl.getBoundingClientRect();
                        const screenCenterX = window.innerWidth / 2;
                        const screenCenterY = window.innerHeight / 2;

                        startXPct = (screenCenterX - rect.left) / rect.width;
                        startYPct = (screenCenterY - rect.top) / rect.height;
                    }

                    savedGifs.unshift({
                        ...GIF_DEFAULTS,
                        url,
                        anchor,
                        size: parseInt(size),
                        xPct: startXPct,
                        yPct: startYPct,
                        x: 0,
                        y: 0
                    });

                    try {
                        saveCurrentLayout();
                    } catch (err) {
                        savedGifs.shift();
                        showCustomNotification("Error: Storage limit exceeded! Could not add local file.", true);
                        return;
                    }

                    renderGifs();
                    updateListUI();

                    document.getElementById("gif-url").value = "";
                    document.getElementById("gif-size").value = "";
                    resetBrowseBtn();
                }
            };
        }
    }

    // Entry Point & Update Logic

    const VERSION = "1.0.5.2";
    const CHANGELOG = `
        <h3 style="margin-top: 0; color: var(--spice-text); text-align: center;">New in 1.0.5.2:</h3>

        <h4 style="margin: 15px 0 5px 0; color: var(--spice-text);">Bug Fixes:</h4>
        <ul style="margin-top: 0; padding-left: 20px; line-height: 1.7; color: var(--spice-subtext); font-size: 14px;">
            <li style="margin-bottom: 8px;">Improved window display on small screens with high resolution. The settings panel no longer stretches to cover the entire Spotify window.</li>
            <li style="margin-bottom: 8px;">Fixed a bug where button hitboxes were misaligned on small displays.</li>
            <li style="margin-bottom: 8px;">Fixed a bug where pressing the info button and returning back could cause some buttons to stop working.</li>
        </ul>

        <hr style="border-color: var(--spice-button-disabled); margin: 20px 0;">

        <h3 style="margin-top: 0; color: var(--spice-text); text-align: center;">New in 1.0.5.1:</h3>
        
        <h4 style="margin: 15px 0 5px 0; color: var(--spice-text);">Added Features:</h4>
        <ul style="margin-top: 0; padding-left: 20px; line-height: 1.7; color: var(--spice-subtext); font-size: 14px;">
            <li style="margin-bottom: 8px;">Added layouts manager. You can now switch between different layouts.</li>
            <li style="margin-bottom: 8px;">Added Gif Bounce Effect. GIFs can now bounce to the music (works on most, but not all tracks). Check it under Effects button.</li>
            <li style="margin-bottom: 8px;">The color selection engine was changed so hue shifts actually look correct now.</li>
            <li style="margin-bottom: 8px;">Added this little popup to show you what's new after an update.</li>
        </ul>

        <h4 style="margin: 15px 0 5px 0; color: var(--spice-text);">Bug Fixes:</h4>
        <ul style="margin-top: 0; padding-left: 20px; line-height: 1.7; color: var(--spice-subtext); font-size: 14px;">
            <li style="margin-bottom: 8px;">Cropper now works correctly and invisible parts of a GIF are no longer treated as part of the image, so effects like DVD bounce, dragging, and auto-spin now behave based on what you actually see.</li>
            <li style="margin-bottom: 8px;">Fixed an annoying issue where dragging a GIF with a 3D flip or scroll effect would instantly snap it a few pixels away.</li>
            <li style="margin-bottom: 8px;">Dragging near the top of the screen won't move the Spotify window anymore.</li>
            <li style="margin-bottom: 8px;">Clicking the hide/show button no longer causes the GIF to briefly twitch.</li>
            <li style="margin-bottom: 8px;">Deleting or duplicating one GIF no longer resets the active animations for all other GIFs on your screen.</li>
        </ul>
    `;

    const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>`;

    const topBarBtn = new Spicetify.Topbar.Button("ADHDfy", iconSvg, () => {
        openSettings();

        if (Spicetify.LocalStorage.get("adhdfy-lastversion") !== VERSION) {
            Spicetify.LocalStorage.set("adhdfy-lastversion", VERSION);
            let dot = topBarBtn.element.querySelector(".adhdfy-update-dot");
            if (dot) dot.remove();
            showChangelogModal();
        }
    });

    const lastVersion = Spicetify.LocalStorage.get("adhdfy-lastversion");
    if (lastVersion !== VERSION) {
        requestAnimationFrame(() => {
            if (topBarBtn.element) {
                topBarBtn.element.style.position = "relative";
                const dot = document.createElement("div");
                dot.className = "adhdfy-update-dot";
                dot.style.position = "absolute";
                dot.style.top = "6px";
                dot.style.right = "6px";
                dot.style.width = "8px";
                dot.style.height = "8px";
                dot.style.backgroundColor = "#e22134";
                dot.style.borderRadius = "50%";
                dot.style.boxShadow = "0 0 5px #e22134";
                dot.style.pointerEvents = "none";
                topBarBtn.element.appendChild(dot);
            }
        });
    }

    function showChangelogModal() {
        const overlay = document.createElement("div");
        overlay.className = "adhdfy-overlay";
        overlay.style.zIndex = "30000000";

        const dialog = document.createElement("div");
        dialog.className = "adhdfy-dialog";
        dialog.style.maxWidth = "450px";
        dialog.style.height = "650px";
        dialog.style.maxHeight = "90vh";

        const title = document.createElement("h2");
        title.innerHTML = '<span class="gif-manager-rainbow-text">ADHDfy</span> Updated';
        title.className = "adhdfy-dialog-title";

        const content = document.createElement("div");
        content.innerHTML = CHANGELOG;
        content.style.fontSize = "14px";
        content.style.textAlign = "left";
        content.style.marginBottom = "20px";
        content.style.overflowY = "auto";
        content.style.flex = "1";
        content.style.paddingRight = "10px";

        const btnContainer = document.createElement("div");
        btnContainer.className = "adhdfy-dialog-buttons";

        const confirmBtn = createButton("Ok!", "primary");
        confirmBtn.classList.add("adhdfy-btn--lg");
        confirmBtn.style.width = "100%";
        confirmBtn.onclick = () => overlay.remove();

        btnContainer.appendChild(confirmBtn);
        dialog.appendChild(title);
        dialog.appendChild(content);
        dialog.appendChild(btnContainer);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    }

    renderGifs();
})();