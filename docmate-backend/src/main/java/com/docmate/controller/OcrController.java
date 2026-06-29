package com.docmate.controller;

import com.docmate.dto.DocumentAnalysisResult;
import com.docmate.service.DocumentAnalyzerService;
import com.docmate.service.OcrService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;

@RestController
@RequestMapping("/api/ocr")
@RequiredArgsConstructor
public class OcrController {

    private final OcrService ocrService;
    private final DocumentAnalyzerService documentAnalyzerService;

    @GetMapping("/test")
    public ResponseEntity<String> testOcr() {

        File file = new File("uploads/RanjithAnnadurai.pdf");

        String ocrText = ocrService.extractText(file);

        return ResponseEntity.ok(ocrText);
    }
}