type HeaderPanel = "search" | "navigation" | "appearance" | "language";

const panelOpenEvent = "blog:header-panel-open";

export function announceHeaderPanelOpen(panel: HeaderPanel) {
  document.dispatchEvent(new CustomEvent<HeaderPanel>(panelOpenEvent, { detail: panel }));
}

export function onHeaderPanelOpen(listener: (panel: HeaderPanel) => void, signal?: AbortSignal) {
  document.addEventListener(
    panelOpenEvent,
    (event) => listener((event as CustomEvent<HeaderPanel>).detail),
    { signal }
  );
}
