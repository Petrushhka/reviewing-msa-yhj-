package com.playdata.userservice.common.auth;

import lombok.*;

@Getter @Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenUserInfo {

    private String email;
    private Role role;
}
