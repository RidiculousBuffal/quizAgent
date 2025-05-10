package com.dhu.dhusoftware.json;


import org.junit.jupiter.api.Test;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.boot.test.context.SpringBootTest;
import com.dhu.dhusoftware.ai.jsonSchema.FillBlankQuestion;

@SpringBootTest
public class OpenAIJsonTest {


    @Test
    public void TestFillBlank() {
        var outputConverter = new BeanOutputConverter<>(FillBlankQuestion.class);
        var jsonSchema = outputConverter.getJsonSchema();
        System.out.println(jsonSchema);
    }
}
