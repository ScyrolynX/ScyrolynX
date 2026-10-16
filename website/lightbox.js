(() => {
  const images = Array.from(document.querySelectorAll('.evidence-gallery .evidence-screenshot'));
  if (!images.length) return;

  images.forEach((img, index) => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-haspopup', 'dialog');
    img.setAttribute('aria-label', `Open screenshot ${index + 1} of ${images.length}: ${img.alt}`);
    img.addEventListener('click', () => openAt(index));
    img.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openAt(index);
      }
    });
  });

  const dialog = document.createElement('dialog');
  dialog.className = 'scx-lightbox';
  dialog.setAttribute('aria-label', 'Project screenshot viewer');
  dialog.innerHTML = `
    <div class="scx-lightbox-controls">
      <p class="scx-lightbox-count" aria-live="polite"></p>
      <button type="button" class="scx-lightbox-prev" aria-label="Previous screenshot">‹</button>
      <button type="button" class="scx-lightbox-next" aria-label="Next screenshot">›</button>
      <button type="button" class="scx-lightbox-close" aria-label="Close screenshot viewer">×</button>
    </div>
    <img class="scx-lightbox-image" alt="">
    <p class="scx-lightbox-caption"></p>`;
  document.body.appendChild(dialog);

  const largeImage = dialog.querySelector('.scx-lightbox-image');
  const caption = dialog.querySelector('.scx-lightbox-caption');
  const count = dialog.querySelector('.scx-lightbox-count');
  let current = 0;
  let lastTrigger = null;

  function show(index) {
    current = (index + images.length) % images.length;
    const source = images[current];
    largeImage.src = source.currentSrc || source.src;
    largeImage.alt = source.alt;
    caption.textContent = source.closest('.evidence-card')?.querySelector('h4')?.textContent || source.alt;
    count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
    const multiple = images.length > 1;
    dialog.querySelector('.scx-lightbox-prev').hidden = !multiple;
    dialog.querySelector('.scx-lightbox-next').hidden = !multiple;
  }

  function openAt(index) {
    lastTrigger = images[index];
    show(index);
    if (!dialog.open) dialog.showModal();
    dialog.querySelector('.scx-lightbox-close').focus();
  }

  dialog.querySelector('.scx-lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.scx-lightbox-prev').addEventListener('click', () => show(current - 1));
  dialog.querySelector('.scx-lightbox-next').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    largeImage.removeAttribute('src');
    if (lastTrigger) lastTrigger.focus();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
  });
})();
