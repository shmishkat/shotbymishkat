// Image protection JavaScript
// Prevents easy downloading of images from the gallery

// Aggressively disable the download function
if (typeof window !== 'undefined'){
  window.enableDownload = false;
}

document.addEventListener('DOMContentLoaded', function() {
  // Prevent context menu on gallery images
  const galleryImages = document.querySelectorAll('.gallery-item img, .pswp__img, img[alt]');
  
  galleryImages.forEach(img => {
    // Disable right-click context menu
    img.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      return false;
    });
    
    // Disable drag and drop
    img.addEventListener('dragstart', function(e) {
      e.preventDefault();
      return false;
    });
    
    // Additional protection on mousedown
    img.addEventListener('mousedown', function(e) {
      if (e.button === 2) { // Right click
        e.preventDefault();
        return false;
      }
    });
  });
  
  // Remove download button if it exists
  const removeDownloadButton = () => {
    // Multiple selectors to catch the download button
    const downloadButtons = document.querySelectorAll(
      '[data-pswp-download-url], ' +
      '.pswp__button--download-button, ' +
      'a[download], ' +
      '.pswp__icn-download, ' +
      'button[title*="Download"], ' +
      'a[title*="Download"], ' +
      'button[aria-label*="Download"], ' +
      'a[aria-label*="Download"], ' +
      '.pswp__element--download, ' +
      '[class*="download"]'
    );
    
    downloadButtons.forEach(btn => {
      // Skip elements that might be form downloads or legitimate
      if (!btn.classList.contains('gallery-download-allowed')) {
        btn.remove();
      }
    });
  };
  
  // Remove on initial load
  removeDownloadButton();
  
  // Monitor for dynamically loaded images (PhotoSwipe lightbox)
  const observer = new MutationObserver(function(mutations) {
    let hasDownloadButton = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(function(node) {
          // Check for download button in added nodes
          if (node.classList && (
            node.classList.contains('pswp__button--download-button') ||
            node.classList.contains('pswp__icn-download') ||
            node.hasAttribute('data-pswp-download-url') ||
            node.getAttribute('title')?.includes('Download') ||
            node.getAttribute('aria-label')?.includes('Download') ||
            Array.from(node.classList || []).some(c => c.includes('download'))
          )) {
            hasDownloadButton = true;
          }
          
          // Check for child elements
          if (node.querySelectorAll) {
            const downloadInChildren = node.querySelectorAll(
              '[data-pswp-download-url], ' +
              '.pswp__button--download-button, ' +
              'a[download], ' +
              '.pswp__icn-download'
            );
            if (downloadInChildren.length > 0) {
              hasDownloadButton = true;
            }
          }
          
          if (node.nodeName === 'IMG') {
            // Apply protection to newly added images
            node.addEventListener('contextmenu', function(e) {
              e.preventDefault();
              return false;
            });
            node.addEventListener('dragstart', function(e) {
              e.preventDefault();
              return false;
            });
          }
          // Check for child images
          if (node.querySelectorAll) {
            const childImages = node.querySelectorAll('img');
            childImages.forEach(childImg => {
              childImg.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
              });
              childImg.addEventListener('dragstart', function(e) {
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
  
  // Observe the document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Prevent saving images via keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Ctrl+S or Cmd+S (Save)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      return false;
    }
  });
  
  // Aggressive cleanup - remove download elements every 300ms
  setInterval(function() {
    removeDownloadButton();
  }, 300);
});

// Also protect against direct file access patterns
document.addEventListener('click', function(e) {
  if (e.target.tagName === 'A' && e.target.hasAttribute('download')) {
    e.preventDefault();
    return false;
  }
}, true);

