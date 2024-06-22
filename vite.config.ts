import pages from "@hono/vite-cloudflare-pages";
import adapter from "@hono/vite-dev-server/cloudflare";
import honox from "honox/vite";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";

export default defineConfig({
    plugins: [
        honox({ devServer: { adapter } }),
        pages(),
        babel({
            filter: /\.[jt]sx?$/,
            babelConfig: {
                presets: ["@babel/preset-typescript"], // if you use TypeScript
                plugins: [["babel-plugin-react-compiler", {}]],
            },
        }),
        {
            name: "test",
            transform: (src, id) => {
                return {
                    code: src.replace(
                        `import { c as _c } from "react/compiler-runtime"`,
                        `
const REACT_MEMO_CACHE_SENTINEL = Symbol.for('react.memo_cache_sentinel');
                
function _c(size) { 
  const data = new Array(size);
  for (let i = 0; i < size; i++) {
    data[i] = REACT_MEMO_CACHE_SENTINEL;
  }
  return data;
}
`
                    ),
                };
            },
        },
    ],
});
