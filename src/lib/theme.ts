export type Theme = "dark" | "light"

export const THEME_KEY = "theme"

/**
 * Inline script for <head>: applies a saved light theme before first paint so the page
 * never flashes dark first. Dark is the default, so nothing runs for it.
 */
export const themeInitScript = `try{if(localStorage.getItem("${THEME_KEY}")==="light")document.documentElement.dataset.theme="light"}catch(e){}`
