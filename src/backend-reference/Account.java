package com.banktm.model;

import java.time.LocalDateTime;

/**
 * BANKTM - CORE BANKING SYSTEM
 * Abstract Base Class demonstrating ABSTRACTION and ENCAPSULATION.
 * Parent class for SavingsAccount and CurrentAccount (INHERITANCE).
 */
public abstract class Account {
    // Encapsulated private attributes
    private String accountNumber;
    private String accountHolderName;
    private double balance;
    private String accountStatus; // ACTIVE, DORMANT, SUSPENDED
    private LocalDateTime dateOfCreation;
    private String branch;
    private String ifscCode;

    // Constructor
    public Account(String accountNumber, String accountHolderName, double initialDeposit, String branch, String ifscCode) {
        if (initialDeposit < 0) {
            throw new IllegalArgumentException("Initial deposit cannot be negative");
        }
        this.accountNumber = accountNumber;
        this.accountHolderName = accountHolderName;
        this.balance = initialDeposit;
        this.accountStatus = "ACTIVE";
        this.dateOfCreation = LocalDateTime.now();
        this.branch = branch;
        this.ifscCode = ifscCode;
    }

    // Common concrete methods
    public synchronized boolean deposit(double amount) {
        return deposit(amount, "Cash Deposit / Clearing");
    }

    // Overloaded method (Compile-time Polymorphism)
    public synchronized boolean deposit(double amount, String channel) {
        if (amount <= 0) {
            System.err.println("[BankTM Error] Deposit amount must be strictly positive: " + amount);
            return false;
        }
        this.balance += amount;
        System.out.printf("[BankTM Ledger] Deposited ₹%.2f via %s into %s. New Balance: ₹%.2f%n",
                amount, channel, accountNumber, this.balance);
        return true;
    }

    public double checkBalance() {
        return this.balance;
    }

    // Abstract methods to be implemented by child classes (Runtime Polymorphism & Abstraction)
    public abstract boolean withdraw(double amount, String purpose);
    public abstract double calculateCharges();
    public abstract String getAccountType();

    // Display Account Details
    public void displayAccountDetails() {
        System.out.println("============================================");
        System.out.println("            BANKTM ACCOUNT DETAILS          ");
        System.out.println("============================================");
        System.out.println("Account Number    : " + accountNumber);
        System.out.println("Account Holder    : " + accountHolderName);
        System.out.println("Account Type      : " + getAccountType());
        System.out.printf("Current Balance   : ₹%.2f%n", balance);
        System.out.println("Status            : " + accountStatus);
        System.out.println("Branch & IFSC     : " + branch + " (" + ifscCode + ")");
        System.out.println("Created On        : " + dateOfCreation);
    }

    // Protected helper for child classes to adjust balance safely
    protected void setBalanceInternal(double newBalance) {
        this.balance = newBalance;
    }

    // Encapsulated Getters & Setters
    public String getAccountNumber() { return accountNumber; }
    public String getAccountHolderName() { return accountHolderName; }
    public void setAccountHolderName(String accountHolderName) { this.accountHolderName = accountHolderName; }
    public double getBalance() { return balance; }
    public String getAccountStatus() { return accountStatus; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }
    public LocalDateTime getDateOfCreation() { return dateOfCreation; }
    public String getBranch() { return branch; }
    public String getIfscCode() { return ifscCode; }
}
