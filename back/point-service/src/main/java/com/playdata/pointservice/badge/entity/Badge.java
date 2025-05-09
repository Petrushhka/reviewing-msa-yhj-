package com.playdata.pointservice.badge.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter @ToString
@NoArgsConstructor
@Entity
@Table(name = "tbl_badge")
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(nullable = true, length = 255)
    private String description;

    @Column(nullable = false, length = 255)
    private String icon_url;

    @Enumerated(EnumType.STRING)
    private BadgeLevel level;

    @Column(nullable = false)
    private int threshold; // 이 배지를 받기 위한 최소 포인트 기준






}
