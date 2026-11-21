package com.banktm.model;

/**
 * BANKTM - SAVINGS ACCOUNT (INHERITANCE & POLYMORPHISM)
 * Extends the abstract Account class.
 * Enforces mandatory minimum balance (₹1,000) and interest calculation.
 */
public class SavingsAccount extends Account {
    private double interestRate; // e.g. 7.10% APY
    private double minimumBalance; // ₹1,000.00

    public SavingsAccount(String accountNumber, String accountHolderName, double initialDeposit, String branch, String ifscCode) {
        super(accountNumber, accountHolderName, initialDeposit, branch, ifscCode);
        this.interestRate = 7.10; // BankTM Special Citizen Rate
        this.minimumBalance = 1000.00;
        if (initialDeposit < minimumBalance) {
            throw new IllegalArgumentException("Savings account requires at least ₹" + minimumBalance + " initial deposit.");
        }
    }

    // Dynamic Interest Computation
    public double calculateInterest() {
        return (getBalance() * interestRate) / 100.0;
    }

    public double calculateDailyAccrual() {
        return calculateInterest() / 365.0;
    }

    // Overridden Polymorphic Method (Runtime Polymorphism)
    @Override
    public synchronized boolean withdraw(double amount, String purpose) {
        if (amount <= 0) {
            System.err.println("[BankTM Error] Withdrawal amount must be positive.");
            return false;
        }

        if (getBalance() - amount < minimumBalance) {
            System.err.printf("[BankTM Declined] Minimum balance of ₹%.2f must be maintained. Current: ₹%.2f, Requested: ₹%.2f%n",
                    minimumBalance, getBalance(), amount);
            return false;
        }

        setBalanceInternal(getBalance() - amount);
        System.out.printf("[BankTM Debit] Successfully debited ₹%.2f from Savings %s for '%s'. Cleared: ₹%.2f%n",
                amount, getAccountNumber(), purpose, getBalance());
        return true;
    }

    @Override
    public double calculateCharges() {
        // Zero maintenance charge if balance >= ₹1,000
        return getBalance() >= minimumBalance ? 0.0 : 150.0;
    }

    @Override
    public String getAccountType() {
        return "SAVINGS";
    }

    @Override
    public void displayAccountDetails() {
        super.displayAccountDetails();
        System.out.printf("Interest Rate     : %.2f%% APY%n", interestRate);
        System.out.printf("Minimum Balance   : ₹%.2f%n", minimumBalance);
        System.out.printf("Daily Projected Yield: ₹%.2f/day%n", calculateDailyAccrual());
        System.out.println("============================================");
    }

    public double getInterestRate() { return interestRate; }
    public void setInterestRate(double interestRate) { this.interestRate = interestRate; }
    public double getMinimumBalance() { return minimumBalance; }
}
