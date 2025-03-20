package com.dhu.dhusoftware.pojo;

public class User {
    private String userId;
    private String userName;
    private String userEmail;
    private String userAvatar;

    public User(String userId, String userName, String userEmail, String userAvatar) {
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userAvatar = userAvatar;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserAvatar() {
        return userAvatar;
    }

    public void setUserAvatar(String userAvatar) {
        this.userAvatar = userAvatar;
    }
}
