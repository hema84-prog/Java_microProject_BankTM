package com.banktm.service;

import com.banktm.model.*;
import java.util.*;

/**
 * BANKTM - CORE TRANSACTION ENGINE INTERFACE (ABSTRACTION)
 */
public interface BankingService {
    boolean openAccount(Account account);
    boolean deposit(String accountNumber, double amount, String channel);
    boolean withdraw(String accountNumber, double amount, String purpose);
    Transaction transferFunds(String senderAcc, String receiverAcc, String receiverName, double amount, String narration);
    double checkBalance(String accountNumber);
    List<Transaction> getTransactionHistory(String accountNumber);
    void generateStatement(String accountNumber);
}
