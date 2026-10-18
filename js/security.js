/**
 * Security & Anti-Inspection Module
 * Md. Mostasim Mahmud Tasim — Portfolio & Technical Articles
 * 
 * Features:
 * 1. Blocks context menu (right-click) across the entire site
 * 2. Blocks developer shortcuts: F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+Shift+K, Ctrl+U, Ctrl+S (and Mac Cmd equivalents)
 * 3. Prevents dragging, copying, and middle-clicking images
 * 4. Detects open Developer Tools (docked inspection) and redirects to access-denied.html
 * 5. Clears and protects console output
 */
(function () {
  'use strict';

  var isAccessDenied = window.location.pathname.endsWith('access-denied.html');

  /* ============================================================
     1. DISABLE CONTEXT MENU (RIGHT-CLICK)
     ============================================================ */
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
  }, { capture: true });

  /* ============================================================
     2. DISABLE DEVTOOLS & SOURCE INSPECTION KEYBOARD SHORTCUTS
     ============================================================ */
  document.addEventListener('keydown', function (e) {
    var isCtrlOrCmd = e.ctrlKey || e.metaKey;
    var isShift = e.shiftKey;
    var isAlt = e.altKey;
    var key = (e.key || '').toUpperCase();
    var keyCode = e.keyCode || e.which;

    // F12 key
    if (key === 'F12' || keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+I / Cmd+Option+I (Inspect Elements)
    // Ctrl+Shift+J / Cmd+Option+J (Developer Console)
    // Ctrl+Shift+C / Cmd+Option+C (Inspect Element Picker)
    // Ctrl+Shift+K / Cmd+Option+K (Firefox Web Console)
    if (isCtrlOrCmd && (isShift || isAlt) && (
      key === 'I' || key === 'J' || key === 'C' || key === 'K' ||
      keyCode === 73 || keyCode === 74 || keyCode === 67 || keyCode === 75
    )) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+U / Cmd+Option+U (View Page Source)
    if (isCtrlOrCmd && (key === 'U' || keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+S / Cmd+S (Save Page Source)
    if (isCtrlOrCmd && (key === 'S' || keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, { capture: true });

  /* ============================================================
     3. PREVENT IMAGE DRAGGING & UNWANTED ASSET ACTIONS
     ============================================================ */
  document.addEventListener('dragstart', function (e) {
    if (e.target && e.target.nodeName === 'IMG') {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  document.addEventListener('mousedown', function (e) {
    if (e.target && e.target.nodeName === 'IMG' && (e.button === 1 || e.button === 2)) {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  document.addEventListener('auxclick', function (e) {
    if (e.button === 1 && e.target && e.target.nodeName === 'IMG') {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  /* ============================================================
     4. CONSOLE LOG CLEARING & ENFORCEMENT
     ============================================================ */
  if (typeof console !== 'undefined') {
    try {
      console.clear();
      console.log(
        '%c[SECURITY PROTOCOL ACTIVE]%c\nSource inspection and developer debugging tools are restricted.',
        'color: #EF4444; font-size: 14px; font-weight: bold;',
        'color: #64748B; font-size: 11px;'
      );
    } catch (e) {}
  }

  /* ============================================================
     5. DOCKED DEVTOOLS DETECTION & REDIRECTION
     ============================================================ */
  if (!isAccessDenied) {
    var devtoolsDetected = false;
    var threshold = 160;

    function getAccessDeniedUrl() {
      try {
        return new URL('access-denied.html', window.location.href).href;
      } catch (e) {
        var path = window.location.pathname;
        var dir = path.substring(0, path.lastIndexOf('/') + 1);
        return window.location.origin + dir + 'access-denied.html';
      }
    }

    function checkDevTools() {
      var widthDiff = window.outerWidth - window.innerWidth;
      var heightDiff = window.outerHeight - window.innerHeight;

      if (widthDiff > threshold || heightDiff > threshold) {
        if (!devtoolsDetected) {
          devtoolsDetected = true;
          try {
            document.body.innerHTML = '';
          } catch (err) {}
          window.location.replace(getAccessDeniedUrl());
        }
      } else {
        devtoolsDetected = false;
      }
    }

    setInterval(checkDevTools, 500);
    window.addEventListener('resize', checkDevTools, { passive: true });
  }
})();
