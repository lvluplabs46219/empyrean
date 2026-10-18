// Telegram Web UI for Empyrean GenTeam Autonomous Multi-Agent Workspace
// Design Scheme: Candy — Playful & Vibrant ("Joyful Pop") with Light & Dark Mode + Settings Modal
export function renderDashboard(): string {
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Empyrean Multi-Agent Orchestrator</title>
  <meta name="description" content="Multi-agent orchestration kernel featuring YHWH (planning), Michael (orchestrator), Gabriel (messenger), Raphael (worker), and Metatron/Seraphim (gateway & reasoning).">
  <meta property="og:title" content="Empyrean Multi-Agent Orchestrator">
  <meta property="og:description" content="Multi-agent orchestration kernel featuring YHWH (planning), Michael (orchestrator), Gabriel (messenger), Raphael (worker), and Metatron/Seraphim (gateway & reasoning).">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..800;1,9..40,400..800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    /* ==========================================================================
       CANDY — PLAYFUL & VIBRANT DESIGN TOKENS ("JOYFUL POP")
       ========================================================================== */
    :root, [data-theme="light"] {
      --candy-mode: "light";
      --candy-surface: #fff7fb;
      --candy-surface-dim: #efd0f7;
      --candy-surface-bright: #fff7fb;
      --candy-surface-lowest: #ffffff;
      --candy-surface-low: #ffefff;
      --candy-surface-container: #fde7ff;
      --candy-surface-high: #fae0ff;
      --candy-surface-highest: #f8d8ff;
      --candy-on-surface: #281330;
      --candy-on-surface-variant: #57414a;
      --candy-inverse-surface: #3e2846;
      --candy-inverse-on-surface: #feebff;
      --candy-outline: #8a707b;
      --candy-outline-variant: #ddbfca;
      --candy-surface-tint: #b2107b;
      --candy-primary: #af0a78;
      --candy-primary-accent: #e040a0;
      --candy-on-primary: #ffffff;
      --candy-primary-container: #cf3192;
      --candy-on-primary-container: #fffbff;
      --candy-inverse-primary: #ffafd5;
      --candy-secondary: #744aa2;
      --candy-secondary-accent: #7c52aa;
      --candy-on-secondary: #ffffff;
      --candy-secondary-container: #cda0fe;
      --candy-on-secondary-container: #5a3086;
      --candy-tertiary: #006388;
      --candy-tertiary-accent: #0096cc;
      --candy-on-tertiary: #ffffff;
      --candy-tertiary-container: #007dab;
      --candy-on-tertiary-container: #fcfcff;
      --candy-error: #ba1a1a;
      --candy-on-error: #ffffff;
      --candy-error-container: #ffdad6;
      --candy-on-error-container: #93000a;
      --candy-background: #fff7fb;
      --candy-on-background: #281330;
      --candy-surface-variant: #f8d8ff;
      --candy-card-bg: #ffffff;
      --candy-card-border: #f8d8ff;
      --candy-msg-in: #ffffff;
      --candy-msg-in-text: #281330;
      --candy-msg-out: linear-gradient(135deg, #e040a0, #af0a78);
      --candy-msg-out-text: #ffffff;
      --candy-shadow-primary: 0 4px 16px rgba(224, 64, 160, 0.22);
      --candy-shadow-card: 0 6px 20px rgba(116, 74, 162, 0.08);
      --candy-shadow-hover: 0 8px 24px rgba(224, 64, 160, 0.28);
      --candy-online: #10b981;
      --candy-check: #10b981;
      --font-candy: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    [data-theme="dark"] {
      --candy-mode: "dark";
      --candy-surface: #1d0e23;
      --candy-surface-dim: #16081b;
      --candy-surface-bright: #291432;
      --candy-surface-lowest: #140718;
      --candy-surface-low: #22102a;
      --candy-surface-container: #2c1536;
      --candy-surface-high: #371a43;
      --candy-surface-highest: #432052;
      --candy-on-surface: #feebff;
      --candy-on-surface-variant: #e0bfd2;
      --candy-inverse-surface: #fde7ff;
      --candy-inverse-on-surface: #281330;
      --candy-outline: #77566a;
      --candy-outline-variant: #492a3e;
      --candy-surface-tint: #ff75c8;
      --candy-primary: #ff4db8;
      --candy-primary-accent: #e040a0;
      --candy-on-primary: #ffffff;
      --candy-primary-container: #930864;
      --candy-on-primary-container: #ffd8e8;
      --candy-inverse-primary: #af0a78;
      --candy-secondary: #cda0fe;
      --candy-secondary-accent: #9d6ee8;
      --candy-on-secondary: #2b0052;
      --candy-secondary-container: #5a3086;
      --candy-on-secondary-container: #efdbff;
      --candy-tertiary: #56ccf2;
      --candy-tertiary-accent: #0096cc;
      --candy-on-tertiary: #001e2d;
      --candy-tertiary-container: #004c6a;
      --candy-on-tertiary-container: #c5e7ff;
      --candy-error: #ffb4ab;
      --candy-on-error: #690005;
      --candy-error-container: #93000a;
      --candy-on-error-container: #ffdad6;
      --candy-background: #170a1b;
      --candy-on-background: #feebff;
      --candy-surface-variant: #3a1c46;
      --candy-card-bg: #271330;
      --candy-card-border: #442154;
      --candy-msg-in: #2c1536;
      --candy-msg-in-text: #feebff;
      --candy-msg-out: linear-gradient(135deg, #e040a0, #930864);
      --candy-msg-out-text: #ffffff;
      --candy-shadow-primary: 0 4px 18px rgba(224, 64, 160, 0.4);
      --candy-shadow-card: 0 6px 20px rgba(0, 0, 0, 0.4);
      --candy-shadow-hover: 0 8px 26px rgba(224, 64, 160, 0.45);
      --candy-online: #34d399;
      --candy-check: #34d399;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--candy-background);
      color: var(--candy-on-background);
      font-family: var(--font-candy);
      height: 100vh;
      overflow: hidden;
      display: flex;
      font-size: 14px;
      line-height: 1.5;
      transition: background-color 0.25s ease, color 0.25s ease;
    }

    /* Scrollbars */
    ::-webkit-scrollbar { width: 7px; height: 7px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb {
      background: var(--candy-surface-highest);
      border-radius: 9999px;
    }
    ::-webkit-scrollbar-thumb:hover { background: var(--candy-primary-accent); }

    /* Bouncy micro-interaction utility */
    .candy-bounce {
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, background 0.15s ease;
    }
    .candy-bounce:hover {
      transform: scale(1.03);
    }
    .candy-bounce:active {
      transform: scale(0.97);
    }

    /* Left Sidebar: Telegram Navigation */
    .tg-sidebar {
      width: 340px;
      min-width: 340px;
      background: var(--candy-surface);
      border-right: 1.5px solid var(--candy-surface-variant);
      display: flex;
      flex-direction: column;
      height: 100vh;
      z-index: 30;
      user-select: none;
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }

    .tg-sidebar-header {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1.5px solid var(--candy-surface-variant);
      position: relative;
    }

    .tg-icon-btn {
      background: var(--candy-surface-container);
      border: 1px solid var(--candy-surface-highest);
      color: var(--candy-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 9999px;
      box-shadow: 0 2px 8px rgba(116, 74, 162, 0.08);
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.15s;
    }
    .tg-icon-btn:hover {
      background: var(--candy-surface-high);
      transform: scale(1.06);
      color: var(--candy-primary-accent);
    }

    .tg-search-bar {
      flex: 1;
      background: var(--candy-surface-container);
      border: 1.5px solid var(--candy-surface-variant);
      border-radius: 9999px;
      padding: 7px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    }
    .tg-search-bar:hover {
      border-color: var(--candy-primary-accent);
      background: var(--candy-surface-lowest);
      box-shadow: var(--candy-shadow-primary);
    }
    .tg-search-bar input {
      background: transparent;
      border: none;
      outline: none;
      color: var(--candy-on-surface);
      font-size: 13.5px;
      font-family: var(--font-candy);
      width: 100%;
      cursor: pointer;
    }
    .tg-search-shortcut {
      font-size: 10px;
      font-family: var(--font-mono);
      background: var(--candy-primary-container);
      color: var(--candy-on-primary-container);
      padding: 2px 7px;
      border-radius: 9999px;
      font-weight: 700;
    }

    /* Telegram Folder Tabs (Pill style) */
    .tg-tabs-bar {
      display: flex;
      background: var(--candy-surface);
      border-bottom: 1.5px solid var(--candy-surface-variant);
      padding: 8px 12px;
      gap: 6px;
      overflow-x: auto;
    }
    .tg-tab-btn {
      background: var(--candy-surface-container);
      border: 1px solid var(--candy-surface-highest);
      color: var(--candy-on-surface-variant);
      font-size: 12.5px;
      font-weight: 600;
      font-family: var(--font-candy);
      padding: 6px 14px;
      border-radius: 9999px;
      cursor: pointer;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .tg-tab-btn:hover {
      color: var(--candy-primary);
      background: var(--candy-surface-highest);
      transform: scale(1.04);
    }
    .tg-tab-btn.active {
      background: var(--candy-primary);
      color: #ffffff;
      border-color: var(--candy-primary);
      box-shadow: var(--candy-shadow-primary);
    }
    .tg-tab-badge {
      background: rgba(255, 255, 255, 0.25);
      color: inherit;
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 9999px;
      font-weight: 700;
    }

    .sidebar-category {
      padding: 14px 16px 6px;
      font-size: 11.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--candy-secondary);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sidebar-action-link {
      color: var(--candy-primary-accent);
      font-size: 12px;
      cursor: pointer;
      text-transform: none;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 9999px;
      background: var(--candy-surface-container);
      transition: background 0.15s;
    }
    .sidebar-action-link:hover {
      background: var(--candy-surface-highest);
    }

    .tg-chat-list {
      flex: 1;
      overflow-y: auto;
      list-style: none;
      padding: 4px 8px;
    }
    .tg-chat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      margin-bottom: 4px;
      cursor: pointer;
      border-radius: 16px;
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      border: 1px solid transparent;
    }
    .tg-chat-item:hover {
      background: var(--candy-surface-container);
      transform: translateX(3px);
    }
    .tg-chat-item.active {
      background: var(--candy-surface-highest);
      border-color: var(--candy-primary-accent);
      box-shadow: 0 4px 14px rgba(224, 64, 160, 0.12);
    }
    .tg-avatar {
      width: 44px;
      height: 44px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 15px;
      color: #fff;
      flex-shrink: 0;
      position: relative;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
    }
    .tg-online-badge {
      width: 12px;
      height: 12px;
      border-radius: 9999px;
      background: var(--candy-online);
      position: absolute;
      bottom: 0;
      right: 0;
      border: 2px solid var(--candy-surface);
      box-shadow: 0 0 6px var(--candy-online);
    }
    .tg-online-badge.cloud {
      background: var(--candy-secondary-container);
    }
    .tg-chat-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .tg-chat-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .tg-chat-name {
      font-weight: 700;
      font-size: 13.5px;
      color: var(--candy-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tg-chat-time {
      font-size: 11px;
      color: var(--candy-on-surface-variant);
      font-weight: 500;
    }
    .tg-chat-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
    }
    .tg-chat-preview {
      font-size: 12px;
      color: var(--candy-on-surface-variant);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }
    .tg-unread-badge {
      background: var(--candy-primary-accent);
      color: #fff;
      font-size: 10.5px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 9999px;
      min-width: 20px;
      text-align: center;
      box-shadow: var(--candy-shadow-primary);
    }

    /* Sidebar Footer */
    .tg-sidebar-footer {
      padding: 12px 16px;
      border-top: 1.5px solid var(--candy-surface-variant);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--candy-surface-low);
      font-size: 12px;
    }
    .user-pill { display: flex; align-items: center; gap: 8px; }
    .user-avatar-sm {
      width: 28px;
      height: 28px;
      border-radius: 9999px;
      background: linear-gradient(135deg, var(--candy-primary), var(--candy-secondary));
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 11px;
      box-shadow: var(--candy-shadow-primary);
    }

    /* Main Workspace Container (Chat + Canvas side by side) */
    .tg-workspace-container {
      flex: 1;
      display: flex;
      height: 100vh;
      overflow: hidden;
      position: relative;
    }

    /* Main Chat Viewport */
    .tg-main {
      flex: 1;
      min-width: 360px;
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--candy-background);
      position: relative;
      transition: flex 0.2s ease, background 0.25s ease;
    }

    /* Top Chat Header */
    .tg-header {
      background: var(--candy-surface);
      border-bottom: 1.5px solid var(--candy-surface-variant);
      padding: 10px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      z-index: 10;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
    }
    .tg-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }
    .tg-header-details { display: flex; flex-direction: column; }
    .tg-header-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--candy-on-surface);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .tg-header-subtitle {
      font-size: 12px;
      color: var(--candy-on-surface-variant);
      font-weight: 500;
    }
    .tg-header-tools { display: flex; align-items: center; gap: 8px; }

    /* Pill Buttons (Candy North Star) */
    .candy-pill-btn {
      background: var(--candy-surface-container);
      border: 1.5px solid var(--candy-surface-highest);
      color: var(--candy-on-surface);
      font-size: 12.5px;
      font-weight: 600;
      font-family: var(--font-candy);
      padding: 7px 15px;
      border-radius: 9999px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 7px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s, background 0.15s, border-color 0.15s;
    }
    .candy-pill-btn:hover {
      background: var(--candy-surface-highest);
      transform: scale(1.04);
      border-color: var(--candy-primary-accent);
      color: var(--candy-primary);
    }
    .candy-pill-btn.primary {
      background: var(--candy-primary);
      color: #ffffff;
      border-color: var(--candy-primary);
      box-shadow: var(--candy-shadow-primary);
    }
    .candy-pill-btn.primary:hover {
      background: var(--candy-primary-accent);
      box-shadow: var(--candy-shadow-hover);
    }
    .candy-pill-btn.active {
      background: var(--candy-primary);
      color: #ffffff;
      border-color: var(--candy-primary);
      box-shadow: var(--candy-shadow-primary);
    }

    /* Pinned Message Ribbon */
    .tg-pinned-ribbon {
      background: var(--candy-surface-low);
      border-bottom: 1px solid var(--candy-surface-variant);
      padding: 8px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12.5px;
      cursor: pointer;
      z-index: 9;
      transition: background 0.15s;
    }
    .tg-pinned-ribbon:hover { background: var(--candy-surface-container); }
    .tg-pinned-left {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .tg-pinned-title {
      font-weight: 700;
      color: var(--candy-primary);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .tg-pinned-text {
      color: var(--candy-on-surface-variant);
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Chat Messages Stream */
    .tg-messages-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      background: var(--candy-background);
    }

    .tg-date-divider {
      align-self: center;
      background: var(--candy-surface-container);
      border: 1px solid var(--candy-surface-highest);
      padding: 4px 16px;
      border-radius: 9999px;
      font-size: 11px;
      color: var(--candy-on-surface-variant);
      font-weight: 700;
      margin: 4px 0;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    }

    /* Message Bubbles */
    .tg-msg-wrapper {
      display: flex;
      gap: 12px;
      max-width: 82%;
      align-self: flex-start;
      position: relative;
    }
    .tg-msg-wrapper.outgoing {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    .tg-msg-bubble {
      padding: 10px 16px 8px 16px;
      border-radius: 20px 20px 20px 4px;
      background: var(--candy-msg-in);
      color: var(--candy-msg-in-text);
      border: 1.5px solid var(--candy-card-border);
      box-shadow: var(--candy-shadow-card);
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 150px;
    }
    .tg-msg-wrapper.outgoing .tg-msg-bubble {
      background: var(--candy-msg-out);
      color: var(--candy-msg-out-text);
      border-radius: 20px 20px 4px 20px;
      border: none;
      box-shadow: var(--candy-shadow-primary);
    }
    .tg-msg-sender {
      font-weight: 700;
      font-size: 12.5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
    }
    .tg-role-tag {
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 9999px;
      background: var(--candy-surface-container);
      color: var(--candy-secondary);
      font-weight: 700;
    }
    .tg-msg-text {
      font-size: 14.5px;
      line-height: 1.5;
      word-break: break-word;
    }
    .tg-msg-wrapper.outgoing .tg-msg-text {
      color: #ffffff;
    }

    /* Live Activity & Task Tracker Monitoring (Candy Card) */
    .tg-activity-card {
      background: var(--candy-surface-low);
      border: 1.5px solid var(--candy-surface-highest);
      border-left: 4px solid var(--candy-primary-accent);
      border-radius: 16px;
      padding: 10px 14px;
      margin-top: 6px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    }
    .tg-activity-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
    }
    .tg-activity-title {
      font-weight: 700;
      color: var(--candy-on-surface);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .tg-step-tracker {
      display: flex;
      align-items: center;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 2px;
    }
    .tg-step-pill {
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 9999px;
      background: var(--candy-surface-container);
      color: var(--candy-on-surface-variant);
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 600;
    }
    .tg-step-pill.completed {
      background: rgba(16, 185, 129, 0.15);
      color: var(--candy-online);
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    /* Specialized Execution Canvas Attachment Pill (Candy Card) */
    .tg-canvas-card {
      background: var(--candy-surface-low);
      border: 1.5px solid var(--candy-surface-highest);
      border-radius: 18px;
      padding: 11px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      margin-top: 6px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .tg-canvas-card:hover {
      background: var(--candy-surface-container);
      transform: translateY(-2px);
      box-shadow: var(--candy-shadow-primary);
      border-color: var(--candy-primary-accent);
    }
    .tg-canvas-info {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--candy-on-surface);
      font-size: 13px;
      font-weight: 600;
    }
    .tg-canvas-btn {
      font-size: 12px;
      color: var(--candy-primary);
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* Inline Action Buttons (Candy Pills) */
    .tg-inline-keyboard {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }
    .tg-inline-btn {
      background: var(--candy-surface-container);
      border: 1.5px solid var(--candy-surface-highest);
      color: var(--candy-primary);
      font-size: 12px;
      font-weight: 700;
      font-family: var(--font-candy);
      padding: 6px 14px;
      border-radius: 9999px;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .tg-inline-btn:hover {
      background: var(--candy-primary);
      color: #ffffff;
      border-color: var(--candy-primary);
      transform: scale(1.05);
      box-shadow: var(--candy-shadow-primary);
    }

    /* Code Blocks */
    .tg-code-block {
      background: var(--candy-surface-lowest);
      border: 1.5px solid var(--candy-surface-variant);
      border-radius: 14px;
      padding: 12px 14px;
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--candy-secondary);
      overflow-x: auto;
      margin: 4px 0;
      line-height: 1.45;
      white-space: pre;
    }

    /* Voice Note Player (Candy Pill Style) */
    .tg-voice-player {
      background: var(--candy-surface-low);
      border: 1.5px solid var(--candy-surface-highest);
      border-radius: 9999px;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 6px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
    }
    .tg-voice-btn {
      width: 34px;
      height: 34px;
      border-radius: 9999px;
      background: var(--candy-primary);
      border: none;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      box-shadow: var(--candy-shadow-primary);
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .tg-voice-btn:hover { transform: scale(1.08); background: var(--candy-primary-accent); }
    .tg-voice-waveform {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 3px;
      height: 24px;
    }
    .wave-stick {
      width: 3.5px;
      background: var(--candy-primary-accent);
      border-radius: 9999px;
      transition: height 0.2s;
    }
    .tg-voice-duration {
      font-size: 11px;
      color: var(--candy-on-surface-variant);
      font-family: var(--font-mono);
      font-weight: 600;
    }

    /* Footer of Bubble */
    .tg-msg-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
      font-size: 11px;
      color: var(--candy-on-surface-variant);
      margin-top: 2px;
    }
    .tg-msg-wrapper.outgoing .tg-msg-footer {
      color: rgba(255, 255, 255, 0.85);
    }
    .tg-checkmarks {
      color: var(--candy-check);
      font-size: 13px;
      font-weight: 700;
    }
    .tg-msg-wrapper.outgoing .tg-checkmarks {
      color: #ffffff;
    }

    /* Input Bar (Candy Pill Style) */
    .tg-input-bar {
      background: var(--candy-surface);
      border-top: 1.5px solid var(--candy-surface-variant);
      padding: 12px 20px;
      display: flex;
      align-items: flex-end;
      gap: 12px;
      position: relative;
    }

    .tg-input-wrapper {
      flex: 1;
      background: var(--candy-surface-container);
      border: 1.5px solid var(--candy-surface-highest);
      border-radius: 24px;
      padding: 8px 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      position: relative;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .tg-input-wrapper:focus-within {
      border-color: var(--candy-primary-accent);
      background: var(--candy-surface-lowest);
      box-shadow: 0 0 0 3px rgba(224, 64, 160, 0.2);
    }
    .tg-active-contexts-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .tg-context-pill {
      background: var(--candy-surface-highest);
      border: 1px solid var(--candy-primary-accent);
      padding: 2px 10px;
      border-radius: 9999px;
      font-size: 11px;
      color: var(--candy-primary);
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
    }
    .tg-context-remove {
      cursor: pointer;
      color: var(--candy-on-surface-variant);
      font-weight: 700;
    }
    .tg-context-remove:hover { color: var(--candy-primary); }

    .tg-text-input {
      background: transparent;
      border: none;
      outline: none;
      color: var(--candy-on-surface);
      font-size: 14px;
      font-family: var(--font-candy);
      resize: none;
      max-height: 120px;
      width: 100%;
      line-height: 1.45;
    }

    .tg-send-btn {
      width: 44px;
      height: 44px;
      border-radius: 9999px;
      background: var(--candy-primary);
      border: none;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: var(--candy-shadow-primary);
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.15s;
      flex-shrink: 0;
    }
    .tg-send-btn:hover {
      background: var(--candy-primary-accent);
      transform: scale(1.08);
      box-shadow: var(--candy-shadow-hover);
    }
    .tg-send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    /* Typing Indicator */
    .tg-typing-indicator {
      font-size: 12px;
      color: var(--candy-primary);
      padding: 6px 24px;
      background: var(--candy-surface-low);
      border-bottom: 1px solid var(--candy-surface-variant);
      display: none;
      align-items: center;
      gap: 8px;
      font-weight: 600;
    }

    /* Popover Menus (Attachment '+' and Slash '/') */
    .tg-popover {
      position: absolute;
      bottom: 74px;
      left: 18px;
      background: var(--candy-card-bg);
      border: 1.5px solid var(--candy-card-border);
      border-radius: 20px;
      box-shadow: 0 14px 40px rgba(116, 74, 162, 0.16);
      width: 300px;
      padding: 8px;
      z-index: 50;
      display: none;
      flex-direction: column;
      gap: 4px;
    }
    .tg-popover.open { display: flex; animation: popIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.92) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .tg-popover-item {
      padding: 9px 14px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--candy-on-surface);
      font-size: 13px;
      cursor: pointer;
      transition: background 0.15s, transform 0.15s;
    }
    .tg-popover-item:hover {
      background: var(--candy-surface-container);
      color: var(--candy-primary);
      transform: translateX(3px);
    }
    .tg-popover-icon {
      color: var(--candy-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    /* Mention Autocomplete Dropdown */
    .tg-mention-popover {
      position: absolute;
      bottom: 74px;
      left: 70px;
      background: var(--candy-card-bg);
      border: 1.5px solid var(--candy-card-border);
      border-radius: 20px;
      box-shadow: 0 14px 40px rgba(116, 74, 162, 0.16);
      width: 300px;
      padding: 8px;
      z-index: 50;
      display: none;
      flex-direction: column;
      gap: 4px;
      max-height: 240px;
      overflow-y: auto;
    }
    .tg-mention-popover.open { display: flex; animation: popIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }

    /* Canvas Panel (Side-by-Side or Sliding Drawer) */
    .tg-canvas-panel {
      width: 0;
      background: var(--candy-surface);
      border-left: 1.5px solid var(--candy-surface-variant);
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 40;
    }
    .tg-canvas-panel.open {
      width: 640px;
      min-width: 640px;
    }
    .tg-canvas-header {
      padding: 12px 20px;
      border-bottom: 1.5px solid var(--candy-surface-variant);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--candy-surface-low);
    }
    .tg-canvas-tabs {
      display: flex;
      gap: 6px;
      overflow-x: auto;
    }
    .tg-c-tab {
      background: var(--candy-surface-container);
      border: 1px solid var(--candy-surface-highest);
      color: var(--candy-on-surface-variant);
      font-size: 12px;
      font-weight: 600;
      font-family: var(--font-candy);
      padding: 6px 13px;
      border-radius: 9999px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .tg-c-tab:hover {
      color: var(--candy-primary);
      background: var(--candy-surface-highest);
      transform: scale(1.04);
    }
    .tg-c-tab.active {
      color: #ffffff;
      background: var(--candy-primary);
      border-color: var(--candy-primary);
      box-shadow: var(--candy-shadow-primary);
    }
    .tg-canvas-body {
      flex: 1;
      overflow-y: auto;
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    /* Sheets Table Style (Candy Card) */
    .sheet-wrapper {
      background: var(--candy-card-bg);
      border: 1.5px solid var(--candy-card-border);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: var(--candy-shadow-card);
    }
    .sheet-toolbar {
      padding: 10px 16px;
      background: var(--candy-surface-container);
      border-bottom: 1.5px solid var(--candy-surface-highest);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12.5px;
      font-weight: 600;
    }
    .sheet-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: left;
    }
    .sheet-table th {
      background: var(--candy-surface-low);
      padding: 10px 12px;
      font-weight: 700;
      border: 1px solid var(--candy-surface-variant);
      color: var(--candy-secondary);
    }
    .sheet-table td {
      padding: 10px 12px;
      border: 1px solid var(--candy-surface-variant);
      color: var(--candy-on-surface);
      background: var(--candy-surface-lowest);
    }
    .sheet-table td:focus {
      outline: 2px solid var(--candy-primary-accent);
      background: var(--candy-surface-container);
    }

    /* Slides Deck Viewer (Candy Card) */
    .slide-viewer {
      background: var(--candy-card-bg);
      border: 1.5px solid var(--candy-card-border);
      border-radius: 20px;
      padding: 26px;
      min-height: 290px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      box-shadow: var(--candy-shadow-card);
    }
    .slide-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 18px;
      padding-top: 14px;
      border-top: 1.5px solid var(--candy-surface-variant);
    }

    /* Live Preview Iframe Container */
    .sandbox-preview-container {
      background: #ffffff;
      border-radius: 18px;
      overflow: hidden;
      height: 320px;
      border: 1.5px solid var(--candy-card-border);
      box-shadow: var(--candy-shadow-card);
    }
    .sandbox-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    /* Candy Cards */
    .tg-card {
      background: var(--candy-card-bg);
      border: 1.5px solid var(--candy-card-border);
      border-radius: 18px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: var(--candy-shadow-card);
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
    }
    .tg-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--candy-shadow-hover);
    }

    /* Modal Backdrop */
    .tg-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(40, 19, 48, 0.45);
      backdrop-filter: blur(8px);
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .tg-modal-backdrop.open { display: flex; animation: fadeIn 0.2s ease; }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .tg-modal {
      background: var(--candy-card-bg);
      border: 1.5px solid var(--candy-card-border);
      border-radius: 24px;
      box-shadow: 0 20px 50px rgba(116, 74, 162, 0.22);
      width: 560px;
      max-width: 92vw;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .tg-modal-header {
      padding: 16px 22px;
      border-bottom: 1.5px solid var(--candy-surface-variant);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--candy-surface-low);
    }
    .tg-modal-title {
      font-size: 17px;
      font-weight: 700;
      color: var(--candy-on-surface);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .tg-modal-close {
      background: var(--candy-surface-container);
      border: none;
      color: var(--candy-on-surface-variant);
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: background 0.15s, transform 0.15s;
    }
    .tg-modal-close:hover {
      background: var(--candy-surface-highest);
      color: var(--candy-primary);
      transform: scale(1.1);
    }
    .tg-modal-body {
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-height: 75vh;
      overflow-y: auto;
    }
    .tg-form-group {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .tg-label {
      font-size: 13px;
      font-weight: 700;
      color: var(--candy-secondary);
    }
    .tg-input, .tg-select, .tg-textarea {
      background: var(--candy-surface-container);
      border: 1.5px solid var(--candy-surface-highest);
      border-radius: 9999px;
      padding: 10px 16px;
      color: var(--candy-on-surface);
      font-size: 13.5px;
      outline: none;
      font-family: inherit;
      transition: all 0.15s;
    }
    .tg-textarea {
      border-radius: 18px;
    }
    .tg-input:focus, .tg-select:focus, .tg-textarea:focus {
      border-color: var(--candy-primary-accent);
      background: var(--candy-surface-lowest);
      box-shadow: 0 0 0 3px rgba(224, 64, 160, 0.2);
    }
    .tg-modal-footer {
      padding: 14px 22px;
      border-top: 1.5px solid var(--candy-surface-variant);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      background: var(--candy-surface-low);
    }

    /* Settings Modal Navigation Tabs */
    .settings-nav-tabs {
      display: flex;
      gap: 6px;
      border-bottom: 1.5px solid var(--candy-surface-variant);
      padding-bottom: 10px;
      overflow-x: auto;
    }
    .settings-tab-btn {
      background: var(--candy-surface-container);
      border: 1px solid var(--candy-surface-highest);
      color: var(--candy-on-surface-variant);
      font-size: 12.5px;
      font-weight: 700;
      font-family: var(--font-candy);
      padding: 6px 14px;
      border-radius: 9999px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .settings-tab-btn:hover {
      background: var(--candy-surface-highest);
      color: var(--candy-primary);
      transform: scale(1.03);
    }
    .settings-tab-btn.active {
      background: var(--candy-primary);
      color: #ffffff;
      border-color: var(--candy-primary);
      box-shadow: var(--candy-shadow-primary);
    }

    /* Settings Theme Option Cards */
    .theme-card-picker {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .theme-card {
      border: 2px solid var(--candy-surface-highest);
      border-radius: 18px;
      padding: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      background: var(--candy-surface-low);
    }
    .theme-card:hover {
      border-color: var(--candy-primary-accent);
      transform: scale(1.03);
    }
    .theme-card.active {
      border-color: var(--candy-primary);
      background: var(--candy-surface-container);
      box-shadow: var(--candy-shadow-primary);
    }

    /* Global Command Palette (⌘K) */
    .tg-cmd-palette {
      width: 580px;
      max-width: 92vw;
      background: var(--candy-card-bg);
      border: 1.5px solid var(--candy-card-border);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(116, 74, 162, 0.25);
      display: flex;
      flex-direction: column;
      animation: popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .tg-cmd-header {
      padding: 16px 20px;
      border-bottom: 1.5px solid var(--candy-surface-variant);
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--candy-surface-low);
    }
    .tg-cmd-input {
      background: transparent;
      border: none;
      outline: none;
      color: var(--candy-on-surface);
      font-size: 15px;
      font-family: var(--font-candy);
      width: 100%;
    }
    .tg-cmd-list {
      max-height: 350px;
      overflow-y: auto;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .tg-cmd-item {
      padding: 11px 16px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      color: var(--candy-on-surface);
      font-size: 13.5px;
      font-weight: 600;
      transition: all 0.15s;
    }
    .tg-cmd-item:hover, .tg-cmd-item.selected {
      background: var(--candy-surface-container);
      color: var(--candy-primary);
      transform: translateX(3px);
    }
    .tg-cmd-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .tg-cmd-meta {
      font-size: 11px;
      color: var(--candy-on-surface-variant);
      background: var(--candy-surface-highest);
      padding: 2px 8px;
      border-radius: 9999px;
    }

    /* Switch toggle component */
    .candy-switch {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 26px;
    }
    .candy-switch input { opacity: 0; width: 0; height: 0; }
    .candy-slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: var(--candy-surface-highest);
      transition: .3s cubic-bezier(0.34, 1.56, 0.64, 1);
      border-radius: 9999px;
    }
    .candy-slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .3s cubic-bezier(0.34, 1.56, 0.64, 1);
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    input:checked + .candy-slider {
      background-color: var(--candy-primary-accent);
    }
    input:checked + .candy-slider:before {
      transform: translateX(22px);
    }
  </style>
</head>
<body>

  <!-- Telegram Left Sidebar (Persistent Channels, Employees, Second Brain) -->
  <aside class="tg-sidebar">
    <div class="tg-sidebar-header">
      <button class="tg-icon-btn candy-bounce" onclick="openSettingsModal()" title="GenTeam Workspace Settings">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </button>
      <div class="tg-search-bar" onclick="openCommandPalette()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--candy-primary);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Search swarm or ⌘K..." readonly>
        <span class="tg-search-shortcut">⌘K</span>
      </div>
      <button class="tg-icon-btn candy-bounce" id="btnThemeToggleHeader" onclick="toggleTheme()" title="Toggle Light / Dark Mode">
        <span id="themeIcon">☀️</span>
      </button>
    </div>

    <!-- Telegram Folders Tabs (Candy Pills) -->
    <div class="tg-tabs-bar">
      <button class="tg-tab-btn active" onclick="switchFolder('all')">
        All <span class="tg-tab-badge" id="badgeAll">8</span>
      </button>
      <button class="tg-tab-btn" onclick="switchFolder('channels')">
        Channels
      </button>
      <button class="tg-tab-btn" onclick="switchFolder('employees')">
        Employees
      </button>
      <button class="tg-tab-btn" onclick="switchFolder('canvas')">
        Canvases
      </button>
      <button class="tg-tab-btn" onclick="switchFolder('brain')">
        Second Brain
      </button>
    </div>

    <!-- Chat Lists -->
    <div id="chatListContainer" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column;">
      
      <!-- Channels Category -->
      <div class="sidebar-category" id="secChannels">
        <span>Team Channels</span>
        <span class="sidebar-action-link" onclick="openCommandPalette()">+ Directive</span>
      </div>
      <ul class="tg-chat-list" id="channelsList" style="flex: 0 0 auto;">
        <li class="tg-chat-item active" onclick="switchChat('general-swarm', '#general-swarm', '6 digital employees active', '#af0a78')">
          <div class="tg-avatar" style="background: linear-gradient(135deg, #e040a0, #744aa2);">#</div>
          <div class="tg-chat-info">
            <div class="tg-chat-top">
              <span class="tg-chat-name">#general-swarm</span>
              <span class="tg-chat-time">10:16</span>
            </div>
            <div class="tg-chat-bottom">
              <span class="tg-chat-preview">Gabriel: Dispatched audit notification...</span>
              <span class="tg-unread-badge">3</span>
            </div>
          </div>
        </li>

        <li class="tg-chat-item" onclick="switchChat('dev-scaffold', '#dev-scaffold', 'Raphael, Michael active', '#744aa2')">
          <div class="tg-avatar" style="background: linear-gradient(135deg, #744aa2, #006388);">#</div>
          <div class="tg-chat-info">
            <div class="tg-chat-top">
              <span class="tg-chat-name">#dev-scaffold</span>
              <span class="tg-chat-time">09:42</span>
            </div>
            <div class="tg-chat-bottom">
              <span class="tg-chat-preview">Raphael: Code sandbox generated</span>
              <span style="font-size: 11px;">📌</span>
            </div>
          </div>
        </li>

        <li class="tg-chat-item" onclick="switchChat('security-audit', '#security-audit', 'Dwayne, Seraphim, Michael', '#006388')">
          <div class="tg-avatar" style="background: linear-gradient(135deg, #006388, #744aa2);">#</div>
          <div class="tg-chat-info">
            <div class="tg-chat-top">
              <span class="tg-chat-name">#security-audit</span>
              <span class="tg-chat-time">09:20</span>
            </div>
            <div class="tg-chat-bottom">
              <span class="tg-chat-preview">Dwayne: Competitor pricing scan verified</span>
            </div>
          </div>
        </li>

        <li class="tg-chat-item" onclick="switchChat('product-launch', '#product-launch', 'Ann, Ryan, Raphael', '#cf3192')">
          <div class="tg-avatar" style="background: linear-gradient(135deg, #cf3192, #e040a0);">#</div>
          <div class="tg-chat-info">
            <div class="tg-chat-top">
              <span class="tg-chat-name">#product-launch</span>
              <span class="tg-chat-time">Yesterday</span>
            </div>
            <div class="tg-chat-bottom">
              <span class="tg-chat-preview">Ryan: Landing page copy & slides updated</span>
            </div>
          </div>
        </li>
      </ul>

      <!-- Digital Employees Category -->
      <div class="sidebar-category" id="secEmployees">
        <span>Digital Employees</span>
        <span class="sidebar-action-link" onclick="openDeployRoleModal()">+ Deploy</span>
      </div>
      <ul class="tg-chat-list" id="employeesList">
        <!-- Dynamically populated from /api/agents -->
      </ul>

      <!-- Second Brain Category (visible when Brain tab clicked) -->
      <div class="sidebar-category" id="secBrain" style="display: none;">
        <span>Second Brain Memory</span>
        <span class="sidebar-action-link" onclick="openAddKnowledgeModal()">+ Add Context</span>
      </div>
      <ul class="tg-chat-list" id="brainList" style="display: none;">
        <!-- Populated from Second Brain -->
      </ul>
    </div>

    <!-- Sidebar Bottom Status Footer -->
    <div class="tg-sidebar-footer">
      <div class="user-pill">
        <div class="user-avatar-sm">LV</div>
        <div style="display: flex; flex-direction: column;">
          <span style="font-weight: 700; color: var(--candy-on-surface);">lvluplabs46201</span>
          <span style="font-size: 11px; color: var(--candy-on-surface-variant);">GenTeam Admin</span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="width: 8px; height: 8px; border-radius: 9999px; background: var(--candy-online); box-shadow: 0 0 6px var(--candy-online);"></span>
        <span style="font-family: var(--font-mono); font-size: 11.5px; color: var(--candy-online); font-weight: 700;">UDS:3000 OK</span>
      </div>
    </div>
  </aside>

  <!-- Main Workspace Container (Chat + Canvas side by side) -->
  <div class="tg-workspace-container">
    
    <!-- Central Telegram Chat Viewport -->
    <main class="tg-main">
      
      <!-- Top Chat Header -->
      <header class="tg-header">
        <div class="tg-header-left" onclick="toggleCanvasPanel()">
          <div class="tg-avatar" id="headerAvatar" style="width: 42px; height: 42px; background: linear-gradient(135deg, #e040a0, #744aa2); font-size: 16px;">
            #
          </div>
          <div class="tg-header-details">
            <span class="tg-header-title" id="headerTitle">
              #general-swarm
            </span>
            <span class="tg-header-subtitle" id="headerSubtitle">6 digital employees active</span>
          </div>
        </div>

        <!-- Header Action Toolbar -->
        <div class="tg-header-tools">
          <button class="candy-pill-btn candy-bounce" id="btnSplitCanvas" onclick="toggleCanvasPanel()" title="Toggle Split-Screen Canvas">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
            <span id="canvasBtnLabel">Open Canvas</span>
          </button>

          <button class="candy-pill-btn candy-bounce" onclick="openCallModal()" title="Call For Me (Voice Agent)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Call For Me
          </button>

          <button class="candy-pill-btn primary candy-bounce" onclick="openDeployRoleModal()" title="Deploy Ready-Made or Custom Digital Employee">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>
            + Deploy Role
          </button>

          <button class="tg-icon-btn candy-bounce" onclick="openSettingsModal()" title="Settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
        </div>
      </header>

      <!-- Telegram Pinned Directive Ribbon -->
      <div class="tg-pinned-ribbon" onclick="jumpToPinnedDirective()">
        <div class="tg-pinned-left">
          <span class="tg-pinned-title">📌 Pinned Directive:</span>
          <span class="tg-pinned-text" id="pinnedDirectiveText">Scaffold authentication module with JWT verify and notify audit channel</span>
        </div>
        <span style="font-size: 12px; color: var(--candy-primary-accent); font-weight: 700;">View DAG &rarr;</span>
      </div>

      <!-- Typing Banner -->
      <div id="tgTypingIndicator" class="tg-typing-indicator">
        <span style="width: 10px; height: 10px; border-radius: 9999px; background: var(--candy-primary-accent); animation: pulse 1s infinite;"></span>
        <span id="typingMessage">Ann (Operations Coordinator) is reasoning and planning Kahn execution tree...</span>
      </div>

      <!-- Messages Stream -->
      <div id="tgMessagesScroll" class="tg-messages-scroll">
        <div class="tg-date-divider">Today</div>
        <div id="messagesList" style="display: flex; flex-direction: column; gap: 14px;"></div>
      </div>

      <!-- Telegram Bottom Input Bar with Attachments -->
      <footer class="tg-input-bar">
        
        <!-- Attachment Plus Menu Button -->
        <button class="tg-icon-btn candy-bounce" id="btnAttachment" title="Anchor Context / Action Menu (+)" onclick="toggleAttachmentMenu()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>

        <!-- Slash Command Menu Button -->
        <button class="tg-icon-btn candy-bounce" title="Commands (/)" onclick="toggleSlashMenu()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="5" x2="5" y2="19"/></svg>
        </button>

        <!-- Message Input Field with Context Tags -->
        <div class="tg-input-wrapper">
          <div id="activeContextsBar" class="tg-active-contexts-bar" style="display: none;"></div>
          <textarea id="tgTextInput" class="tg-text-input" rows="1" placeholder="Direct the GenTeam swarm or type @ to mention an agent..."></textarea>
        </div>

        <!-- Send Paper Plane Button -->
        <button id="tgSendBtn" class="tg-send-btn candy-bounce" onclick="sendMessage()" title="Send Directive / Message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>

        <!-- Attachment Popover Menu -->
        <div id="attachmentPopover" class="tg-popover">
          <div class="tg-popover-item" onclick="anchorSecondBrainContext()">
            <span class="tg-popover-icon">🧠</span>
            <div>
              <div style="font-weight: 700;">Anchor Second Brain</div>
              <div style="font-size: 11px; color: var(--candy-on-surface-variant);">Attach architecture doc, email, or DB schema</div>
            </div>
          </div>
          <div class="tg-popover-item" onclick="openDeployRoleModal()">
            <span class="tg-popover-icon">🤖</span>
            <div>
              <div style="font-weight: 700;">Deploy Digital Employee</div>
              <div style="font-size: 11px; color: var(--candy-on-surface-variant);">Onboard Ann, Ryan, Dwayne, or custom</div>
            </div>
          </div>
          <div class="tg-popover-item" onclick="openCanvasDrawerTab('sheet')">
            <span class="tg-popover-icon">📊</span>
            <div>
              <div style="font-weight: 700;">AI Sheets Canvas</div>
              <div style="font-size: 11px; color: var(--candy-on-surface-variant);">Editable pricing & latency matrix</div>
            </div>
          </div>
          <div class="tg-popover-item" onclick="openCanvasDrawerTab('deck')">
            <span class="tg-popover-icon">📑</span>
            <div>
              <div style="font-weight: 700;">AI Slides & Pitch Deck</div>
              <div style="font-size: 11px; color: var(--candy-on-surface-variant);">Interactive presentation slides</div>
            </div>
          </div>
          <div class="tg-popover-item" onclick="openCanvasDrawerTab('code')">
            <span class="tg-popover-icon">💻</span>
            <div>
              <div style="font-weight: 700;">Code Sandbox</div>
              <div style="font-size: 11px; color: var(--candy-on-surface-variant);">TypeScript & live prototype canvas</div>
            </div>
          </div>
          <div class="tg-popover-item" onclick="openCallModal()">
            <span class="tg-popover-icon">📞</span>
            <div>
              <div style="font-weight: 700;">Call For Me Voice Agent</div>
              <div style="font-size: 11px; color: var(--candy-on-surface-variant);">Schedule autonomous phone recap</div>
            </div>
          </div>
        </div>

        <!-- Slash Command Popover -->
        <div id="slashPopover" class="tg-popover" style="left: 60px;">
          <div class="tg-popover-item" onclick="selectCommand('/directive ')">
            <span class="tg-popover-icon">⚡</span>
            <div>
              <div style="font-weight: 700;">/directive &lt;prompt&gt;</div>
              <div style="font-size: 11px; color: var(--candy-on-surface-variant);">Decompose prayer into Kahn DAG</div>
            </div>
          </div>
          <div class="tg-popover-item" onclick="selectCommand('/call ')">
            <span class="tg-popover-icon">📞</span>
            <div>
              <div style="font-weight: 700;">/call &lt;vendor&gt; &lt;topic&gt;</div>
              <div style="font-size: 11px; color: var(--candy-on-surface-variant);">Initiate autonomous phone recap</div>
            </div>
          </div>
          <div class="tg-popover-item" onclick="selectCommand('/deploy ')">
            <span class="tg-popover-icon">🤖</span>
            <div>
              <div style="font-weight: 700;">/deploy &lt;name&gt; &lt;role&gt;</div>
              <div style="font-size: 11px; color: var(--candy-on-surface-variant);">Spawn new digital employee</div>
            </div>
          </div>
          <div class="tg-popover-item" onclick="selectCommand('/canvas ')">
            <span class="tg-popover-icon">🎨</span>
            <div>
              <div style="font-weight: 700;">/canvas &lt;sheet|code|deck&gt;</div>
              <div style="font-size: 11px; color: var(--candy-on-surface-variant);">Open specialized side canvas</div>
            </div>
          </div>
          <div class="tg-popover-item" onclick="openSettingsModal()">
            <span class="tg-popover-icon">⚙️</span>
            <div>
              <div style="font-weight: 700;">/settings</div>
              <div style="font-size: 11px; color: var(--candy-on-surface-variant);">Open Candy theme & swarm settings</div>
            </div>
          </div>
        </div>

        <!-- Mention Autocomplete Popover -->
        <div id="mentionPopover" class="tg-mention-popover"></div>

      </footer>
    </main>

    <!-- Right-Side Specialized Execution Canvas Panel (Split Screen or Slide Drawer) -->
    <aside id="canvasPanel" class="tg-canvas-panel">
      <div class="tg-canvas-header">
        <div class="tg-canvas-tabs">
          <button class="tg-c-tab active" id="cTabSheet" onclick="switchCanvasTab('sheet')">
            <span>📊</span> AI Sheet
          </button>
          <button class="tg-c-tab" id="cTabDeck" onclick="switchCanvasTab('deck')">
            <span>📑</span> Slides Deck
          </button>
          <button class="tg-c-tab" id="cTabCode" onclick="switchCanvasTab('code')">
            <span>💻</span> Code Sandbox
          </button>
          <button class="tg-c-tab" id="cTabDag" onclick="switchCanvasTab('dag')">
            <span>🔀</span> Workflow DAG
          </button>
          <button class="tg-c-tab" id="cTabBrain" onclick="switchCanvasTab('brain')">
            <span>🧠</span> Second Brain
          </button>
        </div>
        <button class="tg-icon-btn candy-bounce" onclick="toggleCanvasPanel()" title="Close Canvas">
          &times;
        </button>
      </div>

      <div class="tg-canvas-body">

        <!-- TAB 1: AI SHEETS CANVAS -->
        <div id="canvasTabSheetContent" style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h3 style="font-size: 15px; color: var(--candy-on-surface); font-weight: 700;">Model Pricing & Latency Consensus Matrix</h3>
              <p style="font-size: 12px; color: var(--candy-on-surface-variant);">Auto-researched live grid. Click any cell to edit or calculate formulas.</p>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="candy-pill-btn candy-bounce" onclick="addSheetRow()">+ Row</button>
              <button class="candy-pill-btn candy-bounce" onclick="exportSheetCSV()">Export CSV</button>
              <button class="candy-pill-btn primary candy-bounce" onclick="saveSheetCanvas()">Save</button>
            </div>
          </div>

          <div class="sheet-wrapper">
            <div class="sheet-toolbar">
              <span id="sheetSelectedCell">Selected: Cell A1</span>
              <span style="color: var(--candy-online); font-weight: 700;">✓ Synced with Second Brain</span>
            </div>
            <div style="overflow-x: auto;">
              <table class="sheet-table" id="interactiveSheet">
                <thead>
                  <tr>
                    <th>Provider / Model</th>
                    <th>Latency (p50)</th>
                    <th>Cost / 1k Tokens</th>
                    <th>Benchmark</th>
                    <th>Consensus</th>
                  </tr>
                </thead>
                <tbody id="sheetBody">
                  <tr>
                    <td contenteditable="true">Local Ollama (qwen2.5:7b)</td>
                    <td contenteditable="true">115ms</td>
                    <td contenteditable="true">$0.0000</td>
                    <td contenteditable="true">94.2%</td>
                    <td contenteditable="true" style="color: var(--candy-online); font-weight: 700;">AGREE</td>
                  </tr>
                  <tr>
                    <td contenteditable="true">Gemini 2.0 Flash (Seraphim)</td>
                    <td contenteditable="true">210ms</td>
                    <td contenteditable="true">$0.0001</td>
                    <td contenteditable="true">98.4%</td>
                    <td contenteditable="true" style="color: var(--candy-online); font-weight: 700;">AGREE</td>
                  </tr>
                  <tr>
                    <td contenteditable="true">Claude 3.5 Sonnet</td>
                    <td contenteditable="true">540ms</td>
                    <td contenteditable="true">$0.0030</td>
                    <td contenteditable="true">99.1%</td>
                    <td contenteditable="true" style="color: var(--candy-online); font-weight: 700;">AGREE</td>
                  </tr>
                  <tr>
                    <td contenteditable="true">GPT-4o (OpenAI)</td>
                    <td contenteditable="true">480ms</td>
                    <td contenteditable="true">$0.0025</td>
                    <td contenteditable="true">97.8%</td>
                    <td contenteditable="true" style="color: var(--candy-online); font-weight: 700;">AGREE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="tg-card">
            <span style="font-weight: 700; color: var(--candy-on-surface);">Consensus Breakdown</span>
            <div style="font-size: 13px; color: var(--candy-on-surface-variant);">
              Metatron evaluated 4 model outputs for directive <code>dir-scaffold-01</code>.
              Agreement threshold: <strong>80.0% achieved</strong>. Primary routing confirmed to local daemon with Seraphim cloud fallback.
            </div>
          </div>
        </div>

        <!-- TAB 2: AI SLIDES / PITCH DECK CANVAS -->
        <div id="canvasTabDeckContent" style="display: none; flex-direction: column; gap: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h3 style="font-size: 15px; color: var(--candy-on-surface); font-weight: 700;">GenTeam Swarm Operations Pitch Deck</h3>
              <p style="font-size: 12px; color: var(--candy-on-surface-variant);">Fact-checked presentation deck synthesized by Ann & Ryan.</p>
            </div>
            <button class="candy-pill-btn primary candy-bounce" onclick="toggleFullscreenSlide()">Present Fullscreen</button>
          </div>

          <div class="slide-viewer" id="slideViewer">
            <div id="slideContent">
              <span style="font-size: 12px; color: var(--candy-primary-accent); font-weight: 700; text-transform: uppercase;">Slide 1 / 4 · Overview</span>
              <h2 style="font-size: 22px; color: var(--candy-on-surface); margin: 12px 0 8px;">Empyrean GenTeam Operations</h2>
              <p style="font-size: 14px; color: var(--candy-on-surface-variant); line-height: 1.5;">
                A Telegram-native enterprise operations layer bridging autonomous digital employees, persistent Second Brain context, and live execution sandboxes.
              </p>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 18px;">
                <div class="tg-card" style="padding: 12px;">
                  <strong style="color: var(--candy-primary);">🧠 YHWH & Ann</strong>
                  <span style="font-size: 12px; color: var(--candy-on-surface-variant);">Triage & Kahn DAG Decomposition</span>
                </div>
                <div class="tg-card" style="padding: 12px;">
                  <strong style="color: var(--candy-secondary);">⚡ Michael Orchestrator</strong>
                  <span style="font-size: 12px; color: var(--candy-on-surface-variant);">Topological Task Scheduling</span>
                </div>
              </div>
            </div>

            <div class="slide-nav">
              <button class="candy-pill-btn candy-bounce" onclick="prevSlide()">&larr; Previous</button>
              <span id="slideCounter" style="font-size: 13px; font-weight: 700; color: var(--candy-on-surface);">1 of 4</span>
              <button class="candy-pill-btn candy-bounce" onclick="nextSlide()">Next &rarr;</button>
            </div>
          </div>
        </div>

        <!-- TAB 3: CODE SANDBOX CANVAS WITH LIVE PREVIEW -->
        <div id="canvasTabCodeContent" style="display: none; flex-direction: column; gap: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h3 style="font-size: 15px; color: var(--candy-on-surface); font-weight: 700;">AI Design & Code Sandbox</h3>
              <p style="font-size: 12px; color: var(--candy-on-surface-variant);">Generated by Raphael (Engineer Bot). Includes live component rendering.</p>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="candy-pill-btn primary candy-bounce" id="btnToggleSandboxView" onclick="toggleSandboxPreviewMode()">Show Live Preview</button>
              <button class="candy-pill-btn candy-bounce" onclick="copySandboxCode()">Copy Code</button>
              <button class="candy-pill-btn candy-bounce" onclick="downloadSandboxFile()">Download</button>
            </div>
          </div>

          <!-- Code View -->
          <div id="sandboxCodeWrapper">
            <pre class="tg-code-block" id="sandboxCodeDisplay" style="max-height: 340px;"></pre>
          </div>

          <!-- Live Interactive Preview View -->
          <div id="sandboxPreviewWrapper" style="display: none;">
            <div style="font-size: 12px; color: var(--candy-on-surface-variant); margin-bottom: 6px; font-weight: 600;">Live Component Preview (Sandbox Sandbox-01):</div>
            <div class="sandbox-preview-container">
              <iframe id="sandboxIframe" class="sandbox-iframe" sandbox="allow-scripts"></iframe>
            </div>
          </div>

          <!-- Design Guidelines & Palette Inspector -->
          <div class="tg-card">
            <span style="font-weight: 700; color: var(--candy-on-surface);">Design Guidelines & Color Palette</span>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px;">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                <span style="width: 18px; height: 18px; border-radius: 9999px; background: #af0a78; border: 1.5px solid #fff; box-shadow: 0 2px 6px rgba(175,10,120,0.3);"></span>
                <span>Primary (#af0a78)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                <span style="width: 18px; height: 18px; border-radius: 9999px; background: #e040a0; border: 1.5px solid #fff; box-shadow: 0 2px 6px rgba(224,64,160,0.3);"></span>
                <span>Accent (#e040a0)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                <span style="width: 18px; height: 18px; border-radius: 9999px; background: #744aa2; border: 1.5px solid #fff; box-shadow: 0 2px 6px rgba(116,74,162,0.3);"></span>
                <span>Secondary (#744aa2)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                <span style="width: 18px; height: 18px; border-radius: 9999px; background: #006388; border: 1.5px solid #fff; box-shadow: 0 2px 6px rgba(0,99,136,0.3);"></span>
                <span>Tertiary (#006388)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 4: WORKFLOW EXECUTION DAG -->
        <div id="canvasTabDagContent" style="display: none; flex-direction: column; gap: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h3 style="font-size: 15px; color: var(--candy-on-surface); font-weight: 700;">Workflow Execution DAG</h3>
              <p style="font-size: 12px; color: var(--candy-on-surface-variant);">Kahn topological order decomposed by YHWH and executed by Michael.</p>
            </div>
            <select id="dagSelect" class="tg-select" onchange="renderDag(this.value)"></select>
          </div>

          <div id="dagNodesContainer" style="display: flex; flex-direction: column; gap: 12px;"></div>
        </div>

        <!-- TAB 5: SECOND BRAIN (Shared Persistent Memory) -->
        <div id="canvasTabBrainContent" style="display: none; flex-direction: column; gap: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h3 style="font-size: 15px; color: var(--candy-on-surface); font-weight: 700;">Second Brain Memory Vault</h3>
              <p style="font-size: 12px; color: var(--candy-on-surface-variant);">Aggregates emails, transcripts, schemas, and specs across sessions.</p>
            </div>
            <button class="candy-pill-btn primary candy-bounce" onclick="openAddKnowledgeModal()">+ Add Context</button>
          </div>

          <div id="secondBrainItems" style="display: flex; flex-direction: column; gap: 12px;"></div>
        </div>

      </div>
    </aside>

  </div>

  <!-- MODAL 1: SETTINGS MODAL (Theme, Appearance, Swarm, Integrations) -->
  <div id="modalSettings" class="tg-modal-backdrop" onclick="closeModalsOnBackdrop(event)">
    <div class="tg-modal" style="width: 620px;">
      <div class="tg-modal-header">
        <span class="tg-modal-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--candy-primary);"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Workspace & Swarm Settings
        </span>
        <button class="tg-modal-close" onclick="closeModals()">&times;</button>
      </div>

      <div class="tg-modal-body">
        
        <!-- Settings Category Tabs -->
        <div class="settings-nav-tabs">
          <button class="settings-tab-btn active" id="stTabTheme" onclick="switchSettingsTab('theme')">🎨 Appearance & Theme</button>
          <button class="settings-tab-btn" id="stTabSwarm" onclick="switchSettingsTab('swarm')">🤖 Swarm Models</button>
          <button class="settings-tab-btn" id="stTabMemory" onclick="switchSettingsTab('memory')">🧠 Second Brain</button>
          <button class="settings-tab-btn" id="stTabVoice" onclick="switchSettingsTab('voice')">📞 Call & Voice</button>
        </div>

        <!-- Section 1: Appearance & Theme -->
        <div id="settingsSecTheme" style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label class="tg-label">Design Scheme & Color Mode:</label>
            <div class="theme-card-picker" style="margin-top: 8px;">
              <div class="theme-card" id="themeCardLight" onclick="setThemeMode('light')">
                <span style="font-size: 26px;">☀️</span>
                <div>
                  <strong style="color: var(--candy-on-surface); font-size: 13.5px;">Candy Light</strong>
                  <div style="font-size: 11px; color: var(--candy-on-surface-variant);">Joyful Pop · #fff7fb surface</div>
                </div>
              </div>
              <div class="theme-card" id="themeCardDark" onclick="setThemeMode('dark')">
                <span style="font-size: 26px;">🌙</span>
                <div>
                  <strong style="color: var(--candy-on-surface); font-size: 13.5px;">Candy Dark</strong>
                  <div style="font-size: 11px; color: var(--candy-on-surface-variant);">Neon Plum · #1d0e23 surface</div>
                </div>
              </div>
            </div>
          </div>

          <div class="tg-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: var(--candy-on-surface); font-size: 13.5px;">Bouncy Microinteractions</strong>
                <div style="font-size: 12px; color: var(--candy-on-surface-variant);">Playful hover springs & scale animations</div>
              </div>
              <label class="candy-switch">
                <input type="checkbox" id="settingBouncyToggle" checked onchange="toggleBouncySetting(this.checked)">
                <span class="candy-slider"></span>
              </label>
            </div>
          </div>

          <div class="tg-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: var(--candy-on-surface); font-size: 13.5px;">Typography</strong>
                <div style="font-size: 12px; color: var(--candy-on-surface-variant);">DM Sans rounded typography (Candy standard)</div>
              </div>
              <span class="tg-role-tag" style="background: var(--candy-primary-container); color: var(--candy-on-primary-container);">Active</span>
            </div>
          </div>
        </div>

        <!-- Section 2: Swarm Models -->
        <div id="settingsSecSwarm" style="display: none; flex-direction: column; gap: 14px;">
          <div class="tg-form-group">
            <label class="tg-label">Primary Planning Engine (YHWH / Ann):</label>
            <select class="tg-select" id="settingPrimaryModel">
              <option value="qwen2.5:7b">Ollama Local (qwen2.5:7b) [Recommended Local]</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Seraphim Cloud) [Sub-200ms]</option>
              <option value="lemonade-npu">Lemonade Ryzen AI NPU Core</option>
            </select>
          </div>

          <div class="tg-form-group">
            <label class="tg-label">Metatron Multi-Model Consensus Threshold:</label>
            <input type="range" min="60" max="95" value="80" id="settingConsensusRange" oninput="document.getElementById('consensusVal').textContent = this.value + '%'" style="accent-color: var(--candy-primary-accent);">
            <div style="display: flex; justify-content: space-between; font-size: 11.5px; color: var(--candy-on-surface-variant);">
              <span>Permissive (60%)</span>
              <span id="consensusVal" style="font-weight: 700; color: var(--candy-primary);">80%</span>
              <span>Strict (95%)</span>
            </div>
          </div>

          <div class="tg-card">
            <strong style="color: var(--candy-on-surface); font-size: 13px;">Kahn Topological Scheduler</strong>
            <div style="font-size: 12px; color: var(--candy-on-surface-variant);">
              Dependency resolution runs asynchronously on Michael archangel orchestrator. Maximum timeout: <strong>30,000ms</strong>.
            </div>
          </div>
        </div>

        <!-- Section 3: Second Brain -->
        <div id="settingsSecMemory" style="display: none; flex-direction: column; gap: 14px;">
          <div class="tg-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: var(--candy-on-surface); font-size: 13.5px;">Auto-Context Anchoring</strong>
                <div style="font-size: 12px; color: var(--candy-on-surface-variant);">Automatically suggest Second Brain docs during prompt typing</div>
              </div>
              <label class="candy-switch">
                <input type="checkbox" checked>
                <span class="candy-slider"></span>
              </label>
            </div>
          </div>

          <div class="tg-card">
            <strong style="color: var(--candy-on-surface); font-size: 13px;">Storage & Persistence</strong>
            <div style="font-size: 12px; color: var(--candy-on-surface-variant);">
              Active state is held in-memory with optional Supabase real-time sync. Total knowledge fragments: <strong id="settingsBrainCount">4</strong>.
            </div>
          </div>
        </div>

        <!-- Section 4: Call & Voice -->
        <div id="settingsSecVoice" style="display: none; flex-direction: column; gap: 14px;">
          <div class="tg-form-group">
            <label class="tg-label">Voice Note & Call For Me Speech Rate:</label>
            <select class="tg-select">
              <option value="1.0">Normal (1.0x)</option>
              <option value="1.2">Fast (1.2x)</option>
              <option value="1.5">Rapid (1.5x)</option>
            </select>
          </div>

          <div class="tg-card">
            <strong style="color: var(--candy-on-surface); font-size: 13px;">Autonomous Phone Dispatch</strong>
            <div style="font-size: 12px; color: var(--candy-on-surface-variant);">
              Vendor audio calls automatically record transcripts and deposit key action items into the shared Second Brain vault.
            </div>
          </div>
        </div>

      </div>

      <div class="tg-modal-footer">
        <button class="candy-pill-btn candy-bounce" onclick="closeModals()">Cancel</button>
        <button class="candy-pill-btn primary candy-bounce" onclick="saveSettings()">Save Preferences</button>
      </div>
    </div>
  </div>

  <!-- MODAL 2: DEPLOY DIGITAL EMPLOYEE (GenTeam Core Feature 1) -->
  <div id="modalDeployRole" class="tg-modal-backdrop" onclick="closeModalsOnBackdrop(event)">
    <div class="tg-modal">
      <div class="tg-modal-header">
        <span class="tg-modal-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--candy-primary);"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>
          Deploy Digital Employee
        </span>
        <button class="tg-modal-close" onclick="closeModals()">&times;</button>
      </div>
      <div class="tg-modal-body">
        <p style="font-size: 12.5px; color: var(--candy-on-surface-variant);">
          Onboard a pre-built ready-made employee or configure custom boundaries, tool capabilities, and permissions.
        </p>

        <!-- Quick Pre-Built Role Picker -->
        <div class="tg-form-group">
          <label class="tg-label">Quick Role Template:</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <button class="candy-pill-btn candy-bounce" type="button" onclick="presetRole('Ann', 'Operations Coordinator', 'Triage hub routing complex tasks to optimal agents', '#af0a78', 'reason')">
              Ann (Ops Hub)
            </button>
            <button class="candy-pill-btn candy-bounce" type="button" onclick="presetRole('Ryan', 'Marketing Head', 'Content funnel optimizations, brand website, campaigns', '#10b981', 'comms')">
              Ryan (Marketing)
            </button>
            <button class="candy-pill-btn candy-bounce" type="button" onclick="presetRole('Dwayne', 'Sales Strategy & Security Analyst', 'Competitor pricing grids & outreach pipelines', '#744aa2', 'gateway')">
              Dwayne (Sales/Sec)
            </button>
            <button class="candy-pill-btn candy-bounce" type="button" onclick="presetRole('Elena', 'UX & Design Prototyper', 'Synthesizes interactive canvas sandboxes and UI flows', '#006388', 'work')">
              Elena (Design)
            </button>
          </div>
        </div>

        <div class="tg-form-group">
          <label class="tg-label">Employee Name:</label>
          <input type="text" id="deployName" class="tg-input" placeholder="e.g. Ann or Elena">
        </div>

        <div class="tg-form-group">
          <label class="tg-label">Role Title & Specialty:</label>
          <input type="text" id="deployRoleTitle" class="tg-input" placeholder="e.g. Operations Coordinator">
        </div>

        <div class="tg-form-group">
          <label class="tg-label">Tier / Operational Layer:</label>
          <select id="deployTier" class="tg-select">
            <option value="reason">Reasoning & Planning (YHWH tier)</option>
            <option value="control">Control & Orchestration (Michael tier)</option>
            <option value="work">Builder & Code Execution (Raphael tier)</option>
            <option value="comms">Communications & Webhooks (Gabriel tier)</option>
            <option value="gateway">Gateway & Oracles (Metatron tier)</option>
          </select>
        </div>

        <div class="tg-form-group">
          <label class="tg-label">System Instructions & Responsibilities:</label>
          <textarea id="deployDescription" class="tg-textarea" rows="3" placeholder="Define boundaries, task routing, or tool permissions..."></textarea>
        </div>

        <div class="tg-form-group">
          <label class="tg-label">Avatar Accent Color:</label>
          <div style="display: flex; gap: 10px; align-items: center;">
            <input type="color" id="deployColor" value="#e040a0" style="background: transparent; border: none; width: 40px; height: 40px; cursor: pointer; border-radius: 9999px;">
            <span style="font-size: 12px; color: var(--candy-on-surface-variant);">Select badge color for Telegram bubbles</span>
          </div>
        </div>
      </div>
      <div class="tg-modal-footer">
        <button class="candy-pill-btn candy-bounce" onclick="closeModals()">Cancel</button>
        <button class="candy-pill-btn primary candy-bounce" onclick="submitDeployRole()">Deploy to Swarm</button>
      </div>
    </div>
  </div>

  <!-- MODAL 3: CALL FOR ME (Voice Agent Simulation) -->
  <div id="modalCall" class="tg-modal-backdrop" onclick="closeModalsOnBackdrop(event)">
    <div class="tg-modal">
      <div class="tg-modal-header">
        <span class="tg-modal-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--candy-primary);"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          Call For Me — Autonomous Voice Recap
        </span>
        <button class="tg-modal-close" onclick="closeModals()">&times;</button>
      </div>
      <div class="tg-modal-body">
        <p style="font-size: 12.5px; color: var(--candy-on-surface-variant);">
          Delegates phone outreach to digital employees. Upon call completion, audio transcripts and action items are automatically deposited into Second Brain memory.
        </p>

        <div class="tg-card">
          <div style="display: flex; justify-content: space-between;">
            <strong style="color: var(--candy-on-surface);">Apex Cloud Infrastructure</strong>
            <span style="color: var(--candy-online); font-size: 11px; font-weight: 700;">COMPLETED · 2m 14s</span>
          </div>
          <div style="font-size: 11.5px; color: var(--candy-on-surface-variant);">Vendor: +1 (415) 890-2134</div>
          <div class="tg-voice-player">
            <button class="tg-voice-btn" onclick="togglePlayVoiceSample(this)">▶</button>
            <div class="tg-voice-waveform" id="sampleWaveform">
              <span class="wave-stick" style="height: 14px;"></span>
              <span class="wave-stick" style="height: 22px;"></span>
              <span class="wave-stick" style="height: 8px;"></span>
              <span class="wave-stick" style="height: 18px;"></span>
              <span class="wave-stick" style="height: 24px;"></span>
              <span class="wave-stick" style="height: 12px;"></span>
              <span class="wave-stick" style="height: 20px;"></span>
              <span class="wave-stick" style="height: 15px;"></span>
              <span class="wave-stick" style="height: 23px;"></span>
              <span class="wave-stick" style="height: 9px;"></span>
            </div>
            <span class="tg-voice-duration" id="voiceDurationDisplay">2:14</span>
          </div>
          <div style="font-size: 12.5px; color: var(--candy-on-surface);">
            Confirmed dedicated socket on port 3000 and reserved 4x H100 GPU nodes for Seraphim consensus workloads.
          </div>
        </div>

        <div class="tg-form-group">
          <label class="tg-label">Launch New Autonomous Call:</label>
          <input type="text" id="callVendorName" class="tg-input" placeholder="Vendor / Entity Name (e.g. AWS Cloud, Stripe)">
        </div>

        <div class="tg-form-group">
          <label class="tg-label">Objective / Directive:</label>
          <input type="text" id="callObjective" class="tg-input" placeholder="e.g. Confirm 99.99% SLA and rate limit tier increase">
        </div>
      </div>
      <div class="tg-modal-footer">
        <button class="candy-pill-btn candy-bounce" onclick="closeModals()">Close</button>
        <button class="candy-pill-btn primary candy-bounce" onclick="submitCallSimulation()">Dispatch Call</button>
      </div>
    </div>
  </div>

  <!-- MODAL 4: ADD SECOND BRAIN KNOWLEDGE -->
  <div id="modalAddKnowledge" class="tg-modal-backdrop" onclick="closeModalsOnBackdrop(event)">
    <div class="tg-modal">
      <div class="tg-modal-header">
        <span class="tg-modal-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--candy-primary);"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          Add Second Brain Context
        </span>
        <button class="tg-modal-close" onclick="closeModals()">&times;</button>
      </div>
      <div class="tg-modal-body">
        <div class="tg-form-group">
          <label class="tg-label">Context Title:</label>
          <input type="text" id="kbTitle" class="tg-input" placeholder="e.g. Q4 Competitor Pricing Strategy or Schema Spec">
        </div>
        <div class="tg-form-group">
          <label class="tg-label">Category:</label>
          <select id="kbCategory" class="tg-select">
            <option value="doc">Architecture / Document</option>
            <option value="email">Email Digest</option>
            <option value="call">Call Transcript</option>
            <option value="memory">Operational Memory Snippet</option>
          </select>
        </div>
        <div class="tg-form-group">
          <label class="tg-label">Source Identifier:</label>
          <input type="text" id="kbSource" class="tg-input" placeholder="e.g. internal://docs/v2 or gmail://inbox/481">
        </div>
        <div class="tg-form-group">
          <label class="tg-label">Content Snippet:</label>
          <textarea id="kbSnippet" class="tg-textarea" rows="4" placeholder="Enter key facts, schemas, or instructions to anchor into agent memory..."></textarea>
        </div>
      </div>
      <div class="tg-modal-footer">
        <button class="candy-pill-btn candy-bounce" onclick="closeModals()">Cancel</button>
        <button class="candy-pill-btn primary candy-bounce" onclick="submitKnowledgeItem()">Save to Brain</button>
      </div>
    </div>
  </div>

  <!-- MODAL 5: GLOBAL COMMAND PALETTE (⌘K / Ctrl+K) -->
  <div id="modalCmdPalette" class="tg-modal-backdrop" onclick="closeModalsOnBackdrop(event)">
    <div class="tg-cmd-palette">
      <div class="tg-cmd-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--candy-primary);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="cmdInput" class="tg-cmd-input" placeholder="Type a command, channel, agent, or search Second Brain..." oninput="filterCommandPalette(this.value)">
      </div>
      <div class="tg-cmd-list" id="cmdList">
        <!-- Dynamically rendered -->
      </div>
    </div>
  </div>

  <script>
    // State
    var currentTheme = localStorage.getItem('candy-theme') || 'light';
    var currentChatId = 'general-swarm';
    var currentChatName = '#general-swarm';
    var currentChatSubtitle = '6 digital employees active';
    var currentChatColor = '#af0a78';
    var cachedAgents = [];
    var cachedDirectives = [];
    var cachedTasks = [];
    var cachedEvents = [];
    var cachedBrain = [];
    var cachedCanvases = [];
    var activeContexts = [];
    var isCanvasOpen = false;
    var currentSlide = 1;
    var totalSlides = 4;
    var isSandboxPreviewMode = false;

    // Slide decks content
    var slidesData = [
      {
        title: "Empyrean GenTeam Operations",
        category: "Slide 1 / 4 · Overview",
        body: "A Telegram-native enterprise operations layer bridging autonomous digital employees, persistent Second Brain context, and live execution sandboxes.",
        cards: [
          { label: "🧠 YHWH & Ann", desc: "Triage & Kahn DAG Decomposition" },
          { label: "⚡ Michael Orchestrator", desc: "Topological Task Scheduling" }
        ]
      },
      {
        title: "Kahn Topological Execution Graph",
        category: "Slide 2 / 4 · Architecture",
        body: "Every natural language directive is parsed into a Directed Acyclic Graph (DAG) with explicit dependencies resolved in zero-wait order.",
        cards: [
          { label: "🔨 Raphael Worker", desc: "Code scaffolds & DB migrations" },
          { label: "📡 Gabriel Comms", desc: "Multi-endpoint webhook fanout" }
        ]
      },
      {
        title: "Persistent Shared Second Brain",
        category: "Slide 3 / 4 · Memory",
        body: "Agents never hallucinate or reset between conversations. Memory integrates Gmail, Outlook, Call For Me voice transcripts, and code schemas.",
        cards: [
          { label: "🔗 Context Anchoring", desc: "+ icon or ⌘K attaches knowledge" },
          { label: "📊 Specialized Canvases", desc: "Interactive sheets, slides, sandboxes" }
        ]
      },
      {
        title: "Enterprise Benchmark & Consensus",
        category: "Slide 4 / 4 · Performance",
        body: "Metatron multi-model consensus checks ensure 80%+ cross-model verification before critical outputs are finalized.",
        cards: [
          { label: "⚡ Sub-250ms Local", desc: "qwen2.5:7b + Gemini 2.0 Flash" },
          { label: "🔒 Privilege Guard", desc: "Sanitizes untrusted templates" }
        ]
      }
    ];

    // Initialize
    window.addEventListener('DOMContentLoaded', function() {
      applyTheme(currentTheme);
      fetchMessages();
      syncData();
      setupKeybindings();
      setupMentionListener();
    });

    // Theme Switcher (Light / Dark Candy Mode)
    function applyTheme(theme) {
      currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('candy-theme', theme);

      var icon = document.getElementById('themeIcon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '🌙' : '☀️';
      }

      var cardLight = document.getElementById('themeCardLight');
      var cardDark = document.getElementById('themeCardDark');
      if (cardLight && cardDark) {
        if (theme === 'dark') {
          cardDark.classList.add('active');
          cardLight.classList.remove('active');
        } else {
          cardLight.classList.add('active');
          cardDark.classList.remove('active');
        }
      }
    }

    function toggleTheme() {
      var next = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    }

    function setThemeMode(theme) {
      applyTheme(theme);
    }

    function toggleBouncySetting(enabled) {
      document.body.classList.toggle('disable-bounce', !enabled);
    }

    // Keyboard Shortcuts (⌘K / Ctrl+K, Esc)
    function setupKeybindings() {
      window.addEventListener('keydown', function(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          openCommandPalette();
        } else if (e.key === 'Escape') {
          closeModals();
          closePopovers();
        }
      });
    }

    // Settings Modal Tabs
    function openSettingsModal() {
      closePopovers();
      document.getElementById('modalSettings').classList.add('open');
      applyTheme(currentTheme);
      document.getElementById('settingsBrainCount').textContent = cachedBrain.length || 4;
    }

    function switchSettingsTab(tab) {
      document.querySelectorAll('.settings-tab-btn').forEach(function(btn) { btn.classList.remove('active'); });
      document.getElementById('stTab' + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add('active');

      document.getElementById('settingsSecTheme').style.display = tab === 'theme' ? 'flex' : 'none';
      document.getElementById('settingsSecSwarm').style.display = tab === 'swarm' ? 'flex' : 'none';
      document.getElementById('settingsSecMemory').style.display = tab === 'memory' ? 'flex' : 'none';
      document.getElementById('settingsSecVoice').style.display = tab === 'voice' ? 'flex' : 'none';
    }

    function saveSettings() {
      closeModals();
    }

    // Switch Folders in Left Sidebar
    function switchFolder(folder) {
      document.querySelectorAll('.tg-tab-btn').forEach(function(btn) { btn.classList.remove('active'); });
      if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
      }

      var secChannels = document.getElementById('secChannels');
      var channelsList = document.getElementById('channelsList');
      var secEmployees = document.getElementById('secEmployees');
      var employeesList = document.getElementById('employeesList');
      var secBrain = document.getElementById('secBrain');
      var brainList = document.getElementById('brainList');

      if (folder === 'all') {
        secChannels.style.display = 'flex';
        channelsList.style.display = 'block';
        secEmployees.style.display = 'flex';
        employeesList.style.display = 'block';
        secBrain.style.display = 'none';
        brainList.style.display = 'none';
      } else if (folder === 'channels') {
        secChannels.style.display = 'flex';
        channelsList.style.display = 'block';
        secEmployees.style.display = 'none';
        employeesList.style.display = 'none';
        secBrain.style.display = 'none';
        brainList.style.display = 'none';
      } else if (folder === 'employees') {
        secChannels.style.display = 'none';
        channelsList.style.display = 'none';
        secEmployees.style.display = 'flex';
        employeesList.style.display = 'block';
        secBrain.style.display = 'none';
        brainList.style.display = 'none';
      } else if (folder === 'canvas') {
        toggleCanvasPanel(true);
      } else if (folder === 'brain') {
        secChannels.style.display = 'none';
        channelsList.style.display = 'none';
        secEmployees.style.display = 'none';
        employeesList.style.display = 'none';
        secBrain.style.display = 'flex';
        brainList.style.display = 'block';
        renderBrainSidebarList();
      }
    }

    // Switch Chat View
    function switchChat(chatId, title, subtitle, color) {
      currentChatId = chatId;
      currentChatName = title;
      currentChatSubtitle = subtitle;
      currentChatColor = color || '#af0a78';

      document.querySelectorAll('.tg-chat-item').forEach(function(el) { el.classList.remove('active'); });
      if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
      }

      document.getElementById('headerTitle').textContent = title;
      document.getElementById('headerSubtitle').textContent = subtitle;
      var avatar = document.getElementById('headerAvatar');
      avatar.textContent = title.replace('#', '').slice(0, 2).toUpperCase();
      avatar.style.background = currentChatColor;

      fetchMessages();
    }

    // Fetch Messages for Current Chat
    async function fetchMessages() {
      try {
        var res = await fetch('/api/messages?chatId=' + encodeURIComponent(currentChatId));
        var messages = await res.json();
        renderMessages(messages);
      } catch (e) {
        console.error(e);
      }
    }

    // Render Messages with Candy & Telegram styling
    function renderMessages(messages) {
      var container = document.getElementById('messagesList');
      if (!messages || messages.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: var(--candy-on-surface-variant); padding: 40px; font-size: 13.5px;">No messages in this channel yet. Assign a task or direct the team below!</div>';
        return;
      }

      var html = '';
      for (var i = 0; i < messages.length; i++) {
        var m = messages[i];
        var isOut = m.isOutgoing;
        var initial = m.senderName ? m.senderName.replace('#', '').slice(0, 2).toUpperCase() : 'U';

        // Live Activity & Task Tracker Monitor
        var activityHtml = '';
        if (m.toolUsage) {
          activityHtml = '<div class="tg-activity-card">' +
            '<div class="tg-activity-header">' +
              '<span class="tg-activity-title">' +
                '<span style="color: var(--candy-online);">✓</span>' +
                '<span>Tool Invocation: <strong>' + m.toolUsage.tool + '</strong></span>' +
              '</span>' +
              '<span style="color: var(--candy-on-surface-variant); font-size: 11px;">' + (m.toolUsage.durationMs || 150) + 'ms · Succeeded</span>' +
            '</div>' +
            '<div class="tg-step-tracker">' +
              '<span class="tg-step-pill completed">✓ 1. Intent Decomposed</span>' +
              '<span class="tg-step-pill completed">✓ 2. Topological Dispatched</span>' +
              '<span class="tg-step-pill completed">✓ 3. Execution Verified</span>' +
            '</div>' +
          '</div>';
        }

        // Specialized Canvas Attachment
        var canvasHtml = '';
        if (m.canvasAttachment) {
          var typeIcon = m.canvasAttachment.type === 'sheet' ? '📊' : m.canvasAttachment.type === 'code' ? '💻' : m.canvasAttachment.type === 'call' ? '📞' : '🔀';
          canvasHtml = '<div class="tg-canvas-card candy-bounce" onclick="openCanvasDrawerTab(\\'' + m.canvasAttachment.type + '\\', \\'' + m.canvasAttachment.id + '\\')">' +
            '<div class="tg-canvas-info">' +
              '<span style="font-size: 18px;">' + typeIcon + '</span>' +
              '<span>Open Canvas: <strong>' + m.canvasAttachment.title + '</strong></span>' +
            '</div>' +
            '<span class="tg-canvas-btn">View Deliverable &rarr;</span>' +
          '</div>';
        }

        // Code block
        var codeHtml = '';
        if (m.code) {
          codeHtml = '<pre class="tg-code-block">' + escapeHtml(m.code) + '</pre>';
        }

        // Inline Action Buttons (Candy keyboard)
        var buttonsHtml = '';
        if (m.inlineButtons && m.inlineButtons.length > 0) {
          buttonsHtml = '<div class="tg-inline-keyboard">';
          for (var b = 0; b < m.inlineButtons.length; b++) {
            var btn = m.inlineButtons[b];
            buttonsHtml += '<button class="tg-inline-btn candy-bounce" onclick="handleInlineAction(\\'' + btn.action + '\\')">' + btn.text + '</button>';
          }
          buttonsHtml += '</div>';
        }

        html += '<div class="tg-msg-wrapper ' + (isOut ? 'outgoing' : '') + '">' +
          (!isOut ? '<div class="tg-avatar" style="width: 36px; height: 36px; font-size: 12px; background: ' + (m.senderAvatarColor || '#af0a78') + ';">' + initial + '</div>' : '') +
          '<div class="tg-msg-bubble">' +
            (!isOut ? '<div class="tg-msg-sender" style="color: ' + (m.senderAvatarColor || '#af0a78') + ';"><span>' + m.senderName + '</span><span class="tg-role-tag">Digital Employee</span></div>' : '') +
            '<div class="tg-msg-text">' + formatMarkdownText(m.text) + '</div>' +
            activityHtml +
            codeHtml +
            canvasHtml +
            buttonsHtml +
            '<div class="tg-msg-footer">' +
              '<span class="tg-msg-time">' + m.timestamp + '</span>' +
              (isOut ? '<span class="tg-checkmarks">✓✓</span>' : '') +
            '</div>' +
          '</div>' +
        '</div>';
      }

      container.innerHTML = html;
      scrollToBottom();
    }

    function escapeHtml(str) {
      if (!str) return '';
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function formatMarkdownText(txt) {
      if (!txt) return '';
      var backtickRegex = new RegExp('\\x60(.*?)\\x60', 'g');
      return escapeHtml(txt)
        .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
        .replace(backtickRegex, '<code style="background: var(--candy-surface-container); color: var(--candy-primary); padding: 2px 6px; border-radius: 6px; font-family: var(--font-mono); font-size: 12px;">$1</code>')
        .replace(/\\n/g, '<br>');
    }

    function scrollToBottom() {
      var scroll = document.getElementById('tgMessagesScroll');
      scroll.scrollTop = scroll.scrollHeight;
    }

    // Send Message / Directive
    async function sendMessage() {
      var input = document.getElementById('tgTextInput');
      var text = input.value.trim();
      if (!text && activeContexts.length === 0) return;

      if (text === '/settings') {
        input.value = '';
        openSettingsModal();
        return;
      }

      // Prepend anchored Second Brain contexts if attached
      if (activeContexts.length > 0) {
        var contextPrefix = activeContexts.map(function(c) {
          return '[Second Brain Context: "' + c.title + '" (' + c.source + ')]';
        }).join(' ');
        text = contextPrefix + ' ' + text;
      }

      var btn = document.getElementById('tgSendBtn');
      var typing = document.getElementById('tgTypingIndicator');
      var typingMsg = document.getElementById('typingMessage');

      btn.disabled = true;
      typing.style.display = 'flex';
      typingMsg.textContent = 'Ann (Operations Coordinator) is analyzing directive and executing DAG...';

      try {
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text,
            chatId: currentChatId,
            contexts: activeContexts
          })
        });

        input.value = '';
        clearActiveContexts();
        closePopovers();
        fetchMessages();
        syncData();
      } catch (err) {
        console.error(err);
      } finally {
        btn.disabled = false;
        setTimeout(function() {
          typing.style.display = 'none';
          fetchMessages();
          syncData();
        }, 1800);
      }
    }

    // Press Enter to Send
    document.getElementById('tgTextInput')?.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Toggle Popover Menus
    function toggleAttachmentMenu() {
      var popover = document.getElementById('attachmentPopover');
      var slash = document.getElementById('slashPopover');
      slash.classList.remove('open');
      popover.classList.toggle('open');
    }

    function toggleSlashMenu() {
      var popover = document.getElementById('slashPopover');
      var attach = document.getElementById('attachmentPopover');
      attach.classList.remove('open');
      popover.classList.toggle('open');
    }

    function closePopovers() {
      document.getElementById('attachmentPopover').classList.remove('open');
      document.getElementById('slashPopover').classList.remove('open');
      document.getElementById('mentionPopover').classList.remove('open');
    }

    function selectCommand(cmd) {
      var input = document.getElementById('tgTextInput');
      input.value = cmd;
      input.focus();
      closePopovers();
    }

    // Setup @mention autocomplete
    function setupMentionListener() {
      var input = document.getElementById('tgTextInput');
      var popover = document.getElementById('mentionPopover');

      input.addEventListener('input', function() {
        var val = input.value;
        var lastWord = val.split(/\\s+/).pop();
        if (lastWord.startsWith('@')) {
          var query = lastWord.slice(1).toLowerCase();
          var matches = cachedAgents.filter(function(a) {
            return a.display_name.toLowerCase().includes(query) || a.role_title.toLowerCase().includes(query);
          });
          if (matches.length > 0) {
            popover.innerHTML = matches.map(function(a) {
              return '<div class="tg-popover-item" onclick="insertMention(\\'' + a.display_name.split(' ')[0] + '\\')">' +
                '<span class="tg-popover-icon" style="font-weight: 700; color: var(--candy-primary);">' + a.display_name.slice(0, 1) + '</span>' +
                '<div>' +
                  '<div style="font-weight: 700;">' + a.display_name + '</div>' +
                  '<div style="font-size: 11px; color: var(--candy-on-surface-variant);">' + a.role_title + '</div>' +
                '</div>' +
              '</div>';
            }).join('');
            popover.classList.add('open');
          } else {
            popover.classList.remove('open');
          }
        } else {
          popover.classList.remove('open');
        }
      });
    }

    function insertMention(name) {
      var input = document.getElementById('tgTextInput');
      var words = input.value.split(/\\s+/);
      words.pop();
      words.push('@' + name + ' ');
      input.value = words.join(' ');
      input.focus();
      closePopovers();
    }

    // Second Brain Context Anchoring
    function anchorSecondBrainContext() {
      closePopovers();
      if (cachedBrain.length === 0) {
        alert('No Second Brain items available yet. Add one in the Second Brain canvas!');
        return;
      }
      var first = cachedBrain[0];
      activeContexts.push(first);
      renderActiveContexts();
    }

    function anchorItemById(id) {
      var found = cachedBrain.find(function(b) { return b.id === id; });
      if (found && !activeContexts.some(function(c) { return c.id === id; })) {
        activeContexts.push(found);
        renderActiveContexts();
        closeModals();
      }
    }

    function renderActiveContexts() {
      var bar = document.getElementById('activeContextsBar');
      if (activeContexts.length === 0) {
        bar.style.display = 'none';
        bar.innerHTML = '';
        return;
      }
      bar.style.display = 'flex';
      bar.innerHTML = activeContexts.map(function(c, idx) {
        return '<span class="tg-context-pill">' +
          '<span>🧠 ' + c.title + '</span>' +
          '<span class="tg-context-remove" onclick="removeActiveContext(' + idx + ')">&times;</span>' +
        '</span>';
      }).join('');
    }

    function removeActiveContext(idx) {
      activeContexts.splice(idx, 1);
      renderActiveContexts();
    }

    function clearActiveContexts() {
      activeContexts = [];
      renderActiveContexts();
    }

    // Toggle Specialized Execution Canvas Panel (Split Screen)
    function toggleCanvasPanel(forceOpen) {
      var panel = document.getElementById('canvasPanel');
      var btn = document.getElementById('btnSplitCanvas');
      var label = document.getElementById('canvasBtnLabel');

      if (forceOpen === true) {
        panel.classList.add('open');
        isCanvasOpen = true;
      } else {
        panel.classList.toggle('open');
        isCanvasOpen = panel.classList.contains('open');
      }

      if (isCanvasOpen) {
        btn.classList.add('active');
        label.textContent = 'Close Canvas';
      } else {
        btn.classList.remove('active');
        label.textContent = 'Open Canvas';
      }
    }

    function openCanvasDrawerTab(tabName, id) {
      toggleCanvasPanel(true);
      switchCanvasTab(tabName);
    }

    // Switch Canvas Tabs
    function switchCanvasTab(tab) {
      document.querySelectorAll('.tg-c-tab').forEach(function(t) { t.classList.remove('active'); });
      document.getElementById('cTab' + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add('active');

      document.getElementById('canvasTabSheetContent').style.display = tab === 'sheet' ? 'flex' : 'none';
      document.getElementById('canvasTabDeckContent').style.display = tab === 'deck' ? 'flex' : 'none';
      document.getElementById('canvasTabCodeContent').style.display = tab === 'code' ? 'flex' : 'none';
      document.getElementById('canvasTabDagContent').style.display = tab === 'dag' ? 'flex' : 'none';
      document.getElementById('canvasTabBrainContent').style.display = tab === 'brain' ? 'flex' : 'none';
    }

    // Slides Navigation
    function prevSlide() {
      if (currentSlide > 1) {
        currentSlide--;
        renderSlide();
      }
    }
    function nextSlide() {
      if (currentSlide < totalSlides) {
        currentSlide++;
        renderSlide();
      }
    }
    function renderSlide() {
      var data = slidesData[currentSlide - 1];
      var container = document.getElementById('slideContent');
      document.getElementById('slideCounter').textContent = currentSlide + ' of ' + totalSlides;

      var cardsHtml = data.cards.map(function(c) {
        return '<div class="tg-card" style="padding: 12px;">' +
          '<strong style="color: var(--candy-primary);">' + c.label + '</strong>' +
          '<span style="font-size: 12px; color: var(--candy-on-surface-variant);">' + c.desc + '</span>' +
        '</div>';
      }).join('');

      container.innerHTML = '<span style="font-size: 12px; color: var(--candy-primary-accent); font-weight: 700; text-transform: uppercase;">' + data.category + '</span>' +
        '<h2 style="font-size: 22px; color: var(--candy-on-surface); margin: 12px 0 8px;">' + data.title + '</h2>' +
        '<p style="font-size: 14px; color: var(--candy-on-surface-variant); line-height: 1.5;">' + data.body + '</p>' +
        '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 18px;">' +
          cardsHtml +
        '</div>';
    }

    function toggleFullscreenSlide() {
      var el = document.getElementById('slideViewer');
      if (!document.fullscreenElement) {
        el.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    }

    // Sheet Operations
    function addSheetRow() {
      var tbody = document.getElementById('sheetBody');
      var tr = document.createElement('tr');
      tr.innerHTML = '<td contenteditable="true">Custom Oracle Node</td>' +
        '<td contenteditable="true">180ms</td>' +
        '<td contenteditable="true">$0.0008</td>' +
        '<td contenteditable="true">96.0%</td>' +
        '<td contenteditable="true" style="color: var(--candy-online); font-weight: 700;">AGREE</td>';
      tbody.appendChild(tr);
    }

    function exportSheetCSV() {
      var rows = Array.from(document.querySelectorAll('#interactiveSheet tr'));
      var csv = rows.map(function(r) {
        return Array.from(r.querySelectorAll('th, td')).map(function(cell) {
          return '"' + cell.innerText.replace(/"/g, '""') + '"';
        }).join(',');
      }).join('\\n');
      var blob = new Blob([csv], { type: 'text/csv' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'empyrean_model_matrix.csv';
      a.click();
    }

    function saveSheetCanvas() {
      alert('Sheet canvas changes saved to persistent Second Brain context!');
    }

    // Code Sandbox & Live Preview Mode
    function toggleSandboxPreviewMode() {
      isSandboxPreviewMode = !isSandboxPreviewMode;
      var codeWrap = document.getElementById('sandboxCodeWrapper');
      var prevWrap = document.getElementById('sandboxPreviewWrapper');
      var btn = document.getElementById('btnToggleSandboxView');

      if (isSandboxPreviewMode) {
        codeWrap.style.display = 'none';
        prevWrap.style.display = 'block';
        btn.textContent = 'Show Code Editor';
        loadIframePreview();
      } else {
        codeWrap.style.display = 'block';
        prevWrap.style.display = 'none';
        btn.textContent = 'Show Live Preview';
      }
    }

    function loadIframePreview() {
      var iframe = document.getElementById('sandboxIframe');
      var htmlContent = '<!DOCTYPE html><html><head><style>body { font-family: "DM Sans", -apple-system, sans-serif; padding: 24px; background: #fff7fb; color: #281330; } .btn { background: #af0a78; color: #fff; padding: 8px 18px; border-radius: 9999px; border: none; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(224,64,160,0.3); } .card { background: #ffffff; border: 1.5px solid #f8d8ff; padding: 20px; border-radius: 18px; margin-top: 14px; box-shadow: 0 4px 16px rgba(116,74,162,0.08); }</style></head><body><h2 style="color: #af0a78;">Empyrean Candy Auth Prototype</h2><p style="color: #57414a; font-size: 13px;">Live rendered from Raphael\\'s scaffold module in Candy theme.</p><div class="card"><h4>JWT Verification Shield</h4><p style="font-size: 13px; color: #57414a; margin: 8px 0;">Token validation: SHA256 verified. RBAC permissions active.</p><button class="btn" onclick="alert(\\'JWT Authenticated Successfully!\\')">Test Verification</button></div></body></html>';
      iframe.srcdoc = htmlContent;
    }

    function copySandboxCode() {
      var code = document.getElementById('sandboxCodeDisplay').textContent;
      navigator.clipboard.writeText(code);
      alert('Code copied to clipboard!');
    }

    function downloadSandboxFile() {
      var code = document.getElementById('sandboxCodeDisplay').textContent;
      var blob = new Blob([code], { type: 'text/typescript' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'jwt_verifier.ts';
      a.click();
    }

    // Modal Operations
    function openDeployRoleModal() {
      closePopovers();
      document.getElementById('modalDeployRole').classList.add('open');
    }
    function openCallModal() {
      closePopovers();
      document.getElementById('modalCall').classList.add('open');
    }
    function openAddKnowledgeModal() {
      closePopovers();
      document.getElementById('modalAddKnowledge').classList.add('open');
    }
    function openCommandPalette() {
      closePopovers();
      document.getElementById('modalCmdPalette').classList.add('open');
      var input = document.getElementById('cmdInput');
      input.value = '';
      input.focus();
      filterCommandPalette('');
    }
    function closeModals() {
      document.querySelectorAll('.tg-modal-backdrop').forEach(function(m) { m.classList.remove('open'); });
    }
    function closeModalsOnBackdrop(e) {
      if (e.target.classList.contains('tg-modal-backdrop')) {
        closeModals();
      }
    }

    // Quick Role Presets
    function presetRole(name, title, desc, color, tier) {
      document.getElementById('deployName').value = name;
      document.getElementById('deployRoleTitle').value = title;
      document.getElementById('deployDescription').value = desc;
      document.getElementById('deployColor').value = color;
      document.getElementById('deployTier').value = tier;
    }

    // Submit Role Deployment
    async function submitDeployRole() {
      var name = document.getElementById('deployName').value.trim();
      var roleTitle = document.getElementById('deployRoleTitle').value.trim();
      var description = document.getElementById('deployDescription').value.trim();
      var tier = document.getElementById('deployTier').value;
      var avatarColor = document.getElementById('deployColor').value;

      if (!name || !roleTitle) {
        alert('Please specify name and role title');
        return;
      }

      try {
        await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            displayName: name,
            roleTitle: roleTitle,
            description: description,
            tier: tier,
            avatarColor: avatarColor
          })
        });

        closeModals();
        syncData();
        fetchMessages();
      } catch (e) {
        console.error(e);
      }
    }

    // Submit Call For Me Simulation
    async function submitCallSimulation() {
      var vendorName = document.getElementById('callVendorName').value.trim() || 'Stripe API Operations';
      var objective = document.getElementById('callObjective').value.trim() || 'Verified webhook routing and high-throughput SLA';

      try {
        await fetch('/api/calls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vendorName: vendorName,
            summary: objective,
            duration: '1m 52s'
          })
        });
        closeModals();
        fetchMessages();
      } catch (e) {
        console.error(e);
      }
    }

    // Submit Knowledge to Second Brain
    async function submitKnowledgeItem() {
      var title = document.getElementById('kbTitle').value.trim();
      var category = document.getElementById('kbCategory').value;
      var source = document.getElementById('kbSource').value.trim();
      var snippet = document.getElementById('kbSnippet').value.trim();

      if (!title || !snippet) {
        alert('Please provide title and snippet');
        return;
      }

      try {
        await fetch('/api/second-brain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title,
            category: category,
            source: source || 'user://manual-entry',
            snippet,
            tags: ['custom', category]
          })
        });
        closeModals();
        syncData();
      } catch (e) {
        console.error(e);
      }
    }

    // Audio Voice Sample Player in Call Modal
    var isVoicePlaying = false;
    var voiceInterval = null;
    function togglePlayVoiceSample(btn) {
      isVoicePlaying = !isVoicePlaying;
      btn.textContent = isVoicePlaying ? '⏸' : '▶';
      var sticks = document.querySelectorAll('#sampleWaveform .wave-stick');

      if (isVoicePlaying) {
        voiceInterval = setInterval(function() {
          sticks.forEach(function(s) {
            var h = Math.floor(Math.random() * 20) + 6;
            s.style.height = h + 'px';
          });
        }, 150);
      } else {
        clearInterval(voiceInterval);
        sticks.forEach(function(s) { s.style.height = '14px'; });
      }
    }

    // Filter Command Palette
    function filterCommandPalette(q) {
      var list = document.getElementById('cmdList');
      var query = q.toLowerCase().trim();

      var items = [
        { title: 'Open Settings', category: 'Settings', action: function() { openSettingsModal(); } },
        { title: 'Toggle Light / Dark Mode', category: 'Theme', action: function() { toggleTheme(); } },
        { title: '#general-swarm', category: 'Channel', action: function() { switchChat('general-swarm', '#general-swarm', '6 digital employees active', '#af0a78'); } },
        { title: '#dev-scaffold', category: 'Channel', action: function() { switchChat('dev-scaffold', '#dev-scaffold', 'Raphael, Michael active', '#744aa2'); } },
        { title: '#security-audit', category: 'Channel', action: function() { switchChat('security-audit', '#security-audit', 'Dwayne, Seraphim, Michael', '#006388'); } },
        { title: 'Deploy Digital Employee', category: 'Role Action', action: function() { openDeployRoleModal(); } },
        { title: 'Call For Me (Voice Recap)', category: 'Audio Action', action: function() { openCallModal(); } },
        { title: 'Open AI Sheets Canvas', category: 'Canvas', action: function() { openCanvasDrawerTab('sheet'); } },
        { title: 'Open Slides Deck', category: 'Canvas', action: function() { openCanvasDrawerTab('deck'); } },
        { title: 'Open Code Sandbox', category: 'Canvas', action: function() { openCanvasDrawerTab('code'); } },
        { title: 'Add Second Brain Memory', category: 'Knowledge', action: function() { openAddKnowledgeModal(); } }
      ];

      cachedAgents.forEach(function(a) {
        items.push({
          title: a.display_name,
          category: 'Employee DM',
          action: function() { switchChat(a.id, a.display_name, a.role_title, a.tier === 'reason' ? '#af0a78' : '#744aa2'); }
        });
      });

      var filtered = query ? items.filter(function(i) {
        return i.title.toLowerCase().includes(query) || i.category.toLowerCase().includes(query);
      }) : items;

      list.innerHTML = filtered.map(function(item, idx) {
        return '<div class="tg-cmd-item ' + (idx === 0 ? 'selected' : '') + '" onclick="executeCmdItem(' + idx + ')">' +
          '<div class="tg-cmd-left">' +
            '<span>' + (item.category === 'Channel' ? '#' : item.category === 'Employee DM' ? '👤' : item.category === 'Settings' ? '⚙️' : item.category === 'Theme' ? '🎨' : '⚡') + '</span>' +
            '<strong>' + item.title + '</strong>' +
          '</div>' +
          '<span class="tg-cmd-meta">' + item.category + '</span>' +
        '</div>';
      }).join('');

      window._currentFilteredCmds = filtered;
    }

    function executeCmdItem(idx) {
      if (window._currentFilteredCmds && window._currentFilteredCmds[idx]) {
        window._currentFilteredCmds[idx].action();
        closeModals();
      }
    }

    function jumpToPinnedDirective() {
      openCanvasDrawerTab('dag');
    }

    // Sync System Data
    async function syncData() {
      try {
        var results = await Promise.all([
          fetch('/api/directives'),
          fetch('/api/tasks'),
          fetch('/api/events'),
          fetch('/api/second-brain'),
          fetch('/api/canvases'),
          fetch('/api/agents')
        ]);

        cachedDirectives = await results[0].json();
        cachedTasks = await results[1].json();
        cachedEvents = await results[2].json();
        cachedBrain = await results[3].json();
        cachedCanvases = await results[4].json();
        cachedAgents = await results[5].json();

        renderEmployeesList(cachedAgents);
        renderDagSelect();
        renderSecondBrain(cachedBrain);
        renderCodeSandbox(cachedCanvases);

        if (cachedDirectives.length > 0) {
          document.getElementById('pinnedDirectiveText').textContent = cachedDirectives[0].text;
        }
      } catch (e) {
        console.error(e);
      }
    }

    function renderEmployeesList(agents) {
      var container = document.getElementById('employeesList');
      if (!container) return;

      container.innerHTML = agents.map(function(a) {
        var color = a.tier === 'reason' ? '#af0a78' : a.tier === 'control' ? '#744aa2' : a.tier === 'work' ? '#e040a0' : a.tier === 'comms' ? '#10b981' : '#006388';
        var initial = a.display_name.slice(0, 2).toUpperCase();

        return '<li class="tg-chat-item ' + (currentChatId === a.id ? 'active' : '') + '" onclick="switchChat(\\'' + a.id + '\\', \\'' + a.display_name + '\\', \\'' + a.role_title + '\\', \\'' + color + '\\')">' +
          '<div class="tg-avatar" style="background: ' + color + ';">' +
            initial +
            '<span class="tg-online-badge ' + (a.tier === 'gateway' ? 'cloud' : '') + '"></span>' +
          '</div>' +
          '<div class="tg-chat-info">' +
            '<div class="tg-chat-top">' +
              '<span class="tg-chat-name">' + a.display_name + '</span>' +
              '<span class="tg-chat-time">online</span>' +
            '</div>' +
            '<div class="tg-chat-bottom">' +
              '<span class="tg-chat-preview">' + a.role_title + '</span>' +
            '</div>' +
          '</div>' +
        '</li>';
      }).join('');
    }

    function renderDagSelect() {
      var select = document.getElementById('dagSelect');
      if (!select) return;
      select.innerHTML = cachedDirectives.map(function(d) {
        return '<option value="' + d.id + '">' + d.id + ' — ' + d.text.slice(0, 30) + '...</option>';
      }).join('');
      if (cachedDirectives.length > 0) {
        renderDag(cachedDirectives[0].id);
      }
    }

    function renderDag(directiveId) {
      var d = cachedDirectives.find(function(x) { return x.id === directiveId; });
      var container = document.getElementById('dagNodesContainer');
      if (!d || !d.tree || !container) return;

      container.innerHTML = d.tree.nodes.map(function(node) {
        var matched = cachedTasks.find(function(t) { return t.id === node.id; });
        var state = matched ? matched.state : 'pending';
        var deps = node.dependsOn && node.dependsOn.length > 0 ? node.dependsOn.join(', ') : 'root (none)';

        return '<div class="tg-card">' +
          '<div style="display: flex; justify-content: space-between; align-items: center;">' +
            '<span style="font-family: var(--font-mono); font-weight: 700; color: var(--candy-primary);">[' + node.id + ']</span>' +
            '<span style="color: var(--candy-secondary); font-size: 11px; font-weight: bold; text-transform: uppercase;">' + state + '</span>' +
          '</div>' +
          '<div style="font-size: 12.5px; color: var(--candy-on-surface-variant);">Kind: <strong>' + node.kind + '</strong> · Depends on: <strong>' + deps + '</strong></div>' +
          '<pre class="tg-code-block">Payload: ' + escapeHtml(JSON.stringify(node.payload, null, 2)) + '</pre>' +
        '</div>';
      }).join('');
    }

    function renderSecondBrain(items) {
      var container = document.getElementById('secondBrainItems');
      if (!container) return;

      container.innerHTML = items.map(function(item) {
        return '<div class="tg-card">' +
          '<div style="display: flex; justify-content: space-between;">' +
            '<span style="font-weight: 700; color: var(--candy-on-surface);">' + item.title + '</span>' +
            '<span style="font-size: 10px; color: var(--candy-secondary); font-weight: 700;">' + item.category.toUpperCase() + '</span>' +
          '</div>' +
          '<div style="font-size: 11.5px; color: var(--candy-on-surface-variant);">Source: ' + item.source + '</div>' +
          '<div style="font-size: 13px; color: var(--candy-on-surface); margin-top: 4px;">' + item.snippet + '</div>' +
          '<div style="display: flex; justify-content: flex-end; margin-top: 6px;">' +
            '<button class="candy-pill-btn candy-bounce" onclick="anchorItemById(\\'' + item.id + '\\')">+ Anchor to Chat</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    function renderBrainSidebarList() {
      var container = document.getElementById('brainList');
      if (!container) return;
      container.innerHTML = cachedBrain.map(function(item) {
        return '<li class="tg-chat-item" onclick="anchorItemById(\\'' + item.id + '\\')">' +
          '<div class="tg-avatar" style="background: var(--candy-primary); font-size: 14px;">🧠</div>' +
          '<div class="tg-chat-info">' +
            '<div class="tg-chat-top">' +
              '<span class="tg-chat-name">' + item.title + '</span>' +
              '<span class="tg-chat-time">' + item.category + '</span>' +
            '</div>' +
            '<div class="tg-chat-preview">' + item.snippet.slice(0, 45) + '...</div>' +
          '</div>' +
        '</li>';
      }).join('');
    }

    function renderCodeSandbox(canvases) {
      var codeCanvas = canvases.find(function(c) { return c.type === 'code'; });
      var target = document.getElementById('sandboxCodeDisplay');
      if (codeCanvas && target) {
        target.textContent = codeCanvas.content;
      }
    }

    function handleInlineAction(action) {
      var input = document.getElementById('tgTextInput');
      if (action === 'preset:auth') {
        input.value = 'Scaffold JWT auth module, run DB migration, and notify Slack audit channel';
        sendMessage();
      } else if (action === 'preset:migrate') {
        input.value = 'Execute database schema migration and perform workspace maintenance';
        sendMessage();
      } else if (action === 'preset:consensus') {
        input.value = 'Architect consensus review for multi-model reasoning pipeline with 80% threshold';
        sendMessage();
      } else if (action === 'preset:call') {
        openCallModal();
      }
    }

    // Auto-polling for real-time collaboration
    setInterval(function() {
      fetchMessages();
      syncData();
    }, 3500);

  </script>
</body>
</html>`;
}
