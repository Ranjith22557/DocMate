package com.docmate.service;

import com.docmate.enums.FileType;
import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@Service
@RequiredArgsConstructor
public class TextExtractionService {

    private final OcrService ocrService;
    private final PdfService pdfService;
    private final DocxService docxService;
    private final FileTypeService fileTypeService;
    private final ImageService imageService;

    public String extract(MultipartFile multipartFile,
                          File storedFile) throws IOException {

        FileType type = fileTypeService.detect(multipartFile);

        return switch (type) {

            case PDF -> pdfService.extractText(storedFile);

            case IMAGE -> {
                File imageFile = storedFile;
                Tika tika = new Tika();
                String mime = tika.detect(storedFile);
                //String contentType = multipartFile.getContentType();
                if ("image/webp".equals(mime)) {
                    imageFile =
                            imageService.convertWebpToPng(storedFile);
                }
                yield ocrService.extractText(imageFile);
            }
            case DOCX -> docxService.extractText(storedFile);

            case TXT -> Files.readString(storedFile.toPath());

            default ->
                    throw new RuntimeException("Unsupported file");
        };
    }
}
