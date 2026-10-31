/**
 * StudioMock — Interactive 3D Device Showcase Controller
 * Handles live clock updates, 3D tilt transforms, FileReader uploads, and PNG export.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const captureStage = document.getElementById('captureStage');
  const iphoneDevice = document.getElementById('iphoneDevice');
  const ipadDevice = document.getElementById('ipadDevice');

  const wallpapers = document.querySelectorAll('.screen-wallpaper');
  const customScreenOverrides = document.querySelectorAll('.custom-screen-override');
  const lockUIs = document.querySelectorAll('.lock-screen-ui');
  const clockElements = document.querySelectorAll('.lock-clock');
  const dateElements = document.querySelectorAll('.lock-date');
  const shortcutRows = document.querySelectorAll('.shortcut-Row');
  const notifications = document.querySelectorAll('.lock-notification');

  // --- Controls ---
  const swatchButtons = document.querySelectorAll('#wallpaperSwatches .swatch');
  const wallpaperUpload = document.getElementById('wallpaperUpload');
  const fullScreenUpload = document.getElementById('fullScreenUpload');
  const screenModeStatus = document.getElementById('screenModeStatus');

  const liveTimeToggle = document.getElementById('liveTimeToggle');
  const manualTimeInput = document.getElementById('manualTimeInput');
  const dateInput = document.getElementById('dateInput');

  const rotateYSlider = document.getElementById('rotateYSlider');
  const rotateXSlider = document.getElementById('rotateXSlider');
  const tiltValueLabel = document.getElementById('tiltValueLabel');
  const floatAnimToggle = document.getElementById('floatAnimToggle');

  const frameButtons = document.querySelectorAll('#frameColorSelector .frame-swatch');
  const toggleIcons = document.getElementById('toggleIcons');
  const toggleNotif = document.getElementById('toggleNotif');

  const focusButtons = document.querySelectorAll('#focusSelector .seg-btn');
  const swapSidesBtn = document.getElementById('swapSidesBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const resetBtn = document.getElementById('resetBtn');

  let clockInterval = null;

  // =========================================================================
  // 1. CLOCK & DATE MANAGEMENT
  // =========================================================================
  function formatTwoDigits(num) {
    return num.toString().padStart(2, '0');
  }

  function updateClockDisplay() {
    if (liveTimeToggle.checked) {
      const now = new Date();
      const hours = formatTwoDigits(now.getHours());
      const minutes = formatTwoDigits(now.getMinutes());
      const timeStr = `${hours}:${minutes}`;
      clockElements.forEach(el => (el.textContent = timeStr));
      manualTimeInput.value = timeStr;
    } else {
      const timeVal = manualTimeInput.value || '09:41';
      clockElements.forEach(el => (el.textContent = timeVal));
    }
  }

  function formatCurrentDate() {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  }

  function initClockAndDate() {
    const todayFormatted = formatCurrentDate();
    dateInput.value = todayFormatted;
    dateElements.forEach(el => (el.textContent = todayFormatted));

    updateClockDisplay();
    if (clockInterval) clearInterval(clockInterval);
    clockInterval = setInterval(updateClockDisplay, 1000);
  }

  liveTimeToggle.addEventListener('change', () => {
    updateClockDisplay();
  });

  manualTimeInput.addEventListener('input', () => {
    liveTimeToggle.checked = false;
    updateClockDisplay();
  });

  dateInput.addEventListener('input', (e) => {
    const val = e.target.value.trim() || 'Wednesday, October 24';
    dateElements.forEach(el => (el.textContent = val));
  });

  // =========================================================================
  // 2. WALLPAPER SWATCHES & IMAGE UPLOADS (FileReader)
  // =========================================================================
  function clearFullScreenOverride() {
    customScreenOverrides.forEach(img => {
      img.src = '';
      img.classList.add('hidden');
    });
    lockUIs.forEach(ui => ui.classList.remove('hidden'));
    screenModeStatus.textContent = 'Lock UI Active';
  }

  swatchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      swatchButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const presetClass = btn.getAttribute('data-preset');
      clearFullScreenOverride();

      wallpapers.forEach(wp => {
        wp.style.backgroundImage = '';
        wp.className = `screen-wallpaper ${presetClass}`;
      });
    });
  });

  // Upload Custom Lock Screen Wallpaper (keeps clock & icons visible)
  wallpaperUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      clearFullScreenOverride();
      swatchButtons.forEach(b => b.classList.remove('active'));

      wallpapers.forEach(wp => {
        wp.className = 'screen-wallpaper';
        wp.style.backgroundImage = `url('${event.target.result}')`;
      });
      screenModeStatus.textContent = 'Custom Wallpaper';
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  // Upload Full App Screenshot (replaces entire screen content)
  fullScreenUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      swatchButtons.forEach(b => b.classList.remove('active'));
      customScreenOverrides.forEach(img => {
        img.src = event.target.result;
        img.classList.remove('hidden');
      });
      lockUIs.forEach(ui => ui.classList.add('hidden'));
      screenModeStatus.textContent = 'Full Screenshot';
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  // =========================================================================
  // 3. 3D TILT, PERSPECTIVE & FLOATING ANIMATION
  // =========================================================================
  function update3DTilt() {
    const rotY = parseInt(rotateYSlider.value, 10);
    const rotX = parseInt(rotateXSlider.value, 10);

    // Symmetrical inward angle for iPhone (left) and iPad (right)
    document.documentElement.style.setProperty('--iphone-rot-y', `${rotY}deg`);
    document.documentElement.style.setProperty('--iphone-rot-x', `${rotX}deg`);
    document.documentElement.style.setProperty('--ipad-rot-y', `${-rotY}deg`);
    document.documentElement.style.setProperty('--ipad-rot-x', `${rotX}deg`);

    tiltValueLabel.textContent = `${rotY}° / ${rotX}°`;
  }

  rotateYSlider.addEventListener('input', update3DTilt);
  rotateXSlider.addEventListener('input', update3DTilt);

  function updateFloatingState() {
    if (floatAnimToggle.checked) {
      iphoneDevice.classList.add('floating');
      ipadDevice.classList.add('floating');
    } else {
      iphoneDevice.classList.remove('floating');
      ipadDevice.classList.remove('floating');
    }
  }

  floatAnimToggle.addEventListener('change', updateFloatingState);

  // =========================================================================
  // 4. HARDWARE FINISH & LOCK SCREEN UI TOGGLES
  // =========================================================================
  frameButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      frameButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const frameClass = btn.getAttribute('data-frame');
      [iphoneDevice, ipadDevice].forEach(dev => {
        dev.classList.remove('frame-space-gray', 'frame-silver', 'frame-gold');
        dev.classList.add(frameClass);
      });
    });
  });

  toggleIcons.addEventListener('change', () => {
    shortcutRows.forEach(row => {
      row.style.opacity = toggleIcons.checked ? '1' : '0';
      row.style.pointerEvents = toggleIcons.checked ? 'auto' : 'none';
    });
  });

  toggleNotif.addEventListener('change', () => {
    notifications.forEach(notif => {
      notif.style.opacity = toggleNotif.checked ? '1' : '0';
      notif.style.transform = toggleNotif.checked ? 'translateY(0)' : 'translateY(6px)';
    });
  });

  // =========================================================================
  // 5. STAGE VIEW FOCUS & SWAP SIDES
  // =========================================================================
  focusButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      focusButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const view = btn.getAttribute('data-view');
      captureStage.classList.remove('focus-iphone', 'focus-ipad');
      if (view === 'iphone') captureStage.classList.add('focus-iphone');
      if (view === 'ipad') captureStage.classList.add('focus-ipad');
    });
  });

  swapSidesBtn.addEventListener('click', () => {
    captureStage.classList.toggle('swapped');
  });

  // =========================================================================
  // 6. EXPORT SNAPSHOT AS PNG (html2canvas)
  // =========================================================================
  downloadBtn.addEventListener('click', async () => {
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<span>Rendering PNG...</span>';
    downloadBtn.disabled = true;

    // Temporarily pause floating animation for crisp capture
    const wasFloating = floatAnimToggle.checked;
    iphoneDevice.classList.remove('floating');
    ipadDevice.classList.remove('floating');

    try {
      const canvas = await html2canvas(captureStage, {
        backgroundColor: '#eef0f5',
        scale: 2,
        useCORS: true,
        logging: false
      });

      const link = document.createElement('a');
      link.download = `studiomock-showcase-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Snapshot export failed:', err);
      alert('Could not export snapshot. Try again.');
    } finally {
      if (wasFloating) {
        iphoneDevice.classList.add('floating');
        ipadDevice.classList.add('floating');
      }
      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;
    }
  });

  // =========================================================================
  // 7. RESET TO DEFAULTS
  // =========================================================================
  resetBtn.addEventListener('click', () => {
    // Reset Wallpaper
    clearFullScreenOverride();
    swatchButtons.forEach((b, i) => b.classList.toggle('active', i === 0));
    wallpapers.forEach(wp => {
      wp.style.backgroundImage = '';
      wp.className = 'screen-wallpaper preset-1';
    });

    // Reset Clock & Date
    liveTimeToggle.checked = true;
    initClockAndDate();

    // Reset 3D Tilt
    rotateYSlider.value = 22;
    rotateXSlider.value = 10;
    update3DTilt();
    floatAnimToggle.checked = true;
    updateFloatingState();

    // Reset Frame Color
    frameButtons.forEach((b, i) => b.classList.toggle('active', i === 0));
    [iphoneDevice, ipadDevice].forEach(dev => {
      dev.classList.remove('frame-silver', 'frame-gold');
      dev.classList.add('frame-space-gray');
    });

    // Reset UI Toggles
    toggleIcons.checked = true;
    toggleIcons.dispatchEvent(new Event('change'));
    toggleNotif.checked = true;
    toggleNotif.dispatchEvent(new Event('change'));

    // Reset Stage View
    captureStage.classList.remove('swapped', 'focus-iphone', 'focus-ipad');
    focusButtons.forEach((b, i) => b.classList.toggle('active', i === 0));
  });

  // Initialize on Page Load
  initClockAndDate();
  update3DTilt();
  updateFloatingState();
});
