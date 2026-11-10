export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/imagens");
  eleventyConfig.addPassthroughCopy("src/estilo.css");

  eleventyConfig.addFilter("dataBR", (d) =>
    new Date(d).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("slug", (s) =>
    String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  );
  eleventyConfig.addFilter("tempoLeitura", (html) => {
    const palavras = String(html).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(palavras / 200));
  });
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addCollection("temas", (api) => {
    const set = new Set();
    api.getFilteredByGlob("src/posts/*.md").forEach((p) => p.data.tema && set.add(p.data.tema));
    return [...set].sort();
  });

  return { dir: { input: "src", output: "_site" }, markdownTemplateEngine: false };
}
