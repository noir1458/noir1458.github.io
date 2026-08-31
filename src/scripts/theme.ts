const root = document.documentElement;
const media = window.matchMedia("(prefers-color-scheme: dark)");
const supportedThemes = ["system", "light", "dark"] as const;
const safeAccentHue = 250;

type Theme = (typeof supportedThemes)[number];

function storedValue(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storeValue(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function includesValue<T extends string>(values: readonly T[], value?: string | null): value is T {
  return Boolean(value && values.includes(value as T));
}

function validHue(value: string | null | undefined, fallback: number) {
  if (value === null || value === undefined || value.trim() === "") return fallback;
  const hue = Number(value);
  return Number.isInteger(hue) && hue >= 0 && hue <= 360 ? hue : fallback;
}

function applyStoredAppearance(targetRoot: HTMLElement) {
  const themeEnabled = targetRoot.dataset.themeEnabled === "true";
  const storedTheme = storedValue("color-theme");
  const theme: Theme = themeEnabled
    ? storedTheme === "neon"
      ? "dark"
      : includesValue(supportedThemes, storedTheme)
        ? storedTheme
        : "system"
    : "light";
  const configuredHue = validHue(
    targetRoot.dataset.defaultAccentHue,
    safeAccentHue,
  );
  const accentHue = validHue(storedValue("color-accent-hue"), configuredHue);
  const resolved = theme === "system"
    ? media.matches
      ? "dark"
      : "light"
    : theme;

  targetRoot.dataset.theme = theme;
  targetRoot.dataset.resolvedTheme = resolved;
  targetRoot.style.setProperty("--accent-hue", String(accentHue));
  targetRoot.dataset.sidebarCollapsed = String(
    window.matchMedia("(min-width: 961px)").matches
    && storedValue("sidebar-collapsed") === "true"
  );
  targetRoot.dataset.appearanceReady = "true";
  targetRoot.style.colorScheme = resolved;

  if (storedTheme === "neon") storeValue("color-theme", "dark");
}

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
const getAccentPicker = () =>
  document.querySelector<HTMLElement>("[data-accent-picker]");
const getAccentToggle = () =>
  document.querySelector<HTMLButtonElement>("[data-accent-toggle]");
const getAccentMenu = () =>
  document.querySelector<HTMLElement>("[data-accent-menu]");
const getAccentHueInput = () =>
  document.querySelector<HTMLInputElement>("[data-accent-hue]");
const getAccentHueOutput = () =>
  document.querySelector<HTMLOutputElement>("[data-accent-hue-output]");

function closeThemeMenu({ restoreFocus = false } = {}) {
  getThemeMenu()?.classList.remove("open");
  const toggle = getThemeToggle();
  toggle?.setAttribute("aria-expanded", "false");
  if (restoreFocus) toggle?.focus();
}

function closeAccentMenu({ restoreFocus = false } = {}) {
  getAccentMenu()?.classList.remove("open");
  const toggle = getAccentToggle();
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
  const resolved = resolvedTheme() === "dark" ? "dark" : "light";
  root.dataset.resolvedTheme = resolved;
  root.style.colorScheme = resolved;
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

function syncAccentHue() {
  const hue = validHue(
    root.style.getPropertyValue("--accent-hue"),
    validHue(root.dataset.defaultAccentHue, safeAccentHue),
  );
  getAccentToggle()?.setAttribute(
    "aria-label",
    `Choose accent hue, current: ${hue} degrees`,
  );
  const hueInput = getAccentHueInput();
  if (hueInput) hueInput.value = String(hue);
  const hueOutput = getAccentHueOutput();
  if (hueOutput) hueOutput.value = `${hue}°`;
}

document.addEventListener("input", (event) => {
  if (
    !(event.target instanceof HTMLInputElement)
    || !event.target.matches("[data-accent-hue]")
  ) {
    return;
  }
  const hue = validHue(event.target.value, safeAccentHue);
  root.style.setProperty("--accent-hue", String(hue));
  storeValue("color-accent-hue", String(hue));
  syncAccentHue();
});

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const themeButton =
    event.target.closest<HTMLButtonElement>("[data-theme-value]");
  if (themeButton) {
    const value = themeButton.dataset.themeValue;
    const theme: Theme = includesValue(supportedThemes, value) ? value : "system";
    root.dataset.theme = theme;
    storeValue("color-theme", theme);
    syncTheme();
    closeThemeMenu({ restoreFocus: true });
    return;
  }

  const accentToggle = event.target.closest<HTMLButtonElement>("[data-accent-toggle]");
  if (accentToggle) {
    const menu = getAccentMenu();
    const open = !menu?.classList.contains("open");
    closeThemeMenu();
    menu?.classList.toggle("open", open);
    accentToggle.setAttribute("aria-expanded", String(open));
    if (open) getAccentHueInput()?.focus();
    return;
  }

  const toggle = event.target.closest<HTMLButtonElement>("[data-theme-toggle]");
  if (!toggle) return;
  const menu = getThemeMenu();
  const open = !menu?.classList.contains("open");
  closeAccentMenu();
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
  const accentPicker = getAccentPicker();
  if (accentPicker && !accentPicker.contains(event.target as Node))
    closeAccentMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && getThemeMenu()?.classList.contains("open")) {
    closeThemeMenu({ restoreFocus: true });
  }
  if (event.key === "Escape" && getAccentMenu()?.classList.contains("open")) {
    closeAccentMenu({ restoreFocus: true });
  }
});

media.addEventListener("change", () => syncTheme());
window.addEventListener("message", (event) => {
  if (event.origin === "https://giscus.app") syncTheme({ broadcast: false });
});
document.addEventListener("astro:before-swap", (event) => {
  applyStoredAppearance(event.newDocument.documentElement);
});
document.addEventListener("astro:page-load", () => {
  applyStoredAppearance(root);
  closeThemeMenu();
  closeAccentMenu();
  syncTheme({ broadcast: false });
  syncAccentHue();
});
applyStoredAppearance(root);
syncTheme({ broadcast: false });
syncAccentHue();
