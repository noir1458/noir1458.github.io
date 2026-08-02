const scrollTopButton = document.querySelector<HTMLButtonElement>("[data-scroll-top]");
const readingProgress = document.querySelector<HTMLElement>("[data-reading-progress]");
const readingProgressBar = readingProgress?.querySelector<HTMLElement>("span");
const readingArticle = document.querySelector<HTMLElement>("[data-reading-article]");
let scrollFrame = 0;

function syncArticleTools() {
  const showScrollTop = window.scrollY > Math.max(520, window.innerHeight * 0.65);
  scrollTopButton?.classList.toggle("visible", showScrollTop);

  if (readingProgress && readingProgressBar && readingArticle) {
    const bounds = readingArticle.getBoundingClientRect();
    const articleStart = window.scrollY + bounds.top;
    const articleEnd = articleStart + readingArticle.offsetHeight - window.innerHeight;
    const distance = Math.max(1, articleEnd - articleStart);
    const progress = Math.min(1, Math.max(0, (window.scrollY - articleStart) / distance));
    readingProgressBar.style.transform = `scaleX(${progress})`;
    readingProgress.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
  }
}

function requestArticleToolsSync() {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    syncArticleTools();
    scrollFrame = 0;
  });
}

scrollTopButton?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
  });
});
window.addEventListener("scroll", requestArticleToolsSync, { passive: true });
window.addEventListener("resize", requestArticleToolsSync);
syncArticleTools();

async function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

const copyIcon = `
  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
    <rect x="9" y="9" width="11" height="11" rx="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
`;
const copiedIcon = `
  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
    <path d="m5 12 4 4L19 6"></path>
  </svg>
`;

document.querySelectorAll<HTMLElement>(".article-content pre").forEach((pre) => {
  if (pre.dataset.copyReady === "true") return;
  pre.dataset.copyReady = "true";
  const wrapper = document.createElement("div");
  const button = document.createElement("button");
  wrapper.className = "code-block";
  button.className = "code-copy";
  button.type = "button";
  button.innerHTML = copyIcon;
  button.title = "Copy code";
  button.setAttribute("aria-label", "Copy code to clipboard");
  button.setAttribute("aria-live", "polite");
  pre.before(wrapper);
  wrapper.append(pre, button);

  let resetTimer = 0;
  button.addEventListener("click", async () => {
    window.clearTimeout(resetTimer);
    try {
      await copyText(pre.querySelector("code")?.textContent ?? pre.textContent ?? "");
      button.innerHTML = copiedIcon;
      button.classList.add("copied");
      button.classList.remove("failed");
      button.title = "Copied";
      button.setAttribute("aria-label", "Code copied to clipboard");
    } catch {
      button.classList.remove("copied");
      button.classList.add("failed");
      button.title = "Copy failed";
      button.setAttribute("aria-label", "Copy failed; retry");
    }
    resetTimer = window.setTimeout(() => {
      button.innerHTML = copyIcon;
      button.classList.remove("copied");
      button.classList.remove("failed");
      button.title = "Copy code";
      button.setAttribute("aria-label", "Copy code to clipboard");
    }, 1800);
  });
});
