package com.dhu.dhusoftware.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.ArrayList;
import java.util.List;

public class JsonRecordProcessor {

    private static final ObjectMapper mapper = new ObjectMapper();

    /**
     * 为 FillBlank 或其他类似 Record 添加 validators 字段
     */
    public static <T> String addValidatorsAndConvertToJson(T record, int blankCount) throws Exception {
        ObjectNode jsonNode = mapper.valueToTree(record);
        ArrayNode validatorsNode = mapper.createArrayNode();
        for (int i = 0; i < blankCount; i++) {
            validatorsNode.add(mapper.createArrayNode());
        }
        jsonNode.set("validators", validatorsNode);
        return mapper.writeValueAsString(jsonNode);
    }

    /**
     * 为 JSON 增加 type 字段和 id 字段
     */
    public static String enhanceJsonWithTypeAndId(String jsonDetails, long questionId, ObjectNode typeNode) throws Exception {
        ObjectNode jsonNode = (ObjectNode) mapper.readTree(jsonDetails);
        jsonNode.put("id", questionId);
        jsonNode.set("type", typeNode);
        return mapper.writeValueAsString(jsonNode);
    }

    /**
     * 为 JSON 增加 sort 字段
     */
    public static String addSortToJson(String jsonDetails, long sort) throws Exception {
        ObjectNode jsonNode = (ObjectNode) mapper.readTree(jsonDetails);
        jsonNode.put("sort", sort);
        return mapper.writeValueAsString(jsonNode);
    }
}