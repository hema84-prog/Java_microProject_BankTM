package com.banktm.model;

/**
 * BANKTM - CURRENT ACCOUNT (INHERITANCE & POLYMORPHISM)
 * Extends the abstract Account class.
 * Features overdraft facility (up to ₹50,000 credit limit) for businesses & MSMEs.
 */
public class CurrentAccount extends Account {
    private double overdraftLimit; // e.g. ₹50,000.00
    private double overdraftInterestRate; // 12.0% on utilized overdraft

    public CurrentAccount(String accountNumber, String accountHolderName, double initialDeposit, String branch, String ifscCode) {
        super(accountNumber, accountHolderName, initialDeposit, branch, ifscCode);
        this.overdraftLimit = 50000.00;
        this.overdraftInterestRate = 12.00;
        if (initialDeposit < 5000.00) {
            throw new IllegalArgumentException("Current account requires at least ₹5,000 initial deposit.");
        }
    }

    // Overridden Polymorphic Method (Runtime Polymorphism)
    @Override
    public synchronized boolean withdraw(double amount, String purpose) {
        if (amount <= 0) {
            System.err.println("[BankTM Error] Withdrawal amount must be positive.");
            return false;
        }

        // Current account allows negative balance up to overdraftLimit
        double maximumWithdrawable = getBalance() + overdraftLimit;
        if (amount > maximumWithdrawable) {
            System.err.printf("[BankTM Overdraft Exceeded] Max allowed ₹%.2f (Balance: ₹%.2f + Limit: ₹%.2f). Requested: ₹%.2f%n",
                    maximumWithdrawable, getBalance(), overdraftLimit, amount);
            return false;
        }

        setBalanceInternal(getBalance() - amount);
        System.out.printf("[BankTM Debit] Debited ₹%.2f from Current %s for '%s'. New Net Position: ₹%.2f%n",
                amount, getAccountNumber(), purpose, getBalance());
        return true;
    }

    @Override
    public double calculateCharges() {
        // If account is utilizing overdraft, charge 12% annualized on negative component
        if (getBalance() < 0) {
            double utilized = Math.abs(getBalance());
            return (utilized * overdraftInterestRate) / (100.0 * 12.0); // monthly surcharge
        }
        return 0.0;
    }

    @Override
    public String getAccountType() {
        return "CURRENT / MSME";
    }

    @Override
    public void displayAccountDetails() {
        super.displayAccountDetails();
        System.out.printf("Overdraft Limit   : ₹%.2f%n", overdraftLimit);
        System.out.printf("Available Facility: ₹%.2f%n", getBalance() + overdraftLimit);
        System.out.printf("Overdraft APR     : %.2f%%%n", overdraftInterestRate);
        System.out.println("============================================");
    }

    public double getOverdraftLimit() { return overdraftLimit; }
    public void setOverdraftLimit(double overdraftLimit) { this.overdraftLimit = overdraftLimit; }
    public double getOverdraftInterestRate() { return overdraftInterestRate; }
    public void setOverdraftInterestRate(double overdraftInterestRate) { this.overdraftInterestRate = overdraftInterestRate; }
}
