import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { readConfig, watchConfig } from './config/configManager.js';
import { handleCommand } from './handlers/commandHandler.js';
import { handleMessage } from './handlers/messageHandler.js';
import { deployCommands } from './utils/commandDeployer.js';

dotenv.config();

let config = readConfig();

watchConfig((newConfig) => {
	config = newConfig;
});

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages,
	],
});

client.once('ready', () => {
	console.log('Bot siap digunakan!');
	deployCommands();
});

client.on('messageCreate', async (message) => {
	await handleMessage(message, config);
});

client.on('interactionCreate', async (interaction) => {
	await handleCommand(interaction, config);
});

client.on('error', (error) => {
	console.error('Discord client error:', error);
});

client.login(process.env.DISCORD_BOT_TOKEN).catch((error) => {
	console.error('Gagal login bot:', error);
	process.exit(1);
});
