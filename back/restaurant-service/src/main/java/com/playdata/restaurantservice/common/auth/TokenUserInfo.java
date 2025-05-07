package com.playdata.restaurantservice.common.auth;

import com.playdata.restaurantservice.common.auth.Role;
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
