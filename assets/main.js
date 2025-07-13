import View from "./vue/view.js";
(async function () {
    var page = location.hash = location.hash || "#project";
    page = page.substring(1);
    View.create(page);
})();