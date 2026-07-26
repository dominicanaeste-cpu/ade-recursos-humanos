// State Management for ADE Vacaciones using Firebase
const state = {
  db: null,
  // Configuración de Cuentas Institucionales
  supervisors: {
    'Presidencia': { name: 'Geuris Dencil Paulino', email: 'gdpaulino@gmail.com', password: 'presidencia123', pin: 'presidencia123', token: 'token-presidencia', supervisorDept: 'Presidencia' },
    'Secretaría': { name: 'Junior Feliz', email: 'prjuniorfeliz@gmail.com', password: 'secretaria123', pin: 'secretaria123', token: 'token-secretaria', supervisorDept: 'Secretaría' },
    'Tesorería': { name: 'Leidy Martínez', email: 'leidymartinez988@gmail.com', password: 'tesoreria123', pin: 'tesoreria123', token: 'token-tesoreria', supervisorDept: 'Tesorería' },
    'RRHH': { name: 'Director de Recursos Humanos', email: 'dominicanaeste@gmail.com', password: 'rrhh123', pin: 'rrhh123', token: 'token-rrhh', supervisorDept: 'RRHH' },
    'Asistente_RRHH': { name: 'Ana Mercedes', email: 'asistenterrhh@ade.com', password: 'asistente123', pin: 'asistente123', token: 'token-asistente', supervisorDept: 'RRHH' }
  },

  holidays: {
    '1/1/2026': 'Año Nuevo', '5/1/2026': 'Día de Reyes', '21/1/2026': 'Altagracia', '26/1/2026': 'Duarte', '27/2/2026': 'Independencia', '3/4/2026': 'Viernes Santo', '4/5/2026': 'Día del Trabajo', '4/6/2026': 'Corpus Christi', '16/8/2026': 'Restauración', '24/9/2026': 'Mercedes', '9/11/2026': 'Constitución', '25/12/2026': 'Navidad',
    '1/1/2025': 'Año Nuevo', '6/1/2025': 'Día de Reyes', '21/1/2025': 'Altagracia', '26/1/2025': 'Duarte', '27/2/2025': 'Independencia', '18/4/2025': 'Viernes Santo', '5/5/2025': 'Día del Trabajo', '19/6/2025': 'Corpus Christi', '16/8/2025': 'Restauración', '24/9/2025': 'Mercedes', '10/11/2025': 'Constitución', '25/12/2025': 'Navidad'
  },

  getHolidaysInRange(start, end) {
    let count = 0; let d = new Date(start + 'T00:00:00'); const e = new Date(end + 'T00:00:00');
    while(d <= e) {
        const k = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        if(this.holidays[k]) count++;
        d.setDate(d.getDate() + 1);
    }
    return count;
  },
  
  vacationRequests: [],
  annualPlans: [],
  conflictDeclarations: [],
  positionsList: [
    "Presidente", "Secretario", "Tesorero", "Departamental", "Secretaria", 
    "Auditor", "Contador", "Auxiliar Contabilidad", "Asistente Administrativa", 
    "Cajera", "Pastor Ordenado", "Pastor Aspirante", "Conserje", "Mensajero", 
    "Miembro de Junta", "Asistente de Comunicación"
  ],
  usersCache: {},// --- DATOS INSTITUCIONALES (Cargados desde Excel) ---
  employeesList: [],

  async init() {
    console.log("🛠️ Inicializando Estado ADE...");
    this.user = null; // Forza login siempre
    this.saveSession(); // Limpia rastros
    
    // 🚀 NUEVO: Migración a Firebase dinámica
    if (this.db) {
        // Corrección del balance de Junior Feliz (ID "17")
        try {
            const juniorRef = this.db.collection('employees').doc('17');
            const juniorDoc = await juniorRef.get();
            if (juniorDoc.exists) {
                const data = juniorDoc.data();
                if (data.remainingDays !== 28) {
                    await juniorRef.update({ remainingDays: 28 });
                    console.log("✅ Balance de Junior Feliz corregido a 28 días en Firestore.");
                }
            }
        } catch (err) {
            console.error("Error corrigiendo balance de Junior Feliz:", err);
        }

        try {
            const snap = await this.db.collection('employees').get();
            this.employeesList = [];
            snap.forEach(doc => {
                this.employeesList.push({ id: doc.id, ...doc.data() });
            });
            console.log(`☁️ Dinámico: Cargados ${this.employeesList.length} empleados desde Firestore.`);
        } catch(e) {
            console.error("Error en nube:", e);
        }
    }
    // No se carga la sesión automáticamente para forzar el login.
    // Si hay usuario y base de datos, hacer una sincronización silenciosa para refrescar la foto u otros cambios
    if (this.user && this.db) { // This condition will now always be false due to `this.user = null`
        try {
            const empRef = this.db.collection('employees').doc(this.user.id);
            const empDoc = await empRef.get();
            if (empDoc.exists) {
                const data = empDoc.data();
                this.user.photo = data.photo || this.user.photo;
                this.user.remainingDays = data.remainingDays !== undefined ? data.remainingDays : this.user.remainingDays;
                this.saveSession(); // Actualizar localStorage
                console.log("🔄 Perfil institucional sincronizado silenciosamente.");
            }
        } catch(e) {
            console.warn("No se pudo sincronizar el perfil en el inicio:", e);
        }
    }
    return true;
  },

  saveSession: function() {
    if (this.user) {
      localStorage.setItem('ade_vac_session', JSON.stringify(this.user));
    }
  },

  loadSession: function() {
    const saved = localStorage.getItem('ade_vac_session');
    if (saved) {
      try {
        this.user = JSON.parse(saved);
        console.log("👤 Sesión recuperada:", this.user.name);
      } catch(e) {
        localStorage.removeItem('ade_vac_session');
      }
    }
  },

  getWeeksByServiceYears: function(years) {
    const y = parseInt(years) || 0;
    if (y >= 10) return 4; // 10 o más años = 4 semanas (28 días)
    if (y >= 5) return 3;  // 5 a 9 años = 3 semanas (21 días)
    if (y >= 1) return 2;  // 1 a 4 años = 2 semanas (14 días)
    return 0;              // Menos de 1 año = sin vacaciones reglamentarias
  },

  async authenticate(username, password) {
    const loginUser = username.trim().toLowerCase().replace(/\s+/g, '');

    // 1. Verificar si coincide con algún supervisor/rol institucional por nombre, email o slug
    let matchedDept = null;
    let matchedSup = null;

    for (const [deptKey, sup] of Object.entries(this.supervisors || {})) {
        const supNameSlug = (sup.name || "").toLowerCase().replace(/\s+/g, '');
        const supEmail = (sup.email || "").toLowerCase();
        const deptSlug = deptKey.toLowerCase().replace(/\s+/g, '');

        if (loginUser === supNameSlug || username.toLowerCase() === supEmail || loginUser === deptSlug) {
            if (password === sup.password || password === sup.pin) {
                matchedDept = deptKey;
                matchedSup = sup;
                break;
            }
        }
    }

    // 2. Validación Institucional por catálogo de empleados (Nombre o Email)
    const emp = this.employeesList.find(e => {
        const empPin = (e.pin || "").toString();
        const pinMatch = (empPin === password);
        
        const nameParts = (e.name || "").trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const firstSurname = nameParts[2] || nameParts[1] || "";
        const slug = (firstName + firstSurname).toLowerCase();

        const userMatch = (
            slug === loginUser || 
            (e.name && e.name.toLowerCase().replace(/\s+/g, '') === loginUser) ||
            (e.email && e.email.toLowerCase() === username.toLowerCase())
        );

        // También permitir el PIN institucional si el usuario seleccionó un rol
        let supPinMatch = false;
        for (const sup of Object.values(this.supervisors || {})) {
            if ((sup.name && sup.name.toLowerCase().replace(/\s+/g, '') === slug) || (e.email && sup.email && e.email.toLowerCase() === sup.email.toLowerCase())) {
                if (password === sup.password || password === sup.pin) supPinMatch = true;
            }
        }

        return (pinMatch || supPinMatch) && userMatch;
    });

    if (emp) {
        // Determinación dinámica de roles y permisos
        let role = 'employee';
        let permissions = [];
        let supervisorDept = emp.cat || emp.department || 'General';
        let empSupervisor = emp.cat;

        // Comprobar si el empleado ostenta algún puesto institucional en supervisors
        for (const [deptKey, sup] of Object.entries(this.supervisors || {})) {
            const isEmpMatch = (sup.employeeId && sup.employeeId == emp.id) ||
                (sup.email && emp.email && sup.email.toLowerCase() === emp.email.toLowerCase()) ||
                (sup.name && emp.name && sup.name.trim().toLowerCase() === emp.name.trim().toLowerCase());
            
            if (isEmpMatch) {
                if (deptKey === 'Presidencia') {
                    role = 'manager';
                    if (!permissions.includes('manager')) permissions.push('manager');
                    supervisorDept = 'Presidencia';
                    empSupervisor = 'Tesorería';
                } else if (deptKey === 'Secretaría') {
                    role = 'manager';
                    if (!permissions.includes('manager')) permissions.push('manager');
                    supervisorDept = 'Secretaría';
                    empSupervisor = 'Presidencia';
                } else if (deptKey === 'Tesorería') {
                    role = 'manager';
                    if (!permissions.includes('manager')) permissions.push('manager');
                    supervisorDept = 'Tesorería';
                    empSupervisor = 'Presidencia';
                } else if (deptKey === 'RRHH') {
                    if (role === 'employee') role = 'hr';
                    if (!permissions.includes('hr')) permissions.push('hr');
                    if (supervisorDept === emp.cat) supervisorDept = 'RRHH';
                } else if (deptKey === 'Asistente_RRHH' || deptKey === 'Asistente RRHH') {
                    if (role === 'employee') role = 'assistant';
                    if (!permissions.includes('assistant')) permissions.push('assistant');
                    if (supervisorDept === emp.cat) supervisorDept = 'RRHH';
                }
            }
        }

        // Fallbacks históricos de compatibilidad si aún no está asignado explícitamente en supervisors
        if (permissions.length === 0) {
            if (emp.id === "42") { // Geuris Paulino
                role = 'manager'; permissions = ['manager']; supervisorDept = 'Presidencia'; empSupervisor = 'Tesorería';
            } else if (emp.id === "17") { // Junior Feliz: Secretaría (¡Separado de RRHH!)
                role = 'manager'; permissions = ['manager']; supervisorDept = 'Secretaría'; empSupervisor = 'Presidencia';
            } else if (emp.id === "35") { // Leidy Martinez
                role = 'manager'; permissions = ['manager']; supervisorDept = 'Tesorería'; empSupervisor = 'Presidencia';
            } else if (emp.id === "23") { // Ana Mercedes
                role = 'assistant'; permissions = ['assistant']; supervisorDept = 'RRHH';
            }
        }

        this.user = {
            id: emp.id,
            name: emp.name,
            email: emp.email,
            role: role,
            permissions: permissions,
            position: emp.position,
            supervisor: empSupervisor, 
            supervisorDept: supervisorDept, 
            yearsOfService: emp.years,
            evangelismoDays: 0,
            remainingWeeks: this.getWeeksByServiceYears(emp.years),
            remainingDays: this.getWeeksByServiceYears(emp.years) * 7,
            fullWeeksPerYear: this.getWeeksByServiceYears(emp.years),
            photo: null
        };
        
        if (this.db) {
            try {
                const empRef = this.db.collection('employees').doc(emp.id);
                const empDoc = await empRef.get();
                if (empDoc.exists) {
                    const data = empDoc.data();
                    this.user.remainingDays = data.remainingDays !== undefined ? data.remainingDays : this.user.remainingDays;
                    this.user.evangelismoDays = data.evangelismoDays || 0;
                    this.user.photo = data.photo || null;
                }
            } catch(dbErr) {
                console.warn("⚠️ No se pudieron cargar datos remotos, usando locales:", dbErr);
            }
        }

        this.saveSession();
        return this.user;
    }

    // 3. Si no es un usuario del catálogo Excel pero coincide con un supervisor institucional directo
    if (matchedSup) {
        const isHR = matchedDept === 'RRHH';
        const isAssistant = matchedDept === 'Asistente_RRHH' || matchedDept === 'Asistente RRHH';
        const role = isHR ? 'hr' : (isAssistant ? 'assistant' : 'manager');
        const perm = isHR ? ['hr'] : (isAssistant ? ['assistant'] : ['manager']);

        this.user = {
            id: matchedSup.token || `sup_${matchedDept.toLowerCase()}`,
            name: matchedSup.name,
            email: matchedSup.email,
            role: role,
            permissions: perm,
            supervisorDept: matchedSup.supervisorDept || (isHR || isAssistant ? 'RRHH' : matchedDept),
            remainingDays: 28,
            remainingWeeks: 4,
            fullWeeksPerYear: 4,
            yearsOfService: 10,
            position: matchedDept
        };
        this.saveSession();
        return this.user;
    }
    
    // 4. Empleado de prueba genérico
    if (username === "empleado@ade.com" && password === "123") {
      this.user = { id: 'emp_001', name: "Oficial de Prueba ADE", role: 'employee', remainingDays: 15, remainingWeeks: 3, yearsOfService: 10, position: 'Personal DeOficina', supervisor: 'Secretaría' };
      this.saveSession();
      return this.user;
    }
    return null;
  },
  async changePin(newPin) {
    if (!this.db || !this.user) return false;
    try {
        await this.db.collection('employees').doc(this.user.id).set({
            pin: newPin,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        // Actualizar localmente
        const empIndex = this.employeesList.findIndex(e => e.id == this.user.id);
        if (empIndex !== -1) this.employeesList[empIndex].pin = newPin;
        
        this.showToast ? this.showToast("✅ PIN actualizado con éxito") : console.log("PIN actualizado");
        return true;
    } catch (e) {
        console.error("Error al cambiar PIN:", e);
        return false;
    }
  },

  async resetEmployeePin(id) {
    if (!this.db) return false;
    try {
        // Buscar el PIN original en el catálogo inicial (simulado o fallback)
        // Por seguridad, reseteamos a los últimos 4 dígitos de su ID o un genérico
        const newPin = id.toString().padStart(4, '0'); 
        await this.db.collection('employees').doc(id).set({
            pin: newPin,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        return true;
    } catch (e) {
        console.error("Error al resetear PIN:", e);
        return false;
    }
  },
  user: null,
  
  vacationRequests: [],
  teamAbsences: [],
  stats: { available: 4, remaining: 2, pending: 1 },
  
  // Auditoría Data
  evangelismoDays: 0,

  initFirebase(config) {
    if (!config) return;
    try {
        if (typeof firebase === 'undefined') throw new Error("Firebase SDK missing");
        firebase.initializeApp(config);
        this.db = firebase.firestore();
        this.storage = firebase.storage();
        this.listenToChanges();
        console.log("🔥 Firebase Firestore & Storage conectados para ADE Vacaciones");
    } catch(e) {
        console.error("❌ Error al conectar Firebase:", e);
        throw e;
    }
  },

  async toggleEvangelismo(employeeId) {
    const empRef = this.db.collection('employees').doc(employeeId);
    const doc = await empRef.get();
    let current = 0;
    if (doc.exists) {
        current = doc.data().evangelismoDays || 0;
    }
    const newValue = current === 10 ? 0 : 10;
    await empRef.update({ evangelismoDays: newValue });
    if (this.user && this.user.id === employeeId) {
        this.user.evangelismoDays = newValue;
        this.saveSession();
    }
  },

  async uploadPDFToCloud(blob, path) {
    if (!this.storage) return null;
    console.log(`📤 Subiendo documento a: ${path}`);
    const ref = this.storage.ref(path);
    await ref.put(blob);
    return await ref.getDownloadURL();
  },

  listenToChanges() {
    if (!this.db) return;
    
    // Escuchar Solicitudes
    this.db.collection("requests").orderBy("startDate", "desc").onSnapshot(snapshot => {
      this.vacationRequests = [];
      snapshot.forEach(doc => {
        this.vacationRequests.push({ id: doc.id, ...doc.data() });
      });
      if (typeof app !== 'undefined') app.render();
    }, error => {
      console.error("❌ Error en solicitudes:", error);
    });

    // Escuchar Planificaciones Anuales
    this.db.collection("annual_plans").orderBy("createdAt", "desc").onSnapshot(snapshot => {
      this.annualPlans = [];
      snapshot.forEach(doc => {
        this.annualPlans.push({ id: doc.id, ...doc.data() });
      });
      if (typeof app !== 'undefined') app.render();
    }, error => {
      console.error("❌ Error en planificaciones anuales:", error);
    });

    // Escuchar Empleados (Balances en tiempo real)
    this.db.collection("employees").onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        const empIndex = this.employeesList.findIndex(e => e.id == doc.id);
        if (empIndex !== -1) {
          Object.assign(this.employeesList[empIndex], data);
        } else {
          this.employeesList.push({ id: doc.id, ...data });
        }

        // Sincronización crucial si somos nosotros
        if (this.user && this.user.id == doc.id) {
          this.user.photo = data.photo || this.user.photo;
          this.user.remainingDays = data.remainingDays !== undefined ? data.remainingDays : this.user.remainingDays;
          this.saveSession();
        }
      });
      console.log("👥 Datos de empleados sincronizados de la nube");
      if (typeof app !== 'undefined') app.render();
    }, error => {
      console.error("❌ Error en empleados:", error);
    });

    // Escuchar Declaraciones de Conflicto
    this.db.collection('conflict_declarations').onSnapshot(snapshot => {
        this.conflictDeclarations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (typeof app !== 'undefined') {
            app.render();
        }
    }, error => {
        console.error("❌ Error en declaraciones de conflicto:", error);
    });

    // Escuchar Catálogo de Posiciones
    this.db.collection('settings').doc('positions').onSnapshot(doc => {
        if (doc.exists) {
            this.positionsList = doc.data().list || this.positionsList;
        } else {
            // First time logic, push the hardcoded array to Firebase
            this.db.collection('settings').doc('positions').set({ list: this.positionsList });
        }
        if (typeof app !== 'undefined') {
            app.render();
        }
    });

    // Escuchar Supervisores
    this.db.collection('settings').doc('supervisors').onSnapshot(doc => {
        if (doc.exists) {
            this.supervisors = doc.data().list || this.supervisors;
        } else {
            this.db.collection('settings').doc('supervisors').set({ list: this.supervisors });
        }
        if (typeof app !== 'undefined') {
            app.render();
        }
    });
  },

  calculateWeeks(years) {
    return this.getWeeksByServiceYears(years);
  },

  async approveRequest(id, role, signature) {
    const docRef = this.db.collection('requests').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error("Documento no existe");
    const req = doc.data();

    const updates = { 
        [`signatures.${role}`]: signature,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    if (role === 'manager') {
        updates.status = 'pending_hr';
        // Enviar correo a RRHH para que revisen
        const hrEmail = (this.supervisors && this.supervisors['RRHH'] && this.supervisors['RRHH'].email) ? this.supervisors['RRHH'].email : 'dominicanaeste@gmail.com';
        this.sendEmailNotification(
            hrEmail,
            `NUEVA SOLICITUD PENDIENTE: ${req.employeeName}`,
            `La solicitud de ${req.employeeName} para el periodo ${req.startDate} al ${req.endDate} ha recibido el visto bueno de su administrador inmediato. Requiere su revisión final en Recursos Humanos.`
        );
    } else if (role === 'hr') {
        updates.status = 'approved';
        // Descontar días de la cuenta del oficial si es aprobación final de RRHH
        const eId = req.employeeId || req.userId || req.idEmpleado;
        if (!eId) console.warn("⚠️ No se encontró ID de empleado para descontar días.");
        
        const empRef = this.db.collection('employees').doc(eId);
        const empDoc = await empRef.get();
        if (empDoc.exists) {
            const currentDays = empDoc.data().remainingDays || 0;
            let requestedTotal = parseInt(req.totalDays || req.duration);
            if (isNaN(requestedTotal) || (req.duration && req.duration.toString().includes('Semana'))) {
                const s = new Date(req.startDate + 'T00:00:00');
                const e = new Date(req.endDate + 'T00:00:00');
                requestedTotal = Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24)) + 1;
            }
            
            // REGLAMENTO OFICIAL:
            // 1. Solo las vacaciones reales descuentan del balance.
            // 2. Si tiene evangelismo, los 10 días se restan del total del periodo (no consumen cuota).
            // 3. Los feriados NO se descuentan del balance anual (son beneficio libre).
            const isVacation = ['Local', 'Internacional', 'Conjunta', 'Vacaciones (Real)', 'Vacaciones (Cierre)'].includes(req.category);
            let daysToDiscount = 0;
            if (isVacation) {
                const isEvangelismo = req.evangelismoTaken === true;
                const feriados = this.getHolidaysInRange(req.startDate, req.endDate);
                
                daysToDiscount = isEvangelismo ? Math.max(0, requestedTotal - 10) : requestedTotal;
                daysToDiscount = Math.max(0, daysToDiscount - feriados);
            }

            await empRef.update({
                remainingDays: Math.max(0, currentDays - daysToDiscount)
            });
            // Actualizar el estado local si es el usuario logueado
            if (this.user && (this.user.id === eId || this.user.id == eId)) {
                this.user.remainingDays = Math.max(0, currentDays - daysToDiscount);
            }
        }
        
        // Notificar por correo (Requerimiento Asistente RRHH)
        const hrEmail = (this.supervisors && this.supervisors['RRHH'] && this.supervisors['RRHH'].email) ? this.supervisors['RRHH'].email : 'dominicanaeste@gmail.com';
        this.sendEmailNotification(
            hrEmail,
            `SOLICITUD AUTORIZADA: ${req.employeeName}`,
            `La solicitud de ${req.employeeName} para el periodo ${req.startDate} al ${req.endDate} ha sido autorizada digitalmente por todos los responsables y RRHH.`
        );
    }
    
    await docRef.update(updates);
    await this.loadRequests(); // Recargar datos
  },

   async rejectRequest(requestId) {
     await this.db.collection("requests").doc(requestId).update({
       status: 'rejected',
       rejectedAt: firebase.firestore.FieldValue.serverTimestamp()
     });
     await this.loadRequests();
   },
 
   async deleteRequest(requestId) {
     if (!this.db) return;
     await this.db.collection("requests").doc(requestId).delete();
     await this.loadRequests();
   },

  annualPlans: [],
  auditCycles: [],
  
  async loadRequests() {
    if (!this.db) return;
    try {
        const snap = await this.db.collection('requests').get();
        this.vacationRequests = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch(e) { console.warn("loadRequests - error loading requests:", e); }
    
    try {
        const plansSnap = await this.db.collection('annual_plans').get();
        this.annualPlans = plansSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch(e) { console.warn("loadRequests - error loading plans:", e); }

    try {
        const archiveSnap = await this.db.collection('audit_cycles').get();
        this.auditCycles = archiveSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch(e) { console.warn("loadRequests - error loading audit_cycles:", e); }
  },

  async archiveCycle(year, pdfUrl) {
    if (!this.db) return;
    await this.db.collection('audit_cycles').add({
        year: year,
        url: pdfUrl,
        archivedAt: firebase.firestore.FieldValue.serverTimestamp(),
        archivedBy: this.user ? this.user.name : 'System'
    });
    await this.loadRequests();
  },

  async annulVacationRequest(id) {
    if (!this.db) return;
    const docRef = this.db.collection('requests').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error("Documento no existe");
    const req = doc.data();

    // Solo restauramos días si la solicitud estaba aprobada/finalizada
    if (req.status === 'approved') {
        const eId = req.employeeId || req.userId || req.idEmpleado;
        const empRef = this.db.collection('employees').doc(eId);
        const empDoc = await empRef.get();
        
        if (empDoc.exists) {
            const currentDays = empDoc.data().remainingDays || 0;
            let requestedTotal = parseInt(req.totalDays || req.duration);
            if (isNaN(requestedTotal) || (req.duration && req.duration.toString().includes('Semana'))) {
                const s = new Date(req.startDate + 'T00:00:00');
                const e = new Date(req.endDate + 'T00:00:00');
                requestedTotal = Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24)) + 1;
            }
            
            const isVacation = ['Local', 'Internacional', 'Conjunta', 'Vacaciones (Real)', 'Vacaciones (Cierre)'].includes(req.category);
            let daysToRestore = 0;
            if (isVacation) {
                const isEvangelismo = req.evangelismoTaken === true;
                const feriados = this.getHolidaysInRange(req.startDate, req.endDate);
                
                daysToRestore = isEvangelismo ? Math.max(0, requestedTotal - 10) : requestedTotal;
                daysToRestore = Math.max(0, daysToRestore - feriados);
            }

            await empRef.update({
                remainingDays: currentDays + daysToRestore
            });

            if (this.user && (this.user.id === eId || this.user.id == eId)) {
                this.user.remainingDays = currentDays + daysToRestore;
            }
        }

        // Purgar PDF Institucional generado al aprobar
        if (this.storage) {
            try {
                const yearSub = new Date(req.startDate).getFullYear() || 2026;
                const fileName = `Solicitud_${req.employeeName.replace(/\s+/g, '_')}_${new Date(req.startDate).getFullYear()}.pdf`;
                const firePath = `vacaciones/${yearSub}/${req.employeeName}/${fileName}`;
                await this.storage.ref(firePath).delete();
                console.log(`🗑️ Archivo PDF oficial removido de la nube: ${firePath}`);
            } catch (err) {
                console.warn(`⚠️ No se pudo purgar el PDF porque no se encontró o la ruta difiere:`, err.message);
            }
        }
    }

    // Eliminar la solicitud
    await docRef.delete();

    // Notificar anulación por correo (RRHH)
    this.sendEmailNotification(
        'dominicanaeste@gmail.com',
        `⚠️ MOVIMIENTO ANULADO: ${req.employeeName}`,
        `Se ha anulado el movimiento de vacaciones de ${req.employeeName} del periodo ${req.startDate} al ${req.endDate}. Los días correspondientes han sido RESTRITUIDOS a su balance institucional.`
    );

    await this.loadRequests();
  },

  async archiveRequest(requestId) {
    try {
      const doc = await this.db.collection("requests").doc(requestId).get();
      if (doc.exists) {
        const data = doc.data();
        await this.db.collection("archived").add({
          ...data,
          archivedAt: firebase.firestore.FieldValue.serverTimestamp(),
          archivedBy: "Secretaría Ejecutiva"
        });
        await this.db.collection("requests").doc(requestId).delete();
        console.log("📦 Solicitud archivada en la nube de Secretaría");
      }
    } catch (e) {
      console.error("Error al archivar:", e);
    }
  },

  async sendEmailNotification(email, subject, body) {
    console.log("-----------------------------------------");
    console.log(`📧 DE: ASOCIACION DOMINICANA DEL ESTE RR HH`);
    console.log(`PARA: ${email}`);
    console.log(`ASUNTO: ${subject}`);
    console.log(`MSG: ${body}`);
    console.log("-----------------------------------------");
    
    // Soporte para la extensión 'Trigger Email' de Firebase
    if (this.db) {
        try {
            await this.db.collection('mail').add({
                to: email,
                message: {
                    subject: subject,
                    text: body,
                    html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
                             <h2 style="color: #2f557f;">ADE Vacaciones - Notificación</h2>
                             <p style="font-size: 1.1rem;">${body.replace(/\n/g, '<br>')}</p>
                             <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                             <p style="font-size: 0.8rem; color: #64748b;">Este es un mensaje automático del sistema de Recursos Humanos de la Asociación Dominicana del Este.</p>
                           </div>`
                }
            });
        } catch (e) {
            console.warn("⚠️ Falló el envío de correo persistente (¿Extensión instalada?):", e);
        }
    }
    return true;
  },

  async cancelApprovedRequest(requestId, reason = "No especificado") {
    console.log(`🚫 Iniciando anulación de solicitud ${requestId}...`);
    try {
      const docRef = this.db.collection('requests').doc(requestId);
      const doc = await docRef.get();
      if (!doc.exists) throw new Error("Documento no existe");
      const req = doc.data();

      // 1. RECALCULAR DÍAS QUE SE DEBEN DEVOLVER
      let periodTotal = parseInt(req.totalDays || req.duration);
      if (isNaN(periodTotal) || (req.duration && req.duration.toString().includes('Semana'))) {
          const s = new Date(req.startDate + 'T00:00:00');
          const e = new Date(req.endDate + 'T00:00:00');
          periodTotal = Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24)) + 1;
      }

      const isVacation = ['Local', 'Internacional', 'Conjunta', 'Vacaciones (Real)', 'Vacaciones (Cierre)'].includes(req.category);
      let daysToReturn = 0;
      if (isVacation) {
          const isEvangelismo = req.evangelismoTaken === true;
          const feriados = this.getHolidaysInRange(req.startDate, req.endDate);
          
          daysToReturn = isEvangelismo ? Math.max(0, periodTotal - 10) : periodTotal;
          daysToReturn = Math.max(0, daysToReturn - feriados);
      }

      // 2. ACTUALIZAR BALANCE DEL EMPLEADO
      const eId = req.employeeId || req.userId || req.idEmpleado;
      if (eId) {
          const empRef = this.db.collection('employees').doc(eId);
          const empDoc = await empRef.get();
          if (empDoc.exists) {
              const currentDays = empDoc.data().remainingDays || 0;
              await empRef.update({
                  remainingDays: currentDays + daysToReturn,
                  updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              });
              console.log(`✅ Devueltos ${daysToReturn} días al empleado ${eId}`);
          }
      }

      // 3. ARCHIVAR COMO ANULADA
      await this.db.collection("archived").add({
          ...req,
          archivedAt: firebase.firestore.FieldValue.serverTimestamp(),
          archivedBy: "RRHH (Anulación)",
          status: "annulled",
          cancellationReason: reason
      });

      // 4. ELIMINAR DE ACTIVAS
      await docRef.delete();
      console.log("🗑️ Registro de salida eliminado de la lista activa.");
      return true;
    } catch (e) {
      console.error("❌ Error al anular solicitud:", e);
      throw e;
    }
  },

  async updatePositions(newList) {
    this.positionsList = newList;
    await this.db.collection('settings').doc('positions').set({ list: newList });
  },

  async updateSupervisors(newList) {
    this.supervisors = newList;
    if (this.db) {
      await this.db.collection('settings').doc('supervisors').set({ list: newList });
      
      // Actualizar los datos de empleado asociados a cada rol
      for (const [deptKey, sup] of Object.entries(newList)) {
        if (!sup) continue;
        let empToUpdate = null;
        if (sup.employeeId) {
            empToUpdate = this.employeesList.find(e => e.id == sup.employeeId);
        } else if (sup.email) {
            empToUpdate = this.employeesList.find(e => e.email && e.email.toLowerCase() === sup.email.toLowerCase());
        } else if (sup.name) {
            empToUpdate = this.employeesList.find(e => e.name && e.name.trim().toLowerCase() === sup.name.trim().toLowerCase());
        }
        
        if (empToUpdate) {
            const updates = {};
            if (sup.email && sup.email !== empToUpdate.email) updates.email = sup.email;
            if (sup.pin && sup.pin !== empToUpdate.pin) updates.pin = sup.pin;
            
            if (Object.keys(updates).length > 0) {
                try {
                    await this.db.collection('employees').doc(empToUpdate.id.toString()).update(updates);
                    Object.assign(empToUpdate, updates);
                    console.log(`✅ Empleado ${empToUpdate.name} actualizado con nuevo correo/PIN.`);
                } catch(e) {
                    console.warn(`Error actualizando empleado ${empToUpdate.id}:`, e);
                }
            }
        }
      }
    }
  },

  // 📝 GESTIÓN DE PERSONAL (CRUD NUBE)
  async saveEmployee(empData) {
    if (!this.db) return;
    const id = empData.id || String(Date.now());
    await this.db.collection('employees').doc(id).set({
        ...empData,
        id: id,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log(`✅ Empleado ${id} guardado en la nube.`);
  },

  async deleteEmployee(id) {
    if (!this.db) return;
    await this.db.collection('employees').doc(id).delete();
    console.log(`🗑️ Empleado ${id} eliminado de la nube.`);
  },

  async submitConflicto(data) {
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    const docRef = await this.db.collection('conflict_declarations').add(data);
    return docRef.id;
  },

  async deleteConflictDeclaration(id) {
    if (!this.db) return;
    await this.db.collection('conflict_declarations').doc(id).delete();
  },

  async updateConflicto(id, updates) {
    if (!this.db) return;
    await this.db.collection('conflict_declarations').doc(id).update(updates);
  },

  async addRequest(newReq) {
    // Ensure category is set
    if (!newReq.category) newReq.category = 'Local';
    await this.db.collection("requests").add(newReq);
  },

  async submitAnnualPlan(plan) {
    plan.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    const docRef = await this.db.collection("annual_plans").add(plan);
    return docRef.id;
  },

  async seedRealData() {
    const batch = this.db.batch();
    
    // 1. LIMPIEZA TOTAL: Borramos cualquier registro previo de 2026 para eliminar fechas "inventadas"
    for (let i = 1; i <= 60; i++) {
        batch.delete(this.db.collection('requests').doc(`audit_2026_${i}`));
        batch.delete(this.db.collection('requests').doc(`evan_2026_${i}`));
        batch.delete(this.db.collection('requests').doc(`audit_auto_2026_${i}`));
    }

    // 2. DATOS REALES EXTRAÍDOS DE LOS 6 EXPEDIENTES EXCLUSIVOS DE 2026
    const realVacations = [
        {id: "52", start: "2026-04-15", end: "2026-05-03", w: 2}, // Juan Onasis
        {id: "40", start: "2026-03-26", end: "2026-05-02", w: 4}, // Juan Francisco
        {id: "13", start: "2026-01-19", end: "2026-02-03", w: 2}, // David Joel
        {id: "34", start: "2026-02-13", end: "2026-03-02", w: 2}, // Garibaldi Luna
        {id: "8",  start: "2026-03-24", end: "2026-04-05", w: 2}, // Leonidas Chireno
        {id: "11", start: "2026-01-06", end: "2026-01-15", w: 2}  // Sandy De La Cruz
    ];

    // 3. CARGA DE LOS 60 EMPLEADOS CON BALANCE REGLAMENTARIO (UD)
    for (let emp of this.employeesList) {
        const weeks = this.getWeeksByServiceYears(emp.years);
        const real = realVacations.find(v => v.id == emp.id);
        
        // Sincronizar Balance del Empleado
        const empRef = this.db.collection('employees').doc(emp.id.toString());
        
        let consumedInReal = 0;
        if (real) {
            const hCount = this.getHolidaysInRange(real.start, real.end);
            const totalOut = (real.w * 7); // Base weeks requested
            // En los datos reales, 'w' es la base de semanas. 
            // Si el empleado es 52 o 40, tiene 10 días extras que no se descuentan.
            consumedInReal = Math.max(0, totalOut - hCount);
        }

        let baseAssignment = weeks * 7;
        let finalRemaining = Math.max(0, baseAssignment - consumedInReal);

        batch.set(empRef, {
            remainingDays: finalRemaining,
            evangelismoTaken: (emp.id == "52" || emp.id == "40"),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // Si el empleado tiene registro real en los expedientes de 2026
        if (real) {
            const reqRef = this.db.collection('requests').doc(`audit_2026_${emp.id}`);
            
            // Si tiene ajuste de evangelismo, se suma a la duración del mismo bloque de fechas
            let baseDuration = real.w * 7;
            let totalAuditDuration = (emp.id == "52" || emp.id == "40") ? baseDuration + 10 : baseDuration;

            batch.set(reqRef, {
                idEmpleado: emp.id.toString(),
                employeeName: emp.name,
                category: "Vacaciones (Real)",
                evangelismoTaken: emp.id == "52" || emp.id == "40",
                startDate: real.start, 
                endDate: real.end,
                duration: totalAuditDuration,
                status: "approved",
                supervisor: emp.cat,
                managerSignature: "SISTEMA_ADE_FICHA",
                hrSignature: "SISTEMA_ADE_FICHA",
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Eliminar cualquier récord de evangelismo separado que pudiera existir de pruebas anteriores
            const evanOldRef = this.db.collection('requests').doc(`evan_audit_2026_${emp.id}`);
            batch.delete(evanOldRef);
        }
    }

    await batch.commit();
    console.log("✅ Sincronización PROFUNDA completada con los 6 expedientes de 2026.");
    return true;
  },

  async closeYear(year = 2026) {
    console.log(`🔒 Iniciando Cierre de Año Auditoría ${year}...`);
    const batch = this.db.batch();
    const employeesSnapshot = await this.db.collection('employees').get();
    
    for (let doc of employeesSnapshot.docs) {
        const empData = doc.data();
        const empId = doc.id;
        const remaining = empData.remainingDays || 0;

        if (remaining > 0) {
            const localEmp = this.employeesList.find(e => e.id == empId);
            if (!localEmp) continue;

            // Generar fechas aleatorias para el cierre (Segunda mitad del año)
            const month = Math.floor(Math.random() * 4) + 8; // Ago-Nov
            const day = Math.floor(Math.random() * 20) + 1;
            const startDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            
            const d = new Date(startDate);
            d.setDate(d.getDate() + remaining);
            const endDate = d.toISOString().split('T')[0];

            const reqRef = this.db.collection('requests').doc(`audit_auto_${year}_${empId}`);
            batch.set(reqRef, {
                idEmpleado: empId,
                employeeName: localEmp.name,
                category: "Vacaciones (Cierre)",
                startDate: startDate, 
                endDate: endDate,
                duration: remaining,
                status: "approved",
                supervisor: localEmp.cat,
                managerSignature: "AUDITORIA_AUTO",
                hrSignature: "AUDITORIA_AUTO",
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Agotar el balance
            batch.update(doc.ref, { 
                remainingDays: 0,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    }
    
    // RE-INICIALIZAR balances para el nuevo ciclo
    for (let doc of employeesSnapshot.docs) {
        const empId = doc.id;
        const localEmp = this.employeesList.find(e => e.id == empId);
        if (localEmp) {
            const nextYearAssignment = this.getWeeksByServiceYears(localEmp.years) * 7;
            batch.update(doc.ref, { 
                remainingDays: nextYearAssignment,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    }
    
    await batch.commit();
    console.log(`🏁 Cierre de Año ${year} completado. Nuevo ciclo ${year + 1} listo con balances renovados.`);
    return true;
  },

  async resetDatabase() {
    if (!this.db) return;
    console.log("💣 Reiniciando base de datos a estado original...");
    const batch = this.db.batch();
    
    // 1. Borrar todas las solicitudes existentes (Colección requests)
    const reqsSnapshot = await this.db.collection('requests').get();
    reqsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });
    
    // 2. Borrar archivados
    const archivedSnapshot = await this.db.collection('archived').get();
    archivedSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    // 3. Resetear balances de empleados a su asignación original
    const employeesSnapshot = await this.db.collection('employees').get();
    employeesSnapshot.forEach(doc => {
        const empId = doc.id;
        const local = this.employeesList.find(e => e.id == empId);
        if (local) {
            batch.update(doc.ref, {
                remainingDays: this.getWeeksByServiceYears(local.years) * 7,
                evangelismoDays: 0,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    });
    
    await batch.commit();
    
    // 4. Cargar únicamente los 6 expedientes reales de 2026
    await this.seedRealData();
    
    console.log("✨ Base de datos limpia y restaurada con registros reales.");
    return true;
  },

  async resetConflictDeclarations() {
    if (!this.db) return null;
    const snapshot = await this.db.collection('conflict_declarations').get();
    const batch = this.db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    return await batch.commit();
  }
};

