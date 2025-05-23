package AS_API.service;

import AS_API.dto.ReportRequestDto;
import AS_API.entity.Report;
import AS_API.entity.User;
import AS_API.exception.CustomException;
import AS_API.repository.ReportRepository;
import AS_API.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static AS_API.exception.ErrorCode.REPORT_NOT_FOUND;
import static AS_API.exception.ErrorCode.USER_NOT_FOUND;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    // 신고 생성
    public Report createReport(ReportRequestDto dto) {
        User reporter = userRepository.findById(dto.getReporterId())
                .orElseThrow(() -> new CustomException(USER_NOT_FOUND));

        User target = userRepository.findById(dto.getTargetId())
                .orElseThrow(() -> new CustomException(USER_NOT_FOUND));

        Report report = Report.builder()
                .reporter(reporter)
                .target(target)
                .targetType(dto.getTargetType())
                .reason(dto.getReason())
                .createdAt(LocalDateTime.now())
                .build();

        return reportRepository.save(report);
    }

    // 특정 사용자가 신고한 목록
    public List<Report> getReportsByUser(Long userId) {
        User reporter = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(USER_NOT_FOUND));

        return reportRepository.findByReporter(reporter);
    }

    // 특정 신고 ID로 신고 상세 조회
    public Report getReportById(Long reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new CustomException(REPORT_NOT_FOUND));
    }
}
