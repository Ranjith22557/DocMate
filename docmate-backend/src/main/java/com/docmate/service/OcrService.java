package com.docmate.service;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class OcrService {

    public String extractText(File file) {

        try {

            ITesseract tesseract = new Tesseract();

            String tessDataPath = System.getenv()
                    .getOrDefault("TESSDATA_PATH", "/usr/share/tesseract-ocr/5/tessdata");

            tesseract.setDatapath(tessDataPath);
            tesseract.setLanguage("eng");

            return tesseract.doOCR(file);

        } catch (TesseractException e) {

            throw new RuntimeException(
                    "OCR Processing Failed",
                    e
            );
        }
    }
}