package com.docmate.service;

import com.docmate.dto.DocumentAnalysisResult;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DocumentAnalyzerService {

    public DocumentAnalysisResult analyze(String ocrText) {

        String text = ocrText.toLowerCase().trim();

        String documentType = "OTHER";
        Integer confidence = 50;

        if (text.contains("passport")) {

            documentType = "PASSPORT";
            confidence = 95;

        } else if (text.contains("driving")
                || text.contains("driving licence")
                || text.contains("driving license")) {

            documentType = "DRIVING_LICENSE";
            confidence = 90;

        } else if (text.contains("iqama")) {

            documentType = "IQAMA";
            confidence = 90;

        } else if (text.contains("insurance")
                || text.contains("policy")) {

            documentType = "INSURANCE";
            confidence = 85;

        } else if (text.contains("experience")
                || text.contains("skills")
                || text.contains("education")) {

            documentType = "RESUME";
            confidence = 95;

        } else if (text.contains("certificate")
                || text.contains("university")) {

            documentType = "CERTIFICATE";
            confidence = 80;
        }
        LocalDate expiryDate = extractExpiryDate(ocrText);

        boolean renewalRequired = expiryDate != null;
        return new DocumentAnalysisResult(
                documentType,
                null,
                expiryDate,
                renewalRequired,
                confidence
        );
    }

    private LocalDate extractExpiryDate(String text) {
        try {
            // Format: 10/01/2035 or 10-01-2035
            Pattern numericPattern = Pattern.compile("(\\d{2})[-/](\\d{2})[-/](\\d{4})");

            Matcher numericMatcher = numericPattern.matcher(text);
            if (numericMatcher.find()) {

                return LocalDate.of(
                        Integer.parseInt(numericMatcher.group(3)),
                        Integer.parseInt(numericMatcher.group(2)),
                        Integer.parseInt(numericMatcher.group(1))
                );
            }
            // Format: 10 JAN 2035
            Pattern textPattern =
                    Pattern.compile("(\\d{1,2})\\s+(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\\s+(\\d{4})",
                            Pattern.CASE_INSENSITIVE);

            Matcher textMatcher = textPattern.matcher(text);

            if (textMatcher.find()) {

                Map<String, Month> months = new HashMap<>();
                months.put("JAN", Month.JANUARY);
                months.put("FEB", Month.FEBRUARY);
                months.put("MAR", Month.MARCH);
                months.put("APR", Month.APRIL);
                months.put("MAY", Month.MAY);
                months.put("JUN", Month.JUNE);
                months.put("JUL", Month.JULY);
                months.put("AUG", Month.AUGUST);
                months.put("SEP", Month.SEPTEMBER);
                months.put("OCT", Month.OCTOBER);
                months.put("NOV", Month.NOVEMBER);
                months.put("DEC", Month.DECEMBER);
                return LocalDate.of(
                        Integer.parseInt(textMatcher.group(3)),
                        months.get(
                                textMatcher.group(2).toUpperCase()
                        ),
                        Integer.parseInt(textMatcher.group(1))
                );
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}