
import { GoogleGenAI } from "@google/genai";
import { Stock } from '../types';

const analyzeStock = async (stock: Stock): Promise<string> => {
    // This is a placeholder for a real API key, which should be handled securely
    if (!process.env.API_KEY) {
        console.warn("API_KEY environment variable not set. Using mock data.");
        return new Promise(resolve => setTimeout(() => resolve(
            `<strong>Bullish Thesis for ${stock.name}:</strong><br/>The company has shown strong quarterly growth and is a leader in its sector. Recent product launches could drive future revenue.<br/><br/><strong>Bearish Thesis for ${stock.name}:</strong><br/>Increased competition and regulatory headwinds pose potential risks. The stock's current valuation appears stretched compared to industry peers.`
        ), 1500));
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = `Provide a brief, bullish and bearish investment thesis for the stock: ${stock.name} (${stock.symbol}).
        Its current price is ${stock.price.toFixed(2)}.
        - Format the response with clear "Bullish Thesis" and "Bearish Thesis" headings.
        - Use bold headings.
        - Keep the analysis concise and for educational/demonstration purposes only.
        - Do not give financial advice.
        - Start the response directly with the bullish thesis.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get analysis from Gemini API.");
    }
};

export { analyzeStock };
