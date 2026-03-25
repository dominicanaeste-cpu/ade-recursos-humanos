// State Management for ADE Vacaciones using Firebase
const state = {
  db: null,
  // Configuración de Cuentas Institucionales
  supervisors: {
    'Presidencia': { name: 'Geuris Dencil Paulino', email: 'gdpaulino@gmail.com', password: 'presidencia123', token: 'token-presidencia', supervisorDept: 'Presidencia' },
    'Secretaría': { name: 'Junior Feliz', email: 'prjuniorfeliz@gmail.com', password: 'secretaria123', token: 'token-secretaria', supervisorDept: 'Secretaría' },
    'Tesorería': { name: 'Leidy Martínez', email: 'leidymartinez988@gmail.com', password: 'tesoreria123', token: 'token-tesoreria', supervisorDept: 'Tesorería' },
    'RRHH': { name: 'Recursos Humanos', email: 'dominicanaeste@gmail.com', password: 'rrhh123', token: 'token-rrhh', supervisorDept: 'RRHH' }
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
  employeesList: [{"id": "1", "name": "MARCOS ANTONIO ARIAS MERCEDES", "years": 0, "position": "Pastor", "cat": "Presidencia", "pin": "2137"}, {"id": "2", "name": "ISMAEL  ASTACIO CHIRENO", "years": 7, "position": "Pastor", "cat": "Presidencia", "pin": "2274"}, {"id": "3", "name": "RAQUEL GIOVANNA BASTARDO MATEO", "years": 34, "position": "Equipo de Finanzas", "cat": "Tesorer\u00eda", "pin": "2411"}, {"id": "4", "name": "OLIVER RAFIEL BERAS CALDERON", "years": 13, "position": "Departamental", "cat": "Presidencia", "pin": "2548"}, {"id": "5", "name": "JOE  CALDERON", "years": 24, "position": "Pastor", "cat": "Presidencia", "pin": "2685"}, {"id": "6", "name": "NIRSON  CASTILLO FELIZ", "years": 5, "position": "Pastor", "cat": "Presidencia", "pin": "2822"}, {"id": "7", "name": "GABRIEL  CEDE\u00d1O", "years": 26, "position": "Pastor", "cat": "Presidencia", "pin": "2959"}, {"id": "8", "name": "LEONIDAS FRANCISCO CHIRENO CONTRERAS", "years": 27, "position": "Pastor", "cat": "Presidencia", "pin": "3096"}, {"id": "9", "name": "GERMAN  DANIEL SENA", "years": 2, "position": "Pastor", "cat": "Presidencia", "pin": "3233"}, {"id": "10", "name": "MIGUEL IGNACIO DE JESUS PASCUAL", "years": 2, "position": "Pastor", "cat": "Presidencia", "pin": "3370"}, {"id": "11", "name": "SANDY  DE LA CRUZ SEVERINO", "years": 5, "position": "Pastor", "cat": "Presidencia", "pin": "3507"}, {"id": "12", "name": "DAVID  DE LOS SANTOS DE OLEO", "years": 8, "position": "Pastor", "cat": "Presidencia", "pin": "3644"}, {"id": "13", "name": "DAVID JOEL DEL ROSARIO MATEO", "years": 8, "position": "Pastor", "cat": "Presidencia", "pin": "3781"}, {"id": "14", "name": "CANDELARIO  DEL VILLAR GONZALEZ", "years": 11, "position": "Equipo de Finanzas", "cat": "Tesorer\u00eda", "pin": "3918"}, {"id": "15", "name": "FRANCISCO  DIAZ HERRERA", "years": 6, "position": "Pastor", "cat": "Presidencia", "pin": "4055"}, {"id": "16", "name": "JUAN CARLOS ENCARNACION", "years": 28, "position": "Pastor", "cat": "Presidencia", "pin": "4192"}, {"id": "17", "name": "JUNIOR ANDRES FELIZ FELIZ", "years": 18, "position": "SECRETARIO EJECUTIVO", "cat": "Presidencia", "pin": "1717"}, {"id": "18", "name": "AGUSTIN ANTONIO FERNANDEZ", "years": 5, "position": "Personal de Oficina", "cat": "Secretar\u00eda", "pin": "4466"}, {"id": "19", "name": "RONALD MANUEL FIGUEROA RODRIGUEZ", "years": 1, "position": "Pastor", "cat": "Presidencia", "pin": "4603"}, {"id": "20", "name": "PIERRESON  FRANCOIS", "years": 11, "position": "Pastor", "cat": "Presidencia", "pin": "4740"}, {"id": "21", "name": "JOSE ARMANDO GARCIA LIZARDO", "years": 5, "position": "Pastor", "cat": "Presidencia", "pin": "4877"}, {"id": "22", "name": "JULIO  GOMEZ ALBOLEDA", "years": 30, "position": "Pastor", "cat": "Presidencia", "pin": "5014"}, {"id": "23", "name": "ANA MERCEDES ALTAGRACIA GONZALEZ ROBIU", "years": 37, "position": "Departamental", "cat": "Presidencia", "pin": "2323"}, {"id": "24", "name": "EUCLIDES  GRABRIEL CASTRO", "years": 13, "position": "Pastor", "cat": "Presidencia", "pin": "5288"}, {"id": "25", "name": "MANUEL CONCEPCION GUERRERO", "years": 31, "position": "Personal de Oficina", "cat": "Secretar\u00eda", "pin": "5425"}, {"id": "26", "name": "OSCAR EDUARDO GUILLERMO RODRIGUEZ", "years": 6, "position": "Pastor", "cat": "Presidencia", "pin": "5562"}, {"id": "27", "name": "NURIS ISABEL HENRIQUEZ CALDERON", "years": 27, "position": "Equipo de Finanzas", "cat": "Tesorer\u00eda", "pin": "5699"}, {"id": "28", "name": "VICTOR MANUEL HENRIQUEZ CALDERON", "years": 25, "position": "Pastor", "cat": "Presidencia", "pin": "5836"}, {"id": "29", "name": "JOSE FRANCISCO JACOB FRECI", "years": 19, "position": "Pastor", "cat": "Presidencia", "pin": "5973"}, {"id": "30", "name": "RAMON ERNESTO JAVIER GONZALEZ", "years": 5, "position": "Pastor", "cat": "Presidencia", "pin": "6110"}, {"id": "31", "name": "JORGE EUGENIO JESUS JIMENEZ", "years": 13, "position": "Pastor", "cat": "Presidencia", "pin": "6247"}, {"id": "32", "name": "ABIGAIL  LADOO PELEGRIN", "years": 3, "position": "Equipo de Finanzas", "cat": "Tesorer\u00eda", "pin": "6384"}, {"id": "33", "name": "SANTIAGO  LAGUER", "years": 14, "position": "Pastor", "cat": "Presidencia", "pin": "6521"}, {"id": "34", "name": "GARIBALDI  LORENZO LUNA", "years": 20, "position": "Equipo de Finanzas", "cat": "Tesorer\u00eda", "pin": "6658"}, {"id": "35", "name": "LEIDY MARGARITA MARTINEZ RAMIREZ", "years": 26, "position": "Tesorera", "cat": "Tesorer\u00eda", "pin": "3535"}, {"id": "36", "name": "JESUS  MATEO CIPION", "years": 14, "position": "Pastor", "cat": "Presidencia", "pin": "6932"}, {"id": "37", "name": "JORGE DAVID MATEO MEJIA", "years": 14, "position": "Departamental", "cat": "Presidencia", "pin": "7069"}, {"id": "38", "name": "INGRID ANYELINA MEJIA POUERIET", "years": 12, "position": "Personal de Oficina", "cat": "Secretar\u00eda", "pin": "7206"}, {"id": "39", "name": "FREDDY ANTONIO MIGUEL JUAN", "years": 12, "position": "Departamental", "cat": "Presidencia", "pin": "7343"}, {"id": "40", "name": "JUAN FRANCISCO MORILLO MAZARA", "years": 26, "position": "Pastor", "cat": "Presidencia", "pin": "4040"}, {"id": "41", "name": "FAUSTO SEBASTIAN PAULINO FUENTES", "years": 2, "position": "Pastor", "cat": "Presidencia", "pin": "7617"}, {"id": "42", "name": "GEURIS DENCIL PAULINO MILANES", "years": 26, "position": "Presidente", "cat": "Presidencia", "pin": "4242"}, {"id": "43", "name": "ELEIN  PAULINO SAINT FLEUR", "years": 2, "position": "Personal de Oficina", "cat": "Secretar\u00eda", "pin": "7891"}, {"id": "44", "name": "MANUEL  PIO NOLASCO", "years": 14, "position": "Pastor", "cat": "Presidencia", "pin": "8028"}, {"id": "45", "name": "DINORA  REYES", "years": 21, "position": "Personal de Oficina", "cat": "Secretar\u00eda", "pin": "8165"}, {"id": "46", "name": "HENRY AMAURY ROA FELIZ", "years": 26, "position": "Pastor", "cat": "Presidencia", "pin": "8302"}, {"id": "47", "name": "LUIS ALBERTO RODRIGUEZ BASTARDO", "years": 18, "position": "Departamental", "cat": "Presidencia", "pin": "8439"}, {"id": "48", "name": "FAUSTO  RODRIGUEZ GONZALEZ", "years": 22, "position": "Pastor", "cat": "Presidencia", "pin": "8576"}, {"id": "49", "name": "FERNANDO  ROSA ESPINAL", "years": 6, "position": "Pastor", "cat": "Presidencia", "pin": "8713"}, {"id": "50", "name": "JEANNEMARIE  SAINT-FLEUR", "years": 22, "position": "Departamental", "cat": "Presidencia", "pin": "8850"}, {"id": "51", "name": "DORIAN XAVIER SANTANA SANTANA", "years": 15, "position": "Pastor", "cat": "Presidencia", "pin": "8987"}, {"id": "52", "name": "JUAN ONASIS SANTANA SANTOS", "years": 8, "position": "Pastor", "cat": "Presidencia", "pin": "9124"}, {"id": "53", "name": "RAFAEL  SANTILLAN", "years": 26, "position": "Pastor", "cat": "Presidencia", "pin": "9261"}, {"id": "54", "name": "SADO  SIMO TEJEDA", "years": 1, "position": "Pastor", "cat": "Presidencia", "pin": "9398"}, {"id": "55", "name": "YUNIOR  SOLANO", "years": 0, "position": "Personal de Oficina", "cat": "Secretar\u00eda", "pin": "9535"}, {"id": "56", "name": "ANGEL FRANCISCO SOSA BERROA", "years": 32, "position": "Pastor", "cat": "Presidencia", "pin": "9672"}, {"id": "57", "name": "GREGORIO  TIBURCIO DE LOS SANTOS", "years": 34, "position": "Pastor", "cat": "Presidencia", "pin": "9809"}, {"id": "58", "name": "ALEX  VAN SAINT PHAT", "years": 4, "position": "Pastor", "cat": "Presidencia", "pin": "9946"}, {"id": "59", "name": "MISAEL  VIZCAINO PADILLA", "years": 16, "position": "Pastor", "cat": "Presidencia", "pin": "1083"}, {"id": "60", "name": "JAVIER  ZORRILLA MEDINA", "years": 9, "position": "Pastor", "cat": "Presidencia", "pin": "1220"}],

  async init() {
    console.log("🛠️ Inicializando Estado ADE...");
    this.user = null; // Forza login siempre
    this.saveSession(); // Limpia rastros
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
    // Limpiamos el username ingresado (quitar espacios y a minúsculas)
    const loginUser = username.trim().toLowerCase().replace(/\s+/g, '');

    // 1. Validación Institucional por Nombre (Primer Nombre + Primer Apellido) o Email
    const emp = this.employeesList.find(e => {
        const pinMatch = (e.pin === password);
        
        // Generar "Slug" del nombre real: Ej "Juan Francisco Morillo" -> "juanmorillo"
        const nameParts = (e.name || "").trim().split(/\s+/);
        // El primer apellido suele ser la tercera parte si hay dos nombres, o la segunda si hay uno.
        // Simplificación: Buscamos el primer nombre y el primer apellido real (asumiendo formato estándar)
        // Pero para ser SEGUROS con el usuario, comparamos el slug de sus dos primeras palabras significativas
        const firstName = nameParts[0] || "";
        const firstSurname = nameParts[2] || nameParts[1] || ""; // Si hay 2 nombres, el apellido es el 3ro.
        const slug = (firstName + firstSurname).toLowerCase();

        const userMatch = (
            slug === loginUser || 
            (e.name && e.name.toLowerCase().replace(/\s+/g, '') === loginUser) ||
            (e.email && e.email.toLowerCase() === username.toLowerCase())
        );
        return pinMatch && userMatch;
    });

    if (emp) {
        // Asignación de Roles Institucionales (Poderes Especiales)
        let role = 'employee';
        let permissions = [];
        let supervisorDept = emp.cat;
        let empSupervisor = emp.cat;

        if (emp.id === "17") { // Junior Feliz: Secretaría + RRHH
            role = 'manager';
            permissions = ['manager', 'hr'];
            supervisorDept = 'Secretaría';
            empSupervisor = 'Presidencia'; // Solicita autorización al Presidente
        } else if (emp.id === "42") { // Geuris Paulino: Presidencia
            role = 'manager';
            permissions = ['manager'];
            supervisorDept = 'Presidencia';
            empSupervisor = 'Tesorería'; // Solicita autorización a la Tesorera (Control de Auditoría)
        } else if (emp.id === "35") { // Leidy Martinez: Tesorería
            role = 'manager';
            permissions = ['manager'];
            supervisorDept = 'Tesorería';
            empSupervisor = 'Presidencia'; // Solicita autorización al Presidente
        } else if (emp.id === "23") { // Ana Mercedes: Asistente RRHH
            role = 'assistant';
            permissions = ['assistant'];
            supervisorDept = 'RRHH';
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
            evangelismoDays: 0, // Fallback
            remainingWeeks: this.getWeeksByServiceYears(emp.years),
            remainingDays: this.getWeeksByServiceYears(emp.years) * 7,
            fullWeeksPerYear: this.getWeeksByServiceYears(emp.years),
            photo: null
        };
        
        // 90. Cargar datos persistentes de Firestore si existen
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

    // 2. Si no es un usuario del Excel, probar con los mocks originales
    const supervisor = this.supervisors[username] || Object.values(this.supervisors).find(s => s.email === username);
    if (supervisor && (password === supervisor.password || password === supervisor.pin)) {
        const isHR = username === 'dominicanaeste@gmail.com' || supervisor.email === 'dominicanaeste@gmail.com';
        this.user = {
            ...supervisor,
            role: isHR ? 'hr' : 'manager',
            permissions: isHR ? ['hr'] : ['manager'],
            remainingDays: supervisor.remainingDays || 0,
            remainingWeeks: supervisor.remainingWeeks || 0,
            fullWeeksPerYear: supervisor.fullWeeksPerYear || 0,
            yearsOfService: supervisor.yearsOfService || 0,
            position: supervisor.position || (isHR ? 'Recursos Humanos' : 'Director')
        };
        this.saveSession();
        return this.user;
    }
    
    // 3. Empleado de prueba genérico
    if (username === "empleado@ade.com" && password === "123") {
      this.user = { id: 'emp_001', name: "Oficial de Prueba ADE", role: 'employee', remainingDays: 15, remainingWeeks: 3, yearsOfService: 10, position: 'Personal DeOficina', supervisor: 'Secretaría' };
      this.saveSession();
      return this.user;
    }
    return null;
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
          
          // Sincronización crucial si somos nosotros
          if (this.user && this.user.id == doc.id) {
            this.user.photo = data.photo || this.user.photo;
            this.user.remainingDays = data.remainingDays !== undefined ? data.remainingDays : this.user.remainingDays;
            this.saveSession();
          }
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
            // 1. Si tiene evangelismo, los 10 días se restan del total del periodo (no consumen cuota).
            // 2. Los feriados NO se descuentan del balance anual (son beneficio libre).
            const isEvangelismo = req.evangelismoTaken === true;
            const feriados = this.getHolidaysInRange(req.startDate, req.endDate);
            
            let daysToDiscount = isEvangelismo ? Math.max(0, requestedTotal - 10) : requestedTotal;
            daysToDiscount = Math.max(0, daysToDiscount - feriados);

            await empRef.update({
                remainingDays: Math.max(0, currentDays - daysToDiscount)
            });
            // Actualizar el estado local si es el usuario logueado
            if (this.user && (this.user.id === eId || this.user.id == eId)) {
                this.user.remainingDays = Math.max(0, currentDays - daysToDiscount);
            }
        }
        
        // Notificar por correo (Requerimiento Asistente RRHH)
        this.sendEmailNotification(
            'dominicanaeste@gmail.com',
            `SOLICITUD AUTORIZADA: ${req.employeeName}`,
            `La solicitud de ${req.employeeName} para el periodo ${req.startDate} al ${req.endDate} ha sido autorizada digitalmente por todos los responsables.`
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

      const isEvangelismo = req.evangelismoTaken === true;
      const feriados = this.getHolidaysInRange(req.startDate, req.endDate);
      
      let daysToReturn = isEvangelismo ? Math.max(0, periodTotal - 10) : periodTotal;
      daysToReturn = Math.max(0, daysToReturn - feriados);

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

  async submitConflicto(data) {
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    const docRef = await this.db.collection('conflict_declarations').add(data);
    return docRef.id;
  },

  async deleteConflictDeclaration(id) {
    if (!this.db) return;
    await this.db.collection('conflict_declarations').doc(id).delete();
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

