import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(() => ({
	server: {
		host: '::',
		port: 8080,
		// Para HTTPS, descomente as linhas abaixo:
		// https: {
		//   key: './localhost-key.pem',
		//   cert: './localhost.pem'
		// }
		hmr: { overlay: false },
	},
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			stream: 'stream-browserify',
			buffer: 'buffer',
			process: 'process/browser',
			util: 'util',
		},
	},
	define: {
		global: 'globalThis',
	},
}));
