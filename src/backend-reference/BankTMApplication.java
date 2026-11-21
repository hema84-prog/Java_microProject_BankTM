package com.banktm;

import com.banktm.model.*;
import java.util.*;

/**
 * BANKTM - MAIN DRIVER & OOP CONCEPTS DEMONSTRATION
 * Demonstrates:
 * 1. INHERITANCE: Account -> SavingsAccount & CurrentAccount
 * 2. ENCAPSULATION: Private fields, guarded setters, balance safety
 * 3. ABSTRACTION: Abstract Account class and contract enforcement
 * 4. POLYMORPHISM: Dynamic dispatch on withdraw() and overloaded deposit()
 */
public class BankTMApplication {

    public static void main(String[] args) {
        System.out.println("==========================================================");
        System.out.println("   BANKTM DIGITAL BANKING ENGINE - JAVA 17 OOP ARCHITECTURE ");
        System.out.println("==========================================================");

        // 1. INHERITANCE & POLYMORPHISM (Upcasting to Account base class)
        Account savings = new SavingsAccount(
                "BTM-SB-100293847", 
                "Rajesh K. Sharma", 
                25000.00, 
                "Indiranagar Branch, Bengaluru", 
                "BTMN000104"
        );

        Account current = new CurrentAccount(
                "BTM-CA-200938102", 
                "Rajesh K. Sharma", 
                145000.00, 
                "MG Road Main Branch, Bengaluru", 
                "BTMN000101"
        );

        // Display polymorphic details
        savings.displayAccountDetails();
        current.displayAccountDetails();

        // 2. POLYMORPHIC WITHDRAWAL BEHAVIOR
        System.out.println("\n--- Testing Polymorphic Withdrawal Constraints ---");
        // Savings Account: rejects if balance falls below ₹1,000
        savings.withdraw(24500.00, "Emergency ATM Withdrawal"); // Should be declined (min balance 1000)
        savings.withdraw(5000.00, "Rent Payment"); // Should succeed

        // Current Account: allows overdraft up to ₹50,000
        current.withdraw(160000.00, "Supplier Purchase"); // Exceeds balance by 15k, but allowed due to 50k overdraft!
        System.out.printf("Current Account Net Balance after overdraft: ₹%.2f%n", current.getBalance());

        // 3. OVERLOADED DEPOSIT (Compile-time Polymorphism)
        System.out.println("\n--- Testing Overloaded Deposit Methods ---");
        savings.deposit(10000.00); // default channel
        savings.deposit(15000.00, "Direct Benefit Transfer (DBT)"); // specific channel

        // 4. TRANSACTION AUDIT LOGGING
        System.out.println("\n--- Generating Audit Trail Transaction Advice ---");
        Transaction txn = new Transaction(
                "TXN-20261108-9901",
                savings.getAccountHolderName(),
                savings.getAccountNumber(),
                "Kaveri Agro Tech",
                "HDFC00049281",
                12000.00,
                Transaction.Type.DEBIT,
                "Vendor Seed & Equipment Supply",
                "NEFT",
                Transaction.Status.SUCCESSFUL
        );
        txn.printTransactionReceipt();
    }
}
