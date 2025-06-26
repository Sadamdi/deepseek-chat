import axios from 'axios';
import fs from 'fs';
import msoffice2pdf from 'msoffice2pdf';
import { getTextExtractor } from 'office-text-extractor';
import path from 'path';
import pdf from 'pdf-parse';
import { fileURLToPath } from 'url';
import WordExtractor from 'word-extractor';
import xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function downloadFile(url, outputPath) {
	const downloadFolder = path.join(__dirname, '..', 'download');

	if (!fs.existsSync(downloadFolder)) {
		fs.mkdirSync(downloadFolder);
	}

	const filePath = path.join(downloadFolder, path.basename(outputPath));

	const response = await axios.get(url, { responseType: 'stream' });
	const writer = fs.createWriteStream(filePath);
	return new Promise((resolve, reject) => {
		response.data.pipe(writer);
		writer.on('finish', resolve);
		writer.on('error', reject);
	});
}

async function readTxtContent(filePath) {
	try {
		const stats = fs.statSync(filePath);
		if (stats.size === 0) {
			console.log('File teks kosong.');
			return 'File teks kosong.';
		}

		console.log(`Reading file: ${filePath}`);
		const content = fs.readFileSync(filePath, 'utf-8');
		fs.unlinkSync(filePath);
		return content;
	} catch (error) {
		console.error('Error reading text file:', error);
		return 'Gagal membaca file teks.';
	}
}

async function readPdfContent(filePath) {
	const dataBuffer = fs.readFileSync(filePath);
	const data = await pdf(dataBuffer);
	return data.text;
}

async function readWordContent(filePath) {
	const fileExt = path.extname(filePath);

	if (fileExt === '.docx') {
		const extractor = getTextExtractor();
		const content = await extractor.extractText({
			input: filePath,
			type: 'file',
		});
		fs.unlinkSync(filePath);
		return content;
	} else if (fileExt === '.doc') {
		const extractor = new WordExtractor();
		const extracted = await extractor.extract(filePath);
		fs.unlinkSync(filePath);
		return extracted.getBody();
	} else {
		throw new Error('Unsupported file type');
	}
}

async function readExcelContent(filePath) {
	const workbook = xlsx.readFile(filePath);
	const sheetName = workbook.SheetNames[0];
	const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
	fs.unlinkSync(filePath);
	return JSON.stringify(jsonData);
}

async function readPptContent(filePath) {
	try {
		const pdfFilePath = path.join(__dirname, '..', `temp_${Date.now()}.pdf`);
		await msoffice2pdf(filePath, pdfFilePath);

		const pdfContent = await readPdfContent(pdfFilePath);

		fs.unlinkSync(filePath);
		fs.unlinkSync(pdfFilePath);

		return pdfContent;
	} catch (error) {
		console.error('Error reading PPT content:', error);
		return 'Tidak dapat membaca konten PPT. Silakan coba format lain.';
	}
}

async function downloadAndReadFile(url, fileType) {
	let response = await fetch(url);
	if (!response.ok)
		throw new Error(`Failed to download ${response.statusText}`);

	let fileContent = await response.text();
	return fileContent;
}

async function extractFileText(message, messageContent) {
	if (message.attachments.size > 0) {
		let attachments = Array.from(message.attachments.values());
		for (const attachment of attachments) {
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
				try {
					let fileContent = await downloadAndReadFile(attachment.url, fileType);
					messageContent += `\n\n[\`${attachment.name}\` File Content]:\n\
\
${fileContent}\n\
\
`;
				} catch (error) {
					console.error(
						`Error reading file ${attachment.name}: ${error.message}`
					);
				}
			}
		}
	}
	return messageContent;
}

export {
	downloadAndReadFile,
	downloadFile,
	extractFileText,
	readExcelContent,
	readPdfContent,
	readPptContent,
	readTxtContent,
	readWordContent,
};
