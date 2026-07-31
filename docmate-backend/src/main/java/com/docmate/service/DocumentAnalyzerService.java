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

        String documentType = "UNKNOWN";
        Integer confidence = 50;

        if (text.contains("passport")) {

            documentType = "PASSPORT";
            confidence = 95;

        } else if (text.contains("driving")
                || text.contains("driving licence")
                || text.contains("driving license")
                || text.contains("dl no")
                || text.contains("lmv")
                || text.contains("mcwg")) {

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

        } else if (text.contains("university")) {

            documentType = "CERTIFICATE";
            confidence = 80;
        } else if (text.contains("birth")) {

            documentType = "BIRTH_CERTIFICATE";
            confidence = 80;
        } else if (text.contains("aadhaar") || text.contains("uidai")) {

            documentType = "AADHAAR_CARD";
            confidence = 80;
        } else if (text.contains("fire") || text.contains("safety")) {

            documentType = "FIRE_SAFETY_CERTIFICATE";
            confidence = 70;
        } else if (text.contains("food") || text.contains("food safety") || text.contains("fssai")) {

            documentType = "FOOD_SAFETY";
            confidence = 80;
        } else if (text.contains("income") || text.contains("tax") || text.contains("income tax")) {

            documentType = "PAN_CARD";
            confidence = 80;
        } else if (text.contains("election") || text.contains("election commission")) {

            documentType = "VOTER_ID";
            confidence = 80;
        } else if (text.contains("pollution")) {

            documentType = "POLLUTION_CERTIFICATE";
            confidence = 60;
        } else if (text.contains("vehicle") || text.contains("vehicle registration")) {

            documentType = "VEHICLE_REGISTRATION";
            confidence = 80;
        }

        LocalDate expiryDate;
        boolean renewalRequired;

        if (supportsExpiry(documentType)) {
            expiryDate = extractExpiryDate(text);
            renewalRequired = expiryDate != null;
        } else {
            expiryDate = null;
            renewalRequired = false;
        }

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
            Pattern expiryPattern = Pattern.compile(
                    "(expiry|expiry date|valid until|valid upto|valid till|expires on|date of expiry|expiration date)\\\\s*:?\\\\s*(\\\\d{2}[-/]\\\\d{2}[-/]\\\\d{4})",
                    Pattern.CASE_INSENSITIVE
            );
            Matcher matcher = expiryPattern.matcher(text);

            if (matcher.find()) {
                String date = matcher.group(2);
                String[] parts = date.split("[-/]");

                return LocalDate.of(
                        Integer.parseInt(parts[2]),
                        Integer.parseInt(parts[1]),
                        Integer.parseInt(parts[0])
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

    private boolean supportsExpiry(String documentType) {

        return switch (documentType.toUpperCase()) {

            case "PASSPORT",
                 "VISA",
                 "DRIVING_LICENSE",
                 "INSURANCE" -> true;

            default -> false;
        };
    }
}