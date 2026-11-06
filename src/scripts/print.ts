// Preserve the reader's disclosure state on print/cancel.
const openedForPrint = new Set<HTMLDetailsElement>();
let titleBeforePrint: string | undefined;

function preparePrint() {
  const printTitle = document.querySelector<HTMLElement>("[data-print-title]")?.dataset.printTitle;
  if (printTitle && titleBeforePrint === undefined) {
    titleBeforePrint = document.title;
    document.title = printTitle;
  }
  document
    .querySelectorAll<HTMLDetailsElement>(".article-content details:not([open])")
    .forEach((details) => {
      openedForPrint.add(details);
      details.open = true;
    });
}

function restorePrint() {
  if (titleBeforePrint !== undefined) {
    document.title = titleBeforePrint;
    titleBeforePrint = undefined;
  }
  for (const details of openedForPrint) details.open = false;
  openedForPrint.clear();
}

window.addEventListener("beforeprint", preparePrint);
window.addEventListener("afterprint", restorePrint);
document.addEventListener("astro:before-swap", restorePrint);
document.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("[data-print-page]")) window.print();
});
