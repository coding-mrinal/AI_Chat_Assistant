import { GoogleGenerativeAI } from "@google/generative-ai";
import { config, AI_CONFIG, AI_PERSONAS } from "../config";

class GeminiService {
  constructor() {
    if (!config.GEMINI_API_KEY)
      throw new Error("Gemini API key is not configured");
    Object.assign(this, {
      genAI: new GoogleGenerativeAI(config.GEMINI_API_KEY),
      model: null,
      chat: null,
      currentPersona: "assistant",
    });
  }

  setPersona = (personaId) => (
    (this.currentPersona = personaId), this.resetChat()
  );
  resetChat = () => (this.chat = null);

  getSystemPrompt = () => AI_PERSONAS[this.currentPersona].systemPrompt;

  ensureModel = async () =>
    (this.model ||= this.genAI.getGenerativeModel({
      model: AI_CONFIG.model,
      generationConfig: {
        temperature: AI_CONFIG.temperature,
        topP: AI_CONFIG.topP,
        topK: AI_CONFIG.topK,
        maxOutputTokens: AI_CONFIG.maxOutputTokens,
      },
    }));

  startChat = async (history = []) => {
    try {
      await this.ensureModel();
      this.chat = this.model.startChat({
        history: history.length
          ? history.map((msg) => ({
              role: msg.role === "user" ? "user" : "model",
              parts: [{ text: msg.content }],
            }))
          : [
              {
                role: "user",
                parts: [
                  {
                    text: `You are now active with the following instructions: ${this.getSystemPrompt()}`,
                  },
                ],
              },
              {
                role: "model",
                parts: [{ text: "Understood! I am ready to assist you." }],
              },
            ],
      });
      return true;
    } catch (error) {
      console.error("Error starting chat:", error);
      return false;
    }
  };

  sendMessage = async (message, files = []) => {
    try {
      if (!this.chat) await this.startChat();
      const result = await this.chat.sendMessage(
        files.length
          ? [
              { text: message },
              ...(await Promise.all(files.map((f) => this.processFile(f)))),
            ]
          : message
      );
      return (await result.response).text();
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Failed to get AI response. Please try again.");
    }
  };

  processFile = async (file) => {
    if (file.type.startsWith("image/") || file.type === "application/pdf") {
      const data = file.type.startsWith("image/")
        ? (await this.fileToBase64(file)).split(",")[1]
        : this.arrayBufferToBase64(await file.arrayBuffer());
      return { inlineData: { data, mimeType: file.type } };
    }
    if (file.type.startsWith("text/"))
      return { text: `File content of "${file.name}":\n${await file.text()}` };
    return {
      text: `User uploaded a ${
        file.name.match(/\.(doc|docx)$/i) ? "document" : ""
      } file named "${file.name}"${
        file.name.match(/\.(doc|docx)$/i) ? "" : ` of type "${file.type}"`
      }.`,
    };
  };

  arrayBufferToBase64 = (buffer) =>
    btoa(String.fromCharCode(...new Uint8Array(buffer)));
  fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  generateContent = async (prompt, errorMessage) => {
    try {
      await this.ensureModel();
      return (await (await this.model.generateContent(prompt)).response).text();
    } catch (error) {
      console.error(`Error: ${errorMessage}`, error);
      throw new Error(errorMessage);
    }
  };
}

export default new GeminiService();
