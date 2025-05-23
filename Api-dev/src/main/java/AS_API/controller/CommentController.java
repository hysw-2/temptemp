package AS_API.controller;

import AS_API.dto.CommentRequestDto;
import AS_API.dto.CommentResponseDto;
import AS_API.dto.CommentTreeDto;
import AS_API.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponseDto> createComment(@RequestBody CommentRequestDto dto) {
        return ResponseEntity.ok(commentService.createComment(dto));
    }

    @GetMapping("/tree/{postId}")
    public ResponseEntity<List<CommentTreeDto>> getCommentTree(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentTree(postId));
    }
}
