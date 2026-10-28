import { announceHeaderPanelOpen, onHeaderPanelOpen } from "@/scripts/header-panels";

let navigationController: AbortController | undefined;

function initNavigation() {
  navigationController?.abort();
  navigationController = new AbortController();
  const { signal } = navigationController;
  let searchFocusTimer: number | undefined;
  signal.addEventListener("abort", () => window.clearTimeout(searchFocusTimer), { once: true });

  const searchShell = document.querySelector<HTMLElement>("[data-search-shell]");
  const searchToggle = document.querySelector<HTMLButtonElement>("[data-search-toggle]");
  const searchInput = searchShell?.querySelector<HTMLInputElement>("input");
  const searchField = searchShell?.querySelector<HTMLElement>(".header-search-field");
  const primaryNav = document.querySelector<HTMLElement>("[data-primary-nav]");
  const navToggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const languagePicker = document.querySelector<HTMLDetailsElement>("[data-language-picker]");

  function closeSearch({ restoreFocus = false } = {}) {
    window.clearTimeout(searchFocusTimer);
    searchShell?.classList.remove("open");
    searchField?.setAttribute("inert", "");
    if (restoreFocus) searchToggle?.focus();
    searchToggle?.setAttribute("aria-expanded", "false");
    searchToggle?.setAttribute("aria-label", "Open search");
  }

  function setNavigation(open: boolean) {
    if (open) announceHeaderPanelOpen("navigation");
    primaryNav?.classList.toggle("open", open);
    navToggle?.classList.toggle("open", open);
    navToggle?.setAttribute("aria-expanded", String(open));
    navToggle?.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    if (open) {
      window.requestAnimationFrame(() => {
        if (!signal.aborted && primaryNav?.classList.contains("open")) {
          primaryNav.querySelector("a")?.focus();
        }
      });
    }
  }

  onHeaderPanelOpen((panel) => {
    if (panel !== "search") closeSearch();
    if (panel !== "navigation") setNavigation(false);
    if (panel !== "language" && languagePicker) languagePicker.open = false;
  }, signal);

  languagePicker?.addEventListener(
    "toggle",
    () => {
      if (languagePicker.open) announceHeaderPanelOpen("language");
    },
    { signal }
  );

  searchToggle?.addEventListener(
    "click",
    () => {
      const open = !searchShell?.classList.contains("open");
      if (!open) {
        closeSearch();
        return;
      }
      announceHeaderPanelOpen("search");
      searchShell?.classList.add("open");
      searchField?.removeAttribute("inert");
      searchToggle.setAttribute("aria-expanded", "true");
      searchToggle.setAttribute("aria-label", "Close search");
      searchFocusTimer = window.setTimeout(() => {
        if (searchShell?.classList.contains("open")) searchInput?.focus();
      }, 80);
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
    "focusin",
    (event) => {
      const target = event.target as Node;
      if (searchShell?.classList.contains("open") && !searchShell.contains(target)) closeSearch();
      if (
        primaryNav?.classList.contains("open")
        && !primaryNav.contains(target)
        && !navToggle?.contains(target)
      ) {
        setNavigation(false);
      }
      if (languagePicker?.open && !languagePicker.contains(target)) languagePicker.open = false;
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

  const mobileNavigation = window.matchMedia("(max-width: 1000px)");
  mobileNavigation.addEventListener(
    "change",
    (event) => {
      if (!event.matches) setNavigation(false);
    },
    { signal }
  );
}

document.addEventListener("astro:page-load", initNavigation);
