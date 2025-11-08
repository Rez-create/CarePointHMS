
CREATE DATABASE HospitalManagementSystem;

USE HospitalManagementSystem;

-- Patients table
CREATE TABLE Patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M','F','O')),
    contact_email VARCHAR(100) NOT NULL UNIQUE,
    contact_phone VARCHAR(20),
    address VARCHAR(255),
    medical_history TEXT,
    registration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    profile_updated_date DATETIME
);

-- Staff table
CREATE TABLE Staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('doctor','pharmacist','nurse','lab_technician','admin','receptionist') NOT NULL,
    specialization VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive', 'on_leave') NOT NULL DEFAULT 'active',
    created_by_admin_id INT,
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME,
    FOREIGN KEY (created_by_admin_id) REFERENCES Staff(staff_id)
);

-- Staff Schedule table
CREATE TABLE StaffSchedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    day_of_week ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
);

-- Appointments table
CREATE TABLE Appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_type ENUM('initial_visit', 'follow_up', 'consultation', 'procedure') NOT NULL,
    appointment_datetime DATETIME NOT NULL,
    reason_for_visit TEXT,
    status ENUM('booked','confirmed','checked_in','in_progress','completed','cancelled','no_show') NOT NULL DEFAULT 'booked',
    cancellation_reason TEXT,
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES Staff(staff_id)
);



-- Consultations table for doctor's notes
CREATE TABLE Consultations (
    consultation_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    chief_complaint TEXT,
    diagnosis TEXT,
    notes TEXT,
    consultation_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    follow_up_needed BOOLEAN DEFAULT false,
    follow_up_date DATE,
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id),
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES Staff(staff_id)
);

-- Medical Records table
CREATE TABLE MedicalRecords (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    record_type ENUM('diagnosis', 'procedure', 'lab_result', 'prescription', 'immunization') NOT NULL,
    record_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    recorded_by INT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id),
    FOREIGN KEY (recorded_by) REFERENCES Staff(staff_id)
);



-- Lab Requests table
CREATE TABLE LabRequests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    appointment_id INT,
    priority ENUM('routine', 'urgent', 'emergency') NOT NULL DEFAULT 'routine',
    status ENUM('requested', 'sample_collected', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'requested',
    request_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES Staff(staff_id),
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id)
);

-- Lab Results table
CREATE TABLE LabResults (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    test_value VARCHAR(100) NOT NULL,
    is_abnormal BOOLEAN DEFAULT false,
    notes TEXT,
    performed_by INT NOT NULL,
    verified_by INT,
    result_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES LabRequests(request_id),
    FOREIGN KEY (performed_by) REFERENCES Staff(staff_id),
    FOREIGN KEY (verified_by) REFERENCES Staff(staff_id)
);

-- Inventory table with categories and suppliers
CREATE TABLE Suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    address TEXT,
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Inventory (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    category ENUM('medicine','equipment','medical_supply','lab_supply') NOT NULL,
    description TEXT,
    quantity_in_stock INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2),
    reorder_level INT,
    supplier_id INT,
    expiry_date DATE,
    batch_number VARCHAR(50),
    storage_location VARCHAR(100),
    last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id)
);



-- Enhanced Prescriptions table
CREATE TABLE Prescriptions (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    consultation_id INT NOT NULL,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    prescribed_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'dispensed', 'cancelled') NOT NULL DEFAULT 'pending',
    notes TEXT,
    FOREIGN KEY (consultation_id) REFERENCES Consultations(consultation_id),
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES Staff(staff_id)
);

-- Prescription Details table
CREATE TABLE PrescriptionDetails (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_id INT NOT NULL,
    medication_id INT NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    instructions TEXT,
    dispensed_by INT,
    dispensed_date DATETIME,
    FOREIGN KEY (prescription_id) REFERENCES Prescriptions(prescription_id),
    FOREIGN KEY (medication_id) REFERENCES Inventory(item_id),
    FOREIGN KEY (dispensed_by) REFERENCES Staff(staff_id)
);

-- Services Price List
CREATE TABLE ServicePrices (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME
);

-- Bills table
CREATE TABLE Bills (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    appointment_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    insurance_coverage DECIMAL(10,2) DEFAULT 0,
    patient_responsibility DECIMAL(10,2) NOT NULL,
    issued_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date DATE NOT NULL,
    status ENUM('pending','partially_paid','paid','cancelled') NOT NULL DEFAULT 'pending',
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id),
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id)
);

-- Bill Details table
CREATE TABLE BillDetails (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INT NOT NULL,
    service_id INT,
    item_id INT,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (bill_id) REFERENCES Bills(bill_id),
    FOREIGN KEY (service_id) REFERENCES ServicePrices(service_id),
    FOREIGN KEY (item_id) REFERENCES Inventory(item_id)
);

CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INT NOT NULL,
    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('cash','credit_card','debit_card','insurance','bank_transfer') NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    transaction_reference VARCHAR(100),
    received_by INT NOT NULL,
    notes TEXT,
    FOREIGN KEY (bill_id) REFERENCES Bills(bill_id),
    FOREIGN KEY (received_by) REFERENCES Staff(staff_id)
);

CREATE TABLE Reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    report_type ENUM('patient_flow','revenue','inventory','staff_performance','department_metrics') NOT NULL,
    report_name VARCHAR(100) NOT NULL,
    parameters TEXT,
    generated_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    generated_by INT NOT NULL,
    file_path VARCHAR(255),
    FOREIGN KEY (generated_by) REFERENCES Staff(staff_id)
);