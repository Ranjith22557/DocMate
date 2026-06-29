package com.docmate.repository;

import com.docmate.entity.Document;
import com.docmate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface DocumentRepository
        extends JpaRepository<Document, UUID> {

    List<Document> findByUserEmail(String email);

    List<Document> findByUser(User user);

    @Query("""
    select d
    from Document d
    join fetch d.user
    """)
    List<Document> findAllWithUser();

    List<Document> findTop5ByUserEmailOrderByCreatedAtDesc(String email);
}