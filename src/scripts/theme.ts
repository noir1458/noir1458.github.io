const root = document.documentElement;
const media = window.matchMedia("(prefers-color-scheme: dark)");

const getThemeButtons = () => [
  ...document.querySelectorAll<HTMLButtonElement>("[data-theme-value]"),
];
const getThemePicker = () =>
  document.querySelector<HTMLElement>("[data-theme-picker]");
const getThemeToggle = () =>
  document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
const getThemeMenu = () =>
  document.querySelector<HTMLElement>("[data-theme-menu]");
const getThemeIcons = () => [
  ...document.querySelectorAll<HTMLElement>("[data-theme-icon]"),
];

function closeThemeMenu({ restoreFocus = false } = {}) {
  getThemeMenu()?.classList.remove("open");
  const toggle = getThemeToggle();
  toggle?.setAttribute("aria-expanded", "false");
  if (restoreFocus) toggle?.focus();
}

function resolvedTheme() {
  return root.dataset.theme === "system"
    ? media.matches
      ? "dark"
      : "light"
    : root.dataset.theme;
}

function syncTheme({ broadcast = true } = {}) {
  const selected = root.dataset.theme ?? "system";
  root.dataset.resolvedTheme = resolvedTheme();
  getThemeButtons().forEach((button) => {
    const active = button.dataset.themeValue === selected;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  getThemeIcons().forEach((icon) => {
    icon.hidden = icon.dataset.themeIcon !== selected;
  });
  const selectedLabel =
    selected === "system"
      ? "Auto"
      : selected.charAt(0).toUpperCase() + selected.slice(1);
  getThemeToggle()?.setAttribute(
    "aria-label",
    `Choose color theme, current: ${selectedLabel}`,
  );
  if (broadcast) {
    document
      .querySelector<HTMLIFrameElement>(".giscus-frame")
      ?.contentWindow?.postMessage(
        {
          giscus: {
            setConfig: {
              theme:
                root.dataset.resolvedTheme === "dark" ? "dark_dimmed" : "light",
            },
          },
        },
        "https://giscus.app",
      );
  }
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const themeButton =
    event.target.closest<HTMLButtonElement>("[data-theme-value]");
  if (themeButton) {
    const theme = themeButton.dataset.themeValue ?? "system";
    root.dataset.theme = theme;
    localStorage.setItem("color-theme", theme);
    syncTheme();
    closeThemeMenu({ restoreFocus: true });
    return;
  }

  const toggle = event.target.closest<HTMLButtonElement>("[data-theme-toggle]");
  if (!toggle) return;
  const menu = getThemeMenu();
  const open = !menu?.classList.contains("open");
  menu?.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  if (open) {
    getThemeButtons()
      .find((button) => button.classList.contains("active"))
      ?.focus();
  }
});

document.addEventListener("pointerdown", (event) => {
  const themePicker = getThemePicker();
  if (themePicker && !themePicker.contains(event.target as Node))
    closeThemeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && getThemeMenu()?.classList.contains("open")) {
    closeThemeMenu({ restoreFocus: true });
  }
});

media.addEventListener("change", () => syncTheme());
window.addEventListener("message", (event) => {
  if (event.origin === "https://giscus.app") syncTheme({ broadcast: false });
});
document.addEventListener("astro:page-load", () =>
  syncTheme({ broadcast: false }),
);
syncTheme({ broadcast: false });
