/**
 * Centralized API configuration.
 * Automatically falls back to the production Render backend URL
 * if process.env.NEXT_PUBLIC_API_URL is undefined or empty.
 */
export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== "")
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "")
    : "https://ai-company-intelligence.onrender.com";
