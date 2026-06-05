export function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#2367e8"/><path d="M8 10h16v3H8zm0 5h12v3H8zm0 5h16v3H8z" fill="#fff"/></svg>`;

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml",
      "cache-control": "public, max-age=86400"
    }
  });
}
