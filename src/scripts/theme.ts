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
  const configuredHue = validHue(targetRoot.dataset.defaultAccentHue, safeAccentHue);
  const accentHue = validHue(storedValue("color-accent-hue"), configuredHue);
  const resolved = theme === "system" ? (media.matches ? "dark" : "light") : theme;

  targetRoot.dataset.theme = theme;
  targetRoot.dataset.resolvedTheme = resolved;
  targetRoot.style.setProperty("--accent-hue", String(accentHue));
  targetRoot.dataset.appearanceReady = "true";
  targetRoot.style.colorScheme = resolved;

  if (storedTheme === "neon") storeValue("color-theme", "dark");
}

const getThemeButtons = () => [
  ...document.querySelectorAll<HTMLButtonElement>("[data-theme-value]")
];
const getAppearancePicker = () => document.querySelector<HTMLElement>("[data-appearance-picker]");
const getAppearanceToggle = () =>
  document.querySelector<HTMLButtonElement>("[data-appearance-toggle]");
const getAppearanceMenu = () => document.querySelector<HTMLElement>("[data-appearance-menu]");
const getThemeIcons = () => [...document.querySelectorAll<HTMLElement>("[data-theme-icon]")];
const getAccentHueInput = () => document.querySelector<HTMLInputElement>("[data-accent-hue]");
const getAccentHueOutput = () =>
  document.querySelector<HTMLOutputElement>("[data-accent-hue-output]");

function closeAppearanceMenu({ restoreFocus = false } = {}) {
  getAppearanceMenu()?.classList.remove("open");
  const toggle = getAppearanceToggle();
  toggle?.setAttribute("aria-expanded", "false");
  if (restoreFocus) toggle?.focus();
}

function resolvedTheme() {
  return root.dataset.theme === "system" ? (media.matches ? "dark" : "light") : root.dataset.theme;
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
    selected === "system" ? "Auto" : selected.charAt(0).toUpperCase() + selected.slice(1);
  getAppearanceToggle()?.setAttribute(
    "aria-label",
    `Choose appearance, current theme: ${selectedLabel}`
  );
  if (broadcast) {
    document.querySelector<HTMLIFrameElement>(".giscus-frame")?.contentWindow?.postMessage(
      {
        giscus: {
          setConfig: {
            theme: root.dataset.resolvedTheme === "dark" ? "dark_dimmed" : "light"
          }
        }
      },
      "https://giscus.app"
    );
  }
}

function syncAccentHue() {
  const hue = validHue(
    root.style.getPropertyValue("--accent-hue"),
    validHue(root.dataset.defaultAccentHue, safeAccentHue)
  );
  const hueInput = getAccentHueInput();
  if (hueInput) hueInput.value = String(hue);
  const hueOutput = getAccentHueOutput();
  if (hueOutput) hueOutput.value = `${hue}°`;
}

document.addEventListener("input", (event) => {
  if (!(event.target instanceof HTMLInputElement) || !event.target.matches("[data-accent-hue]")) {
    return;
  }
  const hue = validHue(event.target.value, safeAccentHue);
  root.style.setProperty("--accent-hue", String(hue));
  storeValue("color-accent-hue", String(hue));
  syncAccentHue();
});

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const themeButton = event.target.closest<HTMLButtonElement>("[data-theme-value]");
  if (themeButton) {
    const value = themeButton.dataset.themeValue;
    const theme: Theme = includesValue(supportedThemes, value) ? value : "system";
    root.dataset.theme = theme;
    storeValue("color-theme", theme);
    syncTheme();
    closeAppearanceMenu({ restoreFocus: true });
    return;
  }

  const toggle = event.target.closest<HTMLButtonElement>("[data-appearance-toggle]");
  if (!toggle) return;
  const menu = getAppearanceMenu();
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
  const picker = getAppearancePicker();
  if (picker && !picker.contains(event.target as Node)) closeAppearanceMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && getAppearanceMenu()?.classList.contains("open")) {
    closeAppearanceMenu({ restoreFocus: true });
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
  closeAppearanceMenu();
  syncTheme({ broadcast: false });
  syncAccentHue();
});
applyStoredAppearance(root);
syncTheme({ broadcast: false });
syncAccentHue();
