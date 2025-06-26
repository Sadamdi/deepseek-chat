import path from 'path';
import { describeImage, getDeepSeekResponse } from '../services/aiService.js';
import {
	readGoogleDocs,
	readGoogleSheets,
	readGoogleSlides,
} from '../services/googleDocsService.js';
import { sendPaginatedEmbed } from '../utils/embedBuilder.js';
import {
	downloadAndReadFile,
	downloadFile,
	readExcelContent,
	readPdfContent,
	readPptContent,
	readTxtContent,
	readWordContent,
} from '../utils/fileProcessor.js';

async function handleMessage(message, config) {
	if (message.author.bot) return;

	if (
		!config.respondChannels ||
		!config.respondChannels.includes(message.channel.id)
	)
		return;

	const channelId = message.channel.id;

	await message.channel.sendTyping();

	try {
		let messageContent = message.content;
		if (message.attachments.size > 0) {
			const attachments = Array.from(message.attachments.values());

			const responses = await Promise.all(
				attachments.map(async (attachment) => {
					const filePath = path.join(
						process.cwd(),
						'download',
						attachment.name
					);

					try {
						await downloadFile(attachment.url, filePath);

						let contentToSend = '';

						if (
							attachment.contentType === 'application/pdf' ||
							path.extname(attachment.name) === '.pdf'
						) {
							const pdfContent = await readPdfContent(filePath);
							contentToSend = `Ini adalah isi dari PDF yang diberikan:\n${pdfContent}`;
						} else if (
							attachment.contentType ===
								'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
							path.extname(attachment.name) === '.docx' ||
							path.extname(attachment.name) === '.doc'
						) {
							const wordContent = await readWordContent(filePath);

							contentToSend = `Ini adalah isi dari dokumen Word:\n${wordContent}`;
						} else if (
							attachment.contentType === 'application/vnd.ms-excel' ||
							path.extname(attachment.name) === '.xls' ||
							attachment.contentType ===
								'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
							path.extname(attachment.name) === '.xlsx'
						) {
							const excelContent = await readExcelContent(filePath);
							contentToSend = `Ini adalah isi dari file Excel:\n${excelContent}`;
						} else if (attachment.contentType === 'text/plain') {
							const txtContent = await readTxtContent(filePath);
							console.log(filePath);
							contentToSend = `Ini adalah isi dari file teks:\n${txtContent}`;
						} else if (
							attachment.contentType ===
								'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
							attachment.contentType === 'application/vnd.ms-powerpoint' ||
							path.extname(attachment.name) === '.pptx' ||
							path.extname(attachment.name) === '.ppt'
						) {
							const pptContent = await readPptContent(filePath);
							contentToSend = `Ini adalah isi dari file powerpoint:\n${pptContent}`;
						} else if (
							attachment.contentType.startsWith('image/') &&
							attachment.contentType !== 'image/gif'
						) {
							const description = await describeImage(attachment.url);
							const userContext = `Gambar dikirim oleh ${
								message.author.username
							} di server ${
								message.guild.name
							} pada ${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`;
							const originalPrompt = message.content
								? `\n\nPrompt Asli Pengguna: "${message.content}"`
								: '';
							contentToSend = `${userContext}${originalPrompt}\n\nDeskripsi Detail Gambar:\n${description}`;
						} else if (attachment.contentType.startsWith('video/')) {
							contentToSend =
								'Video telah diterima. Namun, deskripsi otomatis tidak diterapkan untuk video.';
						} else {
							const fileType = path.extname(attachment.name) || '';
							const fileTypes = [
								'.html',
								'.js',
								'.css',
								'.json',
								'.xml',
								'.csv',
								'.py',
								'.java',
								'.sql',
								'.log',
								'.md',
								'.txt',
							];

							if (fileTypes.includes(fileType)) {
								const fileContent = await downloadAndReadFile(
									attachment.url,
									fileType
								);
								contentToSend = `Ini adalah isi dari file ${fileType}:\n\
\
${fileContent}\n\
\
`;
							} else {
								contentToSend = 'Tipe file tidak didukung untuk ekstraksi.';
							}
						}

						const prompt = `Analisis berikut: ${contentToSend}`;
						return getDeepSeekResponse(channelId, prompt);
					} catch (error) {
						console.error(
							`Error processing attachment ${attachment.name}:`,
							error
						);
						return 'Error processing attachment.';
					}
				})
			);

			const finalResponse = responses.join('\n\n');
			await sendPaginatedEmbed(message.channel, finalResponse, message);
		} else {
			const messageContent = message.content;

			const googleDocMatch = messageContent.match(
				/docs\.google\.com\/document\/d\/([a-zA-Z0-9-_]+)/
			);
			const googleSlideMatch = messageContent.match(
				/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9-_]+)/
			);
			const googleSheetMatch = messageContent.match(
				/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/
			);
			let botResponse;

			if (googleDocMatch && googleDocMatch[1]) {
				const docId = googleDocMatch[1];
				const googleDocsContent = await readGoogleDocs(docId);
				botResponse = `Ini adalah isi dari Google Docs (ID: ${docId}):\n${googleDocsContent}`;
			} else if (googleSlideMatch && googleSlideMatch[1]) {
				const slideId = googleSlideMatch[1];
				const googleSlidesContent = await readGoogleSlides(slideId);
				botResponse = `Ini adalah isi dari Google Slides (ID: ${slideId}):\n${googleSlidesContent}`;
			} else if (googleSheetMatch && googleSheetMatch[1]) {
				const sheetId = googleSheetMatch[1];
				const googleSheetsContent = await readGoogleSheets(sheetId);
				botResponse = `Ini adalah isi dari Google Sheets (ID: ${sheetId}):\n${googleSheetsContent}`;
			} else {
				botResponse = await getDeepSeekResponse(channelId, messageContent);
			}

			await sendPaginatedEmbed(message.channel, botResponse, message);
		}
	} catch (error) {
		console.error('Error di message handler:', error);
		message.reply('Terjadi kesalahan saat memproses pesan.');
	}
}

export { handleMessage };
