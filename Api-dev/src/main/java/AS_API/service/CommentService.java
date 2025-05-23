package AS_API.service;

import AS_API.dto.CommentRequestDto;
import AS_API.dto.CommentResponseDto;
import AS_API.dto.CommentTreeDto;
import AS_API.entity.Comment;
import AS_API.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;

    public CommentResponseDto createComment(CommentRequestDto dto) {
        Comment comment = Comment.builder()
                .postId(dto.getPostId())
                .parentCommentId(dto.getParentCommentId())
                .userId2(dto.getUserId2())
                .commentContent(dto.getCommentContent())
                .createdAt(LocalDateTime.now())
                .build();

        Comment saved = commentRepository.save(comment);
        return toDto(saved);
    }

    public List<CommentTreeDto> getCommentTree(Long postId) {
        List<Comment> all = commentRepository.findByPostId(postId);
        Map<Long, CommentTreeDto> map = new HashMap<>();
        List<CommentTreeDto> roots = new ArrayList<>();

        for (Comment c : all) {
            CommentTreeDto dto = new CommentTreeDto(c);
            map.put(c.getCommentId(), dto);
        }

        for (Comment c : all) {
            if (c.getParentCommentId() == null) {
                roots.add(map.get(c.getCommentId()));
            } else {
                CommentTreeDto parent = map.get(c.getParentCommentId());
                if (parent != null) {
                    parent.getChildren().add(map.get(c.getCommentId()));
                }
            }
        }

        return roots;
    }

    private CommentResponseDto toDto(Comment c) {
        return CommentResponseDto.builder()
                .commentId(c.getCommentId())
                .postId(c.getPostId())
                .parentCommentId(c.getParentCommentId())
                .userId2(c.getUserId2())
                .commentContent(c.getCommentContent())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
