package com.playdata.pointservice.badge.config;

import com.playdata.pointservice.badge.entity.Badge;
import com.playdata.pointservice.badge.entity.BadgeLevel;
import com.playdata.pointservice.badge.repository.BadgeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 서버 시작 시 배지 테이블(tbl_badge)에 초기 데이터를 자동 삽입합니다.
 */

@Slf4j
@Component
@RequiredArgsConstructor
public class BadgeDataInitializer implements CommandLineRunner {

    private final BadgeRepository badgeRepository;

    @Override
    public void run(String... args) {
        // 전체 배지가 하나도 없는 경우에만 기본 배지 초기화 (입문자 ~ 마스터)
        if (badgeRepository.count() == 0) {
            log.info("[BadgeDataInitializer] 배지 데이터가 없으므로 기본 배지를 초기화합니다.");

            List<Badge> badges = List.of(
                    Badge.builder()
                            .name("입문자")
                            .description("처음 시작한 사용자")
                            .icon_url("/icons/beginner.png")
                            .level(BadgeLevel.BEGINNER)
                            .threshold(0)
                            .build(),

                    Badge.builder()
                            .name("중수")
                            .description("리뷰 중수입니다!")
                            .icon_url("/icons/intermediate.png")
                            .level(BadgeLevel.INTERMEDIATE)
                            .threshold(100)
                            .build(),

                    Badge.builder()
                            .name("고수")
                            .description("리뷰 고수입니다!")
                            .icon_url("/icons/advanced.png")
                            .level(BadgeLevel.ADVANCED)
                            .threshold(200)
                            .build(),

                    Badge.builder()
                            .name("마스터")
                            .description("맛집 마스터입니다!")
                            .icon_url("/icons/master.png")
                            .level(BadgeLevel.MASTER)
                            .threshold(300)
                            .build()
            );

            badgeRepository.saveAll(badges);
            log.info("[BadgeDataInitializer] 기본 배지 초기화 완료 (총 {}개)", badges.size());
        } else {
            log.info("[BadgeDataInitializer] 배지 데이터가 이미 존재하여 기본 배지 초기화를 생략합니다.");
        }

        // 운영자 배지는 별도로 존재 여부를 확인 후 삽입
        badgeRepository.findByName("운영자").ifPresentOrElse(
                badge -> log.info("운영자 배지가 이미 존재합니다. ID: {}", badge.getId()),
                () -> {
                    Badge adminBadge = Badge.builder()
                            .name("운영자")
                            .description("운영자입니다!")
                            .icon_url("/icons/admin.png")
                            .level(BadgeLevel.ADMIN)
                            .threshold(9999)
                            .build();

                    badgeRepository.save(adminBadge);
                    log.info("운영자 배지를 새로 추가했습니다.");
                }
        );
    }
}
