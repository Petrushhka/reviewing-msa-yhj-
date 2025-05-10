package com.playdata.reviewservice.review.entity;

import com.playdata.reviewservice.review.dto.ReviewResponseDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "tbl_review")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;
    private String rating;
    private Long userId;
    private Long restaurantId;
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ReviewImage> images = new ArrayList<>();

    public void addImage(ReviewImage image) {
        this.images.add(image);
        image.setReview(this);
        System.out.println("addImage 호출! 이미지 수: "+images.size());
    }

    public ReviewResponseDto toResponseDto() {
        return ReviewResponseDto.builder()
                .id(id)
                .userId(userId)
                .content(content)
                .rating(rating)
                .images(images.stream().map(ReviewImage::getUrl).toList())
                .build();
    }

}
