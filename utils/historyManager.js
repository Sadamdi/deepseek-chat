import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const historyFilePath = path.join(__dirname, '..', 'history.json');

function readHistory() {
	try {
		if (!fs.existsSync(historyFilePath)) {
			fs.writeFileSync(historyFilePath, JSON.stringify({}, null, 2));
			return {};
		}

		const historyData = fs.readFileSync(historyFilePath, 'utf-8');
		return JSON.parse(historyData);
	} catch (error) {
		console.error('Error membaca history:', error);
		return {};
	}
}

function saveHistory(history) {
	try {
		fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2));
		return true;
	} catch (error) {
		console.error('Error menyimpan history:', error);
		return false;
	}
}

function addToHistory(channelId, userMessage, botResponse) {
	const history = readHistory();

	if (!history[channelId]) history[channelId] = [];
	history[channelId].push({ role: 'user', content: userMessage });
	history[channelId].push({ role: 'assistant', content: botResponse });

	if (history[channelId].length > 100) {
		history[channelId] = history[channelId].slice(-10);
	}

	return saveHistory(history);
}

function getChannelHistory(channelId) {
	const history = readHistory();
	return history[channelId] || [];
}

export { addToHistory, getChannelHistory, readHistory, saveHistory };
