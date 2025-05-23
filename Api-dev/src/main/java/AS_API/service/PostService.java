package AS_API.service;

import AS_API.dto.PostRequestDto;
import AS_API.dto.PostResponseDto;
import AS_API.entity.Post;
import AS_API.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;

    public PostResponseDto createPost(PostRequestDto dto) {
        System.out.println("createPost() called with title: " + dto.getPostTitle());

        if (dto.getParentPostId() != null) {
            int depth = getPostDepth(dto.getParentPostId(), 1);
            if (depth >= 3) {
                throw new RuntimeException("3단계 이상 스레드는 허용되지 않습니다.");
            }
        }

        Post post = Post.builder()
                .parentPostId(dto.getParentPostId())
                .userId(dto.getUserId())
                .postTitle(dto.getPostTitle())
                .content(dto.getContent())
                .postCount(0)
                .postDate(LocalDateTime.now())
                .build();

        Post saved = postRepository.save(post);
        System.out.println("Post saved with ID: " + saved.getPostId());

        return toDto(saved);
    }

    public PostResponseDto getPost(Long id) {
        System.out.println("getPost() called with ID: " + id);

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));

        post.increaseViewCount();

        return toDto(post);
    }

    private PostResponseDto toDto(Post p) {
        return PostResponseDto.builder()
                .postId(p.getPostId())
                .parentPostId(p.getParentPostId())
                .userId(p.getUserId())
                .postTitle(p.getPostTitle())
                .content(p.getContent())
                .postCount(p.getPostCount())
                .postDate(p.getPostDate())
                .build();
    }

    private int getPostDepth(Long parentId, int depth) {
        Post parent = postRepository.findById(parentId).orElseThrow();
        return parent.getParentPostId() == null ? depth : getPostDepth(parent.getParentPostId(), depth + 1);
    }
}
