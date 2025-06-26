import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configFilePath = path.join(__dirname, '..', 'config.json');

function readConfig() {
	try {
		if (!fs.existsSync(configFilePath)) {
			const defaultConfig = { respondChannels: [] };
			fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2));
			return defaultConfig;
		}

		const configData = fs.readFileSync(configFilePath, 'utf-8');
		const parsedConfig = JSON.parse(configData);

		if (!parsedConfig.respondChannels) {
			parsedConfig.respondChannels = [];
		}

		return parsedConfig;
	} catch (error) {
		console.error('Error membaca konfigurasi:', error);
		return { respondChannels: [] };
	}
}

function saveConfig(config) {
	try {
		fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
		return true;
	} catch (error) {
		console.error('Error menyimpan konfigurasi:', error);
		return false;
	}
}

function watchConfig(callback) {
	fs.watchFile(configFilePath, (curr, prev) => {
		if (curr.mtime !== prev.mtime) {
			console.log('Config file has changed. Reloading configuration...');
			callback(readConfig());
		}
	});
}

export { readConfig, saveConfig, watchConfig };
