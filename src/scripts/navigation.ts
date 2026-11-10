let navigationController: AbortController | undefined;

function initNavigation() {
  navigationController?.abort();
  navigationController = new AbortController();
  const { signal } = navigationController;
  const menu = document.querySelector<HTMLDialogElement>("[data-site-menu]");
  const toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const closeButton = menu?.querySelector<HTMLButtonElement>("[data-menu-close]");
  const scrollArea = menu?.querySelector<HTMLElement>("[data-menu-scroll]");
  if (!menu || !toggle) return;
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let closingTimer: number | undefined;
  let openingFrame: number | undefined;

  function clearTimers() {
    window.clearTimeout(closingTimer);
    if (openingFrame !== undefined) window.cancelAnimationFrame(openingFrame);
  }

  function finishClose(restoreFocus = true) {
    clearTimers();
    menu?.classList.remove("is-open");
    menu?.close();
    root.classList.remove("site-menu-open");
    toggle?.setAttribute("aria-expanded", "false");
    if (location.hash === "#categories") {
      history.replaceState(history.state, "", `${location.pathname}${location.search}`);
    }
    if (restoreFocus) toggle?.focus({ preventScroll: true });
  }

  function openMenu() {
    if (!menu) return;
    clearTimers();
    root.classList.add("site-menu-open");
    if (!menu.open) menu.showModal();
    toggle?.setAttribute("aria-expanded", "true");
    if (scrollArea) scrollArea.scrollTop = 0;
    // Commit the initial opacity before the entrance transition starts.
    menu.getBoundingClientRect();
    openingFrame = window.requestAnimationFrame(() => {
      menu.classList.add("is-open");
      if (location.hash === "#categories" && scrollArea) {
        const categories = menu.querySelector<HTMLElement>("#categories");
        if (categories) {
          scrollArea.scrollTop +=
            categories.getBoundingClientRect().top - scrollArea.getBoundingClientRect().top - 24;
        }
      }
    });
    closeButton?.focus({ preventScroll: true });
  }

  function closeMenu() {
    if (!menu?.open) return;
    clearTimers();
    menu.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    if (reducedMotion.matches) finishClose();
    else closingTimer = window.setTimeout(() => finishClose(), 300);
  }

  toggle.addEventListener("click", openMenu, { signal });
  closeButton?.addEventListener("click", closeMenu, { signal });
  menu.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Tab") return;
      const controls = [
        ...menu.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]'
        )
      ].filter((element) => element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls.at(-1);
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus({ preventScroll: true });
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
    },
    { signal }
  );
  menu.addEventListener(
    "cancel",
    (event) => {
      event.preventDefault();
      closeMenu();
    },
    { signal }
  );
  menu.addEventListener(
    "click",
    (event) => {
      if (event.target instanceof Element && event.target.closest("a")) closeMenu();
    },
    { signal }
  );
  menu.addEventListener("submit", closeMenu, { signal });
  menu.addEventListener(
    "transitionend",
    (event) => {
      if (
        event.target === menu
        && event.propertyName === "opacity"
        && !menu.classList.contains("is-open")
      ) {
        finishClose();
      }
    },
    { signal }
  );
  window.addEventListener(
    "hashchange",
    () => {
      if (location.hash === "#categories") openMenu();
    },
    { signal }
  );
  document.addEventListener("astro:before-swap", () => finishClose(false), { signal });
  signal.addEventListener(
    "abort",
    () => {
      clearTimers();
      root.classList.remove("site-menu-open");
    },
    { once: true }
  );
  if (location.hash === "#categories") openMenu();
}

document.addEventListener("astro:page-load", initNavigation);
