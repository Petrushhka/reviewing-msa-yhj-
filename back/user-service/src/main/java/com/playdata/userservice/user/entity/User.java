package com.playdata.userservice.user.entity;

import com.playdata.userservice.common.auth.Role;
import com.playdata.userservice.common.entity.Address;
import com.playdata.userservice.user.dto.UserResDto;
import jakarta.persistence.*;
import lombok.*;

@Getter @ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="tbl_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20, nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    @Embedded  // @Embeddable로 선언된 값 대입 (기본 생성자 필수)
    private Address address;

    @Enumerated(EnumType.STRING)
    @Builder.Default // builder 패턴 사용해서 객체 초기화 시 초기값으로 세팅
    private Role role =  Role.USER;

    // DTO에 Entity 변환 메서드가 있는 거처럼
    // Entity에도 응답용 DTO 변환 메서드를 세팅해서 언제든 변환이 자유롭도록 작성.
    public UserResDto toDto() {
        return UserResDto.builder()
                .id(id)
                .name(name)
                .email(email)
                .role(role)
                .address(address)
                .build();
    }
}
