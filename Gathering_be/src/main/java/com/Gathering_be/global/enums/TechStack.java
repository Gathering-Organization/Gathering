package com.Gathering_be.global.enums;

public enum TechStack {
    JAVASCRIPT("JavaScript"),
    TYPESCRIPT("TypeScript"),
    REACT("React"),
    VUE("Vue"),
    NEXTJS("Nextjs"),
    NODEJS("Nodejs"),
    JAVA("Java"),
    SPRING("Spring"),
    KOTLIN("Kotlin"),
    NESTJS("Nestjs"),
    SWIFT("Swift"),
    FLUTTER("Flutter"),
    FIGMA("Figma")
    ;

    private final String description;

    TechStack(String description) {
        this.description = description;
    }
}
