package com.playdata.userservice.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class UserBlackReqDto {
    String userEmail;
    Boolean isBlack;
}
