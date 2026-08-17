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

const mermaidSourceLabels = {
  en: { copy: "Copy", copied: "Copied", title: "Mermaid source" },
  ja: { copy: "コピー", copied: "コピーしました", title: "Mermaid ソース" },
  ko: { copy: "복사", copied: "복사됨", title: "Mermaid 소스" }
} as const;

const mermaidSourceButtons = document.querySelectorAll<HTMLButtonElement>(".mermaid-source");

if (mermaidSourceButtons.length > 0) {
  const language = document.documentElement.lang.toLowerCase().split("-")[0];
  const labels = mermaidSourceLabels[language as keyof typeof mermaidSourceLabels]
    ?? mermaidSourceLabels.en;
  const dialog = document.createElement("dialog");
  const codeBlock = document.createElement("div");
  const sourcePre = document.createElement("pre");
  const sourceCode = document.createElement("code");
  const sourceCopy = document.createElement("button");

  dialog.className = "mermaid-source-dialog";
  dialog.setAttribute("aria-label", labels.title);
  codeBlock.className = "mermaid-source-code-block";
  sourceCopy.className = "code-copy mermaid-source-copy";
  sourceCopy.type = "button";
  sourceCopy.innerHTML = copyIcon;
  sourceCopy.title = labels.copy;
  sourceCopy.setAttribute("aria-label", labels.copy);
  sourceCopy.setAttribute("aria-live", "polite");
  sourcePre.append(sourceCode);
  codeBlock.append(sourcePre, sourceCopy);
  dialog.append(codeBlock);
  document.body.append(dialog);

  let resetTimer = 0;
  function resetCopyButton() {
    window.clearTimeout(resetTimer);
    sourceCopy.innerHTML = copyIcon;
    sourceCopy.classList.remove("copied", "failed");
    sourceCopy.title = labels.copy;
    sourceCopy.setAttribute("aria-label", labels.copy);
  }

  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = codeBlock.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) dialog.close();
  });

  sourceCopy.addEventListener("click", async () => {
    resetCopyButton();
    try {
      await copyText(sourceCode.textContent ?? "");
      sourceCopy.innerHTML = copiedIcon;
      sourceCopy.classList.add("copied");
      sourceCopy.title = labels.copied;
      sourceCopy.setAttribute("aria-label", labels.copied);
    } catch {
      sourceCopy.classList.add("failed");
    }
    resetTimer = window.setTimeout(() => {
      resetCopyButton();
    }, 1800);
  });

  mermaidSourceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      sourceCode.textContent = button.dataset.mermaidSource ?? "";
      resetCopyButton();
      if (!dialog.open) dialog.showModal();
      sourceCopy.focus();
    });
  });
}

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
