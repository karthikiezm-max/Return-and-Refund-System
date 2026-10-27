package com.rrps.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SupportOverrideRequest {

    private Boolean supportOverride;

    private String reason;
}