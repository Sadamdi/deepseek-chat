import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { addToHistory, getChannelHistory } from '../utils/historyManager.js';
dotenv.config();

const apiKeys = [
	process.env.DEEPSEEK_API_KEY,
	process.env.DEEPSEEK_API_KEY2,
	process.env.DEEPSEEK_API_KEY3,
	process.env.DEEPSEEK_API_KEY4,
	process.env.DEEPSEEK_API_KEY5,
].filter((key) => key);
let currentApiKeyIndex = 0;

const activeRequests = new Set();

async function describeImage(imageUrl) {
	try {
		const geminiKey = process.env.GEMINI_API_KEY;
		if (!geminiKey) {
			console.error('GEMINI_API_KEY not found in environment variables');
			return 'Tidak dapat mendeskripsikan gambar karena API key Gemini tidak ditemukan.';
		}

		const genAI = new GoogleGenerativeAI(geminiKey);
		const model = genAI.getGenerativeModel({
			model: 'gemini-2.0-flash',
			generationConfig: {
				maxOutputTokens: 10000,
			},
		});

		const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
		const base64Image = Buffer.from(response.data, 'binary').toString('base64');

		const prompt =
			'Berikan deskripsi secara lengkap tentang gambar ini, termasuk semua elemen visual yang ada seperti objek, warna, suasana, komposisi, dan konteks gambar. Selain itu, ekstrak semua teks yang terdapat di dalam gambar dengan jelas dan rinci.';
		const result = await model.generateContent({
			contents: [
				{
					role: 'user',
					parts: [
						{ text: prompt },
						{
							inlineData: {
								mimeType: 'image/jpeg',
								data: base64Image,
							},
						},
					],
				},
			],
		});

		return result.response.text();
	} catch (error) {
		console.error(
			'Error describing image with Gemini:',
			error.response?.data || error.message
		);
		return 'Tidak dapat mendeskripsikan gambar dengan detail.';
	}
}

async function getDeepSeekResponse(channelId, messageContent) {
	if (activeRequests.has(channelId)) {
		return 'Masih ada permintaan yang sedang diproses. Silakan tunggu sebentar.';
	}

	activeRequests.add(channelId);

	let botResponse = null;
	const modelFailures = [];

	try {
		const channelHistory = getChannelHistory(channelId);
		const context = [
			{
				role: 'system',
				content: `Saya adalah asisten AI yang dikembangkan oleh DeepSeek, bernama DeepSeek-R1. Tugas saya adalah membantu menjawab pertanyaan, memberikan informasi, dan mendukung berbagai kebutuhan penelitian atau tugas sehari-hari.`,
			},
			...channelHistory.map((entry) => ({
				role: entry.role,
				content: entry.content,
			})),
			{ role: 'user', content: messageContent },
		];

		const models = [
			'deepseek/deepseek-chat:free',
			'deepseek/deepseek-r1:free',
			'deepseek/deepseek-r1-distill-llama-70b:free',
			'deepseek/deepseek-chat:free',
			'deepseek/deepseek-r1:free',
			'deepseek/deepseek-r1-distill-llama-70b:free',
			'deepseek/deepseek-chat:free',
			'deepseek/deepseek-r1:free',
			'deepseek/deepseek-r1-distill-llama-70b:free',
			'deepseek/deepseek-chat:free',
			'deepseek/deepseek-r1:free',
			'deepseek/deepseek-r1-distill-llama-70b:free',
			'deepseek/deepseek-chat:free',
			'deepseek/deepseek-r1:free',
			'deepseek/deepseek-r1-distill-llama-70b:free',
			'google/gemini-2.0-flash-thinking-exp:free',
			'qwen/qwen2.5-vl-72b-instruct:free',
			'cognitivecomputations/dolphin3.0-r1-mistral-24b:free',
			'cognitivecomputations/dolphin3.0-mistral-24b:free',
			'mistralai/mistral-small-24b-instruct-2501:free',
		];

		for (const model of models) {
			try {
				if (apiKeys.length === 0) {
					throw new Error('No API keys available');
				}

				const openai = new OpenAI({
					baseURL: 'https://openrouter.ai/api/v1',
					apiKey: apiKeys[currentApiKeyIndex],
				});
				const completion = await openai.chat.completions.create({
					messages: context,
					model: model,
					stream: false,
					max_tokens: 10000,
					temperature: 0.7,
					top_p: 1,
					frequency_penalty: 0.5,
					presence_penalty: 0.5,
				});

				if (
					model === 'deepseek/deepseek-r1:free' ||
					model === 'deepseek/deepseek-r1-distill-llama-70b:free'
				) {
					const fullResponse = completion.choices[0].message.content;

					const fullResponseJson = JSON.stringify(fullResponse);

					const match = fullResponseJson.match(/.*?\.\\n([^\\n].*)/s);
					botResponse = match ? match[1].trim() : fullResponse;
					const botResponseWords = botResponse.split(/\s+/);
					const firstFourWords = botResponseWords.slice(0, 4).join(' ');
					const startIndex = fullResponse.indexOf(firstFourWords);

					if (startIndex !== -1) {
						botResponse = fullResponse.substring(startIndex).trim();
					}
				} else {
					botResponse = completion.choices[0].message.content;
				}
				if (botResponse) {
					console.log(`Response using ${model.replace(':free', '')}`);
					break;
				}
			} catch (modelError) {
				console.error(
					`Failure with Model ${model.replace(
						':free',
						''
					)}: ${modelError.message.replace(':free', '')}`
				);
				modelFailures.push({
					model,
					error: modelError.message.replace(':free', ''),
				});
				console.log('Error encountered, rolling API key...');
				currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
				console.log(`Switching to API Key index ${currentApiKeyIndex}`);
				continue;
			}
		}

		if (!botResponse) {
			throw new Error('Failure with all models', {
				cause: modelFailures.replace(':free', ''),
			});
		}

		addToHistory(channelId, messageContent, botResponse);

		return botResponse;
	} catch (error) {
		console.error('Error dalam getDeepSeekResponse:', error);

		if (error.cause && modelFailures.length > 0) {
			const failureDetails = modelFailures
				.map(
					(f) =>
						`${f.model.replace(':free', '')}: ${f.error.replace(':free', '')}`
				)
				.join('\n');
			return `Tidak dapat mendapatkan respons. Detail kegagalan model:\n${failureDetails.replace(
				':free',
				''
			)}`;
		}

		return 'Maaf, saat ini tidak dapat memproses permintaan Anda. Silakan coba lagi nanti.';
	} finally {
		activeRequests.delete(channelId);
	}
}

export { describeImage, getDeepSeekResponse };
