package com.docmate.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@Service
@Slf4j
public class DocxService {

    public String extractText(File file) {

        try (
                FileInputStream inputStream =
                        new FileInputStream(file);

                XWPFDocument document =
                        new XWPFDocument(inputStream);

                XWPFWordExtractor extractor =
                        new XWPFWordExtractor(document)
        ) {

            return extractor.getText();

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to read DOCX",
                    e
            );
        }
    }
}