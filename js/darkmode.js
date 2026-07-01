// Modo oscuro: alterna [data-theme] en <html>, recuerda la eleccion en localStorage
// y mantiene sincronizado el icono/estado accesible del boton. Si el usuario nunca elige
// manualmente, el sitio sigue la preferencia del sistema operativo (ver css/variables.css).
(function () {
    var STORAGE_KEY = "theme";
    var root = document.documentElement;
    var toggle = document.getElementById("themeToggle");

    function systemPrefersDark() {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    function getStoredTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            return null;
        }
    }

    function setStoredTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (error) {
            /* almacenamiento no disponible: el tema sigue funcionando solo para esta carga */
        }
    }

    function currentTheme() {
        return root.getAttribute("data-theme") || (systemPrefersDark() ? "dark" : "light");
    }

    function syncToggleState(theme) {
        if (!toggle) {
            return;
        }

        var isDark = theme === "dark";
        toggle.setAttribute("aria-pressed", String(isDark));
        toggle.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    }

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        syncToggleState(theme);
    }

    // El <head> ya aplico el tema guardado antes de pintar (evita parpadeo);
    // aqui solo sincronizamos el estado accesible del boton con lo ya aplicado.
    syncToggleState(currentTheme());

    if (toggle) {
        toggle.addEventListener("click", function () {
            var nextTheme = currentTheme() === "dark" ? "light" : "dark";
            applyTheme(nextTheme);
            setStoredTheme(nextTheme);
        });
    }

    // Si el usuario no eligio manualmente, sigue reaccionando a cambios del sistema en vivo.
    if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
            if (!getStoredTheme()) {
                syncToggleState(event.matches ? "dark" : "light");
            }
        });
    }
})();
