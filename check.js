const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('script.js', 'utf8');

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable",
  url: "http://localhost:8080"
});

dom.window.fetch = async () => ({
  ok: true,
  json: async () => ([])
});

dom.window.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

dom.window.onerror = function(msg, source, lineNo, columnNo, error) {
  console.error('JSDOM Error:', msg, lineNo, columnNo, error);
};

dom.window.eval(script);
dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

setTimeout(() => {
  console.log("Spotlights container:", dom.window.document.getElementById('dynamic-spotlights-container').innerHTML.trim());
}, 1000);
