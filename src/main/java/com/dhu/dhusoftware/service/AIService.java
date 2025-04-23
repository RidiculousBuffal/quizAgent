package com.dhu.dhusoftware.service;

import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class AIService {


    private final OpenAiApi openAiApi;

    @Autowired
    public AIService(OpenAiApi openAiApi) {
        this.openAiApi = openAiApi;
    }

    public Flux<ChatResponse> getResponse(String Model, String question) {
        var openaiChatOptions = OpenAiChatOptions.builder().model(Model).build();
        var chatModel = OpenAiChatModel.builder().openAiApi(this.openAiApi).defaultOptions(openaiChatOptions).build();
        Prompt prompt = new Prompt(new UserMessage(question));
        return chatModel.stream(prompt);
    }

}
