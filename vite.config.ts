import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const isDebugBuild = mode === 'debug'

  return {
    esbuild: isDebugBuild
      ? {
          keepNames: true
        }
      : undefined,
    build: {
      sourcemap: isDebugBuild ? 'inline' : false,
      minify: isDebugBuild ? false : 'esbuild',
      cssMinify: !isDebugBuild,
      target: isDebugBuild ? 'esnext' : undefined,
      rollupOptions: {
        treeshake: isDebugBuild ? false : undefined,
        input: {
          content: 'src/content/index.ts'
        },
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: isDebugBuild ? 'assets/[name].js' : 'assets/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'assets/main.css'
            }
            return 'assets/[name][extname]'
          }
        }
      }
    }
  }
})
