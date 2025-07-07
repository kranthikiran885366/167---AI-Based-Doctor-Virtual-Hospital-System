// MongoDB initialization script
db = db.getSiblingDB('ai-doctor');

// Create collections
db.createCollection('users');
db.createCollection('medicalrecords');
db.createCollection('prescriptions');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });

db.medicalrecords.createIndex({ "userId": 1 });
db.medicalrecords.createIndex({ "type": 1 });
db.medicalrecords.createIndex({ "createdAt": -1 });

db.prescriptions.createIndex({ "userId": 1 });
db.prescriptions.createIndex({ "prescriptionNumber": 1 }, { unique: true });
db.prescriptions.createIndex({ "issuedAt": -1 });

// Insert sample data for testing
db.users.insertOne({
    name: "Test User",
    email: "test@mvksolutions.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uDfm", // password: test123
    role: "patient",
    preferences: {
        language: "en",
        notifications: {
            email: true,
            sms: true,
            push: true
        }
    },
    createdAt: new Date()
});

print("Database initialized successfully!");