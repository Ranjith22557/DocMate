package com.docmate.controller;

import com.docmate.dto.DocumentAnalysisResult;
import com.docmate.service.DocumentAnalyzerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analyzer")
@RequiredArgsConstructor
public class AnalysisController {

    private final DocumentAnalyzerService documentAnalyzerService;

    @PostMapping
    public ResponseEntity<DocumentAnalysisResult>
    analyze(@RequestBody String ocrText) {

        return ResponseEntity.ok(documentAnalyzerService
                        .analyze(ocrText)
        );
    }
}