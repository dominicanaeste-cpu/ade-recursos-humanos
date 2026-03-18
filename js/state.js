// State Management for ADE Vacaciones
const state = {
  user: {
    id: "EMP-1025",
    name: "Juan Pérez",
    role: "employee",
    position: "Pastor",
    yearsOfService: 8,
    fullWeeksPerYear: 4,
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAP5zIjZXrH0KI8PjBQPzjTtnI82VqErsngQLZNC-EpiMAJiWpADW-0_i7d_P8KwL5g6Ok7St74mWDmpqOUzQvZcpsxI9mfG4jcNem8iviDYv7c3F8IezYTPIlmQnyAylUm2D7g2bSfzFOuiHftVsG9QWGX93HPVwaU8Pm3ZijgZhYBbHr6rjTVg4sz96qezxfh7GgARjg4d16Mt-DJS_QPmYorLoILYJJHyRFb45l4ftpaLnJBSiSZ198R4HigA9Kvfe2gBnxT4g"
  },
  
  // Simulation of cloud storage
  vacationRequests: [
    {
      id: "REQ-001",
      employeeId: "EMP-1025",
      employeeName: "Juan Pérez",
      type: "local",
      startDate: "2024-08-01",
      endDate: "2024-08-15",
      status: "pending",
      duration: "2 Semanas",
      signatures: { applicant: true, manager: false, hr: false }
    },
    {
      id: "REQ-002",
      employeeId: "EMP-1025",
      employeeName: "Juan Pérez",
      type: "evangelismo",
      startDate: "2024-03-10",
      endDate: "2024-03-20",
      status: "approved",
      duration: "10 Días",
      signatures: { applicant: true, manager: true, hr: true }
    }
  ],
  
  // Team Availability Simulation
  teamAbsences: [
    { name: "Carlos Ruiz", position: "Tesorero", start: "2024-08-05", end: "2024-08-12", type: "vacation" },
    { name: "Maria Sosa", position: "Secretaria", start: "2024-08-10", end: "2024-08-24", type: "vacation" }
  ],
  
  // Statistics
  stats: {
    available: 4,
    remaining: 2,
    pending: 1,
    evangelismoUsed: false
  },
  
  // Methods for Business Logic
  calculateWeeks(years) {
    if (years >= 1 && years < 5) return 2;
    if (years >= 5 && years < 10) return 4;
    if (years >= 10) return 6;
    return 2;
  },
  
  approveRequest(requestId, role) {
    const req = this.vacationRequests.find(r => r.id === requestId);
    if (!req) return;
    
    if (role === 'manager') req.signatures.manager = true;
    if (role === 'hr') {
      req.signatures.hr = true;
      req.status = 'approved';
    }
    
    // Auto-update stats if approved by HR
    if (req.status === 'approved' && req.employeeId === this.user.id) {
       // logic to update remaining weeks
    }
    
    this.saveToCloud();
  },
  
  saveToCloud() {
    // Mock save to localStorage as a cloud simulation
    localStorage.setItem('ade_vacation_data', JSON.stringify({
      requests: this.vacationRequests,
      user: this.user
    }));
    console.log("💾 Cambios guardados en la nube de ADE");
  },
  
  loadFromCloud() {
    const data = localStorage.getItem('ade_vacation_data');
    if (data) {
      const parsed = JSON.parse(data);
      this.vacationRequests = parsed.requests;
      this.user = { ...this.user, ...parsed.user };
    }
  }
};

state.loadFromCloud();
