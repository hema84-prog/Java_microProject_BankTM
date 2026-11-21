package com.banktm.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * BANKTM - CARD APPLICATION OBJECT MODEL
 * Demonstrates:
 * 1. Abstraction (abstract CardApplication parent class)
 * 2. Inheritance (DebitCardApplication and CreditCardApplication child classes)
 * 3. Encapsulation (private fields with public getters/setters and status lifecycle)
 * 4. Polymorphism (overridden evaluateEligibility and processApproval methods)
 */
public abstract class CardApplication {
    public enum CardType { DEBIT, CREDIT }
    public enum Network { RUPAY, VISA, MASTERCARD }
    public enum Status { PENDING, APPROVED, REJECTED, DISPATCHED, DELIVERED }

    private final String applicationId;
    private final String customerName;
    private final String accountNumber;
    private final CardType cardType;
    private final Network network;
    private final String reasonForApplying;
    private final LocalDateTime applicationDate;
    private Status status;
    private String deliveryAddress;
    private String remarks;
    private String issuedMaskedNumber;

    public CardApplication(String applicationId,
                           String customerName,
                           String accountNumber,
                           CardType cardType,
                           Network network,
                           String reasonForApplying,
                           String deliveryAddress) {
        this.applicationId = applicationId;
        this.customerName = customerName;
        this.accountNumber = accountNumber;
        this.cardType = cardType;
        this.network = network;
        this.reasonForApplying = reasonForApplying;
        this.applicationDate = LocalDateTime.now();
        this.status = Status.PENDING;
        this.deliveryAddress = deliveryAddress;
        this.remarks = "Application pending initial verification.";
    }

    // Abstract methods enforced on polymorphic subclasses
    public abstract boolean evaluateEligibility();
    public abstract void processApproval(String adminRemarks);

    public void reject(String adminRemarks) {
        this.status = Status.REJECTED;
        this.remarks = adminRemarks;
    }

    // Getters & Setters
    public String getApplicationId() { return applicationId; }
    public String getCustomerName() { return customerName; }
    public String getAccountNumber() { return accountNumber; }
    public CardType getCardType() { return cardType; }
    public Network getNetwork() { return network; }
    public String getReasonForApplying() { return reasonForApplying; }
    public LocalDateTime getApplicationDate() { return applicationDate; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getIssuedMaskedNumber() { return issuedMaskedNumber; }
    protected void setIssuedMaskedNumber(String number) { this.issuedMaskedNumber = number; }
}
