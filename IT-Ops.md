# ID Tap-In System Database Documentation

## 1. Database Choice: PostgreSQL

### Why PostgreSQL?

PostgreSQL was selected for the ID Tap-In System due to the following reasons:

- **Reliability & ACID Compliance**  
  Ensures **data integrity** for student check-ins and admin actions.

- **Replication & High Availability**  
  Supports **streaming replication** and **logical replication**, enabling at least two-node clusters for **fault tolerance**.

- **Linux Compatibility**  
  Runs natively on **Ubuntu, Debian, CentOS**, and other Linux distributions.

- **Scalability**  
  Capable of handling increasing user activity and **large datasets** efficiently.

- **Airtable Integration**  
  Compatible with APIs to query **safety training certifications** from Airtable.

---

## 2. PostgreSQL Cluster Configuration on Linux

### Step 1: Install PostgreSQL on All Nodes
Run the following command on each cluster node:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
