import { REST, Routes } from 'discord.js';
import { commands } from '../commands/slashCommands.js';

async function deployCommands() {
	const rest = new REST({ version: '9' }).setToken(
		process.env.DISCORD_BOT_TOKEN
	);
	try {
		console.log('Memulai refresh application (/) commands.');
		await rest.put(
			Routes.applicationGuildCommands(
				process.env.CLIENT_ID,
				process.env.GUILD_ID
			),
			{ body: commands }
		);
		console.log('Berhasil me-refresh application (/) commands.');
	} catch (error) {
		console.error('Deployment commands error:', error);
	}
}

export { deployCommands };
