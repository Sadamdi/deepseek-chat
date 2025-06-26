import { saveConfig } from '../config/configManager.js';

async function handleCommand(interaction, config) {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'respondall') {
		const channelId =
			interaction.options.getString('channel_id') || interaction.channel.id;

		if (!config.respondChannels.includes(channelId)) {
			config.respondChannels.push(channelId);

			try {
				const success = saveConfig(config);
				if (success) {
					await interaction.reply(
						`Channel ID ${channelId} telah ditambahkan untuk respons.`
					);
				} else {
					await interaction.reply(
						'Gagal menambahkan channel. Silakan coba lagi.'
					);
				}
			} catch (error) {
				console.error('Gagal menyimpan konfigurasi:', error);
				await interaction.reply(
					'Gagal menambahkan channel. Silakan coba lagi.'
				);
			}
		} else {
			await interaction.reply(
				`Channel ID ${channelId} sudah ada dalam daftar respons.`
			);
		}
	}
}

export { handleCommand };
