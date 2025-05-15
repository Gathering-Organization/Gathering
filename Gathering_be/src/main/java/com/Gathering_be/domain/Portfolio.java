package com.Gathering_be.domain;

import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Portfolio {
    private String url;
    private String fileName;

    @Builder
    public Portfolio(String url, String fileName) {
        this.url = url;
        this.fileName = fileName;
    }
}