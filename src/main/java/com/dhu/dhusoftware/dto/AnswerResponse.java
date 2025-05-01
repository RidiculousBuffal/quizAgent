package com.dhu.dhusoftware.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerResponse {
    private String username;
    private String details;

    public Map<String, Object> getMap() {
        Map<String, Object> m = new HashMap<>();
        m.put("user", username);
        m.put("answer", details);
        return m;
    }
}
