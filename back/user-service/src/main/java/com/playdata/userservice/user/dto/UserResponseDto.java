package com.playdata.userservice.user.dto;

import com.playdata.userservice.common.auth.Role;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {
    private Long id;
    private String email;
    private String nickName;
    private String profileImage;
    private int point;

}
