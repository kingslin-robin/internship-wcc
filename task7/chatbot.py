import requests

# 🔑 Your OpenRouter API key
API_KEY = "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"

# 🌐 OpenRouter API endpoint
API_URL = "https://openrouter.ai/api/v1/chat/completions"

# 💬 Default model (you can change this to any available model on OpenRouter)
MODEL = "openai/gpt-3.5-turbo"

def chat_with_openrouter():
    print("🤖 OpenRouter Chatbot (type 'exit' to quit)\n")

    # Store conversation history
    conversation = []

    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            print("👋 Goodbye!")
            break

        # Add user message to conversation history
        conversation.append({"role": "user", "content": user_input})

        # Send request to OpenRouter
        response = requests.post(
            API_URL,
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": MODEL,
                "messages": conversation
            },
        )

        if response.status_code == 200:
            data = response.json()
            reply = data["choices"][0]["message"]["content"]
            print(f"Bot: {reply}\n")

            # Save bot response to conversation history
            conversation.append({"role": "assistant", "content": reply})
        else:
            print("❌ Error:", response.status_code, response.text)
            break


if __name__ == "__main__":
    chat_with_openrouter()
