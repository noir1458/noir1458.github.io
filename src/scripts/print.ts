// Preserve the reader's disclosure state on print/cancel.
const openedForPrint = new Set<HTMLDetailsElement>();

function preparePrint() {
  document
    .querySelectorAll<HTMLDetailsElement>(".article-content details:not([open])")
    .forEach((details) => {
      openedForPrint.add(details);
      details.open = true;
    });
}

function restorePrint() {
  for (const details of openedForPrint) details.open = false;
  openedForPrint.clear();
}

window.addEventListener("beforeprint", preparePrint);
window.addEventListener("afterprint", restorePrint);
document.addEventListener("astro:before-swap", restorePrint);
