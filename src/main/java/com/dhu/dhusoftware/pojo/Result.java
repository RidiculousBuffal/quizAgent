package com.dhu.dhusoftware.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.dhu.dhusoftware.constant.COMMON;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Result {
    Integer code;
    String msg;
    Object data;

    public static Result success(String msg, Object data) {
        return new Result(COMMON.SUCCESS_CODE, msg, data);
    }

    public static Result error(String msg, Object data) {
        return new Result(COMMON.FAILURE_CODE, msg, data);
    }

}
