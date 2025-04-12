**Document Title: Lab 1 - Cybersecurity Risk Assessment and Strategies**  
**Student Name:** [Your Name]  
**Unit Code:** MBIS4017  

---

### **Document Structure**  
This document is organized into **sections corresponding to the lab steps**, with labeled placeholders for your 30 screenshots. Add your screenshots under each section as instructed.  

---

### **Table of Contents**  
1. **Virtual Machine Setup**  
2. **Windows Server 2022 Installation**  
3. **Active Directory Configuration**  
4. **Organizational Units (OUs) and User Creation**  
5. **Security Groups and Permissions**  
6. **Roaming Profiles Configuration**  
7. **Group Policy Object (GPO) Configuration**  
8. **Verification and Testing**  

---

### **Section 1: Virtual Machine Setup**  
**Screenshot Labels & Instructions:**  
1. **1.1 - VirtualBox Installation**  
   - *Description:* Screenshot of the VirtualBox installation completion screen.  
   - *Insert Here:*  

2. **1.2 - VM Configuration Summary**  
   - *Description:* VirtualBox VM settings (RAM: 4GB, Storage: 50GB, ISO attached).  
   - *Insert Here:*  

---

### **Section 2: Windows Server 2022 Installation**  
**Screenshot Labels & Instructions:**  
3. **2.1 - ISO Boot Screen**  
   - *Description:* Server booting from the Windows Server 2022 ISO.  
   - *Insert Here:*  

4. **2.2 - Installation Type Selection**  
   - *Description:* "Windows Server 2022 Standard (Desktop Experience)" selected.  
   - *Insert Here:*  

5. **2.3 - Admin Password Setup**  
   - *Description:* Administrator password configuration screen.  
   - *Insert Here:*  

6. **2.4 - Post-Installation Desktop**  
   - *Description:* Windows Server desktop after successful installation.  
   - *Insert Here:*  

---

### **Section 3: Active Directory Configuration**  
**Screenshot Labels & Instructions:**  
7. **3.1 - AD DS Role Installation**  
   - *Description:* Server Manager showing Active Directory Domain Services installed.  
   - *Insert Here:*  

8. **3.2 - Domain Controller Promotion**  
   - *Description:* "Promote this server to a domain controller" wizard.  
   - *Insert Here:*  

9. **3.3 - Domain Forest Configuration**  
   - *Description:* Setting domain name (`westmead.local`) and DSRM password.  
   - *Insert Here:*  

10. **3.4 - Post-Promotion Reboot**  
    - *Description:* Login screen showing domain (`WESTMEAD\Administrator`).  
    - *Insert Here:*  

---

### **Section 4: Organizational Units (OUs) and User Creation**  
**Screenshot Labels & Instructions:**  
11. **4.1 - ADUC Interface**  
    - *Description:* Active Directory Users and Computers (ADUC) console.  
    - *Insert Here:*  

12. **4.2 - OU Structure**  
    - *Description:* OUs created (e.g., Emergency Services, IT Departments).  
    - *Insert Here:*  

13. **4.3 - User Creation Wizard**  
    - *Description:* Example user (e.g., Amina Zayed) being created.  
    - *Insert Here:*  

14. **4.4 - User Properties (Profile Tab)**  
    - *Description:* Profile path configured (`\\WestmeadServer\Profiles\%username%`).  
    - *Insert Here:*  

---

### **Section 5: Security Groups and Permissions**  
**Screenshot Labels & Instructions:**  
15. **5.1 - Security Group Creation**  
    - *Description:* Creating `Emergency_Services_Group`.  
    - *Insert Here:*  

16. **5.2 - Domain Admins Membership**  
    - *Description:* IT user (e.g., Alice Barbieri) added to "Domain Admins."  
    - *Insert Here:*  

---

### **Section 6: Roaming Profiles Configuration**  
**Screenshot Labels & Instructions:**  
17. **6.1 - Shared Folder Permissions**  
    - *Description:* `C:\Profiles` shared with "Everyone: Full Control."  
    - *Insert Here:*  

18. **6.2 - User Profile Path**  
    - *Description:* User properties showing roaming profile path.  
    - *Insert Here:*  

---

### **Section 7: Group Policy Object (GPO) Configuration**  
**Screenshot Labels & Instructions:**  
19. **7.1 - Default Domain Policy (Password Settings)**  
    - *Description:* Password complexity rules (8+ chars, 5-month expiry).  
    - *Insert Here:*  

20. **7.2 - Clock Synchronization GPO**  
    - *Description:* Max tolerance set to 10 minutes.  
    - *Insert Here:*  

21. **7.3 - Kerberos Ticket Lifetime**  
    - *Description:* Ticket lifetime set to 20 hours.  
    - *Insert Here:*  

22. **7.4 - USB Restriction GPO**  
    - *Description:* "Deny all access" to removable storage.  
    - *Insert Here:*  

23. **7.5 - USB Allowance for Heads of Departments**  
    - *Description:* GPO allowing USB access for specific group.  
    - *Insert Here:*  

24. **7.6 - Project Management GPO Restrictions**  
    - *Description:* Blocked Control Panel, CMD, and folder sharing.  
    - *Insert Here:*  

---

### **Section 8: Verification and Testing**  
**Screenshot Labels & Instructions:**  
25. **8.1 - GPO Update Command**  
    - *Description:* `gpupdate /force` executed in Command Prompt.  
    - *Insert Here:*  

26. **8.2 - GPO Result Verification**  
    - *Description:* `gpresult /r` showing applied policies.  
    - *Insert Here:*  

27. **8.3 - USB Policy Test (Blocked)**  
    - *Description:* Error when inserting USB as non-admin.  
    - *Insert Here:*  

28. **8.4 - USB Policy Test (Allowed)**  
    - *Description:* Successful USB access as Head of Department.  
    - *Insert Here:*  

29. **8.5 - Roaming Profile Test**  
    - *Description:* User profile stored in `\\WestmeadServer\Profiles`.  
    - *Insert Here:*  

30. **8.6 - Project Management Restrictions Test**  
    - *Description:* Blocked CMD/Control Panel for Project Management users.  
    - *Insert Here:*  

---

### **Submission Instructions**  
1. Insert your 30 screenshots under the labeled sections above.  
2. Ensure each screenshot is clearly visible and matches the description.  
3. Save this document as **PDF** and upload it to Moodle.  

**Good luck!** 😊