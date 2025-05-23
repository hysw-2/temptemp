package AS_API.controller;

import AS_API.dto.ReportRequestDto;
import AS_API.entity.Report;
import AS_API.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/create")
    public ResponseEntity<String> createReport(@RequestBody ReportRequestDto reportRequestDto) {
        Report report = reportService.createReport(reportRequestDto);
        return ResponseEntity.ok("신고가 생성되었습니다. 신고 ID: " + report.getId());
    }
}
