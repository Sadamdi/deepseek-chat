import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readPdfContent } from '../utils/fileProcessor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readGoogleDocs(docId) {
	try {
		const googleDocUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
		const response = await axios.get(googleDocUrl);
		return response.data;
	} catch (error) {
		console.error(`Error fetching Google Docs content for ID ${docId}:`, error);
		return `Tidak dapat mengambil konten dari Google Docs (ID: ${docId}).`;
	}
}

async function readGoogleSlides(slideId) {
	try {
		const googleSlideUrl = `https://docs.google.com/presentation/d/${slideId}/export/pdf`;
		const response = await axios.get(googleSlideUrl, {
			responseType: 'arraybuffer',
		});

		const tempFilePath = path.join(
			__dirname,
			'..',
			`temp_slide_${slideId}.pdf`
		);
		fs.writeFileSync(tempFilePath, response.data);

		const slideContent = await readPdfContent(tempFilePath);

		fs.unlinkSync(tempFilePath);

		return slideContent;
	} catch (error) {
		console.error(
			`Error fetching Google Slides content for ID ${slideId}:`,
			error
		);
		return `Tidak dapat mengambil konten dari Google Slides (ID: ${slideId}).`;
	}
}

async function readGoogleSheets(sheetId) {
	try {
		const googleSheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
		const response = await axios.get(googleSheetUrl);
		return response.data;
	} catch (error) {
		console.error(
			`Error fetching Google Sheets content for ID ${sheetId}:`,
			error
		);
		return `Tidak dapat mengambil konten dari Google Sheets (ID: ${sheetId}).`;
	}
}

export { readGoogleDocs, readGoogleSheets, readGoogleSlides };
