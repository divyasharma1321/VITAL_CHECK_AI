

(function () {

    
    var MOON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

   
    var SUN_SVG  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

    
    if (localStorage.getItem("vcDark") === "true") {
        document.body.classList.add("dark");
    }

    document.addEventListener("DOMContentLoaded", function () {
        var btn = document.getElementById("darkToggle");
        if (!btn) return;

        function updateBtn() {
            var isDark = document.body.classList.contains("dark");
            btn.innerHTML = isDark
                ? SUN_SVG  + '<span>Light</span>'
                : MOON_SVG + '<span>Dark</span>';
        }

       
        updateBtn();

       
        btn.addEventListener("click", function () {
            document.body.classList.toggle("dark");
            var isDark = document.body.classList.contains("dark");
            localStorage.setItem("vcDark", isDark);
            updateBtn();
        });
    });

})();
