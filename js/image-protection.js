(() => {
  // <stdin>
  if (typeof window !== "undefined") {
    window.enableDownload = false;
  }
  document.addEventListener("DOMContentLoaded", function() {
    const galleryImages = document.querySelectorAll(".gallery-item img, .pswp__img, img[alt]");
    galleryImages.forEach((img) => {
      img.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        return false;
      });
      img.addEventListener("dragstart", function(e) {
        e.preventDefault();
        return false;
      });
      img.addEventListener("mousedown", function(e) {
        if (e.button === 2) {
          e.preventDefault();
          return false;
        }
      });
    });
    const removeDownloadButton = () => {
      const downloadButtons = document.querySelectorAll(
        '[data-pswp-download-url], .pswp__button--download-button, a[download], .pswp__icn-download, button[title*="Download"], a[title*="Download"], button[aria-label*="Download"], a[aria-label*="Download"], .pswp__element--download, [class*="download"]'
      );
      downloadButtons.forEach((btn) => {
        if (!btn.classList.contains("gallery-download-allowed")) {
          btn.remove();
        }
      });
    };
    removeDownloadButton();
    const observer = new MutationObserver(function(mutations) {
      let hasDownloadButton = false;
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(function(node) {
            if (node.classList && (node.classList.contains("pswp__button--download-button") || node.classList.contains("pswp__icn-download") || node.hasAttribute("data-pswp-download-url") || node.getAttribute("title")?.includes("Download") || node.getAttribute("aria-label")?.includes("Download") || Array.from(node.classList || []).some((c) => c.includes("download")))) {
              hasDownloadButton = true;
            }
            if (node.querySelectorAll) {
              const downloadInChildren = node.querySelectorAll(
                "[data-pswp-download-url], .pswp__button--download-button, a[download], .pswp__icn-download"
              );
              if (downloadInChildren.length > 0) {
                hasDownloadButton = true;
              }
            }
            if (node.nodeName === "IMG") {
              node.addEventListener("contextmenu", function(e) {
                e.preventDefault();
                return false;
              });
              node.addEventListener("dragstart", function(e) {
                e.preventDefault();
                return false;
              });
            }
            if (node.querySelectorAll) {
              const childImages = node.querySelectorAll("img");
              childImages.forEach((childImg) => {
                childImg.addEventListener("contextmenu", function(e) {
                  e.preventDefault();
                  return false;
                });
                childImg.addEventListener("dragstart", function(e) {
                  e.preventDefault();
                  return false;
                });
              });
            }
          });
        }
      });
      if (hasDownloadButton) {
        removeDownloadButton();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    document.addEventListener("keydown", function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        return false;
      }
    });
    setInterval(function() {
      removeDownloadButton();
    }, 300);
  });
  document.addEventListener("click", function(e) {
    if (e.target.tagName === "A" && e.target.hasAttribute("download")) {
      e.preventDefault();
      return false;
    }
  }, true);
})();
