import { SlashCommandBuilder } from 'discord.js';

const commands = [
	new SlashCommandBuilder()
		.setName('respondall')
		.setDescription('Tambahkan channel ke daftar respons bot')
		.addStringOption((option) =>
			option
				.setName('channel_id')
				.setDescription('ID channel')
				.setRequired(false)
		),
].map((command) => command.toJSON());

export { commands };
