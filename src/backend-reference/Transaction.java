package com.banktm.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * BANKTM - CREDIT AND DEBIT TRANSACTION AUDIT RECORD
 * Encapsulates full electronic transaction metadata for double-entry bookkeeping.
 * Demonstrates Encapsulation with private final variables and public accessor methods.
 */
public class Transaction {
    public enum Type { CREDIT, DEBIT }
    public enum Status { SUCCESSFUL, FAILED, PENDING }

    private final String transactionId;
    private final String senderName;
    private final String senderAccountNumber;
    private final String receiverName;
    private final String receiverAccountNumber;
    private final String sourceOfMoney;
    private final String destinationOfMoney;
    private final double amount;
    private final LocalDateTime timestamp;
    private final Type type;
    private final String description;
    private final Status status;
    private final String channel; // Cash Deposit, ATM, Internal Transfer, NEFT, RTGS, IMPS
    private final String referenceNumber;

    public Transaction(String transactionId, 
                       String senderName, 
                       String senderAccountNumber, 
                       String receiverName, 
                       String receiverAccountNumber,
                       String sourceOfMoney,
                       String destinationOfMoney,
                       double amount, 
                       Type type, 
                       String description, 
                       String channel,
                       Status status) {
        this.transactionId = transactionId;
        this.senderName = senderName;
        this.senderAccountNumber = senderAccountNumber;
        this.receiverName = receiverName;
        this.receiverAccountNumber = receiverAccountNumber;
        this.sourceOfMoney = sourceOfMoney;
        this.destinationOfMoney = destinationOfMoney;
        this.amount = amount;
        this.timestamp = LocalDateTime.now();
        this.type = type;
        this.description = description;
        this.channel = channel;
        this.status = status;
        this.referenceNumber = "REF" + System.currentTimeMillis();
    }

    public void printTransactionReceipt() {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm:ss");
        System.out.println("--------------------------------------------------");
        System.out.println("             BANKTM OFFICIAL ADVICE RECEIPT       ");
        System.out.println("--------------------------------------------------");
        System.out.println("Transaction ID   : " + transactionId);
        System.out.println("Reference No     : " + referenceNumber);
        System.out.println("Timestamp        : " + timestamp.format(dtf));
        System.out.println("Channel / Rails  : " + channel);
        System.out.println("Transaction Type : " + type);
        System.out.printf("Amount Transferred: ₹%,.2f%n", amount);
        System.out.println("Sender           : " + senderName + " (" + senderAccountNumber + ")");
        System.out.println("Beneficiary      : " + receiverName + " (" + receiverAccountNumber + ")");
        System.out.println("Source of Money  : " + sourceOfMoney);
        System.out.println("Destination Money: " + destinationOfMoney);
        System.out.println("Narration        : " + description);
        System.out.println("Settlement Status: " + status);
        System.out.println("--------------------------------------------------");
    }

    // Encapsulated Getters
    public String getTransactionId() { return transactionId; }
    public String getSenderName() { return senderName; }
    public String getSenderAccountNumber() { return senderAccountNumber; }
    public String getReceiverName() { return receiverName; }
    public String getReceiverAccountNumber() { return receiverAccountNumber; }
    public String getSourceOfMoney() { return sourceOfMoney; }
    public String getDestinationOfMoney() { return destinationOfMoney; }
    public double getAmount() { return amount; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public Type getType() { return type; }
    public String getDescription() { return description; }
    public Status getStatus() { return status; }
    public String getChannel() { return channel; }
    public String getReferenceNumber() { return referenceNumber; }
}
