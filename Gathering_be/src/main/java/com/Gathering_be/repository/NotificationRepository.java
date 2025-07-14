package com.Gathering_be.repository;

import com.Gathering_be.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long>{
    List<com.Gathering_be.domain.Notification> findAllByReceiverIdOrderByCreatedAtDesc(Long receiverId);
    long countByReceiverIdAndIsReadFalse(Long receiverId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.receiver.id = :receiverId")
    void markAllAsReadByReceiverId(@Param("receiverId") Long receiverId);
}
