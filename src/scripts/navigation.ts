let navigationController: AbortController | undefined;
let searchCloseTimer: number | undefined;

function initNavigation() {
  navigationController?.abort();
  navigationController = new AbortController();
  const { signal } = navigationController;

  window.clearTimeout(searchCloseTimer);

  const searchShell = document.querySelector<HTMLElement>("[data-search-shell]");
  const searchToggle = document.querySelector<HTMLButtonElement>("[data-search-toggle]");
  const searchInput = searchShell?.querySelector<HTMLInputElement>("input");
  const primaryNav = document.querySelector<HTMLElement>("[data-primary-nav]");
  const navToggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const languagePicker = document.querySelector<HTMLDetailsElement>("[data-language-picker]");

  function closeSearch({ restoreFocus = false } = {}) {
    const wasOpen = Boolean(searchShell?.classList.contains("open"));
    searchShell?.classList.remove("open");
    if (wasOpen) {
      searchShell?.classList.add("closing");
      window.clearTimeout(searchCloseTimer);
      searchCloseTimer = window.setTimeout(() => {
        searchShell?.classList.remove("closing");
        if (restoreFocus) searchToggle?.focus();
      }, 240);
    } else if (restoreFocus) {
      searchToggle?.focus();
    }
    searchToggle?.setAttribute("aria-expanded", "false");
    searchToggle?.setAttribute("aria-label", "Open search");
  }

  function setNavigation(open: boolean) {
    primaryNav?.classList.toggle("open", open);
    navToggle?.classList.toggle("open", open);
    navToggle?.setAttribute("aria-expanded", String(open));
    navToggle?.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    if (open) closeSearch();
  }

  searchToggle?.addEventListener(
    "click",
    () => {
      const open = !searchShell?.classList.contains("open");
      if (!open) {
        closeSearch();
        return;
      }
      setNavigation(false);
      window.clearTimeout(searchCloseTimer);
      searchShell?.classList.remove("closing");
      searchShell?.classList.add("open");
      searchToggle.setAttribute("aria-expanded", "true");
      searchToggle.setAttribute("aria-label", "Close search");
      window.setTimeout(() => searchInput?.focus(), 80);
    },
    { signal }
  );

  navToggle?.addEventListener(
    "click",
    () => {
      setNavigation(!primaryNav?.classList.contains("open"));
    },
    { signal }
  );

  primaryNav?.addEventListener(
    "click",
    (event) => {
      if ((event.target as Element).closest("a")) setNavigation(false);
    },
    { signal }
  );

  document.addEventListener(
    "pointerdown",
    (event) => {
      if (searchShell && !searchShell.contains(event.target as Node)) closeSearch();
      if (
        primaryNav?.classList.contains("open")
        && !primaryNav.contains(event.target as Node)
        && !navToggle?.contains(event.target as Node)
      ) {
        setNavigation(false);
      }
      if (languagePicker?.open && !languagePicker.contains(event.target as Node)) {
        languagePicker.open = false;
      }
    },
    { signal }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") return;
      closeSearch({
        restoreFocus: Boolean(searchShell?.classList.contains("open"))
      });
      if (primaryNav?.classList.contains("open")) {
        setNavigation(false);
        navToggle?.focus();
      }
      if (languagePicker?.open) {
        languagePicker.open = false;
        languagePicker.querySelector<HTMLElement>("summary")?.focus();
      }
    },
    { signal }
  );

  const mobileNavigation = window.matchMedia("(max-width: 700px)");
  mobileNavigation.addEventListener(
    "change",
    (event) => {
      if (!event.matches) setNavigation(false);
    },
    { signal }
  );

  const layout = document.querySelector<HTMLElement>("[data-layout]");
  const sidebarToggle = document.querySelector<HTMLButtonElement>("[data-sidebar-toggle]");
  const sidebarRegion = document.querySelector<HTMLElement>("[data-sidebar-region]");
  const sidebarIcon = sidebarToggle?.querySelector("svg");
  const desktopSidebar = window.matchMedia("(min-width: 961px)");

  function setSidebar(collapsed: boolean, { persist = true } = {}) {
    document.documentElement.dataset.sidebarCollapsed = String(collapsed);
    layout?.classList.toggle("sidebar-collapsed", collapsed);
    sidebarRegion?.classList.toggle("collapsed", collapsed);
    sidebarToggle?.setAttribute("aria-expanded", String(!collapsed));
    sidebarToggle?.setAttribute("aria-label", collapsed ? "Show sidebar" : "Hide sidebar");
    sidebarIcon?.classList.toggle("flip", collapsed);
    if (persist) localStorage.setItem("sidebar-collapsed", String(collapsed));
  }

  sidebarToggle?.addEventListener(
    "click",
    () => {
      setSidebar(!layout?.classList.contains("sidebar-collapsed"));
    },
    { signal }
  );

  const savedSidebarCollapsed = () => localStorage.getItem("sidebar-collapsed") === "true";
  setSidebar(desktopSidebar.matches && savedSidebarCollapsed(), {
    persist: false
  });
  desktopSidebar.addEventListener(
    "change",
    (event) => {
      setSidebar(event.matches && savedSidebarCollapsed(), { persist: false });
    },
    { signal }
  );

  document.querySelectorAll<HTMLDetailsElement>(".sidebar-widget").forEach((details) => {
    details.addEventListener(
      "toggle",
      () => {
        const icon = details.querySelector<SVGElement>("summary svg");
        icon?.classList.toggle("open", details.open);
      },
      { signal }
    );
    details.querySelector<SVGElement>("summary svg")?.classList.toggle("open", details.open);
  });
}

document.addEventListener("astro:page-load", initNavigation);
