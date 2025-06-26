import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} from 'discord.js';

async function sendPaginatedEmbed(channel, content, message) {
	const MESSAGE_LIMIT = 3800;
	const chunks = [];
	let currentPos = 0;

	function findSplitPosition(str) {
		const space = str.lastIndexOf(' ');
		const period = str.lastIndexOf('.');
		const newLine = str.lastIndexOf('\n');

		const positions = [space, period, newLine];
		const validPositions = positions.filter((pos) => pos >= 0);

		return validPositions.length > 0
			? Math.max(...validPositions) + 1
			: str.length;
	}

	while (currentPos < content.length) {
		let slice = content.substring(currentPos, currentPos + MESSAGE_LIMIT);

		if (slice.length < MESSAGE_LIMIT) {
			chunks.push(slice);
			break;
		}

		const splitPos = findSplitPosition(slice);

		chunks.push(content.substring(currentPos, currentPos + splitPos));
		currentPos += splitPos;
	}

	if (chunks.length === 0) return;

	let currentPage = 0;

	const embed = new EmbedBuilder()
		.setDescription(chunks[currentPage])
		.setAuthor({
			name: message.author.username,
			iconURL: message.author.displayAvatarURL(),
		})
		.setFooter({
			text: `${new Date().toLocaleString()} | Server: ${
				message.guild.name
			} | Page: ${currentPage + 1}/${chunks.length}`,
			iconURL: message.guild.iconURL() || undefined,
		})
		.setColor('#0099ff');

	const previousButton = new ButtonBuilder()
		.setCustomId('previous')
		.setLabel('◀️')
		.setStyle(ButtonStyle.Primary)
		.setDisabled(true);

	const nextButton = new ButtonBuilder()
		.setCustomId('next')
		.setLabel('▶️')
		.setStyle(ButtonStyle.Primary)
		.setDisabled(chunks.length <= 1);

	const deleteButton = new ButtonBuilder()
		.setCustomId('delete')
		.setLabel('Delete')
		.setEmoji('🗑️')
		.setStyle(ButtonStyle.Danger);

	const row = new ActionRowBuilder().addComponents(
		previousButton,
		nextButton,
		deleteButton
	);

	const sentMessage = await message.reply({
		embeds: [embed],
		components: [row],
	});

	const collector = sentMessage.createMessageComponentCollector({
		time: 300 * 60 * 1000,
	});

	collector.on('collect', async (interaction) => {
		if (interaction.user.id !== message.author.id) {
			const embed = new EmbedBuilder()
				.setColor(0xff0000)
				.setTitle('Access Denied')
				.setDescription("It's not for you.");

			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		try {
			if (interaction.customId === 'delete') {
				collector.stop('deleted');
				await sentMessage.delete();
				return;
			}

			if (!sentMessage || sentMessage.deleted) {
				collector.stop('message deleted');
				return;
			}

			if (interaction.customId === 'next') {
				currentPage++;
			} else if (interaction.customId === 'previous') {
				currentPage--;
			}

			previousButton.setDisabled(currentPage === 0);
			nextButton.setDisabled(currentPage === chunks.length - 1);

			embed.setDescription(chunks[currentPage]).setFooter({
				text: `${new Date().toLocaleString()} | Server: ${
					message.guild.name
				} | Page: ${currentPage + 1}/${chunks.length}`,
				iconURL: message.guild.iconURL() || undefined,
			});

			await interaction.update({ embeds: [embed], components: [row] });
		} catch (error) {
			console.error('Error di pagination collector:', error);
			collector.stop('error');
		}
	});

	collector.on('end', (collected, reason) => {
		if (reason === 'deleted') return;
		try {
			if (sentMessage && !sentMessage.deleted) {
				previousButton.setDisabled(true);
				nextButton.setDisabled(true);
				deleteButton.setDisabled(true);

				sentMessage.edit({ components: [row] });
			}
		} catch (error) {
			console.error('Error saat menonaktifkan tombol:', error);
		}
	});
}

export { sendPaginatedEmbed };
