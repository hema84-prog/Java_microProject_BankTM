package com.banktm.model;

import java.time.LocalDateTime;

/**
 * ============================================================================
 * BANKTM CORE BANKING SYSTEM - OBJECT-ORIENTED APPLICATION ARCHITECTURE
 * ============================================================================
 * 
 * 1. ABSTRACTION:
 *    AccountApplication is an abstract parent class encapsulating common KYC,
 *    demographic, and banking mandate fields. Subclasses implement specialized
 *    criteria validation (e.g. minimum balance, overdraft eligibility).
 * 
 * 2. ENCAPSULATION:
 *    All member variables are strictly private and exposed only via verified
 *    getters and setters.
 * 
 * 3. INHERITANCE:
 *    SavingsAccountApplication and CurrentAccountApplication inherit from this base class.
 * 
 * 4. POLYMORPHISM:
 *    The abstract method validateApplicationCriteria() is overridden with
 *    specific logic for each account type.
 */
public abstract class AccountApplication {
    private String applicationId;
    private String customerId;
    private String customerName;
    private String applicantPrefix;
    private String fatherOrSpouseName;
    private String motherName;
    private String dateOfBirth;
    private String gender;
    private String nationality;
    private String panNumber;
    private String aadhaarNumber;
    private String customerMobile;
    private String customerEmail;
    private String residentialAddress;
    private String city;
    private String state;
    private String pinCode;
    private String occupationType;
    private String annualIncome;
    private String sourceOfFunds;
    private double initialDeposit;
    private String branch;
    private String status; // "PENDING", "APPROVED", "REJECTED"
    private LocalDateTime submittedAt;
    private String remarks;

    // Nominee particulars (Section 45ZA Banking Regulation Act)
    private String nomineeName;
    private String nomineeRelationship;
    private String nomineeAgeOrDob;
    private String nomineeAddress;

    public AccountApplication(String applicationId, String customerId, String customerName, double initialDeposit, String branch) {
        this.applicationId = applicationId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.initialDeposit = initialDeposit;
        this.branch = branch;
        this.status = "PENDING";
        this.submittedAt = LocalDateTime.now();
        this.nationality = "Indian";
    }

    // Abstract method enforcing Polymorphism in child classes
    public abstract boolean validateApplicationCriteria();
    public abstract String getAccountTypeLabel();

    // Getters & Setters (Encapsulation)
    public String getApplicationId() { return applicationId; }
    public String getCustomerId() { return customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getApplicantPrefix() { return applicantPrefix; }
    public void setApplicantPrefix(String applicantPrefix) { this.applicantPrefix = applicantPrefix; }
    public String getFatherOrSpouseName() { return fatherOrSpouseName; }
    public void setFatherOrSpouseName(String fatherOrSpouseName) { this.fatherOrSpouseName = fatherOrSpouseName; }
    public String getMotherName() { return motherName; }
    public void setMotherName(String motherName) { this.motherName = motherName; }
    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }
    public String getAadhaarNumber() { return aadhaarNumber; }
    public void setAadhaarNumber(String aadhaarNumber) { this.aadhaarNumber = aadhaarNumber; }
    public String getCustomerMobile() { return customerMobile; }
    public void setCustomerMobile(String customerMobile) { this.customerMobile = customerMobile; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public String getResidentialAddress() { return residentialAddress; }
    public void setResidentialAddress(String residentialAddress) { this.residentialAddress = residentialAddress; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPinCode() { return pinCode; }
    public void setPinCode(String pinCode) { this.pinCode = pinCode; }
    public String getOccupationType() { return occupationType; }
    public void setOccupationType(String occupationType) { this.occupationType = occupationType; }
    public String getAnnualIncome() { return annualIncome; }
    public void setAnnualIncome(String annualIncome) { this.annualIncome = annualIncome; }
    public String getSourceOfFunds() { return sourceOfFunds; }
    public void setSourceOfFunds(String sourceOfFunds) { this.sourceOfFunds = sourceOfFunds; }
    public double getInitialDeposit() { return initialDeposit; }
    public void setInitialDeposit(double initialDeposit) { this.initialDeposit = initialDeposit; }
    public String getBranch() { return branch; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getNomineeName() { return nomineeName; }
    public void setNomineeName(String nomineeName) { this.nomineeName = nomineeName; }
    public String getNomineeRelationship() { return nomineeRelationship; }
    public void setNomineeRelationship(String nomineeRelationship) { this.nomineeRelationship = nomineeRelationship; }
    public String getNomineeAgeOrDob() { return nomineeAgeOrDob; }
    public void setNomineeAgeOrDob(String nomineeAgeOrDob) { this.nomineeAgeOrDob = nomineeAgeOrDob; }
    public String getNomineeAddress() { return nomineeAddress; }
    public void setNomineeAddress(String nomineeAddress) { this.nomineeAddress = nomineeAddress; }
}

/**
 * Child Class 1: SavingsAccountApplication (Inheritance & Polymorphism)
 */
class SavingsAccountApplication extends AccountApplication {
    public static final double MIN_SAVINGS_DEPOSIT = 1000.00;

    public SavingsAccountApplication(String id, String custId, String name, double initialDeposit, String branch) {
        super(id, custId, name, initialDeposit, branch);
    }

    @Override
    public boolean validateApplicationCriteria() {
        return getInitialDeposit() >= MIN_SAVINGS_DEPOSIT &&
               getPanNumber() != null && !getPanNumber().trim().isEmpty() &&
               getAadhaarNumber() != null && !getAadhaarNumber().trim().isEmpty();
    }

    @Override
    public String getAccountTypeLabel() {
        return "SAVINGS_ACCOUNT";
    }
}

/**
 * Child Class 2: CurrentAccountApplication (Inheritance & Polymorphism)
 */
class CurrentAccountApplication extends AccountApplication {
    public static final double MIN_CURRENT_DEPOSIT = 5000.00;
    private double requestedOverdraftLimit = 50000.00;

    public CurrentAccountApplication(String id, String custId, String name, double initialDeposit, String branch) {
        super(id, custId, name, initialDeposit, branch);
    }

    @Override
    public boolean validateApplicationCriteria() {
        return getInitialDeposit() >= MIN_CURRENT_DEPOSIT &&
               getPanNumber() != null && !getPanNumber().trim().isEmpty();
    }

    @Override
    public String getAccountTypeLabel() {
        return "CURRENT_ACCOUNT";
    }

    public double getRequestedOverdraftLimit() {
        return requestedOverdraftLimit;
    }
}
