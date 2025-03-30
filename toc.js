// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="intro.html">Welds ORM</a></li><li class="chapter-item expanded "><a href="getting_started.html"><strong aria-hidden="true">1.</strong> Getting Started</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="setup.html"><strong aria-hidden="true">1.1.</strong> Project Setup</a></li><li class="chapter-item expanded "><a href="fundamentals.html"><strong aria-hidden="true">1.2.</strong> Fundamentals Struct/Traits</a></li><li class="chapter-item expanded "><a href="connections.html"><strong aria-hidden="true">1.3.</strong> Connections</a></li></ol></li><li class="chapter-item expanded "><a href="models.html"><strong aria-hidden="true">2.</strong> Models</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="model_attributes.html"><strong aria-hidden="true">2.1.</strong> Attributes</a></li><li class="chapter-item expanded "><a href="model_extras.html"><strong aria-hidden="true">2.2.</strong> Whats Added To your Model</a></li><li class="chapter-item expanded "><a href="model_state.html"><strong aria-hidden="true">2.3.</strong> DbState (Create/Edit/Delete)</a></li><li class="chapter-item expanded "><a href="model_relationships.html"><strong aria-hidden="true">2.4.</strong> Relationships</a></li><li class="chapter-item expanded "><a href="model_hooks.html"><strong aria-hidden="true">2.5.</strong> Hooks</a></li></ol></li><li class="chapter-item expanded "><a href="query.html"><strong aria-hidden="true">3.</strong> Query</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="query_basic.html"><strong aria-hidden="true">3.1.</strong> Basic</a></li><li class="chapter-item expanded "><a href="query_advanced.html"><strong aria-hidden="true">3.2.</strong> Advanced</a></li><li class="chapter-item expanded "><a href="query_select.html"><strong aria-hidden="true">3.3.</strong> Custom Select (Columns &amp; Joins)</a></li><li class="chapter-item expanded "><a href="query_sql.html"><strong aria-hidden="true">3.4.</strong> Manual SQL</a></li></ol></li><li class="chapter-item expanded "><a href="migration.html"><strong aria-hidden="true">4.</strong> Migration</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
