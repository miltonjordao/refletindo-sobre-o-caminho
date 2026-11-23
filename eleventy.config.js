import { HtmlBasePlugin } from "@11ty/eleventy";
import notasDeRodape from "markdown-it-footnote";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  // Notas de rodapé no estilo [^1] dentro dos textos
  eleventyConfig.amendLibrary("md", (md) => {
    md.use(notasDeRodape);
    md.renderer.rules.footnote_caption = (tokens, idx) => String(tokens[idx].meta.id + 1);
    md.renderer.rules.footnote_block_open = () =>
      '<section class="notas" aria-label="Notas"><h2>Notas</h2>\n<ol class="notas-lista">\n';
    md.renderer.rules.footnote_block_close = () => "</ol>\n</section>\n";
    md.renderer.rules.footnote_anchor = (tokens, idx, options, env, slf) => {
      let id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
      if (tokens[idx].meta.subId > 0) id += ":" + tokens[idx].meta.subId;
      return ' <a href="#fnref' + id + '" class="nota-voltar" aria-label="Voltar ao texto">↩</a>';
    };
  });
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
