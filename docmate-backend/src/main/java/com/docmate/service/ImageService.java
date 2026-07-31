package com.docmate.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

@Service
@Slf4j
public class ImageService {

    public File convertWebpToPng(File webpFile) {

        try {

            BufferedImage image = ImageIO.read(webpFile);

            if (image == null) {
                throw new RuntimeException("Unable to read image.");
            }

            File pngFile = new File(
                    webpFile.getParent(),
                    webpFile.getName().replaceFirst("\\.[^.]+$", ".png")
            );

            ImageIO.write(image, "png", pngFile);

            return pngFile;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to convert WEBP image",
                    e
            );
        }
    }
}