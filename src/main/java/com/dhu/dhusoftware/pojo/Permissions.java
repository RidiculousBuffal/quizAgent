package com.dhu.dhusoftware.pojo;


public class Permissions {

  private long permissionId;
  private String permissionScope;
  private String permissionDescription;


  public long getPermissionId() {
    return permissionId;
  }

  public void setPermissionId(long permissionId) {
    this.permissionId = permissionId;
  }


  public String getPermissionScope() {
    return permissionScope;
  }

  public void setPermissionScope(String permissionScope) {
    this.permissionScope = permissionScope;
  }


  public String getPermissionDescription() {
    return permissionDescription;
  }

  public void setPermissionDescription(String permissionDescription) {
    this.permissionDescription = permissionDescription;
  }

}
