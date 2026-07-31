package com.docmate.service;

import com.docmate.enums.FileType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileTypeService {

    public FileType detect(MultipartFile file) {

        String type = file.getContentType();

        if (type == null)
            return FileType.UNSUPPORTED;

        switch (type) {

            case "application/pdf":
                return FileType.PDF;

            case "image/jpeg":
            case "image/jpg":
            case "image/png":
            case "image/webp":
            case "image/bmp":
            case "image/tiff":
                return FileType.IMAGE;

            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return FileType.DOCX;

            case "text/plain":
                return FileType.TXT;

            default:
                return FileType.UNSUPPORTED;
        }
    }
}
