package com.playdata.userservice.user.dto;

import com.playdata.userservice.common.auth.Role;
import com.playdata.userservice.common.entity.Address;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResDto {
    private Long id;
    private String email;
    private String name;
    private Role role;
    private Address address;
}
