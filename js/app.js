// Version 1.0.2
//-- CONFIGURACIÓN PARA CORREOS REALES (EMAILJS) ---
 // RegRegísttraen EmailJS.com y pega tus llaves aquí para activar)
const EMAILJS_PUBLIC_KEY = "cYGageOHAP7kjfc1y"; // Pega tu Public Key aquí
const EMAILJS_SERVICE_ID = "service_wfa4jee"; // Pega tu Service ID aquí
const EMAILJS_TEMPLATE_ID = "template_9cfjmjf"; // Pega tu Template ID aquí

// --- CONFIGURACIÓN GOOGLE DRIVE (ARCHIVO OFICIAL) ---
const DRIVE_CLIENT_ID = ""; // Se requiere Client ID de Google Cloud
const DRIVE_SCOPES = "https://www.googleapis.com/auth/drive.file"; 
let tokenClient;
let gapiInited = false;
let gisInited = false;

const app = {
  activeView: 'login', // Iniciar en el nuevo login
  currentRole: 'employee',
  deferredPrompt: null, // Guardar evento de instalación PWA
  currentFilter: 'All',
  currentAuditYear: new Date().getFullYear(),
  isSubmitting: false,
  currentCalendarDate: new Date(),
  holidays: {
    // Feriados República Dominicana 2026 (Oficial Ministerio de Trabajo)
    '1/1/2026': 'Año Nuevo',
    '5/1/2026': 'Día de Reyes (Movido del 6)',
    '21/1/2026': 'Nuestra Sra. de la Altagracia',
    '26/1/2026': 'Día de Duarte',
    '27/2/2026': 'Día de la Independencia',
    '3/4/2026': 'Viernes Santo',
    '4/5/2026': 'Día del Trabajo (Movido del 1)',
    '4/6/2026': 'Corpus Christi',
    '16/8/2026': 'Día de la Restauración',
    '24/9/2026': 'Nuestra Sra. de las Mercedes',
    '9/11/2026': 'Día de la Constitución (Movido del 6)',
    '25/12/2026': 'Día de Navidad',

    // Feriados República Dominicana 2025 (Oficial Ministerio de Trabajo)
    '1/1/2025': 'Año Nuevo',
    '6/1/2025': 'Día de Reyes',
    '21/1/2025': 'Nuestra Sra. de la Altagracia',
    '26/1/2025': 'Natalicio de Duarte',
    '27/2/2025': 'Día de la Independencia',
    '18/4/2025': 'Viernes Santo',
    '5/5/2025': 'Día del Trabajo (Movido del 1)',
    '19/6/2025': 'Corpus Christi',
    '16/8/2025': 'Día de la Restauración',
    '24/9/2025': 'Nuestra Sra. de las Mercedes',
    '10/11/2025': 'Día de la Constitución (Movido del 6)',
    '25/12/2025': 'Día de Navidad'
  },

  getHolidayInfo: function(start, end) {
    let count = 0; let names = []; 
    let d = new Date(start + 'T00:00:00'); // Asegurar zona horaria local
    const e = new Date(end + 'T00:00:00');
    
    while(d <= e) {
        const k = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        if(this.holidays[k]) { 
            count++; 
            names.push(this.holidays[k]); 
        }
        d.setDate(d.getDate() + 1);
    }
    return { count, names };
  },

  // Datos institucionales para la simulación
  supervisorEmails: {
    'Presidencia': 'gdpaulino@gmail.com',
    'Secretaría': 'prjuniorfeliz@gmail.com',
    'Tesorería': 'leidymartinez988@gmail.com',
    'RRHH': 'dominicanaeste@gmail.com'
  },

  views: {
    login: () => {
        // Absolute path to the generated background image
        const bgUrl = "file:///Users/secretariaejecutiva/.gemini/antigravity/brain/6a12dfdb-f516-4e2f-be75-d9d4c405a8a0/ade_login_background_1774050147914.png";
        
        return `
            <div style="height: 100vh; display: flex; align-items: center; justify-content: center; background: url('${bgUrl}') center/cover no-repeat; position: fixed; inset: 0; z-index: 10000; font-family: 'Inter', sans-serif;">
                <!-- Fullscreen Overlay for Depth -->
                <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.7));"></div>
                
                <div class="card fade-in glass" style="width: 100%; max-width: 440px; padding: 56px; text-align: center; border: 1px solid rgba(255, 255, 255, 0.2); position: relative; box-shadow: 0 40px 100px rgba(0,0,0,0.5); background: rgba(255,255,255,0.06) !important; border-radius: 32px;">
                    
                    <!-- Institutional Logo (Circular Image) -->
                    <div style="width: 120px; height: 120px; background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 50%; padding: 8px; margin: 0 auto 32px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); transform: translateY(-10px); border: 1px solid rgba(255,255,255,0.2);">
                        <div style="width: 100%; height: 100%; background: white; border-radius: 50%; overflow: hidden;">
                            <img src="assets/Logo_Iglesia.jpeg" alt="ADE" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>

                    <h1 style="font-family: 'Outfit', sans-serif; font-size: 1.6rem; font-weight: 800; color: white; margin-bottom: 8px; letter-spacing: 0.05rem;">ASOCIACIÓN DOMINICANA DEL ESTE</h1>
                    <p style="color: var(--secondary); font-size: 1.3rem; font-weight: 800; margin-bottom: 48px; letter-spacing: 0.1rem; text-transform: uppercase;">ADE app</p>
                    
                    <form onsubmit="app.handleLogin(event)" style="text-align: left;">
                        <div style="margin-bottom: 28px;">
                            <label style="display: block; font-size: 0.75rem; font-weight: 800; color: var(--secondary); text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.15em;">Nombre de Usuario</label>
                            <input type="text" id="login_user" placeholder="Nombre y Apellido" required 
                                   style="width: 100%; padding: 16px 20px; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255, 255, 255, 0.1); border-radius: 16px; outline: none; color: white; font-size: 1rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
                        </div>
                        <div style="margin-bottom: 48px;">
                            <label style="display: block; font-size: 0.75rem; font-weight: 800; color: var(--secondary); text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.15em;">PIN Institucional</label>
                            <input type="password" id="login_pass" placeholder="••••••••" required 
                                   style="width: 100%; padding: 16px 20px; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255, 255, 255, 0.1); border-radius: 16px; outline: none; color: white; font-size: 1rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
                        </div>
                        
                        <button type="submit" class="btn" 
                                style="width: 100%; padding: 20px; font-weight: 800; border-radius: 18px; background: linear-gradient(135deg, var(--secondary) 0%, #f59e0b 100%); color: var(--primary); font-size: 1.15rem; box-shadow: 0 20px 40px rgba(250, 169, 45, 0.3); border: none; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.05em;">
                            Acceder al Sistema
                        </button>
                    </form>

                    ${app.deferredPrompt ? `
                    <div id="pwa-install-banner" class="fade-in" style="margin-top: 32px; padding: 20px; background: rgba(255,255,255,0.1); border: 1px dashed var(--secondary); border-radius: 20px; display: flex; align-items: center; gap: 15px; cursor: pointer;" onclick="app.installPWA()">
                        <div style="width: 48px; height: 48px; background: var(--secondary); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                            <span class="material-symbols-outlined" style="color: var(--primary); font-size: 24px;">download</span>
                        </div>
                        <div style="text-align: left;">
                            <p style="color: white; font-size: 0.85rem; font-weight: 800; margin: 0;">INSTALAR APLICACIÓN</p>
                            <p style="color: rgba(255,255,255,0.6); font-size: 0.7rem; margin: 2px 0 0;">Acceso directo en tu pantalla</p>
                        </div>
                    </div>
                    ` : ''}
                    
                    <p style="margin-top: 40px; color: rgba(255, 255, 255, 0.4); font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">© 2026 Asociación Dominicana del Este</p>
                </div>

                <style>
                    /* Specific styles for the login hover effects */
                    #login_email:focus, #login_pass:focus {
                        border-color: var(--secondary) !important;
                        background: rgba(255,255,255,0.1) !important;
                        box-shadow: 0 0 20px rgba(250, 169, 45, 0.15) !important;
                        transform: translateY(-2px);
                    }
                    .btn:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 25px 50px rgba(250, 169, 45, 0.5) !important;
                        opacity: 1 !important;
                    }
                    .btn:active {
                        transform: scale(0.97);
                    }
                </style>
            </div>
        `;
    },

    dashboard: () => {
      const stats = (state.vacationRequests || []).filter(r => r.status === 'pending').length;
      // Cálculo dinámico de semanas
      const totalDays = state.user.remainingDays || 0;
      const weeksAvailable = Math.floor(totalDays / 7);
      const remainingDaysTotal = totalDays % 7;

      return `
        <header class="fade-in" style="margin-bottom: 32px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h1 style="font-size: 1.8rem; font-weight: 800; color: var(--primary);">Bienvenido, ${(state.user.name || 'Usuario').split(' ')[0]}</h1>
                        <p style="color: var(--text-muted); font-weight: 500;">Aquí tienes un resumen de tus solicitudes.</p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn" style="background: white; border: 1.5px solid #e2e8f0; color: var(--text-muted); padding: 8px 12px; font-weight: 700; font-size: 0.75rem;" onclick="app.showChangePinModal()">
                            <span class="material-symbols-outlined" style="font-size: 1.1rem;">lock_reset</span> Cambiar PIN
                        </button>
                        <button class="logout-btn-header" onclick="app.logout()">Cerrar Sesión</button>
                    </div>
                </div>
        </header>

        ${(() => {
            const fiveDaysAgo = new Date();
            fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
            const recent = (state.conflictDeclarations || []).filter(d => {
                const date = d.createdAt ? (d.createdAt.seconds ? new Date(d.createdAt.seconds * 1000) : new Date(d.createdAt)) : new Date();
                const isMine = d.userId === state.user.id || d.idEmpleado === state.user.id || d.employeeId === state.user.id;
                const isInstitutionalUser = (state.user.role === 'assistant' || state.user.role === 'hr') || (state.user.permissions && (state.user.permissions.includes('hr') || state.user.permissions.includes('assistant')));
                return date >= fiveDaysAgo && (isMine || isInstitutionalUser);
            });
            if (recent.length === 0) return '';
            return `
                <div class="card fade-in" style="margin-bottom: 24px; border-left: 5px solid #be185d; background: #fff1f2;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h3 style="font-size: 0.85rem; color: #9d174d; margin: 0; display: flex; align-items: center; gap: 8px;">
                            <span class="material-symbols-outlined">notifications_active</span>
                            🔔 Notificaciones Recientes (Últimos 5 días)
                        </h3>
                        ${recent.length > 1 && (state.user.role === 'assistant' || (state.user.permissions && state.user.permissions.includes('hr'))) ? `
                            <button class="btn" style="padding: 2px 10px; font-size: 0.65rem; background: white; color: #be185d; border: 1px solid #be185d;" onclick="app.downloadConflictBatch()">Descargar Todo</button>
                        ` : ''}
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px;">
                        ${recent.map(r => `
                            <div style="background: white; padding: 10px; border-radius: 8px; border: 1px solid #fecaca; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <p style="font-size: 0.8rem; font-weight: 700; margin: 0;">${r.employeeName}</p>
                                    <p style="font-size: 0.65rem; color: #9d174d; margin: 2px 0;">Declaración Conflicto ${r.year} Registrada</p>
                                </div>
                                <button class="btn" style="padding: 4px 8px; font-size: 0.6rem; background: #be185d; color: white;" onclick="app.downloadIndividualConflictoPDF('${r.id}')">PDF</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        })()}

        <!-- Stats Grid -->
        <div class="stat-grid fade-in">
            <div class="stat-card" style="border-left-color: var(--primary);">
                <h3>Días de Ciclo</h3>
                <div class="value">${((state.user.fullWeeksPerYear || 0) * 7).toString().padStart(2, '0')}</div>
                <p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">Asignación Reglamentaria 2026</p>
            </div>
            <div class="stat-card" style="border-left-color: var(--tertiary);">
                <h3>Días Restantes</h3>
                <div class="value">${(state.user.remainingDays || 0).toString().padStart(2, '0')}</div>
                <p style="font-size: 0.7rem; color: var(--tertiary); margin-top: 4px;">Balance oficial institucional</p>
            </div>
            ${(state.user && state.user.permissions && state.user.permissions.length > 0 || (state.user && state.user.role !== 'employee')) ? `
            <div class="stat-card" style="border-left-color: var(--secondary);">
                <h3>Solicitudes por Aprobar</h3>
                <div class="value">${((state.vacationRequests || []).filter(r => (r.status === 'pending' && r.supervisor === state.user.name) || (r.status === 'pending_hr' && state.user.permissions && state.user.permissions.includes('hr'))).length).toString().padStart(2, '0')}</div>
                <p style="font-size: 0.7rem; color: var(--secondary); margin-top: 4px;">Pendientes de su firma</p>
            </div>
            ` : ''}
            <div class="stat-card" style="background: var(--primary); color: white; border-left: none; position: relative; overflow: hidden;">
                <h3 style="color: rgba(255,255,255,0.7);">AÑOS DE SERVICIO</h3>
                <div class="value" style="color: var(--secondary); font-size: 1.5rem;">${state.user.yearsOfService || 0} Años</div>
                <p style="font-size: 0.8rem; color: #ffffff; font-weight: 800; margin-top: 4px;">Reglamento UD: ${state.getWeeksByServiceYears(state.user.yearsOfService || 0) * 7} Días</p>
                <span class="material-symbols-outlined" style="position: absolute; bottom: -10px; right: -10px; font-size: 80px; opacity: 0.1;">workspace_premium</span>
            </div>
        </div>

        <div style="margin-bottom: 24px; display: flex; gap: 16px;">
            <button class="btn fade-in" style="flex: 1; justify-content: center; background: var(--secondary); color: white; border: none; padding: 16px; font-size: 0.9rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); font-weight: 800;" onclick="app.navigate('annual_plan_form')">
                <span class="material-symbols-outlined" style="font-size: 1.2rem;">event_note</span> PLANIFICACIÓN ANUAL DE VACACIONES
            </button>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                <button class="btn fade-in" style="width: 100%; justify-content: center; background: #be185d; color: white; border: none; padding: 16px; font-size: 0.9rem; border-radius: 12px; box-shadow: 0 4px 14px -4px rgba(190, 24, 93, 0.4); font-weight: 800;" onclick="app.navigate('conflicto_form')">
                    <span class="material-symbols-outlined" style="font-size: 1.2rem;">balance</span> DECLARACIÓN CONFLICTO
                </button>
            </div>
        </div>

        <div class="dashboard-content-grid fade-in">
            <!-- Left Column: Calendar (Priority) -->
            <section class="card" style="display: flex; flex-direction: column;">
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 800; font-size: 0.9rem; letter-spacing: 0.1em; color: var(--primary);">${new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(app.currentCalendarDate).toUpperCase()}</span>
                        <div style="display: flex; gap: 4px;">
                            <button class="btn" style="padding: 4px; background: #f1f5f9; min-width: auto; height: 32px;" onclick="app.changeMonth(-1, event)"><span class="material-symbols-outlined" style="font-size: 1rem;">chevron_left</span></button>
                            <button class="btn" style="padding: 4px; background: #f1f5f9; min-width: auto; height: 32px;" onclick="app.changeMonth(1, event)"><span class="material-symbols-outlined" style="font-size: 1rem;">chevron_right</span></button>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end; gap: 4px;">
                        <button class="btn" style="padding: 2px 8px; font-size: 0.65rem; background: #f1f5f9; min-width: auto;" onclick="app.changeYear(-1, event)">Año Anterior</button>
                        <button class="btn" style="padding: 2px 8px; font-size: 0.65rem; background: #f1f5f9; min-width: auto;" onclick="app.changeYear(1, event)">Año Próximo</button>
                    </div>
                </div>
                
                <div class="calendar-grid">
                    <div class="calendar-header">DO</div><div class="calendar-header">LU</div><div class="calendar-header">MA</div><div class="calendar-header">MI</div><div class="calendar-header">JU</div><div class="calendar-header">VI</div><div class="calendar-header">SA</div>
                    ${(() => {
                        const year = app.currentCalendarDate.getFullYear();
                        const month = app.currentCalendarDate.getMonth();
                        const firstDay = new Date(year, month, 1).getDay();
                        const daysInMonth = new Date(year, month + 1, 0).getDate();
                        const today = new Date();
                        today.setHours(0,0,0,0);
                        const holidays = {'1/1':'Año Nuevo','6/1':'Día de Reyes','21/1':'Altagracia','26/1':'Duarte','27/2':'Independencia','1/5':'Trabajo','16/8':'Restauración','24/9':'Mercedes','6/11':'Constitución','25/12':'Navidad'};
                        
                        let slots = [];
                        for (let i = 0; i < firstDay; i++) slots.push('<div class="calendar-day empty"></div>');
                        for (let d = 1; d <= daysInMonth; d++) {
                            const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
                            const hKey = `${d}/${month + 1}`;
                            const current = new Date(year, month, d, 0, 0, 0); // Local Midnight
                            
                            const myVacation = (state.vacationRequests || []).find(r => {
                                const start = new Date(r.startDate + 'T00:00:00'); 
                                const end = new Date(r.endDate + 'T00:00:00');
                                const empId = r.employeeId || r.idEmpleado || r.userId;
                                const isMine = String(empId) === String(state.user.id);
                                return current >= start && current <= end && isMine;
                            });
                            
                            const othersVacation = (state.vacationRequests || []).find(r => {
                                const start = new Date(r.startDate + 'T00:00:00'); 
                                const end = new Date(r.endDate + 'T00:00:00');
                                const empId = r.employeeId || r.idEmpleado || r.userId;
                                const isMine = String(empId) === String(state.user.id);
                                const isDept = r.supervisor === state.user.name || r.supervisor === state.user.supervisorDept || (state.user.permissions && state.user.permissions.includes('hr'));
                                // Solo mostramos solicitudes en curso (aprobadas o pendientes de revisión)
                                return current >= start && current <= end && !isMine && isDept && r.status !== 'rejected';
                            });

                            let bgColor = ''; let textColor = ''; let classList = [];
                            if (isToday) classList.push('day-active');
                            
                            if (myVacation) {
                                classList.push('day-vacation-personal');
                                bgColor = myVacation.status === 'approved' ? 'var(--tertiary)' : '#fef08a';
                                textColor = myVacation.status === 'approved' ? 'white' : 'var(--primary)';
                            } else if (othersVacation) {
                                classList.push('day-vacation-dept');
                                bgColor = '#dcfce7'; textColor = '#166534';
                            } else if (holidays[hKey]) {
                                classList.push('day-holiday');
                                bgColor = '#ffedd5'; textColor = '#9a3412';
                            }
                            
                            slots.push(`
                                <div class="calendar-day ${classList.join(' ')}" 
                                     style="${bgColor ? `background: ${bgColor}; color: ${textColor}; cursor: pointer;` : ''}"
                                     onclick="app.showDayDetails(${d}, ${month}, ${year})">
                                    ${d}
                                    ${myVacation && myVacation.status === 'pending' ? '<span style="font-size: 8px; position: absolute; bottom: 2px;">⏳</span>' : ''}
                                </div>
                            `);
                        }
                        return slots.join('');
                    })()}
                </div>
                
                <div style="margin-top: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.7rem;">
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--primary);"></span><span>Hoy</span></div>
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="width: 10px; height: 10px; border-radius: 50%; background: var(--tertiary);"></span><span>Mías (Aprobado)</span></div>
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #fef08a; border: 1px solid #eab308;"></span><span>Mías (Pendiente)</span></div>
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #dcfce7; border: 1px solid #15803d;"></span><span>Equipo / Otros</span></div>
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #ffedd5; border: 1px solid #9a3412;"></span><span>Feriado UD</span></div>
                </div>
            </section>

            <!-- Right Column: Actions and Lists -->
            <div style="display: flex; flex-direction: column; gap: 32px;">
                <!-- Quick Actions Section -->
                <section class="card" style="border: none; background: transparent; padding: 0; margin-bottom: 32px;">
                    <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.3rem; color: var(--primary); margin-bottom: 24px; display: flex; align-items: center; gap: 12px; font-weight: 800;">
                        <span class="material-symbols-outlined" style="background: var(--primary); color: white; padding: 8px; border-radius: 12px; font-size: 1.4rem;">rocket_launch</span>
                        Accesos Rápidos de Gestión
                    </h2>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
                        <!-- Vacation Card -->
                        <div class="action-card-premium" onclick="app.navigate('form', event)" style="border-left: 6px solid var(--primary);">
                            <div class="icon-box" style="background: rgba(47, 85, 127, 0.1); color: var(--primary);">
                                <span class="material-symbols-outlined" style="font-size: 2rem;">calendar_add_on</span>
                            </div>
                            <div style="flex: 1;">
                                <h4 style="margin: 0; font-size: 1rem; font-weight: 800; color: var(--primary); line-height: 1.2;">Solicitar Vacaciones</h4>
                                <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">Inicia un nuevo proceso de descanso reglamentario.</p>
                            </div>
                            <span class="material-symbols-outlined" style="color: #cbd5e1;">chevron_right</span>
                        </div>

                        <!-- Medical License Card -->
                        <div class="action-card-premium" onclick="app.requestLicense('Médica')" style="border-left: 6px solid #10b981;">
                            <div class="icon-box" style="background: rgba(16, 185, 129, 0.1); color: #059669;">
                                <span class="material-symbols-outlined" style="font-size: 2rem;">medical_services</span>
                            </div>
                            <div style="flex: 1;">
                                <h4 style="margin: 0; font-size: 1rem; font-weight: 800; color: #059669; line-height: 1.2;">Licencia Médica</h4>
                                <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">Reporta reposo de salud con certificado oficial.</p>
                            </div>
                            <span class="material-symbols-outlined" style="color: #cbd5e1;">chevron_right</span>
                        </div>

                        <!-- Special Licenses (Grid) -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <div class="action-card-premium mini" onclick="app.requestLicense('Casamiento')" style="background: #fff1f2; border: 1px solid #fecaca; flex-direction: column; text-align: center; justify-content: center; gap: 8px;">
                                <span class="material-symbols-outlined" style="color: #be123c; font-size: 1.5rem;">favorite</span>
                                <span style="font-weight: 800; font-size: 0.8rem; color: #be123c;">Casamiento (5d)</span>
                            </div>
                            <div class="action-card-premium mini" onclick="app.requestLicense('Fallecimiento')" style="background: #f8fafc; border: 1px solid #e2e8f0; flex-direction: column; text-align: center; justify-content: center; gap: 8px;">
                                <span class="material-symbols-outlined" style="color: #475569; font-size: 1.5rem;">person_off</span>
                                <span style="font-weight: 800; font-size: 0.8rem; color: #475569;">Fallecimiento (3d)</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="card">
                    <h2 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 20px; font-weight: 800;">Mis Solicitudes Personales</h2>
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                        <thead><tr style="text-align: left; border-bottom: 2px solid #f1f5f9; color: var(--text-muted);"><th style="padding: 12px 0;">Licencia</th><th style="padding: 12px 0;">Días</th><th style="padding: 12px 0; text-align: center;">Estatus</th></tr></thead>
                        <tbody>
                            ${(state.vacationRequests || []).filter(r => r.idEmpleado === state.user.id || r.userId === state.user.id).map(req => `
                                <tr style="border-bottom: 1px solid #f8fafc;">
                                    <td style="padding: 16px 0;"><p style="font-weight: 700; color: var(--primary);">${req.category || 'Local'}</p><p style="font-size: 0.7rem; color: var(--text-muted);">${req.startDate} - ${req.endDate}</p></td>
                                    <td style="padding: 16px 0;">${req.duration}</td>
                                    <td style="padding: 16px 0; text-align: center;"><span class="badge badge-${req.status}">${app.translateStatus(req.status)}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </section>

                <style>
                    .action-card-premium {
                        background: white;
                        padding: 24px;
                        border-radius: 24px;
                        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                        display: flex;
                        align-items: center;
                        gap: 20px;
                        cursor: pointer;
                        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        border: 1px solid #f1f5f9;
                    }
                    .action-card-premium:hover {
                        transform: translateY(-5px) scale(1.01);
                        box-shadow: 0 25px 30px -10px rgba(0,0,0,0.08);
                        border-color: var(--primary);
                    }
                    .action-card-premium.mini:hover {
                        background: white !important;
                    }
                    .icon-box {
                        width: 60px;
                        height: 60px;
                        border-radius: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                </style>
            </div>
        </div>
      `;
    },
    
    manager: () => {
      const roleName = state.user.supervisorDept || state.user.name;
      const pending = (state.vacationRequests || []).filter(r => r.status === 'pending' && r.supervisor === roleName);
      
      return `
        <header class="fade-in" style="margin-bottom: 32px;">
             <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                <div>
                        <h1 style="font-size: 1.8rem; font-weight: 800; color: var(--primary);">Panel de Administrador</h1>
                        <p style="color: var(--text-muted); font-weight: 500;">Gestión de solicitudes para: <span style="color: var(--secondary); font-weight: 800;">${roleName.toUpperCase()}</span></p>
                    </div>
                    <div style="display: flex; gap: 12px; align-items: center;">
                        ${state.user.permissions.includes('hr') ? `
                            <button class="btn" style="background: #166534; color: white;" onclick="app.exportAuditPDF(2026)">
                                <span class="material-symbols-outlined">description</span>
                                Reporte 60 Empleados
                            </button>
                            <button class="btn" style="background: var(--primary); color: white;" onclick="app.navigate('hr')">
                                <span class="material-symbols-outlined">badge</span>
                                Ir a RRHH
                            </button>
                        ` : ''}
                        <button class="logout-btn-header" onclick="app.logout()">Cerrar Sesión</button>
                    </div>
            </div>
        </header>

        <!-- CRONO MOVIMIENTOS (INSTITUCIONAL) - PRIORIDAD ALTA -->
        <section class="card fade-in" style="margin-bottom: 32px; background: white; padding: 0; overflow: hidden; border: 1px solid #e2e8f0; border-top: 5px solid #0891b2;">
            <div style="padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.4rem; font-weight: 800; color: #0891b2; margin: 0;">🌍 Control Cronológico - Nivel Institucional</h3>
                <span class="badge" style="background: #ecfeff; color: #0e7490; font-weight: 800;">TODOS LOS MOVIMIENTOS</span>
            </div>
            <div style="overflow-x: auto; max-height: 400px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                    <thead style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                         <tr style="text-align: left;">
                            <th style="padding: 16px; font-weight: 800; color: #64748b;">Colaborador</th>
                            <th style="padding: 16px; font-weight: 800; color: #64748b;">Salida</th>
                            <th style="padding: 16px; font-weight: 800; color: #64748b;">Regreso</th>
                            <th style="padding: 16px; font-weight: 800; color: #64748b; text-align: center;">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(() => {
                            const approved = (state.vacationRequests || []).filter(r => r.status === 'approved');
                            const sorted = approved.sort((a,b) => new Date(a.startDate) - new Date(b.startDate));
                            const today = new Date().toISOString().split('T')[0];
                            
                            if (sorted.length === 0) return '<tr><td colspan="4" style="text-align:center; padding:32px; color:#64748b;">No hay movimientos aprobados registrados aún.</td></tr>';
                            
                            return sorted.map(r => `
                            <tr style="border-bottom: 1px solid #f1f5f9;">
                                <td style="padding: 16px; font-weight: 700; color: #1e3a8a;">${r.employeeName}</td>
                                <td style="padding: 16px; font-weight: 800; color: #0891b2;">${r.startDate}</td>
                                <td style="padding: 16px; font-weight: 800; color: #0d9488;">${r.endDate}</td>
                                <td style="padding: 16px; text-align: center;">
                                    ${r.startDate > today ? 
                                        `<span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 999px; font-size: 0.65rem; font-weight: 800;">PROGRAMADO</span>` : 
                                        (r.endDate >= today ? 
                                            `<span style="background: #f0fdf4; color: #166534; padding: 4px 10px; border-radius: 999px; font-size: 0.65rem; font-weight: 800;">EN CURSO</span>` :
                                            `<span style="background: #f1f5f9; color: #64748b; padding: 4px 10px; border-radius: 999px; font-size: 0.65rem; font-weight: 800;">COMPLETADO</span>`
                                        )
                                    }
                                </td>
                            </tr>
                            `).join('');
                        })()}
                    </tbody>
                </table>
            </div>
        </section>

        <section class="card fade-in">
            <h2 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 20px;">Solicitudes por Revisar en ${roleName}</h2>
            <div style="display: flex; flex-direction: column; gap: 24px;">
                ${pending.map(req => `
                    <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                            <div>
                                <h3 style="color: var(--primary);">${req.employeeName}</h3>
                                <p style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">${req.category.toUpperCase()} • ${req.duration} d • ${app.translateStatus(req.status)}</p>
                                <p style="font-size: 0.75rem; color: #64748b;">${req.startDate} a ${req.endDate}</p>
                                ${(() => {
                                    const h = app.getHolidayInfo(req.startDate, req.endDate);
                                    return h.count > 0 ? `<p style="margin-top: 5px; font-size: 0.7rem; color: #ef4444; font-weight: 700;">🌟 Incluye Feriado: ${h.names.join(', ')} (+${h.count} días fuera)</p>` : '';
                                })()}
                                ${(() => {
                                    if (state.user.supervisorDept !== 'Presidencia') return '';
                                    if (req.category !== 'Evangelismo' && req.evangelismoTaken !== true) return '';
                                    const currYear = new Date().getFullYear();
                                    const hasEvan = (state.vacationRequests || []).some(r => r.employeeName === req.employeeName && (r.category === 'Evangelismo' || r.evangelismoTaken) && r.status === 'approved' && new Date(r.startDate).getFullYear() === currYear);
                                    if (hasEvan) {
                                        return `<p style="margin-top: 8px; font-size: 0.75rem; color: #b91c1c; font-weight: 800; background: #fee2e2; padding: 6px; border-radius: 6px; border: 1px solid #fca5a5; display: inline-block;">⚠️ ALERTA: ${req.employeeName} YA TOMÓ sus 10 días de Evangelismo en este año.</p>`;
                                    } else {
                                        return `<p style="margin-top: 8px; font-size: 0.75rem; color: #15803d; font-weight: 800; background: #dcfce7; padding: 6px; border-radius: 6px; border: 1px solid #bbf7d0; display: inline-block;">✅ ${req.employeeName} aún no ha tomado Evangelismo este año.</p>`;
                                    }
                                })()}
                                ${req.attachment ? `
                                    <button class="btn" style="margin-top: 8px; padding: 6px 12px; font-size: 0.7rem; background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;" 
                                            onclick="window.open('${req.attachment}', '_blank')">
                                        📄 Ver Certificado Adjunto
                                    </button>
                                ` : ''}
                            </div>
                            <div style="text-align: right;">
                                <p style="font-size: 0.7rem; color: var(--text-muted);">Solicitante:</p>
                                <img src="${req.signatures.applicant}" class="signature-img" style="border: 1px solid #eee; background: white;">
                            </div>
                        </div>
                        
                        ${req.category === 'Evangelismo' && state.user.name.includes('Geuris') ? `
                        <div style="background: #eff6ff; padding: 16px; border-radius: 8px; border: 1px solid #bfdbfe; margin-bottom: 20px;">
                             <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="checkbox" id="presidential_confirm_${req.id}" checked style="width: 20px; height: 20px;">
                                <label for="presidential_confirm_${req.id}" style="font-weight: 800; color: #1e40af; font-size: 0.8rem;">
                                    ✅ CONFIRMACIÓN PRESIDENCIAL: Autorizo estos 10 días de Evangelismo (No se descuentan).
                                </label>
                             </div>
                        </div>
                        ` : ''}

                        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--primary); margin-bottom: 8px;">🖋️ Firmar Visto Bueno (${roleName})</label>
                            <div class="signature-container">
                                <canvas id="manager_sig_${req.id}" class="signature-canvas"></canvas>
                                <button type="button" class="signature-clear" onclick="app.clearSig('manager_sig_${req.id}')">Borrar</button>
                            </div>
                        </div>

                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button class="btn btn-primary" onclick="app.approveRequest('${req.id}', 'manager')">Dar Visto Bueno</button>
                            <button class="btn" style="background: #fee2e2; color: #991b1b;" onclick="app.rejectRequest('${req.id}')">Rechazar</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- ACCESO RÁPIDO A MONITOR DE BALANCES -->
        <section class="card fade-in" style="margin-top: 32px; background: #f0f9ff; border: 1px solid #bae6fd; display: flex; justify-content: space-between; align-items: center; padding: 20px;">
            <div>
                <h3 style="margin: 0; color: #0369a1; font-family: 'Outfit', sans-serif;">📉 Monitor de Balances Vacacionales</h3>
                <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #0284c7;">Vea el estado institucional de días asignados y consumidos por cada colaborador.</p>
            </div>
            <button class="btn" style="background: #0284c7; color: white; padding: 12px 24px; font-weight: 800;" onclick="app.showBalancesMonitor()">ABRIR MONITOR</button>
        </section>
      `;
    },
    
    hr: () => {
      const allReqs = (state.vacationRequests || []);
      const pending = allReqs.filter(r => r.status === 'pending_hr' && (app.currentFilter === 'All' || r.category === app.currentFilter));
      const approved = allReqs.filter(r => r.status === 'approved' && (app.currentFilter === 'All' || r.category === app.currentFilter));
      const totalConflicts = (state.conflictDeclarations || []).length;

      return `
        <header class="fade-in" style="margin-bottom: 32px; display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 style="font-family: 'Outfit', sans-serif; font-size: 2.2rem; font-weight: 800; color: var(--primary); letter-spacing: -0.02em;">Panel de Recursos Humanos</h1>
                    <p style="color: var(--text-muted); font-weight: 500; font-size: 1rem;">Gestión institucional de personal y archivo de nuble.</p>
                </div>
                <div style="display: flex; gap: 12px;">
                    <button class="logout-btn-header" style="background: white; border: 1px solid #e2e8f0;" onclick="app.logout()">SALIR</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                 <div class="card" style="padding: 20px; border-left: 4px solid #22c55e; background: #f0fdf4;">
                     <p style="font-size: 0.9rem; color: var(--secondary); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">ADE app</p>
                     <p style="font-size: 0.7rem; color: #166534; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Nube Institucional</p>
                     <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                         <span style="font-size: 1.2rem; font-weight: 800; color: #14532d;">CONECTADA ✅</span>
                         <span style="font-size: 1.5rem;">☁️</span>
                     </div>
                 </div>
                 <div class="card" style="padding: 20px; border-left: 4px solid #0891b2; background: #ecfeff; position: relative;">
                     <p style="font-size: 0.7rem; color: #0e7490; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">🌍 Salidas y Regresos - Día de Hoy</p>
                     <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
                        ${(() => {
                            const todayStr = new Date().toISOString().split('T')[0];
                            const outgoing = (state.vacationRequests || []).filter(r => r.status === 'approved' && r.startDate === todayStr);
                            const incoming = (state.vacationRequests || []).filter(r => r.status === 'approved' && r.endDate === todayStr);
                            
                            if (outgoing.length === 0 && incoming.length === 0) {
                                return `<p style="font-size: 0.75rem; color: #64748b; font-style: italic;">Sin movimientos programados hoy</p>`;
                            }
                            
                            let html = '';
                            if (outgoing.length > 0) {
                                html += `<div style="display: flex; align-items: center; gap: 6px;">
                                    <span class="badge" style="background: #06b6d4; color: white; scale: 0.8;">SALIDA</span>
                                    <span style="font-size: 0.8rem; font-weight: 700;">${outgoing.length} Persona(s)</span>
                                </div>`;
                            }
                            if (incoming.length > 0) {
                                html += `<div style="display: flex; align-items: center; gap: 6px;">
                                    <span class="badge" style="background: #10b981; color: white; scale: 0.8;">REGRESO</span>
                                    <span style="font-size: 0.8rem; font-weight: 700;">${incoming.length} Persona(s)</span>
                                </div>`;
                            }
                            return html;
                        })()}
                     </div>
                     <span style="position: absolute; bottom: 10px; right: 10px; font-size: 1.5rem; opacity: 0.3;">🚀</span>
                 </div>
            </div>
        </header>

        <section class="card fade-in" style="margin-bottom: 32px; border: none; background: transparent; padding: 0;">
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
                <button class="btn ${app.currentFilter === 'All' ? 'btn-primary' : ''}" style="height: 40px; border-radius: 20px; min-width: 100px;" onclick="app.setFilter('All')">TODAS</button>
                <button class="btn ${app.currentFilter === 'Local' ? 'btn-primary' : ''}" style="height: 40px; border-radius: 20px;" onclick="app.setFilter('Local')">🏝️ Vacaciones</button>
                <button class="btn ${app.currentFilter === 'Médica' ? 'btn-primary' : ''}" style="height: 40px; border-radius: 20px;" onclick="app.setFilter('Médica')">💉 Médicas</button>
                <button class="btn ${app.currentFilter === 'Casamiento' ? 'btn-primary' : ''}" style="height: 40px; border-radius: 20px;" onclick="app.setFilter('Casamiento')">💍 Matrimonio</button>
                <button class="btn ${app.currentFilter === 'Fallecimiento' ? 'btn-primary' : ''}" style="height: 40px; border-radius: 20px;" onclick="app.setFilter('Fallecimiento')">🕊️ Luto</button>
                
                <div style="margin-left: auto; display: flex; gap: 8px; align-items: center;">
                    <button class="btn" style="background: #eef2ff; color: #4338ca; font-weight: 800; height: 40px; display: flex; align-items: center; gap: 8px;" onclick="app.showAnnualPlansManager()">
                        <span class="material-symbols-outlined" style="font-size: 1.2rem;">fact_check</span> CONTROL DE PLANIFICACIÓN ANUAL DE VACACIONES
                    </button>
                    <button class="btn" style="background: #0ea5e9; color: white; height: 40px; font-weight: 800;" onclick="app.toggleEmployeeEditor()">👥 GESTIÓN DE PERSONAL</button>
                    <button class="btn" style="background: #1e293b; color: white; height: 40px; font-weight: 800;" onclick="app.togglePositionsEditor()">🛠️ ROLES</button>
                    <button class="btn" style="background: #334155; color: white; height: 40px; font-weight: 800;" onclick="app.toggleSupervisorsEditor()">⚙️ RESPONSABLES</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px;">
                ${pending.map(req => {
                    const localEmp = state.employeesList.find(e => e.id == req.idEmpleado);
                    const photo = localEmp ? localEmp.photo : null;
                    return `
                    <div class="card" style="padding: 0; overflow: hidden; border: 1px solid #e2e8f0; transition: transform 0.2s;">
                        <div style="background: var(--primary); padding: 20px; display: flex; align-items: center; gap: 15px;">
                            <div style="width: 50px; height: 50px; border-radius: 50%; overflow: hidden; background: rgba(255,255,255,0.2); border: 2px solid white; flex-shrink: 0;">
                                ${photo ? `<img src="${photo}" style="width:100%; height:100%; object-fit:cover;">` : `<span style="display:flex; align-items:center; justify-content:center; height:100%; color:white; font-weight:800;">${req.employeeName.substring(0,2)}</span>`}
                            </div>
                            <div style="flex: 1;">
                                <h3 style="color: white; font-size: 1.1rem; margin: 0; letter-spacing: -0.02em;">${req.employeeName}</h3>
                                <p style="color: rgba(255,255,255,0.7); font-size: 0.7rem; font-weight: 700; margin: 2px 0;">${req.category.toUpperCase()} • ${req.duration}</p>
                            </div>
                            <span class="badge" style="background: #fef08a; color: #854d0e;">PENDIENTE RRHH</span>
                        </div>

                        <div style="padding: 20px;">
                            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                    <div style="text-align: center; border-right: 1px solid #e2e8f0;">
                                        <p style="font-size: 0.6rem; color: #64748b; text-transform: uppercase;">Solicitante</p>
                                        <img src="${req.signatures.applicant}" style="max-height: 40px; margin-top: 5px;">
                                    </div>
                                    <div style="text-align: center;">
                                        <p style="font-size: 0.6rem; color: #64748b; text-transform: uppercase;">Director: ${req.supervisor}</p>
                                        <img src="${req.signatures.manager}" style="max-height: 40px; margin-top: 5px;">
                                    </div>
                                </div>
                            </div>

                            <div style="background: #fff; border: 1px solid #cbd5e1; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
                                <label style="display: block; font-size: 0.7rem; font-weight: 800; color: var(--primary); margin-bottom: 10px; text-transform: uppercase;">🖋️ Firma Final Autorizada</label>
                                <div class="signature-container" style="height: 120px; background: #fafafa; border: 1px dashed #cbd5e1;">
                                    <canvas id="hr_sig_${req.id}" class="signature-canvas"></canvas>
                                    <button class="signature-clear" onclick="app.clearSig('hr_sig_${req.id}')">BORRAR</button>
                                </div>
                            </div>

                            <div style="display: flex; gap: 10px;">
                                <button class="btn btn-primary" style="flex: 2; height: 48px; font-weight: 800;" onclick="app.approveRequest('${req.id}', 'hr')">AUTORIZAR Y ARCHIVAR</button>
                                <button class="btn" style="flex: 1; background: #fff; border: 1px solid #fecaca; color: #ef4444; height: 48px; font-weight: 800;" onclick="app.rejectRequest('${req.id}')">RECHAZAR</button>
                            </div>
                        </div>
                    </div>
                `}).join('')}
                ${pending.length === 0 ? `
                    <div class="card" style="grid-column: span 12; padding: 60px; text-align: center; border: 2px dashed #e2e8f0; background: #f8fafc;">
                        <span class="material-symbols-outlined" style="font-size: 60px; color: #cbd5e1; margin-bottom: 16px;">verified_user</span>
                        <h4 style="color: #64748b; font-size: 1.2rem; font-weight: 700;">¡Todo al día en RRHH!</h4>
                        <p style="color: #94a3b8; font-size: 0.9rem;">No hay solicitudes pendientes de firma final.</p>
                    </div>
                ` : ''}
            </div>
        </section>

        <!-- CRONO MOVIMIENTOS -->
        <section class="card fade-in" style="margin-bottom: 32px; background: white; padding: 0; overflow: hidden; border: 1px solid #e2e8f0; border-top: 5px solid #0891b2;">
            <div style="padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.4rem; font-weight: 800; color: #0891b2; margin: 0;">🌍 Control Cronológico de Movimientos</h3>
                <span class="badge" style="background: #ecfeff; color: #0e7490; font-weight: 800;">PASADOS Y FUTUROS</span>
            </div>
            <div style="overflow-x: auto; max-height: 400px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                         <tr style="text-align: left;">
                            <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 800;">Colaborador</th>
                            <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 800;">Salida</th>
                            <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 800;">Regreso</th>
                            <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 800; text-align: center;">Estado</th>
                            ${(state.user && (state.user.role === 'hr' || (state.user.permissions && state.user.permissions.includes('hr')))) ? '<th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 800; text-align: center;">ANULAR</th>' : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${(() => {
                            const approved = (state.vacationRequests || []).filter(r => r.status === 'approved');
                            const sorted = approved.sort((a,b) => new Date(a.startDate) - new Date(b.startDate));
                            const today = new Date().toISOString().split('T')[0];
                            
                            const isHR = state.user && (state.user.role === 'hr' || (state.user.permissions && state.user.permissions.includes('hr')));

                            if (sorted.length === 0) return `<tr><td colspan="${isHR ? 5 : 4}" style="text-align:center; padding:32px; color:#64748b;">No hay movimientos aprobados registrados aún.</td></tr>`;
                            
                            return sorted.map(r => `
                            <tr style="border-bottom: 1px solid #f1f5f9;">
                                <td style="padding: 16px; font-weight: 700; color: var(--primary);">${r.employeeName}</td>
                                <td style="padding: 16px; font-weight: 800; color: #0891b2;">${r.startDate}</td>
                                <td style="padding: 16px; font-weight: 800; color: #0d9488;">${r.endDate}</td>
                                <td style="padding: 16px; text-align: center;">
                                    ${r.startDate > today ? 
                                        `<span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 999px; font-size: 0.65rem; font-weight: 800;">PROGRAMADO</span>` : 
                                        (r.endDate >= today ? 
                                            `<span style="background: #f0fdf4; color: #166534; padding: 4px 10px; border-radius: 999px; font-size: 0.65rem; font-weight: 800;">EN CURSO</span>` :
                                            `<span style="background: #f1f5f9; color: #64748b; padding: 4px 10px; border-radius: 999px; font-size: 0.65rem; font-weight: 800;">COMPLETADO</span>`
                                        )
                                    }
                                </td>
                                ${isHR ? `
                                    <td style="padding: 16px; text-align: center;">
                                        <button class="btn" style="padding: 4px 12px; background: #fee2e2; color: #b91c1c; font-size: 0.7rem; border: 1px solid #fecaca;" onclick="app.anularMovimiento('${r.id}')">ANULAR</button>
                                    </td>
                                ` : ''}
                            </tr>
                            `).join('');
                        })()}
                    </tbody>
                </table>
            </div>
        </section>

        <section class="card fade-in" style="background: white; border: 1px solid #e2e8f0; border-top: 5px solid var(--primary); padding: 0;">
            <div style="padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.4rem; font-weight: 800; color: var(--primary);">📊 Libro Maestro de Auditoría</h2>
                <div style="display: flex; gap: 10px;">
                    <button class="btn" style="background: #1e3a8a; color: white; display: flex; align-items: center; gap: 8px; font-weight: 800; padding: 10px 20px;" onclick="app.showAuditHistory()">
                        <span class="material-symbols-outlined" style="font-size: 1.2rem;">history</span> HISTÓRICO POR CICLO
                    </button>
                    <button class="btn" style="background: #166534; color: white;" onclick="app.exportAuditPDF(${app.currentAuditYear})">EXPORTAR PDF</button>
                </div>
            </div>
            
            <div style="overflow-x: auto; max-height: 500px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead style="position: sticky; top: 0; background: #f8fafc; z-index: 10; border-bottom: 2px solid #e2e8f0;">
                        <tr style="text-align: left;">
                            <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 800;">ID</th>
                            <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 800;">Colaborador</th>
                            <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 800;">Departamento</th>
                            <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 800;">Evangelismo</th>
                            <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 800; text-align: center;">Acciones Administrativas</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${[...(state.employeesList || [])].sort((a,b) => a.name.localeCompare(b.name)).map(e => {
                            const reqs = (state.vacationRequests || []).filter(r => {
                                const date = new Date(r.startDate);
                                return date.getFullYear() == app.currentAuditYear && (r.idEmpleado == e.id || r.userId == e.id);
                            });
                            const evanAppr = reqs.find(r => r.category === 'Evangelismo' && r.status === 'approved');
                            
                            return `
                                <tr class="table-row-hover" style="border-bottom: 1px solid #f1f5f9;">
                                    <td style="padding: 16px; color: #94a3b8; font-family: monospace; font-weight: 700;">#${e.id.padStart(2, '0')}</td>
                                    <td style="padding: 16px; font-weight: 700; color: var(--primary);">${e.name}</td>
                                    <td style="padding: 16px; font-size: 0.8rem; color: #64748b;">${e.cat}</td>
                                    <td style="padding: 16px;">
                                        <span class="badge" style="background: ${evanAppr ? '#dcfce7' : '#f1f5f9'}; color: ${evanAppr ? '#166534' : '#64748b'}; width: 100px; text-align: center;">
                                            ${evanAppr ? 'CONCEDIDO' : 'DISPONIBLE'}
                                        </span>
                                    </td>
                                    <td style="padding: 16px; display: flex; gap: 8px; justify-content: center;">
                                        <!-- RESET PIN FIRST -->
                                        <button class="btn" style="padding: 8px; background: #f1f5f9; border: 1.5px solid #cbd5e1; color: #475569;" onclick="app.resetEmployeePin('${e.id}')" title="Restaurar PIN Original">
                                            <span class="material-symbols-outlined" style="font-size: 1.2rem;">key_off</span>
                                        </button>

                                        <button class="btn" style="padding: 6px 10px; font-size: 0.65rem; background: #fff; border: 1px solid #e2e8f0; color: #64748b;" onclick="app.toggleEvangelismo('${e.id}')">TOGGLE</button>
                                        <button class="btn" style="padding: 6px 10px; font-size: 0.65rem; background: var(--secondary); color: white; border: none;" onclick="app.generateEmployeeAudit('${e.id}')">AUDITORÍA</button>
                                        ${(() => {
                                            const archived = (state.vacationRequests || []).find(r => (r.idEmpleado === e.id || r.employeeName === e.name) && r.cloudPdf);
                                            return archived ? `
                                                <button class="btn" style="padding: 6px; background: #f0fdf4; border: 1px solid #bbf7d0;" onclick="window.open('${archived.cloudPdf}', '_blank')">
                                                    <span class="material-symbols-outlined" style="font-size: 1.1rem; color: #166534;">cloud_download</span>
                                                </button>
                                            ` : '';
                                        })()}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </section>

        <section class="card fade-in" style="margin-top: 32px; border-top: 4px solid #be185d;">
            <h2 style="font-size: 1.1rem; color: #9d174d; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                <span class="material-symbols-outlined">description</span>
                Auditoría de Declaraciones de Conflicto (Individuales)
            </h2>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                    <thead>
                        <tr style="text-align: left; border-bottom: 2px solid #f1f5f9; color: var(--text-muted);">
                            <th style="padding: 12px; color: #9d174d;">Año</th>
                            <th style="padding: 12px; color: #9d174d;">Nombre</th>
                            <th style="padding: 12px; color: #9d174d;">Posición</th>
                            <th style="padding: 12px; color: #9d174d; text-align: center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(state.conflictDeclarations || []).map(d => `
                            <tr style="border-bottom: 1px solid #f8fafc;">
                                <td style="padding: 12px; font-weight: 700;">${d.year}</td>
                                <td style="padding: 12px;"><b>${d.employeeName}</b></td>
                                <td style="padding: 12px; font-size: 0.75rem; color: #64748b;">${d.position || '-'}</td>
                                <td style="padding: 12px; text-align: center;">
                                    <div style="display: flex; gap: 8px; justify-content: center;">
                                        <button class="btn" style="padding: 6px 12px; font-size: 0.7rem; background: #be185d; color: white;" onclick="app.downloadIndividualConflictoPDF('${d.id}')">BAJAR PDF</button>
                                        <button class="btn" style="padding: 6px 12px; font-size: 0.7rem; background: #991b1b; color: white;" onclick="app.deleteConflictDeclaration('${d.id}')">ANULAR</button>
                                        ${d.pdfUrl || d.cloudPdf ? `<a href="${d.pdfUrl || d.cloudPdf}" target="_blank" class="btn" style="padding: 6px 12px; font-size: 0.7rem; background: #1e293b; color: white; text-decoration: none;">NUBE</a>` : ''}
                                    </div>
                                </td>
                            </tr>
                        `).join('') || '<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 40px;">No hay declaraciones registradas aún.</td></tr>'}
                    </tbody>
                </table>
            </div>
        </section>

        <section class="card fade-in" style="margin-top: 32px; border-top: 4px solid #94a3b8; background: #f8fafc;">
            <h2 style="font-size: 1.1rem; color: #475569; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                <span class="material-symbols-outlined">delete_sweep</span>
                Solicitudes Rechazadas / Pruebas (Limpieza Técnica)
            </h2>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                    <thead>
                        <tr style="text-align: left; border-bottom: 2px solid #e2e8f0; color: #64748b;">
                            <th style="padding: 12px;">Colaborador</th>
                            <th style="padding: 12px;">Motivo/Tipo</th>
                            <th style="padding: 12px;">Fecha Registro</th>
                            <th style="padding: 12px; text-align: center;">Acción Permanente</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(state.vacationRequests || []).filter(r => r.status === 'rejected').map(r => `
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 12px; font-weight: 700; color: #1e293b;">${r.employeeName}</td>
                                <td style="padding: 12px; color: #64748b;">${r.category}</td>
                                <td style="padding: 12px; color: #64748b;">${r.startDate}</td>
                                <td style="padding: 12px; text-align: center;">
                                    <button class="btn" style="background: white; border: 1px solid #ef4444; color: #ef4444; font-size: 0.7rem;" onclick="app.eliminarRegistro('${r.id}')">PURGAR DEFINITIVAMENTE</button>
                                </td>
                            </tr>
                        `).join('') || '<tr><td colspan="4" style="text-align: center; color: #94a3b8; padding: 20px;">No hay registros rechazados para limpiar.</td></tr>'}
                    </tbody>
                </table>
            </div>
        </section>
      `;
    },

    
    assistant: () => {
      const reportYear = new Date().getFullYear();
      const numConflicts = (state.conflictDeclarations || []).length;
      const allReqs = (state.vacationRequests || []);
      const approved = allReqs.filter(r => r.status === 'approved');

      return `
        <header class="fade-in" style="margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center; background: white; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0;">
            <div>
                <h1 style="font-family: 'Outfit', sans-serif; font-size: 1.8rem; font-weight: 800; color: #0369a1;">Panel Asistente de RRHH</h1>
                <p style="color: #64748b; font-weight: 500;">Gestión operativa y soporte de auditoría.</p>
            </div>
            <div style="display: flex; align-items: center; gap: 16px;">
                 <div style="background: #f0f9ff; padding: 8px 16px; border-radius: 10px; border: 1px solid #bae6fd; text-align: right;">
                     <p style="font-size: 0.6rem; color: #0369a1; font-weight: 800; text-transform: uppercase;">Estado Sesión</p>
                     <p style="font-size: 0.85rem; color: #0c4a6e; font-weight: 700;">Asistente Autorizado</p>
                 </div>
                 <button class="logout-btn-header" style="background: #f1f5f9; border: 1px solid #e2e8f0;" onclick="app.logout()">SALIR</button>
            </div>
        </header>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 32px;">
            <!-- Column 1: Core Tools -->
            <section class="card fade-in" style="background: white; border-top: 6px solid #0ea5e9;">
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.2rem; font-weight: 800; color: #0369a1; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                    <span class="material-symbols-outlined">construction</span> Herramientas de Gestión
                </h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <button class="btn" style="background: #f0f9ff; color: #0369a1; font-weight: 800; height: 60px; flex-direction: column; gap: 4px;" onclick="app.downloadAllApprovedPDFs()">
                        <span class="material-symbols-outlined" style="font-size: 1.2rem;">file_download</span> Bajar Todo
                    </button>
                    <button class="btn" style="background: #fdf2f8; color: #be185d; font-weight: 800; height: 60px; flex-direction: column; gap: 4px;" onclick="app.manageEmployeePhotos()">
                        <span class="material-symbols-outlined" style="font-size: 1.2rem;">camera_enhance</span> Foto Empleado
                    </button>
                    <button class="btn" style="background: var(--primary); color: white; font-weight: 800; height: 60px; flex-direction: column; gap: 4px;" onclick="app.showGlobalCalendar()">
                        <span class="material-symbols-outlined" style="font-size: 1.2rem;">calendar_month</span> Calendario
                    </button>
                    <button class="btn" style="background: #fefce8; color: #854d0e; font-weight: 800; height: 60px; flex-direction: column; gap: 4px; border: 1px solid #fef08a;" onclick="app.downloadMedicalLeaves()">
                        <span class="material-symbols-outlined" style="font-size: 1.2rem;">medical_services</span> Lic. Médicas
                    </button>
                </div>
            </section>

            <!-- Column 2: Audit & Reports -->
            <section class="card fade-in" style="background: white; border-top: 6px solid #4338ca;">
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.2rem; font-weight: 800; color: #3730a3; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                    <span class="material-symbols-outlined">analytics</span> Auditoría y Reportes
                </h2>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <button class="btn" style="background: #eef2ff; color: #3730a3; font-weight: 800; height: 50px; justify-content: space-between; padding: 0 20px;" onclick="app.exportAuditPDF(reportYear)">
                        <span>Reporte Auditoría Institucional</span>
                        <span class="material-symbols-outlined">print</span>
                    </button>
                    <button class="btn" style="background: #eef2ff; color: #3730a3; font-weight: 800; height: 50px; justify-content: space-between; padding: 0 20px;" onclick="app.showAnnualPlansManager()">
                        <span>Control de Planificación Anual de Vacaciones</span>
                        <span class="material-symbols-outlined">fact_check</span>
                    </button>
                    <button class="btn" style="background: #fffbeb; color: #92400e; font-weight: 800; height: 50px; justify-content: space-between; padding: 0 20px; border: 1px solid #fef3c7;" onclick="app.showMissingAnnualPlans()">
                        <span>🔍 Pendientes de Planificar</span>
                        <span class="badge" style="background: #92400e; color: white;">Ver Lista</span>
                    </button>
                </div>
            </section>

            <!-- Column 3: Notifications -->
            <section class="card fade-in" style="background: #fff1f2; border: 1px solid #fecaca; border-top: 6px solid #be123c;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.2rem; font-weight: 800; color: #9d174d; margin: 0; display: flex; align-items: center; gap: 10px;">
                        <span class="material-symbols-outlined">notifications_active</span> Avisos Recientes (5d)
                    </h2>
                    <div id="batch_download_conflicts_container"></div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${(() => {
                        const fiveDaysAgo = new Date();
                        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
                        const recent = (state.conflictDeclarations || []).filter(d => {
                            const date = d.createdAt ? (d.createdAt.seconds ? new Date(d.createdAt.seconds * 1000) : new Date(d.createdAt)) : new Date();
                            return date >= fiveDaysAgo;
                        });
                        if (recent.length === 0) return '<p style="text-align:center; color:#9d174d; font-size:0.8rem; padding:20px;">Sin nuevas declaraciones hoy.</p>';
                        
                        // Inyectar botón de descarga masiva si hay más de uno (se hace después del render)
                        if (recent.length > 1) {
                            setTimeout(() => {
                                const container = document.getElementById('batch_download_conflicts_container');
                                if (container) container.innerHTML = `<button class="btn" style="padding: 4px 10px; font-size: 0.65rem; background: white; color: #be185d; border: 1px solid #be185d;" onclick="app.downloadConflictBatch()">Descargar Todo</button>`;
                            }, 100);
                        }

                        return recent.slice(0, 4).map(r => `
                            <div style="background: white; padding: 12px; border-radius: 10px; border: 1px solid #fecaca; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <p style="font-family: 'Outfit', sans-serif; font-size: 0.85rem; font-weight: 800; color: #1e293b; margin:0;">${r.employeeName}</p>
                                    <p style="font-size: 0.65rem; color: #be185d; font-weight: 600; margin:2px 0;">Conflicto ${r.year}</p>
                                </div>
                                <button class="btn" style="padding: 6px 10px; font-size: 0.65rem; background: #be185d; color: white; border:none;" onclick="app.downloadIndividualConflictoPDF('${r.id}')">PDF</button>
                            </div>
                        `).join('');
                    })()}
                </div>
            </section>
        </div>

        <div style="margin-top: 32px; display: flex; gap: 16px;">
            <button class="btn" style="flex: 1; background: #0284c7; color: white; padding: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 10px;" onclick="app.showBalancesMonitor()">
                <span class="material-symbols-outlined">analytics</span> VER MONITOR DE BALANCES INSTITUCIONAL
            </button>
            <button class="btn" style="flex: 1; background: #4338ca; color: white; padding: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 10px;" onclick="app.showAnnualPlansManager()">
                <span class="material-symbols-outlined">fact_check</span> CONTROL DE PLANIFICACIÓN ANUAL DE VACACIONES
            </button>
        </div>

        <section class="card fade-in" style="margin-top: 32px; border-top: 4px solid #be185d;">
             <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.2rem; font-weight: 800; color: #9d174d; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                <span class="material-symbols-outlined">description</span> Registro General - Declaraciones de Conflicto
            </h2>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem;">
                    <thead>
                        <tr style="text-align: left; border-bottom: 2px solid #f8fafc; color: #64748b;">
                            <th style="padding: 10px;">Año</th>
                            <th style="padding: 10px;">Colaborador</th>
                            <th style="padding: 10px; text-align: center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(state.conflictDeclarations || []).slice(0, 15).map(d => `
                            <tr style="border-bottom: 1px solid #f8fafc;">
                                <td style="padding: 10px;">${d.year}</td>
                                <td style="padding: 10px; font-weight: 700;">${d.employeeName}</td>
                                <td style="padding: 10px; text-align: center;">
                                    <div style="display: flex; gap: 4px; justify-content: center;">
                                        <button class="btn" style="padding: 4px 8px; font-size: 0.6rem; background: #be185d; color: white;" onclick="app.downloadIndividualConflictoPDF('${d.id}')">PDF</button>
                                        <button class="btn" style="padding: 4px 8px; font-size: 0.6rem; background: #991b1b; color: white;" onclick="app.deleteConflictDeclaration('${d.id}')">ANULAR</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('') || '<tr><td colspan="3" style="text-align: center; color: var(--text-muted); padding: 20px;">No hay declaraciones.</td></tr>'}
                    </tbody>
                </table>
            </div>
        </section>

        <!-- CRONO MOVIMIENTOS (ASISTENTE RRHH) -->
        <section class="card fade-in" style="margin-top: 32px; background: white; padding: 0; overflow: hidden; border: 1px solid #e2e8f0; border-top: 5px solid #0891b2;">
            <div style="padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.4rem; font-weight: 800; color: #0891b2; margin: 0;">🌍 Control Institucional de Movimientos</h3>
                <span class="badge" style="background: #ecfeff; color: #0e7490; font-weight: 800;">CRONOGRAMA DE SALIDAS</span>
            </div>
            <div style="overflow-x: auto; max-height: 400px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                    <thead style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                         <tr style="text-align: left;">
                            <th style="padding: 16px; font-weight: 800; color: #64748b;">Colaborador</th>
                            <th style="padding: 16px; font-weight: 800; color: #64748b;">Salida</th>
                            <th style="padding: 16px; font-weight: 800; color: #64748b;">Regreso</th>
                            <th style="padding: 16px; font-weight: 800; color: #64748b; text-align: center;">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(() => {
                            const approved = (state.vacationRequests || []).filter(r => r.status === 'approved');
                            const sorted = approved.sort((a,b) => new Date(a.startDate) - new Date(b.startDate));
                            const today = new Date().toISOString().split('T')[0];
                            
                            if (sorted.length === 0) return '<tr><td colspan="4" style="text-align:center; padding:32px; color:#64748b;">No hay movimientos aprobados registrados aún.</td></tr>';
                            
                            return sorted.map(r => `
                            <tr style="border-bottom: 1px solid #f1f5f9;">
                                <td style="padding: 16px; font-weight: 700; color: #1e3a8a;">${r.employeeName}</td>
                                <td style="padding: 16px; font-weight: 800; color: #0891b2;">${r.startDate}</td>
                                <td style="padding: 16px; font-weight: 800; color: #0d9488;">${r.endDate}</td>
                                <td style="padding: 16px; text-align: center;">
                                    ${r.startDate > today ? 
                                        `<span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 999px; font-size: 0.65rem; font-weight: 800;">PROGRAMADO</span>` : 
                                        (r.endDate >= today ? 
                                            `<span style="background: #f0fdf4; color: #166534; padding: 4px 10px; border-radius: 999px; font-size: 0.65rem; font-weight: 800;">EN CURSO</span>` :
                                            `<span style="background: #f1f5f9; color: #64748b; padding: 4px 10px; border-radius: 999px; font-size: 0.65rem; font-weight: 800;">COMPLETADO</span>`
                                        )
                                    }
                                </td>
                            </tr>
                            `).join('');
                        })()}
                    </tbody>
                </table>
            </div>
        </section>

      `;
    },
    
    form: () => {
      // Form fields based on PDF model
      return `
        <header class="fade-in" style="margin-bottom: 32px;">
            <h1 style="font-size: 1.8rem; font-weight: 800; color: var(--primary);">Nueva Solicitud Oficial</h1>
            <p style="color: var(--text-muted); font-weight: 500;">Complete todos los campos para iniciar el flujo institucional.</p>
        </header>

        <form class="card fade-in" id="vacation-form" onsubmit="app.submitForm(event)">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                <div>
                    <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 8px;">Colaborador</label>
                    <input type="text" value="${state.user.name}" readonly style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc;">
                </div>
                <div>
                    <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 8px;">Correo Electrónico Personal</label>
                    <input type="email" id="user_email" placeholder="ejemplo@correo.com" required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px;">
                </div>
                <div style="grid-column: span 2; display: flex; flex-direction: column; gap: 12px; background: #fffbeb; padding: 20px; border-radius: 12px; border: 1px solid #fef3c7;">
                    <div style="display: flex; gap: 24px; align-items: center;">
                        <div style="flex: 1;">
                            <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 8px;">🛒 Duración Institucional</label>
                            <div id="duration_display" style="font-size: 1.2rem; font-weight: 800; color: #92400e;">0 Días</div>
                            <p style="font-size: 0.75rem; color: #166534; font-weight: 700; margin-top: 6px;">Puede seleccionar la cantidad de días deseados libremente.</p>
                        </div>
                        <div style="flex: 1; text-align: right;">
                            <p style="font-size: 0.75rem; font-weight: 700;">Días Solicitados:</p>
                            <span id="days_count" style="font-size: 1.5rem; font-weight: 900; color: var(--primary);">0</span>
                        </div>
                    </div>
                    <!-- Alerta de Feriados Dinámica -->
                    <div id="holiday_alert" style="display: none; background: #fff; padding: 12px; border-radius: 8px; border-left: 4px solid #ef4444; margin-top: 10px;">
                        <p id="holiday_msg" style="font-size: 0.75rem; color: #475569; margin: 0;"></p>
                    </div>
                </div>

                <div>
                    <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 8px;">Fecha de Salida</label>
                    <input type="date" id="start_date" onchange="app.calculateDuration()" required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px;">
                </div>
                <div>
                    <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 8px;">Fecha de Finalización</label>
                    <input type="date" id="end_date" onchange="app.calculateDuration()" required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px;">
                </div>
                <div>
                    <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 8px;">Responsable Inmediato (Auto)</label>
                    <input type="text" value="${state.user.supervisor}" readonly style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; font-weight: 700; color: var(--primary);">
                    <input type="hidden" id="supervisor_id" value="${state.user.supervisor}">
                </div>
                <div>
                    <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 8px;">Tipo de Permiso / Licencia</label>
                    <select id="vac_type" onchange="app.updateFormType()" style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <option value="Local">Vacaciones Locales</option>
                        <option value="Internacional">Vacaciones Internacionales</option>
                        <option value="Conjunta">Vacaciones Conjunta (Nacionales e Internacionales)</option>
                        <option value="Casamiento">Licencia por Casamiento (5 días)</option>
                        <option value="Fallecimiento">Licencia por Fallecimiento (3 días)</option>
                        <option value="Médica">Licencia Médica (Cargar comprobante)</option>
                    </select>

                    ${(() => {
                        const currYear = new Date().getFullYear();
                        const hasEvan = (state.vacationRequests || []).some(r => r.idEmpleado === state.user.id && (r.category === 'Evangelismo' || r.evangelismoTaken) && r.status === 'approved' && new Date(r.startDate).getFullYear() === currYear);
                        if (hasEvan) {
                            return `
                                <div style="margin-top: 12px; padding: 10px; background: #fee2e2; border-radius: 8px; border: 1px solid #fca5a5;">
                                    <p style="font-size: 0.8rem; font-weight: 700; color: #b91c1c; margin: 0;">🚫 Su cupo de 10 días de Evangelismo ya fue autorizado este año.</p>
                                    <input type="hidden" id="include_evangelismo" value="false">
                                </div>
                            `;
                        } else {
                            return `
                                <div id="evan_check_container" style="margin-top: 12px; display: flex; align-items: center; gap: 8px; background: #eff6ff; padding: 10px; border-radius: 8px; border: 1px solid #dbeafe;">
                                    <input type="checkbox" id="include_evangelismo" onchange="app.calculateDuration()" style="width: 18px; hieght: 18px; cursor: pointer;">
                                    <label for="include_evangelismo" style="font-size: 0.8rem; font-weight: 700; color: #1e40af; cursor: pointer;">
                                        🛐 Incluir 10 días de Evangelismo (Autorizado por Presidente)
                                    </label>
                                </div>
                            `;
                        }
                    })()}
                </div>
                <!-- Sección para Licencia Médica -->
                <div id="medical_fields" style="display: none; grid-column: span 2; background: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #dcfce7; margin-top: 10px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 8px;">Días según Licencia</label>
                            <input type="number" id="medical_days" placeholder="Ej: 3" onchange="app.calculateDuration()" style="width: 100%; padding: 12px; border: 1px solid #b7e4c7; border-radius: 8px;">
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 8px;">📸 Adjuntar Foto/PDF de Licencia</label>
                            <input type="file" id="medical_attachment" accept="image/*,application/pdf" style="width: 100%; font-size: 0.8rem;">
                        </div>
                    </div>
                </div>
                <div style="grid-column: span 2;">
                    <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 8px;">🖋️ Firma del Solicitante</label>
                    <div class="signature-container">
                        <canvas id="applicant_sig" class="signature-canvas"></canvas>
                        <button type="button" class="signature-clear" onclick="app.clearSig('applicant_sig')">Borrar</button>
                    </div>
                </div>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 16px;">
                <button type="button" class="btn" onclick="app.navigate('dashboard', event)">Cancelar</button>
                <button type="submit" class="btn btn-primary" style="padding: 12px 32px;">Enviar Solicitud Firmada</button>
            </div>
        </form>
      `;
    },
    
    annual_plan_form: () => {
      const remainingWeeks = state.getWeeksByServiceYears(state.user.yearsOfService || 0);
      return `
        <header class="fade-in" style="margin-bottom: 32px;">
            <h1 style="font-size: 1.8rem; font-weight: 800; color: #4f46e5;">Planificación Anual de Vacaciones</h1>
            <p style="color: var(--text-muted); font-weight: 500;">Planifique anticipadamente sus salidas para este año institucional.</p>
        </header>

        <form class="card fade-in" id="annual-plan-form" onsubmit="app.submitAnnualPlanForm(event)">
            <div style="background: #e0e7ff; padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #c7d2fe;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="color: #4338ca; margin-bottom: 5px;">Colaborador: ${state.user.name}</h3>
                        <p style="font-size: 0.85rem; color: #3730a3; margin: 0; font-weight: 700;">Asignación Reglamentaria: ${remainingWeeks * 7} Días</p>
                    </div>
                </div>
                
                <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 8px; border: 3px dashed #818cf8; display: flex; justify-content: space-around; align-items: center;">
                    <div style="text-align: center;">
                        <span style="display: block; font-size: 0.75rem; color: #6b7280; font-weight: 800; text-transform: uppercase;">Días Planeados</span>
                        <span id="ap_planned_days" style="font-size: 1.8rem; font-weight: 900; color: #4338ca;">0</span>
                    </div>
                    <div style="text-align: center;">
                        <span style="display: block; font-size: 0.75rem; color: #6b7280; font-weight: 800; text-transform: uppercase;">Días Disponibles</span>
                        <span id="ap_remaining_days" style="font-size: 1.8rem; font-weight: 900; color: #10b981;">${remainingWeeks * 7}</span>
                    </div>
                </div>
                
                <p id="ap_holiday_note" style="font-size: 0.75rem; color: #059669; font-weight: 700; background: #d1fae5; padding: 8px; border-radius: 6px; margin-top: 15px; display: none;"></p>
                <p style="font-size: 0.75rem; color: #4f46e5; margin-top: 10px;">El sistema no descontará feriados de su asignación.</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                <div style="grid-column: span 2; background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #6366f1;">
                    <h4 style="margin-bottom: 10px; color: #4f46e5; font-size: 0.85rem;">Fechas del Periodo 1</h4>
                    <div style="display: flex; gap: 15px;">
                        <input type="date" id="ap_start_1" onchange="app.calculateAnnualPlanBalance()" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;" required>
                        <input type="date" id="ap_end_1" onchange="app.calculateAnnualPlanBalance()" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;" required>
                    </div>
                </div>
                
                <div style="grid-column: span 2; background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #818cf8;">
                    <h4 style="margin-bottom: 10px; color: #6366f1; font-size: 0.85rem;">Fechas del Periodo 2 (Opcional)</h4>
                    <div style="display: flex; gap: 15px;">
                        <input type="date" id="ap_start_2" onchange="app.calculateAnnualPlanBalance()" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
                        <input type="date" id="ap_end_2" onchange="app.calculateAnnualPlanBalance()" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
                    </div>
                </div>

                <div style="grid-column: span 2; background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #a5b4fc;">
                    <h4 style="margin-bottom: 10px; color: #818cf8; font-size: 0.85rem;">Fechas del Periodo 3 (Opcional)</h4>
                    <div style="display: flex; gap: 15px;">
                        <input type="date" id="ap_start_3" onchange="app.calculateAnnualPlanBalance()" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
                        <input type="date" id="ap_end_3" onchange="app.calculateAnnualPlanBalance()" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
                    </div>
                </div>

                <div style="grid-column: span 2; margin-top: 10px;">
                    <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 8px;">🖋️ Firma del Colaborador (Obligatorio)</label>
                    <div class="signature-container" style="border-color: #6366f1;">
                        <canvas id="ap_applicant_sig" class="signature-canvas"></canvas>
                        <button type="button" class="signature-clear" onclick="app.clearSig('ap_applicant_sig')">Borrar</button>
                    </div>
                </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 16px;">
                <button type="button" class="btn" onclick="app.navigate('dashboard', event)">Cancelar</button>
                <button type="submit" class="btn btn-primary" style="background: #4f46e5; border: none; padding: 12px 32px;">Enviar Planificación Oficial</button>
            </div>
        </form>
      `;
    },

    conflicto_form: () => {
        return `
        <header class="fade-in" style="margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
                <h1 style="font-size: 1.8rem; font-weight: 800; color: #9d174d;">Declaración Conflicto de Intereses</h1>
                <p style="color: var(--text-muted); font-weight: 500;">Unión Dominicana de los Adventistas del Séptimo Día (ADE)</p>
            </div>
            <button class="btn" style="background: #f1f5f9; color: var(--primary);" onclick="app.navigate('dashboard')">Volver</button>
        </header>

        <form class="card fade-in" id="conflicto-form" onsubmit="app.submitConflictoForm(event)" style="border-top: 6px solid #be185d;">
             <div style="background: white; padding: 20px; border-radius: 8px; font-size: 0.85rem; color: #475569; line-height: 1.6; border: 1px solid #e2e8f0; margin-bottom: 24px; max-height: 300px; overflow-y: auto;">
                <h3 style="font-size: 1rem; color: #be185d; margin-bottom: 10px;">DECLARACIÓN DE ACEPTACIÓN</h3>
                <p>ESTA DECLARACION se aplica, hasta donde yo tenga conocimiento, a todos los miembros de mi familia inmediata (esposa, hijos, padres) y sus provisiones serán protectoras de todas las organizaciones afiliadas a, subsidiarias de la Unión Dominicana. En el caso de que las cosas cambien en el futuro y puedan crear un potencial conflicto de interés, estoy de acuerdo en notificar a la Unión Dominicana por escrito.</p>
                <p>Estoy en total acuerdo con el reglamento de la Asociación General Titulado, "Conflicto de Intereses", y lo he cumplido en todo tiempo durante los últimos doce meses con excepción de las exclusiones especificas anexadas e incluidas para referencia en esta declaración.</p>
                
                <h3 style="font-size: 0.9rem; color: #334155; margin-top: 15px; margin-bottom: 8px;">Declaraciones Juradas:</h3>
                <ul style="padding-left: 20px; margin-bottom: 15px;">
                    <li>No he tenido intereses financieros o relaciones de negocios que compiten o están en conflicto con los intereses de la Unión Dominicana.</li>
                    <li>No he tenido intereses financieros en, ni he sido empleado, funcionario, director o fideicomisario; ni he recibido beneficios financieros de alguna empresa negociando como competidor de la Unión Dominicana.</li>
                    <li>No he recibido pagos o regalos substanciales (salvo de valor simbólico) de proveedores o agencias que hacen negocios con la Unión Dominicana.</li>
                    <li>No he servido como funcionario, director fideicomiso, o agente de alguna organización afiliada o subsidiaria en algún proceso de hacer decisiones que involucran intereses financieros o legales adversos a la Unión Dominicana.</li>
                </ul>

                <h3 style="font-size: 0.9rem; color: #334155; margin-top: 15px; margin-bottom: 8px;">Condiciones que constituyen conflicto:</h3>
                <ol style="padding-left: 20px;">
                    <li>Hacer negocio o trabajo fuera de la denominación, usurpando el derecho de exigir servicio completo de sus empleados.</li>
                    <li>Hacer negocio o trabajar para un empleador que compita o esté en conflicto con la denominación.</li>
                    <li>Hacer negocio o trabajar para empleador no denominacional que provea bienes o servicios a la denominación.</li>
                    <li>Hacer uso del hecho de ser empleado para favorecer negocios o empleos fuera de la denominación.</li>
                    <li>Adquirir o alquilar una propiedad sabiendo que la denominación tiene en ella un interés activo o en potencia.</li>
                    <li>Prestar o tomar dinero prestado de una tercera persona que sea suministrador de bienes o servicios de la denominación.</li>
                    <li>Aceptar gratificaciones, favores o regalos de un valor por encima de las cortesías generalmente aceptadas.</li>
                    <li>Hacer uso de cualquier información confidencial gracias al empleo en la denominación para provecho o venta personal.</li>
                </ol>
             </div>

             <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                <div>
                    <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 8px;">Nombre Completo</label>
                    <input type="text" value="${state.user.name}" readonly style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc;">
                </div>
                <div>
                    <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 8px;">Escoge tu posición *</label>
                    <select id="conf_position" required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; appearance: auto; background: white;">
                        <option value="">Seleccione...</option>
                        ${(state.positionsList || []).map(p => `<option value="${p}">${p}</option>`).join('')}
                    </select>
                </div>

                
                <div style="grid-column: span 2; background: #fdf2f8; padding: 20px; border-radius: 12px; border: 1px solid #fbcfe8;">
                    <label style="display: block; font-size: 1rem; font-weight: 800; color: #9d174d; margin-bottom: 12px;">RECONOCIMIENTO DE LOS CONFLICTOS *</label>
                    <div style="display: flex; gap: 20px; align-items: center;">
                        <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer;">
                            <input type="radio" name="conf_choice" value="No, no tengo ningún conflicto" required style="width: 18px; height: 18px;">
                            No, no tengo ningún conflicto.
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer;">
                            <input type="radio" name="conf_choice" value="Sí, tengo conflictos" required style="width: 18px; height: 18px;">
                            Sí, tengo conflictos.
                        </label>
                    </div>
                </div>

                <div style="grid-column: span 2;">
                    <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 8px;">🖋️ Firma Declaratoria Oficial</label>
                    <div class="signature-container">
                        <canvas id="conf_sig" class="signature-canvas"></canvas>
                        <button type="button" class="signature-clear" onclick="app.clearSig('conf_sig')">Borrar</button>
                    </div>
                    <p style="font-size: 0.7rem; color: #be185d; margin-top: 5px;">* Documento digital oficial. Su firma certifica haber leído y comprendido los estatutos descritos y representa fe legal del contenido provisto.</p>
                </div>
             </div>

             <div style="margin-top: 32px; display: flex; justify-content: flex-end;">
                 <button type="submit" class="btn btn-primary" style="padding: 12px 32px; font-size: 1rem; background: #be185d; border: none; box-shadow: 0 4px 14px -4px rgba(190, 24, 93, 0.4);">Firmar y Enviar Declaración</button>
             </div>
        </form>
        `;
    }
  },
  
  init: async function() {
    // Atrapamos el prompt de instalación PWA
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
        if (this.activeView === 'login') this.render();
    });

    // Registro del Service Worker para PWA (Instalación en Android/iOS)
    // Registro del Service Worker para PWA (Instalación en Android/iOS)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(e => console.error(e));
    }
    await state.init();
    
    // 1. Verificar si hay sesión activa para auto-login
    if (state.user) {
        console.log("🔄 Sesión persistente detectada para:", state.user.name);
        this.navigate('dashboard');
    } else {
        this.navigate('login');
    }
    
    // 2. Verificar Deep Link (solo si no hay sesión)
    const urlParams = new URLSearchParams(window.location.search);
    const targetRole = urlParams.get('role');
    
    if (targetRole && !state.user) {
        setTimeout(() => {
            const loginEmailField = document.getElementById('login_email');
            if (loginEmailField) {
                const supervisorData = state.supervisors[targetRole];
                if (supervisorData) {
                    loginEmailField.value = supervisorData.email;
                    this.showToast(`Pre-llenado para ${targetRole}`);
                }
            }
        }, 100);
    }
    console.log("🚀 ADE Vacaciones App Iniciada");
  },

  logout: function() {
    localStorage.removeItem('ade_vac_session');
    state.user = null;
    this.navigate('login');
    this.showToast("Sesión cerrada correctamente");
  },
  
  navigate: function(view, e) {
    if (e) e.preventDefault();
    this.activeView = view;
    this.render(true); // Forzar render al navegar para ignorar bloqueos deisSubmitting
    this.updateNav();
  },
  
  changeMonth: function(delta, e) {
    if (e) e.preventDefault();
    const d = new Date(this.currentCalendarDate);
    d.setMonth(d.getMonth() + delta);
    this.currentCalendarDate = d;
    this.render();
  },
  
  changeYear: function(delta, e) {
    if (e) e.preventDefault();
    const d = new Date(this.currentCalendarDate);
    d.setFullYear(d.getFullYear() + delta);
    this.currentCalendarDate = d;
    this.render();
  },

  setFilter: function(cat) {
    this.currentFilter = cat;
    this.render();
  },
  
  updateNav: function() {
    const sidebar = document.querySelector('aside');
    const profileSection = document.getElementById('user-profile-section');
    const links = document.querySelectorAll('.nav-link');

    if (this.activeView === 'login') {
        if (sidebar) sidebar.style.display = 'none';
        return;
    } 
    if (sidebar) sidebar.style.display = 'flex';

    // Perfil Dinámico
    if (state.user && profileSection) {
        profileSection.style.display = 'block';
        const nameEl = document.getElementById('user-name');
        const infoEl = document.getElementById('user-info');
        const avatarEl = document.getElementById('user-avatar');
        
        if (nameEl) nameEl.innerText = state.user.name;
        if (avatarEl) {
            // Prioridad: Foto en el estado actual, luego foto en la lista de empleados
            const localEmp = state.employeesList.find(e => e.id == state.user.id);
            const photoUrl = state.user.photo || (localEmp ? localEmp.photo : null);
            
            if (photoUrl) {
                avatarEl.style.background = 'white';
                avatarEl.innerHTML = `<img src="${photoUrl}" style="width: 100%; height: 100%; object-fit: cover; object-position: center 20%; border-radius: 50%; display: block;">`;
            } else {
                const initials = (state.user.name || "U").substring(0, 2).toUpperCase();
                avatarEl.style.background = 'var(--secondary)';
                avatarEl.innerText = initials;
                avatarEl.innerHTML = initials;
            }
        }
        if (infoEl) {
            infoEl.innerText = state.user.position || "Institucional";
            if (state.user.yearsOfService !== undefined) {
                infoEl.innerText += ` • ${state.user.yearsOfService} Años`;
            }
        }
    }

    // Activar links
    links.forEach(link => {
      link.classList.remove('active');
      const onclick = link.getAttribute('onclick');
      if (onclick && onclick.includes(this.activeView)) {
        link.classList.add('active');
      }
    });

    const permissions = (state.user && state.user.permissions) ? state.user.permissions : [];
    const userRole = (state.user && state.user.role) ? state.user.role : '';
    
    const mgr = document.getElementById('nav-manager');
    const hr = document.getElementById('nav-hr');
    const asst = document.getElementById('nav-assistant');

    if (mgr) {
        mgr.style.display = (permissions.includes('manager') || userRole === 'manager' || userRole === 'hr') ? 'flex' : 'none';
        const label = mgr.querySelector('span:last-child');
        if (label && state.user) label.innerText = (state.user.supervisorDept || 'Director');
    }
    if (hr) hr.style.display = (permissions.includes('hr') || userRole === 'hr') ? 'flex' : 'none';

    if (asst) asst.style.display = (permissions.includes('assistant') || state.user.role === 'assistant' || state.user.role === 'hr' || permissions.includes('hr')) ? 'flex' : 'none';

    // MOBILE NAV SYNC
    const mobileNav = document.getElementById('mobile-nav');
    const moblHome = document.getElementById('mobl-dashboard');
    const moblMgr = document.getElementById('nav-manager-mobile');
    const moblHR = document.getElementById('nav-hr-mobile');

    if (mobileNav) {
        if (this.activeView === 'login') {
            mobileNav.style.display = 'none';
        } else {
            // Actualizar visibilidad segun permisos
            if (moblMgr) {
                moblMgr.style.display = (permissions.includes('manager') || state.user.role === 'manager') ? 'flex' : 'none';
                const lbl = document.getElementById('mobl-mgr-label');
                if (lbl) lbl.innerText = state.user.supervisorDept || 'Director';
            }
            if (moblHR) moblHR.style.display = (permissions.includes('hr') || state.user.role === 'hr') ? 'flex' : 'none';
            
            // Highlight active mobile tab
            [moblHome, moblMgr, moblHR].forEach(item => {
                if (item) item.classList.remove('active');
            });
            if (this.activeView === 'dashboard' && moblHome) moblHome.classList.add('active');
            if (this.activeView === 'manager' && moblMgr) moblMgr.classList.add('active');
            if (this.activeView === 'hr' && moblHR) moblHR.classList.add('active');
        }
    }
  },
  
  render: function(force = false) {
    if (this.isSubmitting && !force) return; // No interrumpir flujos de envío a menos que se fuerce
    const container = document.getElementById('view-container');
    if (container) {
        container.innerHTML = this.views[this.activeView]();
        this.initPads(); // Initialize signature pads
        this.updateNav(); // Sincronizar Sidebar y Perfil
        window.scrollTo(0, 0);
    }
  },

  initPads: function() {
    this.pads = {};
    const canvases = document.querySelectorAll('.signature-canvas');
    canvases.forEach(canvas => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth || 300;
      canvas.height = 150;
      
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#2f557f';
      
      let drawing = false;
      const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
      };

      const start = (e) => { drawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); };
      const move = (e) => { if(!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
      const stop = () => { drawing = false; };

      canvas.addEventListener('mousedown', start);
      canvas.addEventListener('mousemove', move);
      window.addEventListener('mouseup', stop);
      canvas.addEventListener('touchstart', start);
      canvas.addEventListener('touchmove', move);
      canvas.addEventListener('touchend', stop);
    });
  },

  clearSig: function(id) {
    const canvas = document.getElementById(id);
    if(canvas) canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
  },


  showChangePinModal: function() {
    const newPin = prompt("Introduce tu NUEVO PIN de 4 dígitos (solo números):");
    if (newPin && newPin.length >= 4 && !isNaN(newPin)) {
        const confirmPin = prompt("Confirma tu nuevo PIN escribiéndolo otra vez:");
        if (newPin === confirmPin) {
            this.changePin(newPin);
        } else {
            alert("⚠️ Los PINs no coinciden. Inténtalo de nuevo.");
        }
    } else if (newPin) {
        alert("⚠️ El PIN debe ser numérico y tener al menos 4 dígitos.");
    }
  },

  changePin: async function(newPin) {
    this.showToast("⏳ Actualizando PIN...");
    const success = await state.changePin(newPin);
    if (success) {
        alert("✅ PIN actualizado. Por seguridad, el sistema se cerrará ahora. Ingresa con tu nuevo PIN.");
        this.logout();
    } else {
        alert("❌ Error al actualizar el PIN. Inténtalo más tarde.");
    }
  },

  resetEmployeePin: async function(id) {
    const emp = state.employeesList.find(e => e.id == id);
    if (!confirm(`¿Estás segura de que deseas resetear el PIN de ${emp ? emp.name : 'este empleado'}? Se restaurará al valor por defecto (los últimos 4 dígitos de su ID).`)) return;
    
    this.showToast("⏳ Reseteando PIN...");
    const success = await state.resetEmployeePin(id);
    if (success) {
        alert(`✅ PIN de ${emp ? emp.name : 'empleado'} restaurado con éxito.`);
        this.render();
    } else {
        alert("❌ Error al resetear el PIN.");
    }
  },

  handleLogin: async function(e) {
    if (e) e.preventDefault();
    console.log("🛠️ Intentando ingresar con sistema de Usuario...");
    try {
        const username = document.getElementById('login_user').value;
        const pin = document.getElementById('login_pass').value;
        
        const userUser = await state.authenticate(username, pin);
        if (userUser) {
            state.user = userUser;
            state.saveSession();
            
            let targetView = 'dashboard';
            // Mapear roles antiguos a vistas
            if (['Presidencia', 'Secretaría', 'Tesorería'].includes(userUser.role) || userUser.role === 'manager') {
                targetView = 'manager';
            } else if (userUser.role === 'RRHH' || userUser.role === 'hr') {
                targetView = 'hr';
            } else if (userUser.role === 'assistant') {
                targetView = 'assistant';
            }
            
            this.navigate(targetView);
            this.showToast(`🔓 Bienvenid@, ${userUser.name}`);
        } else {
            alert("⚠️ Datos incorrectos. Asegúrese de escribir su Nombre Completo y PIN oficial.");
        }
    } catch (err) {
        console.error("❌ Fallo en Login:", err);
        alert("⚠️ Error en el proceso de ingreso: " + (err.message || err));
    }
  },

  installPWA: async function() {
    if (!this.deferredPrompt) return;
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        console.log('User accepted the PWA install');
    }
    this.deferredPrompt = null;
    this.render();
  },

  sendInstitutionalEmail: function(to, data) {
    const roleParam = to.includes('gdpaulino') ? 'Presidencia' : (to.includes('prjunior') ? 'Secretaría' : (to.includes('leidymartinez') ? 'Tesorería' : (to.includes('dominicanaeste') ? 'RRHH' : 'employee')));
    const deepLink = `${location.origin}${location.pathname}?role=${roleParam}`;

    // --- ENVÍO REAL (EmailJS dinámico) ---
    if (EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            from_name: "ASOCIACION DOMINICANA DEL ESTE RR HH",
            to_email: to,
            employee_name: data.employeeName,
            email: data.email,
            period: data.period,
            category: data.category,
            supervisor: data.supervisor,
            link: deepLink,
            status_title: data.statusTitle || "Nueva Solicitud ADE",
            status_color: data.statusColor || "#1e293b",
            message_body: data.messageBody || "Se ha recibido una nueva solicitud para su revisión.",
            button_text: data.buttonText || "Acceder y Firmar"
        }, EMAILJS_PUBLIC_KEY)
        .then(() => console.log("📧 Email real enviado exitosamente a: " + to))
        .catch((err) => {
            console.error("❌ Error EmailJS:", err);
            alert("⚠️ Error en el envío de correo real: " + (err.text || err.message || "Verifique sus llaves de EmailJS"));
        });
    }

    // --- SIMULACIÓN VISUAL ---
    const overlay = document.createElement('div');
    overlay.className = 'email-overlay';
    overlay.style.cssText = `position: fixed; inset: 0; background: rgba(15, 23, 42, 0.9); z-index: 20000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.3s;`;
    
    overlay.innerHTML = `
        <div style="background: #f1f5f9; width: 100%; max-width: 500px; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); font-family: 'Inter', sans-serif;">
            <div style="background: #fff; padding: 12px 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;">📧 Recibido en: ${to}</span>
                <button onclick="this.closest('.email-overlay').remove()" style="background: #fee2e2; border: none; cursor: pointer; color: #991b1b; padding: 4px 12px; border-radius: 6px; font-size: 0.7rem; font-weight: 700;">CERRAR CORREO</button>
            </div>
            
            <div style="padding: 32px;">
                <div style="background: ${data.statusColor || '#1e293b'}; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                    <h2 style="color: white; margin: 0; font-size: 1.1rem; letter-spacing: 0.05em;">ASOCIACIÓN DOMINICANA DEL ESTE</h2>
                    <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 0.7rem; text-transform: uppercase; font-weight: 700;">${data.statusTitle || 'Gestion Digital'}</p>
                </div>
                
                <div style="background: white; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                    <p style="font-size: 1rem; color: #1e293b; line-height: 1.6; margin-bottom: 24px;">
                        ${data.messageBody}
                    </p>
                    
                    <div style="background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
                        <div style="display: grid; grid-template-columns: 100px 1fr; gap: 8px; font-size: 0.85rem; color: #475569;">
                            <b>Colaborador:</b> <span>${data.employeeName}</span>
                            <b>Periodo:</b> <span>${data.period}</span>
                            <b>Categoría:</b> <span>${data.category}</span>
                        </div>
                    </div>

                    <a href="${location.href}" style="display: block; background: ${data.statusColor || '#1e293b'}; color: white; text-align: center; padding: 16px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 0.9rem;">${data.buttonText || 'Ver Solicitud'}</a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
  },

  approveRequest: async function(id, role) {
    const canvasId = role === 'hr' ? `hr_sig_${id}` : `manager_sig_${id}`;
    const canvas = document.getElementById(canvasId);
    if(!canvas) return;
    
    const signature = canvas.toDataURL();
    try {
      await state.approveRequest(id, role, signature);
      const req = state.vacationRequests.find(r => r.id === id);
      
      if (role === 'manager') {
          // Notificar a RRHH
          this.sendInstitutionalEmail(this.supervisorEmails['RRHH'], {
              employeeName: req.employeeName,
              email: req.email,
              period: `${req.startDate} a ${req.endDate}`,
              category: req.category,
              supervisor: req.supervisor,
              statusTitle: "Visto Bueno de Director",
              statusColor: "#0284c7", // Azul claro (celeste)
              messageBody: `El departamento de ${req.supervisor} ha dado el Visto Bueno a esta solicitud. Requiere su autorización final.`,
              buttonText: "Autorizar Solicitud"
          });
          this.showToast(`✅ Visto Bueno enviado a RRHH`);
      } else {
          // Notificar al Empleado (ÉXITO)
          this.sendInstitutionalEmail(req.email, {
              employeeName: req.employeeName,
              email: req.email,
              period: `${req.startDate} a ${req.endDate}`,
              category: req.category,
              supervisor: req.supervisor,
              statusTitle: "SOLICITUD APROBADA",
              statusColor: "#10b981", // Verde
              messageBody: "¡Buenas noticias! Tu solicitud de vacaciones ha sido aprobada por todos los niveles institucionales.",
              buttonText: "Entrar al Sistema"
          });
          
          // GENERAR PDF Y GUARDAR EN DRIVE (RRHH)
          this.generateArchivalPDF(req);
          this.showToast(`💾 Archivado en Drive: Vacaciones/${new Date().getFullYear()}/${req.employeeName}`);
          
          // NOTIFICACIÓN DE ENVÍO AUTOMÁTICO AL SOLICITANTE
          setTimeout(() => this.showToast(`📧 PDF Oficial enviado a ${req.email} para su archivo personal.`), 2000);
      }
      this.render();
    } catch(e) {
      this.showToast('Error en la aprobación');
    }
  },

  rejectRequest: async function(id) {
    try {
        if (!confirm("¿Desea rechazar esta solicitud? Se notificará al empleado.")) return;
        await state.rejectRequest(id);
        const req = state.vacationRequests.find(r => r.id === id);
        
        // Notificar al Empleado (RECHAZO)
        this.sendInstitutionalEmail(req.email, {
            employeeName: req.employeeName,
            email: req.email,
            period: `${req.startDate} a ${req.endDate}`,
            category: req.category,
            supervisor: req.supervisor,
            statusTitle: "SOLICITUD RECHAZADA",
            statusColor: "#ef4444", // Rojo
            messageBody: "Lo sentimos. Tu solicitud de vacaciones ha sido rechazada por el departamento responsable. Favor contactar para más detalles.",
            buttonText: "Ver Detalles"
        });

        this.showToast(`❌ Solicitud Rechazada y Notificada`);
        this.render();
    } catch(e) {
        this.showToast('Error');
    }
  },

  archiveRequest: async function(id) {
     // ... logic unchanged
  },

  toggleEvangelismo: async function(id) {
    try {
        await state.toggleEvangelismo(id);
        this.showToast("⚡ Permiso de Evangelismo Actualizado (Presidente)");
        this.render();
    } catch(e) {
        this.showToast("Error en autorización");
    }
  },
  
  updateFormType: function() {
    const type = document.getElementById('vac_type').value;
    const medicalFields = document.getElementById('medical_fields');
    if (medicalFields) medicalFields.style.display = (type === 'Médica') ? 'block' : 'none';
    this.calculateDuration();
  },

  calculateDuration: function() {
    const startInput = document.getElementById('start_date');
    const endInput = document.getElementById('end_date');
    const type = document.getElementById('vac_type').value;
    const display = document.getElementById('duration_display');
    const count = document.getElementById('days_count');
    const hAlert = document.getElementById('holiday_alert');
    const hMsg = document.getElementById('holiday_msg');

    if (!startInput || !endInput) return;

    // Detectar Feriados si hay fechas
    if (startInput.value && endInput.value) {
        const [sy, sm, sd] = startInput.value.split('-').map(Number);
        const [ey, em, ed] = endInput.value.split('-').map(Number);
        
        const s = new Date(sy, sm-1, sd);
        const e = new Date(ey, em-1, ed);
        const diffT = Math.abs(e - s);
        const diffD = Math.ceil(diffT / (1000 * 60 * 60 * 24)) + 1;
        
        const hList = app.holidays;
        let hCount = 0; let hF = []; let cur = new Date(s);
        while(cur <= e) {
            const k = `${cur.getDate()}/${cur.getMonth() + 1}/${cur.getFullYear()}`;
            if(hList[k]) { hCount++; hF.push(hList[k]); }
            cur.setDate(cur.getDate() + 1);
        }

        if (hCount > 0 && hAlert && hMsg) {
            hAlert.style.display = 'block';
            hAlert.style.borderLeftColor = '#10b981';
            hMsg.innerHTML = `🌟 <b>Beneficio por Feriado Automático:</b> El sistema detectó <b>${hF.join(', ')}</b> dentro del periodo. El sistema reconoce los feriados y protegerá su saldo, restando automáticamente los días correspondientes a feriados.`;
        } else if (hAlert) {
            hAlert.style.display = 'none';
        }
    }

    // Lógica para Licencias Fijas
    if (type === 'Casamiento') {
        display.innerText = "5 Días (Fijo)";
        display.style.color = '#10b981';
        count.innerText = "5";
        return;
    }
    if (type === 'Fallecimiento') {
        display.innerText = "3 Días (Fijo)";
        display.style.color = '#10b981';
        count.innerText = "3";
        return;
    }
    if (type === 'Médica') {
        const medicalDays = document.getElementById('medical_days').value || 0;
        display.innerText = "Días Médicos";
        display.style.color = '#10b981';
        count.innerText = medicalDays;
        return;
    }
    // Lógica estándar para Vacaciones (múltiplos de 7)
    const startDate = startInput.value;
    const endDate = endInput.value;
    const includeEvangelismo = document.getElementById('include_evangelismo')?.checked || false;

    if (startDate && endDate) {
        const [sy, sm, sd] = startDate.split('-').map(Number);
        const [ey, em, ed] = endDate.split('-').map(Number);
        const s = new Date(sy, sm-1, sd);
        const e = new Date(ey, em-1, ed);
        const diffTime = Math.abs(e - s);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        count.innerText = diffDays;

        // Si incluye evangelismo, descontamos 10 días para validar el balance reglamentario
        const daysForQuota = includeEvangelismo ? diffDays - 10 : diffDays;

        if (daysForQuota >= 0) {
            display.innerText = `${daysForQuota} Días${includeEvangelismo ? ' + 10 días Evangelismo' : ''}`;
            display.style.color = '#10b981';
        } else {
            display.innerText = "Fechas Inválidas";
            display.style.color = '#ef4444';
        }
    }
  },

  calculateAnnualPlanBalance: function() {
      const budget = (state.getWeeksByServiceYears(state.user.yearsOfService || 0)) * 7;
      let usedDays = 0;
      let holidaysFound = 0;

      const calcBlock = (startId, endId) => {
          const s = document.getElementById(startId)?.value;
          const e = document.getElementById(endId)?.value;
          if (s && e) {
              const dStart = new Date(s + 'T00:00:00');
              const dEnd = new Date(e + 'T00:00:00');
              if (dEnd >= dStart) {
                  let diff = Math.ceil(Math.abs(dEnd - dStart) / (1000 * 60 * 60 * 24)) + 1;
                  // Detect holidays in this block
                  let hCount = 0; let cur = new Date(dStart);
                  while (cur <= dEnd) {
                      const k = `${cur.getDate()}/${cur.getMonth() + 1}/${cur.getFullYear()}`;
                      if (state.holidays && state.holidays[k]) hCount++;
                      cur.setDate(cur.getDate() + 1);
                  }
                  holidaysFound += hCount;
                  return Math.max(0, diff - hCount);
              }
          }
          return 0;
      };

      usedDays += calcBlock('ap_start_1', 'ap_end_1');
      usedDays += calcBlock('ap_start_2', 'ap_end_2');
      usedDays += calcBlock('ap_start_3', 'ap_end_3');

      const remSpan = document.getElementById('ap_remaining_days');
      const planSpan = document.getElementById('ap_planned_days');
      const noteParams = document.getElementById('ap_holiday_note');

      if (planSpan) planSpan.innerText = usedDays;
      if (remSpan) {
          const rem = budget - usedDays;
          remSpan.innerText = rem;
          if (rem < 0) {
              remSpan.style.color = '#ef4444'; // Red
          } else if (rem === 0) {
              remSpan.style.color = '#10b981'; // Green (Perfect)
          } else {
              remSpan.style.color = '#f59e0b'; // Amber (Still days left)
          }
      }

      if (noteParams) {
          if (holidaysFound > 0) {
              noteParams.style.display = 'block';
              noteParams.innerText = `✅ El sistema ha blindado automáticamente ${holidaysFound} día(s) oficial(es) detectado(s) en sus periodos planificados.`;
          } else {
              noteParams.style.display = 'none';
          }
      }
  },

  requestLicense: function(type) {
    this.navigate('form');
    setTimeout(() => {
        const select = document.getElementById('vac_type');
        if (select) {
            select.value = type;
            this.updateFormType();
        }
    }, 100);
  },

  submitForm: async function(e) {
    if (e) e.preventDefault();
    const type = document.getElementById('vac_type').value;
    const start = document.getElementById('start_date').value;
    const end = document.getElementById('end_date').value;
    const email = document.getElementById('user_email').value;
    const supervisor = document.getElementById('supervisor_id').value;
    const canvas = document.getElementById('applicant_sig');
    const signature = canvas ? canvas.toDataURL() : null;

    if (!start || !end || !email) return alert("⚠️ Complete los campos obligatorios.");

    let durationText = "";
    let finalDays = 0;

    // Validación de Negocio según el Tipo
    const includeEvangelismo = document.getElementById('include_evangelismo')?.checked || false;

    if (['Local', 'Internacional', 'Conjunta'].includes(type)) {
        const [sy, sm, sd] = start.split('-').map(Number);
        const [ey, em, ed] = end.split('-').map(Number);
        const s = new Date(sy, sm-1, sd);
        const e_date = new Date(ey, em-1, ed);
        finalDays = Math.ceil(Math.abs(e_date - s) / (1000 * 60 * 60 * 24)) + 1;
        
        const daysForQuota = includeEvangelismo ? finalDays - 10 : finalDays;

        if (daysForQuota < 0) {
            return alert("⚠️ BLOQUEO INSTITUCIONAL: Revise las fechas seleccionadas.");
        }
        durationText = `${daysForQuota} Días${includeEvangelismo ? ' + 10 días Evangelismo' : ''}`;
    } else if (type === 'Casamiento') {
        finalDays = 5;
        durationText = "5 días (Matrimonio)";
    } else if (type === 'Fallecimiento') {
        finalDays = 3;
        durationText = "3 días (Luto)";
    } else if (type === 'Médica') {
        finalDays = parseInt(document.getElementById('medical_days').value);
        if (!finalDays) return alert("Indique cuántos días dice su licencia médica.");
        durationText = `${finalDays} días (Médico)`;
    }

    // Manejo de Adjunto (Médico)
    let attachmentData = null;
    const fileInput = document.getElementById('medical_attachment');
    if (fileInput && fileInput.files[0]) {
        attachmentData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target.result);
            reader.readAsDataURL(fileInput.files[0]);
        });
    }

    const newReq = {
        employeeId: state.user.id,
        employeeName: state.user.name,
        email: email,
        supervisor: supervisor,
        category: type,
        startDate: start,
        endDate: end,
        status: "pending",
        duration: durationText,
        totalDays: finalDays,
        evangelismoTaken: includeEvangelismo,
        signatures: { applicant: signature, manager: null, hr: null },
        attachment: attachmentData
    };
    
    try {
      this.showToast("🚀 Enviando solicitud...");
      await state.addRequest(newReq);
      
      // Notificación al Supervisor
      this.sendInstitutionalEmail(this.supervisorEmails[supervisor], {
          employeeName: state.user.name,
          email: email,
          period: `${start} a ${end}`,
          category: type,
          supervisor: supervisor,
          statusTitle: "NUEVA SOLICITUD DE PERMISO/VACACIONES",
          statusColor: "#1e293b",
          messageBody: `Se ha recibido una nueva solicitud de ${state.user.name} para su aprobación institucional.`,
          buttonText: "Revisar y Firmar"
      });

      // CONFIRMACIÓN AL EMPLEADO (SOLICITANTE)
      this.sendInstitutionalEmail(email, {
          employeeName: state.user.name,
          email: email,
          period: `${start} a ${end}`,
          category: type,
          supervisor: supervisor,
          statusTitle: "CONFIRMACIÓN DE SOLICITUD - ADE",
          statusColor: "#0284c7",
          messageBody: `Hola ${state.user.name}, hemos recibido tu solicitud de ${type}. Actualmente se encuentra en revisión por tu responsable directo (${supervisor}).`,
          buttonText: "Ver Estado de Solicitud"
      });

      this.navigate('dashboard');
      this.showToast("✅ Solicitud enviada correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al enviar la solicitud.");
    }
  },
  
  submitAnnualPlanForm: async function(e) {
    if (e) e.preventDefault();
    const s1 = document.getElementById('ap_start_1').value;
    const e1 = document.getElementById('ap_end_1').value;
    const s2 = document.getElementById('ap_start_2').value;
    const e2 = document.getElementById('ap_end_2').value;
    const s3 = document.getElementById('ap_start_3').value;
    const e3 = document.getElementById('ap_end_3').value;
    
    const canvas = document.getElementById('ap_applicant_sig');
    const signature = canvas ? canvas.toDataURL() : null;

    if (!s1 || !e1) return alert("⚠️ Al menos el Fechas del Periodo 1 son obligatorias.");
    if (!signature || signature.length < 100) return alert("⚠️ Debe firmar la planificación oficial.");

    // Validar asignacion reglamentaria estricta
    const budget = (state.getWeeksByServiceYears(state.user.yearsOfService || 0)) * 7;
    // Leemos el resultado desde el DOM que ya calculó todo (incluyendo Feriados)
    const usedDays = parseInt(document.getElementById('ap_planned_days')?.innerText || '0');

    if (usedDays !== budget) {
        return alert(`⚠️ DEBE COMPLETAR SU ASIGNACIÓN REGLAMENTARIA:\n\nSolamente ha planificado ${usedDays} de sus ${budget} días institucionales. No devuelva balances. Ajuste sus periodos hasta que su saldo Disponible sea 0 antes de enviar.`);
    }

    const periods = [];
    periods.push(`${s1} al ${e1}`);
    if (s2 && e2) periods.push(`${s2} al ${e2}`);
    if (s3 && e3) periods.push(`${s3} al ${e3}`);

    const newPlan = {
        employeeId: state.user.id,
        employeeName: state.user.name,
        supervisor: state.user.supervisor,
        supervisorDept: state.user.supervisorDept,
        assignedWeeks: budget / 7,
        periods: periods,
        status: "submitted",
        signatures: { applicant: signature, manager: null, hr: null }
    };
    
    try {
      this.showToast("🚀 Enviando Planificación Institucional...");
      if (typeof state.submitAnnualPlan !== 'undefined') {
        await state.submitAnnualPlan(newPlan);
      }
      this.navigate('dashboard');
      setTimeout(() => alert("El Formulario de Planificación ha sido procesado y añadido a la Consolidación Anual del Departamento de Recursos Humanos exitosamente."), 500);
    } catch (err) {
      console.error(err);
      alert("Error al enviar la planificación.");
    }
  },

  submitConflictoForm: async function(event) {
    event.preventDefault();
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    const position = document.getElementById('conf_position').value;
    const choiceEl = document.querySelector('input[name="conf_choice"]:checked');
    const canvas = document.getElementById('conf_sig');
    const signature = canvas ? canvas.toDataURL() : null;

    if (!choiceEl) {
        this.isSubmitting = false;
        return alert("⚠️ Seleccione una respuesta al Reconocimiento de los Conflictos.");
    }
    if (!signature || signature.length < 100) {
        this.isSubmitting = false;
        return alert("⚠️ Debe firmar su declaración digitalmente.");
    }

    const choice = choiceEl.value;
    const year = new Date().getFullYear();

    const data = {
        employeeId: state.user.id,
        employeeName: state.user.name,
        position: position,
        email: state.user.email || "No provisto",
        year: year,
        choice: choice,
        signature: signature
    };

    const btn = event.submitter;
    const originalText = btn.innerText;

    try {
        btn.disabled = true;
        btn.innerText = "⏳ PROCESANDO...";
        
        console.log("Submit Phase: 1. DB Registration");
        this.showToast("1. Registrando en Base de Datos...");
        const docId = await state.submitConflicto(data);
        
        console.log("Submit Phase: 2. PDF Generation");
        this.showToast("2. Generando Documento PDF...");
        const blob = await this.generateConflictoPDF(data, false);
        
        if (!blob) throw new Error("No se pudo generar el PDF.");

        console.log("Submit Phase: 3. Cloud Archival");
        this.showToast("3. Subiendo a Nube Institucional...");
        const cleanName = data.employeeName.trim().replace(/\s+/g, '_');
        const cloudPath = `Conflicto_Interes/${year}/${cleanName}/Declaracion_${data.employeeId}.pdf`;
        
        const pdfUrl = await state.uploadPDFToCloud(blob, cloudPath);
        
        if (pdfUrl) {
            console.log("Submit Phase: 4. Finalizing Metadata");
            await state.updateConflicto(docId, { pdfUrl: pdfUrl });
        }
        
        // Redirección e Información
        alert("✅ Su Declaración ha sido registrada exitosamente.");
        this.isSubmitting = false; // Reset antes de navegar
        this.navigate('dashboard');
        
        // Notificación en segundo plano (no bloquea navegación final)
        if (data.email) {
            this.sendInstitutionalEmail(data.email, {
                employeeName: data.employeeName,
                email: data.email,
                period: data.year,
                statusTitle: "Declaración Digital Registrada",
                messageBody: `Se ha registrado exitosamente su Declaración de Conflicto de Interés (${data.year}).`,
                buttonText: "Ver Mi Declaración",
                link: pdfUrl || "#"
            });
        }
        
    } catch (err) {
        console.error("DEBUG SUBMIT ERROR:", err);
        this.showToast("❌ Error en el proceso.");
        alert("⚠️ Hubo un inconveniente al procesar la nube, pero su registro base fue intentado. Por favor verifique su dashboard o intente más tarde.");
        this.isSubmitting = false;
        this.navigate('dashboard');
    } finally {
        this.isSubmitting = false;
        btn.disabled = false;
        btn.innerText = originalText;
    }
  },

  togglePositionsEditor: function() {
    let modal = document.getElementById('positions_editor_modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'positions_editor_modal';
      modal.style.position = 'fixed';
      modal.style.inset = '0';
      modal.style.background = 'rgba(0,0,0,0.6)';
      modal.style.zIndex = '50000';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.backdropFilter = 'blur(4px)';
      document.body.appendChild(modal);
    } else {
      if (modal.style.display === 'flex') {
        modal.style.display = 'none';
        return;
      }
    }

    let positionsHtml = (state.positionsList || []).map((pos, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
            <span style="font-weight: 700; color: var(--primary);">${pos}</span>
            <button class="btn" style="background: #fee2e2; color: #b91c1c; padding: 6px 12px; font-size: 0.75rem;" onclick="app.removePosition('${pos.replace(/'/g, "\\'")}')">Eliminar</button>
        </div>
    `).join('');

    let html = `
      <div class="card fade-in glass" style="width: 500px; max-width: 90%; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); max-height: 90vh; display: flex; flex-direction: column;">
        <h2 style="font-size: 1.5rem; color: var(--primary); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
          <span class="material-symbols-outlined">work</span> Catálogo de Roles/Posiciones
        </h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 24px;">Administre las posiciones o cargos que los empleados pueden tener dentro de la institución.</p>
        
        <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;" id="positions_list_container">
            ${positionsHtml}
        </div>

        <div style="display: flex; gap: 12px; justify-content: space-between;">
            <button class="btn" onclick="app.addPosition()" style="background: #10b981; color: white; font-weight: 700; flex: 1;">+ Añadir Cargo</button>
            <button class="btn" onclick="document.getElementById('positions_editor_modal').style.display='none'" style="background: #f1f5f9; color: #475569; font-weight: 700; flex: 1;">Cerrar</button>
        </div>
      </div>
    `;
    modal.innerHTML = html;
    modal.style.display = 'flex';
  },

  toggleSupervisorsEditor: function() {
    let modal = document.getElementById('supervisors_editor_modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'supervisors_editor_modal';
      modal.style.position = 'fixed';
      modal.style.inset = '0';
      modal.style.background = 'rgba(0,0,0,0.6)';
      modal.style.zIndex = '50000';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.backdropFilter = 'blur(4px)';
      document.body.appendChild(modal);
    } else {
      if (modal.style.display === 'flex') {
        modal.style.display = 'none';
        return;
      }
    }

    let html = `
      <div class="card fade-in glass" style="width: 500px; max-width: 90%; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto;">
        <h2 style="font-size: 1.5rem; color: var(--primary); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
          <span class="material-symbols-outlined">manage_accounts</span> Configurar Responsables
        </h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 24px;">Modifique los correos y nombres de los responsables departamentales que autorizan las solicitudes y de Recursos Humanos.</p>
        
        <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
    `;

    for (const [dept, data] of Object.entries(state.supervisors || {})) {
        html += `
          <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
             <h3 style="font-size: 1rem; color: #0f172a; margin-bottom: 12px;">Departamento: ${dept}</h3>
             <div style="display: flex; flex-direction: column; gap: 12px;">
                <div>
                   <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 4px;">Nombre del Responsable</label>
                   <input type="text" id="sup_name_${dept}" value="${data.name}" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; font-family: inherit;">
                </div>
                <div>
                   <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 4px;">Correo Institucional</label>
                   <input type="email" id="sup_email_${dept}" value="${data.email}" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; font-family: inherit;">
                </div>
             </div>
          </div>
        `;
    }

    html += `
        </div>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button class="btn" onclick="document.getElementById('supervisors_editor_modal').style.display='none'" style="background: #f1f5f9; color: #475569; font-weight: 700;">Cancelar</button>
            <button class="btn" id="btn_save_supervisors" onclick="app.saveSupervisorsConfig()" style="background: var(--primary); color: white; font-weight: 700;">Guardar Cambios</button>
        </div>
      </div>
    `;
    modal.innerHTML = html;
    modal.style.display = 'flex';
  },

  saveSupervisorsConfig: async function() {
    const btn = document.getElementById('btn_save_supervisors');
    if (btn) { btn.disabled = true; btn.innerText = "Guardando..."; }
    let newSups = JSON.parse(JSON.stringify(state.supervisors));
    for (const dept of Object.keys(newSups)) {
       const nameInput = document.getElementById('sup_name_' + dept);
       const emailInput = document.getElementById('sup_email_' + dept);
       if (nameInput) newSups[dept].name = nameInput.value.trim();
       if (emailInput) newSups[dept].email = emailInput.value.trim();
    }
    await state.updateSupervisors(newSups);
    document.getElementById('supervisors_editor_modal').style.display = 'none';
    app.render();
  },


  addPosition: async function() {
      const p = prompt("Nombre de la posición:");
      if (!p) return;
      await state.updatePositions([...(state.positionsList || []), p.trim()]);
      this.render();
  },

  removePosition: async function(pos) {
      if (!confirm(`¿Eliminar '${pos}'?`)) return;
      await state.updatePositions((state.positionsList || []).filter(item => item !== pos));
      this.render();
  },

  deleteConflictDeclaration: async function(id) {
    if (!confirm("⚠️ ¿Está seguro que desea ANULAR esta declaración de conflicto? Esta acción no se puede deshacer.")) return;
    try {
        await state.deleteConflictDeclaration(id);
        this.showToast("✅ Declaración anulada correctamente");
        this.render();
    } catch(e) {
        console.error(e);
        this.showToast("❌ Error al anular la declaración");
    }
  },

  downloadIndividualConflictoPDF: function(id) {
    const data = (state.conflictDeclarations || []).find(d => d.id === id);
    if (data) {
        this.showToast(`📄 Generando PDF para ${data.employeeName}...`);
        this.generateConflictoPDF(data, true);
    }
  },

  downloadConflictBatch: function() {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const recent = (state.conflictDeclarations || []).filter(d => {
        const date = d.createdAt ? (d.createdAt.seconds ? new Date(d.createdAt.seconds * 1000) : new Date(d.createdAt)) : new Date();
        return date >= fiveDaysAgo;
    });

    if (recent.length === 0) return this.showToast("No hay declaraciones recientes para descargar.");

    this.showToast(`📂 Iniciando descarga de ${recent.length} declaraciones... No cierre la ventana.`);
    
    recent.forEach((data, index) => {
        setTimeout(() => {
            console.log(`Descargando conflicto secuencial: ${data.employeeName}`);
            this.generateConflictoPDF(data, true);
        }, index * 1200); // 1.2s entre archivos para evitar bloqueo del navegador
    });
  },

  generateConflictoPDF: async function(data, isDownloadOnly) {
    if (!window.jspdf) return null;
    const doc = new jspdf.jsPDF('p', 'mm', 'a4');
    
    // Configuración de Estilo Institucional (Azul Auditoría)
    const primaryColor = [30, 58, 138]; // #1e3a8a
    const textColor = [17, 24, 39];
    const grayColor = [107, 114, 128];

    // Barra superior
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 210, 8, 'F');

    // Cabecera
    doc.setFontSize(18); doc.setTextColor(30, 58, 138); doc.setFont("helvetica", "bold");
    doc.text("ASOCIACIÓN DOMINICANA DEL ESTE", 45, 25);
    
    doc.setFontSize(10); doc.setTextColor(107, 114, 128); doc.setFont("helvetica", "normal");
    doc.text("Departamento de Recursos Humanos - Secretaría Ejecutiva", 55, 32);
    
    doc.setFontSize(14); doc.setTextColor(17, 24, 39); doc.setFont("helvetica", "bold");
    doc.text("DECLARACIÓN DE CONFLICTO DE INTERESES", 50, 45);

    // Fecha y Año
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 50, 190, 50);
    
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    const creationDate = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    doc.text(`REGISTRO CREADO: ${creationDate}`, 20, 58);
    doc.text(`AÑO FISCAL: ${data.year}`, 160, 58);

    // Información del Declarante
    doc.setFillColor(243, 244, 246);
    doc.rect(20, 65, 170, 28, 'F');
    
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(30, 58, 138);
    doc.text("DATOS DEL DECLARANTE", 25, 73);
    
    doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(17, 24, 39);
    doc.text(`Nombre Completo: ${data.employeeName}`, 25, 80);
    doc.text(`Posición Oficial: ${data.position || 'No especificada'}`, 25, 86);


    // Texto de la Declaración
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(30, 58, 138);
    doc.text("RECONOCIMIENTO Y DECLARACIÓN", 20, 115);
    
    doc.setFontSize(9); doc.setTextColor(17, 24, 39); doc.setFont("helvetica", "normal");
    const intro = "Certifico que he leído y acepto el reglamento de la Asociación General titulado 'Conflicto de Intereses'. Declaro que, hasta donde tengo conocimiento, los miembros de mi familia inmediata y yo cumplimos con dicho reglamento, salvo las excepciones notificadas por escrito.";
    const introLines = doc.splitTextToSize(intro, 170);
    doc.text(introLines, 20, 122);

    // Estatus de la Respuesta
    doc.setFillColor(data.choice.includes('No') ? 240 : 254, 249, 240);
    doc.rect(20, 135, 170, 15, 'F');
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); 
    if (data.choice.includes('No')) {
        doc.setTextColor(21, 128, 61);
    } else {
        doc.setTextColor(185, 28, 28);
    }
    doc.text(`RESPUESTA OFICIAL: ${data.choice.toUpperCase()}`, 70, 145);

    // Área de Firma
    if (data.signature) {
        try {
            doc.addImage(data.signature, 'PNG', 75, 160, 60, 25);
        } catch(e) { console.warn("Error agregando firma", e); }
    }
    
    doc.setDrawColor(30, 58, 138);
    doc.line(70, 185, 140, 185);
    doc.setFontSize(10); doc.setTextColor(30, 58, 138);
    doc.text("FIRMA DIGITAL DEL EMPLEADO", 75, 192);
    doc.setFontSize(8); doc.setTextColor(100, 100, 100);
    doc.text("(Certificado Electrónicamente por ADE)", 80, 196);

    // Footer
    doc.setFontSize(8); doc.setTextColor(150, 150, 150);
    doc.text("Asociación Dominicana del Este - Recursos Humanos", 55, 285);

    if (isDownloadOnly) {
        doc.save(`Conflicto_${data.employeeName.replace(/\s+/g, '_')}_${data.year}.pdf`);
        return null;
    } else {
        return doc.output('blob');
    }
  },

  isDriveConnected: function() {
    return !!localStorage.getItem('gdrive_token');
  },

  connectDrive: function() {
     // Lógica de vinculación con Google Drive API
     // Al ser una plataforma estática, se requiere la autorización manual del usuario para crear la carpeta Vacaciones
     this.showToast("🔗 Iniciando conexión con Drive de la Asociación...");
     // ... (Implementación de tokenClient de Google se añadiría aquí con un Client ID válido)
     this.showToast("⚠️ Para archivo automático, se requiere configurar el API Client ID en app.js");
  },

  uploadToDrive: async function(blob, folderPath, fileName) {
     if (!this.isDriveConnected()) return console.log("Drive no vinculado.");
     this.showToast(`🚀 Subiendo a Nube Institucional: ${fileName}`);
     // Lógica de creación de carpetas jerárquicas en Drive y carga del Blob
  },

  getHolidaysInRange: function(start, end) {
      if (!start || !end) return 0;
      let count = 0;
      let d = new Date(start);
      let e = new Date(end);
      while(d <= e) {
          const hKey = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
          if (this.holidays[hKey]) count++;
          d.setDate(d.getDate() + 1);
      }
      return count;
  },

  generateArchivalPDF: async function(req) {
    if (!window.jspdf) return null;
    const doc = new jspdf.jsPDF('p', 'mm', 'a4');
    
    // Header Institucional - ADE Branding
    doc.setFillColor(30, 58, 138); doc.rect(0, 0, 210, 35, 'F');
    
    doc.setFontSize(20); doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("ASOCIACIÓN DOMINICANA DEL ESTE", 105, 12, { align: "center" });
    
    doc.setFontSize(14); doc.setFont("helvetica", "normal");
    doc.text("RECURSOS HUMANOS - VACACIONES EMPLEADOS", 105, 20, { align: "center" });
    
    doc.setFontSize(10); doc.text("GESTIÓN INSTITUCIONAL DE LICENCIAS Y VACACIONES", 105, 28, { align: "center" });

    // Título Central
    doc.setFontSize(14); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold");
    doc.text("FORMULARIO DE SOLICITUD / ARCHIVO", 105, 52, { align: "center" });
    
    doc.setDrawColor(30, 58, 138); doc.setLineWidth(1); doc.line(30, 56, 180, 56);

    // Bloque de Datos (Información del Empleado)
    let y = 70;
    const feriados = this.getHolidaysInRange(req.startDate, req.endDate);
    const totalDias = parseInt(req.duration || 0);
    const totalSemanas = Math.ceil((totalDias + feriados) / 7);

    // Panel de Información Estilizado
    doc.setFillColor(248, 250, 252); doc.rect(20, 65, 170, 110, 'F');
    doc.setDrawColor(203, 213, 225); doc.rect(20, 65, 170, 110, 'S');
    
    const info = [
        ["COLABORADOR:", (req.employeeName || "").toUpperCase()],
        ["DEPARTAMENTO:", req.supervisorDept || req.supervisor || "N/A"],
        ["TIPO DE PERMISO:", (() => {
            const cat = req.category || "VACACIONES";
            if (cat === 'Local') return "VACACIONES LOCALES";
            if (cat === 'Internacional') return "VACACIONES INTERNACIONALES";
            if (cat === 'Conjunta') return "VACACIONES CONJUNTA (NACIONALES E INTERNACIONALES)";
            return cat.toUpperCase();
        })()],
        ["FECHA SALIDA:", app.formatDateES(req.startDate)],
        ["FECHA REGRESO:", app.formatDateES(req.endDate)],
        ["DÍAS FERIADOS:", `${feriados} Días`],
        ["TOTAL DÍAS:", `${totalDias} Días`],
        ["EVANGELISMO (10 D):", req.evangelismoTaken ? "TOMADO (Autorizado)" : "DISPONIBLE"],
        ["REFERENCIA:", `#${req.id.substring(0,8).toUpperCase()}`],
        ["ESTADO:", "AUTORIZADO / ARCHIVADO"]
    ];

    y = 75;
    info.forEach(row => {
        doc.setFont("helvetica", "bold"); doc.setTextColor(30, 41, 59); doc.setFontSize(10);
        doc.text(row[0], 25, y);
        doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85);
        doc.text((row[1] || "").toString(), 85, y);
        y += 10;
    });

    // Firmas
    const sigY = 220;
    const sigWidth = 45; const sigHeight = 18;

    // Helper para firmas
    const drawSig = (title, sigData, posX) => {
        if (sigData && sigData.length > 50) {
            try {
                doc.addImage(sigData, 'PNG', posX, sigY - 20, sigWidth, sigHeight);
            } catch(e) {}
        }
        doc.setDrawColor(148, 163, 184); doc.setLineWidth(0.5);
        doc.line(posX, sigY, posX + sigWidth, sigY);
        doc.setFontSize(8); doc.setTextColor(100); doc.setFont("helvetica", "bold");
        doc.text(title, posX + sigWidth/2, sigY + 5, { align: "center" });
    };

    drawSig("FIRMA SOLICITANTE", req.signatures?.applicant || req.applicantSignature, 25);
    drawSig("VISTO BUENO SUPERVISOR", req.signatures?.manager || req.managerSignature, 82);
    drawSig("AUTORIZACIÓN RRHH", req.signatures?.hr || req.hrSignature, 140);

    // Footer
    doc.setFontSize(7); doc.setTextColor(150);
    doc.text(`Documento generado digitalmente por ADE Vacaciones - Folio ${req.id}`, 105, 280, { align: "center" });
    doc.text("Asociación Dominicana del Este - Recursos Humanos", 105, 285, { align: "center" });

    // Guardado y Nube
    const fileName = `Solicitud_${req.employeeName.replace(/\s+/g, '_')}_${new Date(req.startDate).getFullYear()}.pdf`;
    const pdfOutput = doc.output('blob');
    
    // Archivar en Firebase
    const yearSub = new Date(req.startDate).getFullYear() || 2026;
    const firePath = `vacaciones/${yearSub}/${req.employeeName}/${fileName}`;
    state.uploadPDFToCloud(pdfOutput, firePath).catch(err => console.error("Error nube:", err));

    doc.save(fileName);
    return URL.createObjectURL(pdfOutput);
  },
  
  viewRequestPDF: async function(id) {
     const req = state.vacationRequests.find(r => r.id === id);
     if (!req) return this.showToast('Solicitud no encontrada');
     this.showToast('Generando vista de PDF...');
     const url = await this.generateArchivalPDF(req);
     window.open(url, '_blank');
  },
  addYearsOfService: async function() {
    // Para pruebas manuales del usuario
    state.user.yearsOfService++;
    state.user.remainingWeeks = state.getWeeksByServiceYears(state.user.yearsOfService);
    state.saveSession();
    this.render();
    this.showToast('Año institucional agregado');
  },
  
  showToast: function(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `position: fixed; bottom: 24px; right: 24px; background: #1e293b; color: white; padding: 12px 24px; border-radius: 12px; z-index: 100000; font-weight: 600; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.1);`;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  },

  requestEvangelismo: function() {
    const currYear = new Date().getFullYear();
    const hasEvan = (state.vacationRequests || []).some(r => r.idEmpleado === state.user.id && (r.category === 'Evangelismo' || r.evangelismoTaken) && r.status === 'approved' && new Date(r.startDate).getFullYear() === currYear);
    
    if (hasEvan) {
        return alert("🚫 RESTRICTO POR REGLAMENTO\n\nUsted ya tiene autorizados 10 días de Evangelismo en este año calendario. El reglamento institucional no permite duplicidad anual.");
    }
    
    if (confirm("¿Iniciar solicitud de campaña de Evangelismo (10 días permitidos)?")) {
        this.navigate('form');
        setTimeout(() => {
            const evanCheck = document.getElementById('include_evangelismo');
            if (evanCheck && evanCheck.type === 'checkbox') {
                evanCheck.checked = true;
                this.calculateDuration();
            }
        }, 300);
    }
  },

  resetData: async function() {
    try {
        await state.resetDatabase();
        this.showToast("☁️ Nube de ADE Reiniciada");
        this.navigate('dashboard');
    } catch(e) {
        console.error(e);
        this.showToast("Error al reiniciar datos");
    }
  },

  setAuditYear: function(year) {
    this.currentAuditYear = year;
    this.render();
  },

  generateEmployeeAudit: function(id) {
    const emp = state.employeesList.find(e => e.id == id);
    if (!emp) return this.showToast('Empleado no encontrado');
    
    // Usar el año fiscal seleccionado (2025 o 2026)
    const reportYear = this.currentAuditYear || 2026;
    this.showToast(`Generando Auditoría ${reportYear} para ${emp.name}...`);
    
    const getHolidaysInRange = (start, end) => {
        let count = 0;
        let d = new Date(start + 'T00:00:00');
        const e = new Date(end + 'T00:00:00');
        while (d <= e) {
            const hKey = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
            if (this.holidays[hKey]) count++;
            d.setDate(d.getDate() + 1);
        }
        return count;
    };

    // Filtrar solicitudes por año y empleado
    const reqs = (state.vacationRequests || []).filter(r => {
        const d = new Date(r.startDate);
        return d.getFullYear() == reportYear && (r.idEmpleado == id || r.userId == id);
    });

    let consumed = 0;
    const rows = reqs.map(r => {
        // Calcular duración real basada en fechas si duration no es puramente numérico
        let baseDuration = parseInt(r.totalDays || r.duration);
        if (isNaN(baseDuration) || (r.duration && r.duration.toString().includes('Semana'))) {
            const s = new Date(r.startDate + 'T00:00:00');
            const e = new Date(r.endDate + 'T00:00:00');
            baseDuration = Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24)) + 1;
        }

        const feriadosInfo = this.getHolidayInfo(r.startDate, r.endDate);
        const feriados = feriadosInfo.count;
        const hasEvan = r.evangelismoTaken === true;
        
        // El 'total' que se muestra es el periodo calendario completo
        const total = baseDuration;
        
        if (r.status === 'approved') {
            // REGLAMENTO: Consumido = Total - Evangelismo (10) - Feriados (Cuentan como beneficio)
            let periodVacation = hasEvan ? Math.max(0, baseDuration - 10) : baseDuration;
            consumed += Math.max(0, periodVacation - feriados);
        }
        
        const statusEsp = { 'approved': 'APROBADO', 'pending': 'PENDIENTE', 'rejected': 'RECHAZADO', 'pending_hr': 'PENDIENTE RRHH' };
        
        // Base a mostrar: Días de vacaciones puros (sin evangelismo ni feriados)
        const baseAMostrar = (hasEvan ? Math.max(0, baseDuration - 10) : baseDuration) - feriados;

        return `
            <tr>
                <td>#${r.id.substring(0, 5)}</td>
                <td style="font-weight:700">${r.category}</td>
                <td>${r.startDate}</td>
                <td>${r.endDate}</td>
                <td style="text-align:center">
                    ${baseAMostrar} d
                    ${feriados > 0 ? `<br><small style="color: #ef4444;">+${feriados} Feriado(s)</small>` : ''}
                    ${hasEvan ? `<br><small style="color: #1e40af; font-size: 10px;">+10 Evangelismo</small>` : ''}
                </td>
                <td style="text-align:center; font-weight: 800;">${total}</td>
                <td class="status-${r.status}" style="text-align:center; font-weight: 700;">${statusEsp[r.status] || r.status.toUpperCase()}</td>
            </tr>
        `;
    }).join('');

    // Cálculo en días calendario (Reglamento: semanas * 7 días)
    const asignacion = state.getWeeksByServiceYears(emp.years || 0) * 7; 
    const balance = asignacion - consumed;

    const auditHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <title>Auditoría ADE - ${emp.name}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet">
          <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; background: #fff; line-height: 1.5; }
              .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2f557f; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: 800; color: #2f557f; border: 2px solid #2f557f; padding: 5px 15px; }
              .doc-title { text-align: right; }
              .doc-title h1 { margin: 0; font-size: 1.2rem; text-transform: uppercase; color: #2f557f; }
              .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
              .info-card { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
              .info-card h3 { margin: 0 0 5px 0; font-size: 0.7rem; color: #64748b; text-transform: uppercase; }
              .info-card p { margin: 0; font-weight: 700; font-size: 1rem; color: #2f557f; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 0.8rem; }
              th { background: #f1f5f9; text-align: left; padding: 12px; border: 1px solid #cbd5e1; color: #475569; }
              td { padding: 10px 12px; border: 1px solid #cbd5e1; }
              .status-approved { color: #15803d; }
              .status-pending { color: #b45309; }
              .summary-box { background: #1e293b; color: white; padding: 30px; border-radius: 12px; margin-top: 40px; display: flex; justify-content: space-around; text-align: center; }
              .summary-item h2 { margin: 0; font-size: 2.5rem; color: #ffa92d; }
              .summary-item p { margin: 5px 0 0 0; font-size: 0.7rem; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.1em; }
              .footer { margin-top: 60px; text-align: center; font-size: 0.75rem; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
              .note { font-size: 0.7rem; color: #ef4444; font-weight: 700; margin-top: 10px; }
              @media print { .no-print { display: none; } }
          </style>
      </head>
      <body>
          <div class="header">
              <div class="logo">ADE VACACIONES</div>
              <div class="doc-title">
                  <h1>Perfil de Auditoría Institucional</h1>
                  <p>Ciclo Fiscal: <b>${reportYear}</b></p>
              </div>
          </div>

          <div class="grid">
              <div class="info-card"><h3>Empleado</h3><p>${emp.name}</p></div>
              <div class="info-card"><h3>Responsable</h3><p>${emp.cat || emp.department}</p></div>
              <div class="info-card"><h3>Años de Servicio</h3><p>${emp.years || 0} años</p></div>
          </div>

          <h2 style="font-size: 1.1rem; color: #1e293b; margin-bottom: 10px;">Movimientos de Tiempo - ${reportYear}</h2>
          <table>
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Concepto / Tipo</th>
                      <th>Fecha Inicio</th>
                      <th>Fecha Fin</th>
                      <th style="text-align:center">Base (Calendario)</th>
                      <th style="text-align:center">Total (+Feriados)</th>
                      <th style="text-align:center">Estado</th>
                  </tr>
              </thead>
              <tbody>
                  ${rows || `<tr><td colspan="7" style="text-align:center; padding: 40px; color: #64748b;">No existen registros para el ciclo ${reportYear}.</td></tr>`}
              </tbody>
          </table>
          <p class="note">* Según el reglamento, los días feriados dentro del periodo de vacaciones se suman al conteo final y no se descuentan del balance anual.</p>

          <div class="summary-box">
              <div class="summary-item">
                  <h2>${asignacion}</h2>
                  <p>Asignación Anual</p>
              </div>
              <div class="summary-item">
                  <h2>${consumed}</h2>
                  <p>Días Utilizados</p>
              </div>
              <div class="summary-item" style="border-left: 1px solid rgba(255,255,255,0.1); padding-left: 40px;">
                  <h2 style="color: ${balance < 0 ? '#f87171' : '#4ade80'};">${balance}</h2>
                  <p>Balance Disponible</p>
              </div>
          </div>

          <div class="footer">
              <p>Este reporte cumple con las normas de la Unión Dominicana.</p>
              <p>Generado el ${new Date().toLocaleString()} por ADE Vacaciones.</p>
          </div>
          
          <div class="no-print" style="margin-top: 30px; text-align: center;">
              <button onclick="window.print()" style="padding: 12px 40px; background: #2f557f; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 800; font-size: 1rem;">IMPRIMIR REPORTE</button>
          </div>
      </body>
      </html>
    `;

    const win = window.open('', '_blank');
    win.document.write(auditHtml);
    win.document.close();
  },
  exportAuditPDF: function(reportYear) {
    this.showToast(`Generando reporte consolidado ${reportYear}...`);
    
    const rows = state.employeesList.map(emp => {
        const reqs = (state.vacationRequests || []).filter(r => {
            const date = new Date(r.startDate + 'T00:00:00');
            return date.getFullYear() == reportYear && (r.idEmpleado == emp.id || r.userId == emp.id);
        });

        const approvedReqs = reqs.filter(r => r.status === 'approved');
        const consumed = approvedReqs.reduce((sum, r) => {
            let baseDuration = parseInt(r.totalDays || r.duration);
            if (isNaN(baseDuration) || (r.duration && r.duration.toString().includes('Semana'))) {
                const s = new Date(r.startDate + 'T00:00:00');
                const e = new Date(r.endDate + 'T00:00:00');
                baseDuration = Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24)) + 1;
            }
            const feriados = state.getHolidaysInRange(r.startDate, r.endDate);
            const hasEvan = r.evangelismoTaken === true;
            
            // Deducción = Periodo (Total) - Evangelismo (10) - Feriados (Beneficio)
            let periodVacation = hasEvan ? Math.max(0, baseDuration - 10) : baseDuration;
            return sum + Math.max(0, periodVacation - feriados);
        }, 0);

        const evan = reqs.find(r => r.evangelismoTaken === true && r.status === 'approved');
        const assignedW = state.getWeeksByServiceYears(emp.years);
        const allocated = assignedW * 7; 
        const balance = allocated - consumed;
        
        const vacAppr = reqs.find(r => (r.category === 'Local' || r.category === 'Vacaciones' || (r.category && r.category.includes('Vacaciones'))) && r.status === 'approved');
        const estatus = vacAppr ? '🟡 DISFRUTADO' : (reqs.length > 0 ? '⏳ EN PROCESO' : '---');
        const estatusColor = vacAppr ? '#15803d' : '#64748b';

        return `
            <tr>
                <td style="text-align: center;">${emp.id.padStart(2, '0')}</td>
                <td style="font-weight: 700;">${emp.name}</td>
                <td style="text-align: center;">${assignedW} sem</td>
                <td style="text-align: center;">${allocated}</td>
                <td style="text-align: center;">${evan ? '✅ SI' : '-'}</td>
                <td style="text-align: center; font-weight: 700;">${consumed}</td>
                <td style="text-align: center; font-weight: 800; color: ${balance < 0 ? '#ef4444' : '#15803d'};">${balance}</td>
                <td style="text-align: center; color: ${estatusColor}; font-weight: bold; font-size: 0.65rem;">${estatus}</td>
            </tr>
        `;
    }).join('');

    const consolidatedHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <title>Reporte Consolidado ADE - ${reportYear}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet">
          <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; background: #fff; line-height: 1.2; }
              .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 25px; }
              .logo-box h1 { margin: 0; font-size: 24px; font-weight: 800; color: #1e3a8a; }
              .logo-box p { margin: 2px 0 0 0; color: #475569; font-size: 0.85rem; font-weight: 700; }
              .year-indicator { background: #1e3a8a; color: white; padding: 8px 20px; border-radius: 6px; font-weight: 800; font-size: 1.2rem; }
              table { width: 100%; border-collapse: collapse; font-size: 0.65rem; }
              th { background: #1e3a8a; padding: 10px; border: 1px solid #cbd5e1; text-align: left; text-transform: uppercase; color: white; font-size: 0.6rem; letter-spacing: 0.5px; }
              td { padding: 8px 10px; border: 1px solid #cbd5e1; }
              tr:nth-child(even) { background: #f8fafc; }
              .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 0.65rem; color: #64748b; }
              .note { color: #ef4444; font-weight: 700; font-size: 0.6rem; margin-top: 10px; }
              .signature-section { margin-top: 80px; display: flex; justify-content: center; }
              .signature-box { border-top: 2px solid #1e3a8a; width: 300px; padding-top: 15px; text-align: center; font-size: 13px; font-weight: 700; color: #1e3a8a; text-transform: uppercase; }
              @media print { .no-print { display: none; } }
          </style>
      </head>
      <body>
          <div class="header">
              <div class="logo-box">
                  <h1>RESUMEN DE AUDITORÍA CONSOLIDADA</h1>
                  <p>Secretaría Ejecutiva del Este - Gestión de 60 Empleados</p>
              </div>
              <div class="year-indicator">CICLO ${reportYear}</div>
          </div>

          <table>
              <thead>
                  <tr>
                      <th style="width: 30px; text-align: center;">ID</th>
                      <th>Nombre del Empleado</th>
                      <th style="text-align: center;">Derecho</th>
                      <th style="text-align: center;">Asignado</th>
                      <th style="text-align: center;">Evangelismo</th>
                      <th style="text-align: center;">Consumido (+F)</th>
                      <th style="text-align: center;">Balance</th>
                      <th style="text-align: center;">Situación</th>
                  </tr>
              </thead>
              <tbody>
                  ${rows}
              </tbody>
          </table>
          <p class="note">* El conteo se realiza basado en Días Calendario. Los días feriados institucionales caídos en periodos de vacaciones se suman al beneficio del empleado según el reglamento.</p>

          <div class="signature-section">
              <div class="signature-box">SECRETARIO EJECUTIVO</div>
          </div>

          <div class="footer">
              <p>© ${reportYear} Asociación Dominicana del Este. Todos los derechos reservados.</p>
              <p>Generado oficialmente el ${new Date().toLocaleString()} por Sistema ADE Vacaciones.</p>
          </div>

          <div class="no-print" style="margin-top: 25px; text-align: center;">
              <button onclick="window.print()" style="padding: 12px 30px; background: #1e293b; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 800; font-size: 0.9rem;">IMPRIMIR REPORTE CONSOLIDADO</button>
          </div>
      </body>
      </html>
    `;

    const win = window.open('', '_blank');
    win.document.write(consolidatedHtml);
    win.document.close();
  },

  downloadAllApprovedPDFs: function() {
    const reportYear = 2026;
    const approved = (state.vacationRequests || []).filter(r => {
        const date = new Date(r.startDate + 'T00:00:00');
        return r.status === 'approved' && date.getFullYear() == reportYear;
    });

    if (approved.length === 0) {
        return this.showToast("⚠️ No hay records aprobados en este ciclo para descargar.");
    }

    if (!confirm(`Se generarán y abrirán ${approved.length} PDFs individuales. ¿Desea continuar?`)) return;

    this.showToast(`📂 Procesando ${approved.length} archivos...`);
    
    // Descarga secuencial con delay para no saturar el navegador
    approved.forEach((req, index) => {
        setTimeout(() => {
            console.log(`Descargando PDF ${index+1}/${approved.length}: ${req.employeeName}`);
            this.viewRequestPDF(req.id);
        }, index * 1000); 
    });
  },

  downloadMedicalLeaves: function() {
    const medicalReqs = (state.vacationRequests || []).filter(r => r.category === 'Médica' && r.attachment);
    
    if (medicalReqs.length === 0) {
        return this.showToast("⚠️ No hay licencias médicas con documentos adjuntos registrados.");
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <title>Licencias Médicas - ADE</title>
          <style>
              body { font-family: 'Helvetica', Arial, sans-serif; padding: 20px; color: #1e293b; background: #f8fafc; }
              .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border-radius: 8px; }
              .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1e3a8a; padding-bottom: 20px; }
              .header h1 { color: #1e3a8a; margin: 0 0 5px 0; font-size: 1.8rem; text-transform: uppercase; font-weight: 800; }
              .header p { color: #64748b; font-weight: bold; margin: 0; }
              .leave-card { border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 40px; page-break-inside: avoid; }
              .leave-title { color: #1e3a8a; font-size: 1.3rem; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px; }
              .leave-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.95rem; color: #334155; margin-bottom: 20px; padding: 15px; background: #f1f5f9; border-radius: 8px; }
              .leave-img { max-width: 100%; max-height: 800px; border: 1px solid #cbd5e1; border-radius: 8px; object-fit: contain; }
              @media print { 
                  body { background: white; padding: 0; }
                  .container { box-shadow: none; max-width: 100%; padding: 0; }
                  .no-print { display: none; } 
                  .leave-card { border: 1px solid #ccc; break-inside: avoid; margin-bottom: 30px; }
              }
          </style>
      </head>
      <body>
          <div class="no-print" style="text-align: center; margin-bottom: 30px; position: sticky; top: 20px; z-index: 100;">
              <button onclick="window.print()" style="padding: 15px 30px; background: #1e3a8a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 800; box-shadow: 0 4px 6px rgba(0,0,0,0.1); font-size: 1.1rem;">🖨️ IMPRIMIR / DESCARGAR PDF</button>
          </div>
          <div class="container">
              <div class="header">
                  <h1>Expedientes de Licencias Médicas</h1>
                  <p>Asociación Dominicana del Este</p>
              </div>
              ${medicalReqs.map(req => `
                  <div class="leave-card">
                      <h2 class="leave-title">🩺 Registro #${req.id || Date.now().toString().slice(-4)}</h2>
                      
                      <div class="leave-info">
                          <div>
                              <b>👤 Empleado:</b> <br> <span style="font-weight:700; color: #1e3a8a;">${req.employeeName}</span>
                          </div>
                          <div>
                              <b>🗓️ Periodo:</b> <br> ${req.startDate} al ${req.endDate}
                          </div>
                          <div>
                              <b>⏱️ Duración:</b> <br> ${req.totalDays || '?'} días de reposo
                          </div>
                          <div>
                              <b>📋 Creado:</b> <br> ${new Date(req.createdAt).toLocaleDateString() || 'N/A'}
                          </div>
                      </div>
                      
                      <div>
                          <h4 style="margin-bottom: 10px; color: #475569; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em;">Documento Certificado:</h4>
                          <img src="${req.attachment}" class="leave-img" alt="Certificado Médico">
                      </div>
                  </div>
              `).join('')}
          </div>
      </body>
      </html>
    `;

    const win = window.open('', '_blank');
    win.document.write(htmlContent);
    win.document.close();
  },

  manageEmployeePhotos: function() {
      const html = `
          <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px;">
              <div class="card fade-in" style="width: 100%; max-width: 800px; max-height: 90vh; overflow-y: auto; background: white;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">
                      <h2 style="color: var(--primary); font-weight: 800;">Galería de Fotos Institucional</h2>
                      <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: none; border: none; cursor: pointer; color: #ef4444; font-weight: 800;">CERRAR</button>
                  </div>
                  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 16px;">
                      ${state.employeesList.map(emp => `
                          <div class="card" style="padding: 10px; text-align: center; background: #f8fafc; border: 1px solid #e2e8f0;">
                              <div style="width: 80px; height: 80px; border-radius: 50%; background: #e2e8f0; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                  ${emp.photo ? `<img src="${emp.photo}" style="width: 100%; height: 100%; object-fit: cover;">` : `<span class="material-symbols-outlined" style="font-size: 40px; color: #94a3b8;">person</span>`}
                              </div>
                              <p style="font-size: 0.65rem; font-weight: 700; color: #1e3a8a; height: 32px; overflow: hidden;">${emp.name}</p>
                              <button class="btn" style="padding: 4px; font-size: 0.6rem; width: 100%; justify-content: center; margin-top: 8px; background: #e0f2fe; color: #0369a1;" onclick="app.uploadEmployeePhoto('${emp.id}')">
                                  CAMBIAR
                              </button>
                          </div>
                      `).join('')}
                  </div>
              </div>
          </div>
      `;
      document.body.insertAdjacentHTML('beforeend', html);
  },

  uploadEmployeePhoto: async function(empId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64 = event.target.result;
            try {
                this.showToast("🔄 Subiendo foto institucional...");
                const empRef = state.db.collection('employees').doc(empId);
                await empRef.update({ photo: base64 });
                
                // Actualizar localmente
                const emp = state.employeesList.find(e => e.id === empId);
                if (emp) emp.photo = base64;
                
                // Si el usuario actual es el modificado, refrescar su sesion local
                if (state.user.id === empId) {
                    state.user.photo = base64;
                    state.saveSession();
                }

                this.showToast("✅ Foto actualizada con éxito");
                const modal = document.querySelector('div[style*="z-index: 2000"]');
                if (modal) modal.remove();
                this.manageEmployeePhotos();
                this.render(); // Refrescar Sidebar
            } catch(err) {
                console.error(err);
                this.showToast("❌ Error al subir la foto");
            }
        };
        reader.readAsDataURL(file);
    };
    input.click();
  },

  closeConfirmModal: function() {
      const modal = document.getElementById('confirm-modal');
      if (modal) modal.style.display = 'none';
  },

  resetConflictDeclarations: function() {
      const modal = document.getElementById('confirm-modal');
      const msg = document.getElementById('confirm-modal-msg');
      const input = document.getElementById('confirm-modal-input');
      const btn = document.getElementById('confirm-modal-btn');
      
      if (!modal || !msg || !input || !btn) return;

      msg.innerText = `Esta acción borrará TODAS las declaraciones de conflicto de interés de ${new Date().getFullYear()}. Para confirmar, escriba 'REINICIAR' en el cuadro de abajo:`;
      input.value = "";
      modal.style.display = 'flex';
      
      setTimeout(() => input.focus(), 100);

      btn.onclick = async () => {
          if (input.value !== 'REINICIAR') {
              this.showToast("❌ Código incorrecto. Operación cancelada.");
              this.closeConfirmModal();
              return;
          }
          
          this.closeConfirmModal();
          this.isSubmitting = true;
          this.showToast("🔥 Borrando registros del sistema...");
          
          try {
              await state.resetConflictDeclarations();
              this.showToast("✅ Base de datos de conflictos reiniciada con éxito.");
          } catch(e) {
              console.error(e);
              this.showToast("❌ Error al reiniciar registros");
          } finally {
              this.isSubmitting = false;
              this.render();
          }
      };
  },

  showGlobalCalendar: function() {
      // Reutiliza la lógica del calendario pero forzada a 'global'
      this.activeView = 'assistant';
      this.render();
      setTimeout(() => {
          const calBox = document.querySelector('.calendar-grid');
          if (calBox) calBox.scrollIntoView({ behavior: 'smooth' });
      }, 100);
  },

  cancelRequest: async function(requestId, empName) {
    const reason = prompt(`⚠️ ¿Está seguro de que desea ANULAR la vacación de ${empName}?\n\nEsto devolverá los días al balance del empleado y lo eliminará de la lista activa.\n\nEscriba la razón (Ej: Cambio de vuelo, enfermedad, necesidad institucional):`);
    
    if (reason === null) return; // Cancelado por el usuario (prompt cancel)
    if (!reason.trim()) return this.showToast("⚠️ Debe indicar una razón para anular");

    this.showToast(`🔄 Anulando registro de ${empName}...`);
    try {
        await state.cancelApprovedRequest(requestId, reason);
        this.showToast("✅ Registro anulado y días devueltos al balance.");
        this.render();
    } catch(e) {
        console.error(e);
        this.showToast("❌ Error al anular el registro");
    }
  },
  translateStatus: function(status) {
    const map = {
        'approved': 'APROBADO',
        'pending': 'PENDIENTE',
        'pending_hr': 'PENDIENTE RRHH',
        'rejected': 'RECHAZADO',
        'archived': 'ARCHIVADO'
    };
    return map[status] || status.toUpperCase();
  },
  showDayDetails: function(d, m, y) {
    const holidays = {'1/1':'Año Nuevo','6/1':'Día de Reyes','21/1':'Altagracia','26/1':'Duarte','27/2':'Independencia','1/5':'Trabajo','16/8':'Restauración','24/9':'Mercedes','6/11':'Constitución','25/12':'Navidad'};
    const hKey = `${d}/${m + 1}`;
    
    const myVac = (state.vacationRequests || []).find(r => {
        const start = new Date(r.startDate); const end = new Date(r.endDate); const current = new Date(y, m, d);
        return current >= start && current <= end && (r.idEmpleado === state.user.id || r.userId === state.user.id);
    });

    const othersVac = (state.vacationRequests || []).find(r => {
        const start = new Date(r.startDate); const end = new Date(r.endDate); const current = new Date(y, m, d);
        return current >= start && current <= end && (r.idEmpleado !== state.user.id && (r.supervisor === state.user.supervisorDept || state.user.permissions.includes('hr')));
    });

    if (myVac) {
        alert(`📅 Tus Vacaciones:\n\nTipo: ${myVac.category}\nDesde: ${myVac.startDate}\nHasta: ${myVac.endDate}\nEstatus: ${myVac.status.toUpperCase()}`);
    } else if (othersVac) {
        alert(`👥 Vacación del Equipo:\n\nEmpleado: ${othersVac.employeeName}\nTipo: ${othersVac.category}\nRango: ${othersVac.startDate} a ${othersVac.endDate}`);
    } else if (holidays[hKey]) {
        alert(`🇩🇴 Feriado Institucional:\n\n${holidays[hKey]}`);
    } else {
        if (confirm(`¿Deseas iniciar una nueva solicitud para el ${d}/${m+1}/${y}?`)) {
            this.navigate('form');
        }
    }
  },
  syncFullAuditData: async function() {
    if (!confirm("⚠️ ¿Deseas sincronizar los 6 EXPEDIENTES REALES de 2026?\n\nEsto borrará cualquier fecha inventada previa y cargará los datos extraídos de los formularios PDF.")) return;
    
    this.showToast("⏳ Sincronizando expedientes ADE...");
    try {
        await state.seedRealData();
        this.showToast("✅ Sincronización PROFUNDA Exitosa");
        this.render();
    } catch(e) {
        this.showToast("❌ Error al sincronizar datos");
        console.error(e);
    }
  },

  closeAuditYear: async function() {
    if (!confirm("⚠️ ¿ESTÁ SEGURO? Esto cerrará el año fiscal actual, consumirá todos los balances de vacaciones restantes y generará registros de auditoría aleatorios para completar el reporte institucional. Esta acción es irreversible.")) return;
    
    this.showToast("🔒 Iniciando Cierre de Auditoría...");
    try {
        const yearToClose = this.currentAuditYear || 2026;
        // 1. Generar el reporte antes de cerrar para que el usuario pueda guardarlo
        this.exportAuditPDF(yearToClose);
        
        // 2. Ejecutar cierre en la base de datos (consume balances y prepara el siguiente ciclo)
        await state.closeYear(yearToClose);
        
        // 3. Incrementar el año para el nuevo ciclo
        this.currentAuditYear = yearToClose + 1;
        
        this.showToast(`✅ Año ${yearToClose} Cerrado. Nuevo Ciclo ${yearToClose + 1} Iniciado.`);
        this.render();
    } catch(e) {
        console.error(e);
        this.showToast("Error al cerrar el año");
    }
  },

  formatDateES: function(dateStr) {
      if (!dateStr) return '';
      if (dateStr.includes('-')) {
          const parts = dateStr.split('-');
          if (parts[0].length === 4 && parts.length === 3) {
              return `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
      }
      return dateStr;
  },

  downloadAnnualPlansPDF: async function() {
      if (!window.jspdf) {
          alert('Error: Librería PDF no cargada.');
          return;
      }
      this.showToast('Generando Consolidado Profesional...', 3000);
      const doc = new jspdf.jsPDF('l', 'mm', 'a4');
      const currYear = new Date().getFullYear();
      
      // -- DISEÑO INSTITUCIONAL SUPERIOR --
      // Fondo de cabecera azul
      doc.setFillColor(30, 58, 138); // Blue 800
      doc.rect(0, 0, 297, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("ASOCIACIÓN DOMINICANA DEL ESTE", 148, 15, { align: "center" });
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("RECURSOS HUMANOS - VACACIONES EMPLEADOS", 148, 22, { align: "center" });
      
      doc.setFontSize(10);
      doc.text(`REGISTRO CONSOLIDADO PARA AUDITORÍA INSTITUCIONAL - CICLO ${currYear}`, 148, 28, { align: "center" });
      
      // Auto-Firma de RRHH para el consolidado
      let hrSignature = "";
      const hrReq = (state.vacationRequests || []).find(r => r.signatures && r.signatures.hr);
      if (hrReq) { hrSignature = hrReq.signatures.hr; }
      
      const plans = state.annualPlans || [];
      const tableData = [];
      
      plans.forEach(p => {
          const blocks = (p.periods || []).map(period => {
              return period.split(' al ').map(d => app.formatDateES(d)).join(' al ');
          }).join('\n');
          tableData.push([
              p.employeeName.toUpperCase(),
              p.supervisorDept || p.supervisor || 'ADMINISTRACIÓN',
              p.assignedWeeks * 7 + " Días",
              blocks,
              p.signatures ? p.signatures.applicant : '',
              hrSignature
          ]);
      });

      if (tableData.length === 0) {
          tableData.push(["No hay planificaciones registradas", "-", "-", "-", "-", "-"]);
      }

      doc.autoTable({
          startY: 45,
          head: [['COLABORADOR', 'RESPONSABLE', 'DÍAS', 'PERIODOS ADJUDICADOS', 'FIRMA EMPLEADO', 'VISTO BUENO RRHH']],
          body: tableData,
          theme: 'grid',
          styles: { 
              fontSize: 8, 
              cellPadding: 4, 
              valign: 'middle',
              lineColor: [200, 200, 200],
              lineWidth: 0.1,
              font: "helvetica"
          },
          headStyles: { 
              fillColor: [30, 58, 138], 
              textColor: 255, 
              halign: 'center', 
              fontStyle: 'bold',
              cellPadding: 5
          },
          columnStyles: {
              0: { cellWidth: 50, fontStyle: 'bold' },
              1: { cellWidth: 35, halign: 'center' },
              2: { cellWidth: 25, halign: 'center' },
              3: { cellWidth: 60 },
              4: { cellWidth: 50, halign: 'center', minCellHeight: 25 },
              5: { cellWidth: 50, halign: 'center', minCellHeight: 25 }
          },
          didDrawCell: function(data) {
              if (data.section === 'body' && data.cell.raw && data.cell.raw.length > 100) {
                  if (data.column.index === 4 || data.column.index === 5) {
                      try {
                          const x = data.cell.x + (data.cell.width - 35) / 2;
                          const y = data.cell.y + (data.cell.height - 15) / 2;
                          doc.addImage(data.cell.raw, 'PNG', x, y, 35, 15);
                      } catch(e) {}
                  }
              }
          },
          willDrawCell: function(data) {
              if (data.section === 'body' && (data.column.index === 4 || data.column.index === 5)) {
                  data.cell.text = '';
              }
          },
          margin: { top: 45, left: 10, right: 10 }
      });

      // Pie de página
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(`Hoja ${i} de ${pageCount} - Generado por ADE Vacaciones v2.5`, 20, 200);
      }

      doc.save(`Consolidado_Vacaciones_ADE_${currYear}.pdf`);
      
      // DESCARGA INDIVIDUAL OPCIONAL (Solo si el navegador lo permite en bloque)
      if (confirm("¿Desea descargar también las planificaciones individuales de cada empleado?")) {
        this.showToast("Generando archivos individuales...");
        plans.forEach((p, idx) => {
            setTimeout(async () => {
                const individualId = p.id;
                this.generateAnnualPlanPDF(p);
            }, idx * 1000);
        });
      }
  },

  generateAnnualPlanPDF: async function(plan) {
    if (!window.jspdf) return;
    const doc = new jspdf.jsPDF('p', 'mm', 'a4');
    const currYear = new Date().getFullYear();

    // -- CABECERA INSTITUCIONAL --
    doc.setFillColor(30, 58, 138); doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold"); doc.setFontSize(16);
    doc.text("ASOCIACIÓN DOMINICANA DEL ESTE", 105, 12, { align: "center" });
    doc.setFontSize(12); doc.setFont("helvetica", "normal");
    doc.text("RECURSOS HUMANOS - VACACIONES EMPLEADOS", 105, 18, { align: "center" });
    doc.setFontSize(9); doc.text(`FICHA DE PLANIFICACIÓN ANUAL DE VACACIONES - CICLO ${currYear}`, 105, 24, { align: "center" });

    // -- DATOS DEL EMPLEADO --
    doc.setFillColor(248, 250, 252); doc.rect(15, 40, 180, 25, 'F');
    doc.setDrawColor(226, 232, 240); doc.rect(15, 40, 180, 25, 'S');
    
    doc.setTextColor(30, 58, 138); doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL COLABORADOR", 20, 48);
    
    doc.setTextColor(15, 23, 42); doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${plan.employeeName.toUpperCase()}`, 20, 56);
    doc.text(`Departamento: ${plan.supervisorDept || plan.supervisor || 'General'}`, 20, 61);

    // -- TABLA DE PERIODOS --
    doc.setTextColor(30, 58, 138); doc.setFont("helvetica", "bold");
    doc.text("PERIODOS PLANIFICADOS", 15, 78);
    
    const tableData = (plan.periods || []).map((p, i) => [`Periodo 0${i+1}`, p]);
    doc.autoTable({
        startY: 82,
        head: [['IDENTIFICADOR', 'RANGO DE FECHAS SELECCIONADAS']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 138], textColor: 255 },
        styles: { cellPadding: 5, fontSize: 10 },
        margin: { left: 15, right: 15 }
    });

    let finalY = doc.autoTable.previous.finalY + 30;

    // -- ÁREA DE FIRMAS --
    if (plan.signatures && plan.signatures.applicant) {
        doc.addImage(plan.signatures.applicant, 'PNG', 40, finalY - 20, 45, 18);
    }
    doc.setDrawColor(148, 163, 184); doc.line(30, finalY, 100, finalY);
    doc.setFontSize(9); doc.setTextColor(100); doc.text("FIRMA DEL COLABORADOR", 40, finalY + 5);

    // Firma RRHH (Si existe algún registro aprobado)
    const hrReq = (state.vacationRequests || []).find(r => r.signatures && r.signatures.hr);
    if (hrReq) {
        doc.addImage(hrReq.signatures.hr, 'PNG', 125, finalY - 20, 45, 18);
    }
    doc.line(115, finalY, 185, finalY);
    doc.text("VISTO BUENO RRHH", 130, finalY + 5);

    // Footer
    doc.setFontSize(7); doc.text(`Certificado emitido digitalmente el ${new Date().toLocaleDateString()} - Portal ADE`, 105, 285, { align: "center" });

    doc.save(`Plan_${plan.employeeName.replace(/ /g,'_')}.pdf`);
  },

  showMissingAnnualPlans: function() {
      const plans = state.annualPlans || [];
      const submittedIds = plans.map(p => String(p.employeeId));
      const missing = state.employeesList.filter(e => !submittedIds.includes(String(e.id)));
      
      const container = document.getElementById('missing_plans_container');
      const list = document.getElementById('missing_plans_list');
      const countSpan = document.getElementById('missing_plans_count');
      
      if (!container || !list) return;
      
      if (container.style.display === 'block') {
          container.style.display = 'none';
          return;
      }
      
      container.style.display = 'block';
      if (missing.length === 0) {
          countSpan.innerText = '0 Faltantes';
          list.innerHTML = "<p style='grid-column: span 2; font-weight: bold;'>🎉 ¡Excelente! Todos los empleados han enviado su planificación.</p>";
      } else {
          countSpan.innerText = `${missing.length} Faltantes`;
          list.innerHTML = missing.map(e => `
              <div style="background: white; padding: 8px 12px; border-radius: 6px; border: 1px solid #fef08a;">
                  <div style="font-weight: 700; color: #92400e;">${e.name}</div>
                  <div style="font-size: 0.65rem; color: #b45309;">📍 ${e.cat} • ID: ${e.id}</div>
              </div>
          `).join('');
      }
  },

  showMissingConflicto: function() {
      const decls = state.conflictDeclarations || [];
      const currentYear = new Date().getFullYear();
      
      const submittedIds = decls.filter(d => d.year === currentYear).map(d => String(d.employeeId));
      const missing = state.employeesList.filter(e => !submittedIds.includes(String(e.id)));
      
      const container = document.getElementById('missing_conflict_container');
      const list = document.getElementById('missing_conflict_list');
      const countSpan = document.getElementById('missing_conflict_count');
      
      if (!container || !list) return;
      
      if (container.style.display === 'block') {
          container.style.display = 'none';
          return;
      }
      
      container.style.display = 'block';
      if (missing.length === 0) {
          countSpan.innerText = '0 Faltantes';
          list.innerHTML = "<p style='grid-column: span 2; font-weight: bold;'>🎉 ¡Excelente! Todos los empleados firmaron su declaración este año.</p>";
      } else {
          countSpan.innerText = `${missing.length} Faltantes`;
          list.innerHTML = missing.map(e => `
              <div style="background: white; padding: 8px 12px; border-radius: 6px; border: 1px solid #fbcfe8;">
                  <div style="font-weight: 700; color: #9d174d;">${e.name}</div>
                  <div style="font-size: 0.65rem; color: #be185d;">📍 ${e.cat} • ID: ${e.id}</div>
              </div>
          `).join('');
      }
  },

  downloadConflictoPDF: async function() {
      if (!window.jspdf) {
          alert('Error: Librería PDF no cargada.');
          return;
      }
      this.showToast('Generando Registro Consolidado (Formato Final)...', 3000);
      const doc = new jspdf.jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
      const currYear = 2026;
      
      const primaryColor = [30, 58, 138];
      doc.setFillColor(30, 58, 138); doc.rect(0, 0, 297, 6, 'F');
      
      doc.setFontSize(14); doc.setTextColor(30, 58, 138); doc.setFont("helvetica", "bold");
      doc.text("ASOCIACIÓN DOMINICANA DEL ESTE", 15, 12);
      doc.setFontSize(9); doc.setTextColor(100, 100, 100); doc.setFont("helvetica", "normal");
      doc.text("REGISTRO CONSOLIDADO - DECLARACIONES DE CONFLICTO DE INTERÉS", 15, 17);
      
      const genDate = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
      doc.setFontSize(8); doc.setTextColor(0, 0, 0);
      doc.text(`FECHA DE REPORTE: ${genDate}`, 282, 17, { align: 'right' });
      
      const decls = (state.conflictDeclarations || [])
          .filter(d => d.year == currYear || !d.year)
          .sort((a, b) => a.employeeName.localeCompare(b.employeeName));

      const tableData = decls.map(d => [
          d.employeeName.toUpperCase(),
          d.position || '-',
          d.createdAt ? new Date(d.createdAt.seconds * 1000).toLocaleDateString() : new Date().toLocaleDateString(),
          d.choice.includes('No') ? 'NO TIENE CONFLICTO' : 'TIENE CONFLICTO',
          d.signature || ''
      ]);

      if (tableData.length === 0) tableData.push([ "Sin registros 2026", "-", "-", "-", "" ]);

      doc.autoTable({
          startY: 23,
          head: [['Nombre Completo del Empleado', 'Cargo / Posición', 'Fecha Declaración', 'Estatus de Conflicto', 'Firma Digital']],
          body: tableData,
          theme: 'grid',
          rowPageBreak: 'avoid',
          margin: { top: 25, bottom: 20, left: 15, right: 15 },
          styles: { fontSize: 7, cellPadding: 2, valign: 'middle', overflow: 'linebreak' },
          headStyles: { fillColor: primaryColor, textColor: 255, halign: 'center', fontSize: 8, fontStyle: 'bold' },
          columnStyles: {
              0: { cellWidth: 70 },
              1: { cellWidth: 60 },
              2: { cellWidth: 35, halign: 'center' },
              3: { cellWidth: 50, halign: 'center' },
              4: { cellWidth: 35, minCellHeight: 18 }
          },
          didDrawCell: (data) => {
              // VITAL: Forzar el foco en la página correcta de la celda para reportes multi-página
              if (data.section === 'body' && data.column.index === 4 && data.cell.raw && data.cell.raw.length > 100) {
                  try {
                      doc.setPage(data.pageNumber);
                      doc.addImage(data.cell.raw, 'PNG', data.cell.x + 2, data.cell.y + 1, 31, 15, `sig_${data.pageNumber}_${data.row.index}`);
                  } catch (e) {
                      console.warn("Firma omitida:", e);
                  }
              }
          },
          willDrawCell: (data) => {
              if (data.section === 'body' && data.column.index === 4) {
                  data.cell.text = ''; // Ocultar Base64
              }
          },
          didDrawPage: (data) => {
              doc.setFontSize(7); doc.setTextColor(150, 150, 150);
              doc.text(`Página ${data.pageNumber} - ADE 2026`, 15, 205);
          }
      });

      doc.save(`Consolidado_Conflicto_Interes_${currYear}.pdf`);
  },

  showBalancesMonitor: function() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay fade-in';
    modal.style.cssText = `position: fixed; inset: 0; background: rgba(15, 23, 42, 0.85); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(8px);`;
    
    const currentYear = new Date().getFullYear();
    
    modal.innerHTML = `
        <div class="card" style="width: 100%; max-width: 1000px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; padding: 0; border: none; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
            <div style="padding: 24px; background: #0284c7; color: white; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h2 style="margin: 0; font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 800;">📉 Monitor de Balances Vacacionales</h2>
                    <p style="margin: 4px 0 0 0; font-size: 0.8rem; opacity: 0.9;">Control Institucional de Presupuesto - Ciclo ${currentYear}</p>
                </div>
                <button onclick="this.closest('.modal-overlay').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">&times;</button>
            </div>
            
            <div style="overflow-y: auto; padding: 0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead style="position: sticky; top: 0; background: #f8fafc; z-index: 10; border-bottom: 2px solid #e2e8f0; text-align: left;">
                         <tr>
                            <th style="padding: 16px; font-size: 0.7rem; text-transform: uppercase; color: #64748b; font-weight: 800;">ID</th>
                            <th style="padding: 16px; font-size: 0.7rem; text-transform: uppercase; color: #64748b; font-weight: 800;">Colaborador</th>
                            <th style="padding: 16px; font-size: 0.7rem; text-transform: uppercase; color: #64748b; font-weight: 800; text-align: center;">Asignado</th>
                            <th style="padding: 16px; font-size: 0.7rem; text-transform: uppercase; color: #64748b; font-weight: 800; text-align: center;">Consumido</th>
                            <th style="padding: 16px; font-size: 0.7rem; text-transform: uppercase; color: #64748b; font-weight: 800; text-align: center;">Balance</th>
                            <th style="padding: 16px; font-size: 0.7rem; text-transform: uppercase; color: #64748b; font-weight: 800; text-align: center;">Evangelismo</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${[...state.employeesList].sort((a,b) => a.name.localeCompare(b.name)).map(emp => {
                            const reqs = (state.vacationRequests || []).filter(r => {
                                const date = new Date(r.startDate + 'T00:00:00');
                                return date.getFullYear() == currentYear && (r.idEmpleado == emp.id || r.userId == emp.id);
                            });
                            const approvedReqs = reqs.filter(r => r.status === 'approved');
                            const consumed = approvedReqs.reduce((sum, r) => {
                                let d = parseInt(r.totalDays || r.duration);
                                if (isNaN(d) || (r.duration && r.duration.toString().includes('Semana'))) {
                                    const s = new Date(r.startDate + 'T00:00:00');
                                    const e = new Date(r.endDate + 'T00:00:00');
                                    d = Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24)) + 1;
                                }
                                const h = state.getHolidaysInRange(r.startDate, r.endDate);
                                const ev = r.evangelismoTaken === true ? 10 : 0;
                                return sum + Math.max(0, (d - ev) - h);
                            }, 0);
                            const allocated = state.getWeeksByServiceYears(emp.years) * 7;
                            const balance = allocated - consumed;
                            const hasEvan = reqs.some(r => r.evangelismoTaken === true && r.status === 'approved');
                            
                            return `
                                <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.2s;">
                                    <td style="padding: 12px 16px; color: #94a3b8; font-family: monospace; font-weight: 700;">#${emp.id.padStart(2,'0')}</td>
                                    <td style="padding: 12px 16px; font-weight: 700; color: #1e293b; font-size: 0.85rem;">${emp.name}</td>
                                    <td style="padding: 12px 16px; text-align: center; color: #64748b; font-weight: 700;">${allocated}d</td>
                                    <td style="padding: 12px 16px; text-align: center; color: #0284c7; font-weight: 800;">${consumed}d</td>
                                    <td style="padding: 12px 16px; text-align: center;">
                                        <span class="badge" style="background: ${balance < 5 ? '#fee2e2' : '#f0f9ff'}; color: ${balance < 5 ? '#991b1b' : '#0369a1'}; font-weight: 800;">${balance}d</span>
                                    </td>
                                    <td style="padding: 12px 16px; text-align: center;">${hasEvan ? '✅' : '---'}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            
            <div style="padding: 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end;">
                <button class="btn" style="background: #1e293b; color: white;" onclick="this.closest('.modal-overlay').remove()">ENTENDIDO</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
  },

  showAnnualPlansManager: function() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay fade-in';
    modal.style.cssText = `position: fixed; inset: 0; background: rgba(15, 23, 42, 0.9); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(12px);`;
    
    const plans = state.annualPlans || [];
    const totalEmps = state.employeesList.length;
    const submitted = plans.length;
    
    modal.innerHTML = `
        <div class="card" style="width: 100%; max-width: 1100px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; padding: 0; border: none; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6); border-radius: 20px;">
            <div style="padding: 24px; background: #4338ca; color: white; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h2 style="margin: 0; font-family: 'Outfit', sans-serif; font-size: 1.6rem; font-weight: 800;">📅 Monitor Institucional de Planificación Anual</h2>
                    <p style="margin: 4px 0 0 0; font-size: 0.85rem; opacity: 0.9;">Gestión de Registros y Descargas Consolidadas - Ciclo ${new Date().getFullYear()}</p>
                </div>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div style="background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 12px; font-size: 0.9rem; font-weight: 700;">
                        ${submitted} / ${totalEmps} Colaboradores han completado su plan
                    </div>
                    <button onclick="this.closest('.modal-overlay').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 1.4rem;">&times;</button>
                </div>
            </div>
            
            <div style="padding: 20px; background: #f8fafc; display: flex; gap: 12px; border-bottom: 1px solid #e2e8f0;">
                <button class="btn" style="background: #0284c7; color: white; padding: 12px 20px; font-weight: 800; display: flex; align-items: center; gap: 8px;" onclick="app.downloadAllIndividualPlans()">
                    <span class="material-symbols-outlined">file_download</span> DESCARGAR TODOS LOS INDIVIDUALES (LOTE)
                </button>
            </div>
            
            <div style="overflow-y: auto; padding: 0; flex-grow: 1;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                    <thead style="position: sticky; top: 0; background: #f1f5f9; z-index: 10; border-bottom: 2px solid #cbd5e1; text-align: left;">
                         <tr>
                            <th style="padding: 18px; font-weight: 800; color: #475569;">COLABORADOR</th>
                            <th style="padding: 18px; font-weight: 800; color: #475569;">DEPARTAMENTO / RESPONSABLE</th>
                            <th style="padding: 18px; font-weight: 800; color: #475569; text-align: center;">DÍAS</th>
                            <th style="padding: 18px; font-weight: 800; color: #475569; text-align: center;">ARCHIVO</th>
                            ${(state.user.role === 'hr' || (state.user.permissions && state.user.permissions.includes('hr'))) ? '<th style="padding: 18px; font-weight: 800; color: #475569; text-align: center;">ANULAR</th>' : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${plans.sort((a,b) => a.employeeName.localeCompare(b.employeeName)).map(p => `
                            <tr style="border-bottom: 1px solid #f1f5f9; hover: background: #f8fafc;">
                                <td style="padding: 14px 18px;">
                                    <div style="font-weight: 800; color: #1e293b;">${p.employeeName.toUpperCase()}</div>
                                    <div style="font-size: 0.75rem; color: #64748b;">Enviado: ${p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</div>
                                </td>
                                <td style="padding: 14px 18px; color: #475569;">${p.supervisorDept || p.supervisor || 'ADMINISTRACIÓN'}</td>
                                <td style="padding: 14px 18px; text-align: center;">
                                    <span class="badge" style="background: #ecfdf5; color: #065f46; font-weight: 800;">${p.assignedWeeks * 7} Días</span>
                                </td>
                                <td style="padding: 14px 18px; text-align: center;">
                                    <button class="btn" style="padding: 6px 12px; background: #f1f5f9; color: #1e293b; font-size: 0.75rem; border: 1px solid #e2e8f0;" onclick="app.downloadIndividualPlanPDFById('${p.id}')">
                                        📄 PDF
                                    </button>
                                </td>
                                ${(state.user.role === 'hr' || (state.user.permissions && state.user.permissions.includes('hr'))) ? `
                                <td style="padding: 14px 18px; text-align: center;">
                                    <button class="btn" style="padding: 6px 12px; background: #fee2e2; color: #991b1b; font-size: 0.75rem; border: 1px solid #fecaca;" onclick="app.deleteAnnualPlan('${p.id}')">
                                        🗑️ ANULAR
                                    </button>
                                </td>
                                ` : ''}
                            </tr>
                        `).join('') || `<tr><td colspan="5" style="text-align: center; padding: 40px; color: #64748b; font-style: italic;">No hay registros de planificación para mostrar aún.</td></tr>`}
                    </tbody>
                </table>
            </div>
            
            <div style="padding: 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end;">
                <button class="btn" style="background: #1e293b; color: white; padding: 12px 30px;" onclick="this.closest('.modal-overlay').remove()">CERRAR PANEL</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
  },

  downloadIndividualPlanPDFById: function(planId) {
      const plan = (state.annualPlans || []).find(p => p.id === planId);
      if (plan) this.generateAnnualPlanPDF(plan);
  },

  downloadAllIndividualPlans: function() {
      const plans = state.annualPlans || [];
      if (plans.length === 0) return alert("No hay registros para descargar.");
      
      this.showToast(`Preparando descarga de ${plans.length} archivos...`);
      plans.forEach((p, i) => {
          setTimeout(() => {
              this.generateAnnualPlanPDF(p);
          }, i * 1000); // 1s de delay para no bloquear descargas
      });
  },

  deleteAnnualPlan: async function(planId) {
      if (!confirm("⚠️ ¿Está seguro de que desea ANULAR este registro de planificación? Esta acción no se puede deshacer.")) return;
      
      try {
          this.showToast("Anulando registro...");
          await state.db.collection('annualPlans').doc(planId).delete();
          // Update local state
          state.annualPlans = state.annualPlans.filter(p => p.id !== planId);
          // Refresh UI
          const modal = document.querySelector('.modal-overlay');
          if (modal) {
              modal.remove();
              this.showAnnualPlansManager();
          }
          this.showToast("Planificación anulada con éxito.");
      } catch (err) {
          console.error("Error al anular:", err);
          alert("Error al intentar anular el registro.");
      }
   },

   anularMovimiento: async function(id) {
       if (!confirm("⚠️ ¿Desea ANULAR esta solicitud aprobada? Esto devolverá los días al balance del empleado y eliminará el movimiento. Según el Código de Trabajo, esto aplica por enfermedad o posposición justificada.")) return;
       
       try {
           this.showToast("Anulando movimiento y restituyendo días...");
           await state.annulVacationRequest(id);
           this.showToast("Movimiento anulado y balance actualizado.");
           this.navigate('hr');
       } catch (err) {
           console.error("Error al anular:", err);
           alert("No se pudo anular el movimiento.");
       }
   },

   showAuditHistory: function() {
       const cycles = (state.auditCycles || []).sort((a,b) => b.year - a.year);
       
       const modal = document.createElement('div');
       modal.className = 'modal-overlay fade-in';
       modal.innerHTML = `
           <div class="modal-card" style="max-width: 600px;">
               <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                   <h2 style="margin: 0; color: var(--primary); font-weight: 800; display: flex; align-items: center; gap: 10px;">
                       <span class="material-symbols-outlined">auto_stories</span> Histórico de Ciclos Institucionales
                   </h2>
                   <button class="btn-icon" onclick="this.closest('.modal-overlay').remove()">close</button>
               </div>
               
               <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">Acceda a los reportes consolidados y archivos maestros de años anteriores almacenados en la nube.</p>
               
               <div style="display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto; padding-right: 8px;">
                   ${cycles.map(c => `
                       <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                           <div>
                               <div style="font-weight: 800; color: var(--primary); font-size: 1.1rem;">CICLO ${c.year}</div>
                               <div style="font-size: 0.75rem; color: #64748b;">Archivado el: ${c.archivedAt ? new Date(c.archivedAt.seconds * 1000).toLocaleDateString() : 'N/A'}</div>
                           </div>
                           <button class="btn" style="background: var(--primary); color: white; border: none; padding: 8px 16px; font-weight: 800;" onclick="window.open('${c.url}', '_blank')">
                               <span class="material-symbols-outlined" style="font-size: 1.1rem;">cloud_download</span> DESCARGAR
                           </button>
                       </div>
                   `).join('') || '<div style="text-align:center; padding: 40px; color: #94a3b8; font-style: italic;">No hay ciclos archivados todavía.</div>'}
               </div>
               
               <div style="margin-top: 30px; padding-top: 20px; border-top: 2px dashed #e2e8f0;">
                   <button class="btn" style="width: 100%; background: #166534; color: white; padding: 14px; border: none; font-weight: 800;" onclick="app.archiveCurrentCycleUI()">
                       <span class="material-symbols-outlined" style="font-size: 1.2rem;">inventory_2</span> CERRAR Y ARCHIVAR CICLO ACTUAL (${new Date().getFullYear()})
                   </button>
                   <p style="font-size: 0.7rem; color: #ef4444; margin-top: 8px; text-align: center; font-weight: 700;">⚠️ Esta acción genera una copia permanente del estado actual en la nube.</p>
               </div>
           </div>
       `;
       document.body.appendChild(modal);
   },

   archiveCurrentCycleUI: async function() {
       const year = new Date().getFullYear();
       if (!confirm(`¿Está seguro de que desea cerrar formalmente el ciclo ${year} y guardar una copia de auditoría en la nube?`)) return;
       
       try {
           this.showToast("Generando reporte maestro y subiendo a la nube...");
           // Nota: En una implementación completa, aquí usaríamos jspdf para generar el PDF consolidado real
           // Por ahora, simulamos el proceso de archivado para que la interfaz funcione.
           // Generamos un PDF básico del estado actual
           const doc = new jspdf.jsPDF('p', 'mm', 'a4');
           doc.text(`AUDITORÍA CONSOLIDADA ADE - CICLO ${year}`, 105, 20, { align: "center" });
           doc.text(`Generado el: ${new Date().toLocaleString()}`, 105, 30, { align: "center" });
           
           const pdfBlob = doc.output('blob');
           const path = `audits/consolidated_${year}_${Date.now()}.pdf`;
           const url = await state.uploadPDFToCloud(pdfBlob, path);
           
           if (url) {
               await state.archiveCycle(year, url);
               this.showToast("¡Ciclo archivado correctamente!");
               const modal = document.querySelector('.modal-overlay');
               if (modal) modal.remove();
               this.showAuditHistory();
           }
       } catch (err) {
           console.error("Error al archivar:", err);
           alert("Error al intentar archivar el ciclo.");
       }
   },
 
   eliminarRegistro: async function(id) {
    if (confirm("⚠️ ¿Está seguro que desea ELIMINAR PERMANENTEMENTE este registro? Esta acción no se puede deshacer y el registro desaparecerá de todos los controles.")) {
        try {
            this.showToast("🧹 Limpiando registro...");
            await state.deleteRequest(id);
            this.render();
            this.showToast("✅ Registro eliminado con éxito");
        } catch (e) {
            console.error(e);
            alert("Error al eliminar: " + e.message);
        }
    }
  },

  // 👥 MÓDULO DE GESTIÓN DE PERSONAL
  toggleEmployeeEditor: function() {
    const existing = document.getElementById('employee-manager-modal');
    if (existing) {
        existing.remove();
        return;
    }
    this.renderEmployeeEditor();
  },

  renderEmployeeEditor: function() {
    const modal = document.createElement('div');
    modal.id = 'employee-manager-modal';
    modal.className = 'modal-overlay fade-in';
    modal.style = "position: fixed; inset: 0; background: rgba(15, 23, 42, 0.8); z-index: 15000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); padding: 20px;";
    
    const employees = [...(state.employeesList || [])].sort((a,b) => a.name.localeCompare(b.name));
    
    modal.innerHTML = `
        <div class="card glass shadow-2xl" style="width: 100%; max-width: 900px; max-height: 90vh; overflow-y: auto; background: white !important; border-radius: 24px; padding: 0; border: 1px solid rgba(255,255,255,0.2);">
            <div style="position: sticky; top: 0; background: white; padding: 32px; border-bottom: 2px solid #f1f5f9; z-index: 10; display: flex; justify-content: space-between; align-items: center;">
                <div>
                   <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.8rem; font-weight: 800; color: var(--primary); margin: 0;">Gestión de Personal Ministerial</h2>
                   <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">Añada, edite o retire oficiales de la base de datos institucional.</p>
                </div>
                <button class="btn" onclick="app.toggleEmployeeEditor()" style="background: #f1f5f9; color: #1e293b; border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; padding: 0;">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <div style="padding: 32px;">
                <!-- Formulario Nuevo/Editar -->
                <div id="emp-form-container" class="card" style="background: #f8fafc; border: 2px solid #e2e8f0; margin-bottom: 32px; padding: 24px;">
                    <h3 id="form-title" style="font-weight: 800; color: var(--primary); margin-bottom: 20px; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em;">➕ Registrar Nuevo Empleado</h3>
                    <input type="hidden" id="edit-emp-id" value="">
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                        <div>
                            <label style="display: block; font-size: 0.75rem; font-weight: 800; color: var(--primary); margin-bottom: 8px;">Nombre Completo</label>
                            <input type="text" id="emp-name" placeholder="Ej: Juan Pérez" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem;">
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; font-weight: 800; color: var(--primary); margin-bottom: 8px;">PIN de Acceso (4 dígitos)</label>
                            <input type="text" id="emp-pin" maxlength="4" placeholder="1234" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; font-family: monospace; letter-spacing: 0.2em;">
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; font-weight: 800; color: var(--primary); margin-bottom: 8px;">Categoría/Departamento</label>
                            <select id="emp-cat" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem;">
                                <option value="Presidencia">Presidencia</option>
                                <option value="Secretaría">Secretaría</option>
                                <option value="Tesorería">Tesorería</option>
                                <option value="RRHH">RRHH</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; font-weight: 800; color: var(--primary); margin-bottom: 8px;">Cargo Actual</label>
                            <select id="emp-position" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem;">
                                ${state.positionsList.map(p => `<option value="${p}">${p}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; font-weight: 800; color: var(--primary); margin-bottom: 8px;">Años de Servicio (UD)</label>
                            <input type="number" id="emp-years" value="0" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem;">
                        </div>
                        <div style="display: flex; align-items: flex-end;">
                            <button id="btn-save-emp" class="btn btn-primary" style="width: 100%; height: 48px; font-weight: 800;" onclick="app.saveEmployeeUI()">GUARDAR CAMBIOS</button>
                        </div>
                    </div>
                    <button id="btn-cancel-edit" style="display: none; margin-top: 12px; background: transparent; border: none; color: #64748b; font-size: 0.8rem; cursor: pointer; text-decoration: underline;" onclick="app.cancelEmployeeEdit()">Cancelar edición y limpiar</button>
                </div>

                <!-- Tabla de Empleados -->
                <div class="table-container shadow-sm" style="border-radius: 12px; border: 1px solid #e2e8f0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead style="background: #f8fafc;">
                            <tr>
                                <th style="padding: 16px; text-align: left; font-size: 0.75rem; font-weight: 800; color: var(--primary);">ID</th>
                                <th style="padding: 16px; text-align: left; font-size: 0.75rem; font-weight: 800; color: var(--primary);">NOMBRE</th>
                                <th style="padding: 16px; text-align: left; font-size: 0.75rem; font-weight: 800; color: var(--primary);">PIN</th>
                                <th style="padding: 16px; text-align: left; font-size: 0.75rem; font-weight: 800; color: var(--primary);">DEPTO</th>
                                <th style="padding: 16px; text-align: left; font-size: 0.75rem; font-weight: 800; color: var(--primary);">AÑOS</th>
                                <th style="padding: 16px; text-align: right; font-size: 0.75rem; font-weight: 800; color: var(--primary);">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${employees.map(e => `
                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                    <td style="padding: 14px 16px; font-weight: 700; color: #64748b; font-size: 0.8rem;">#${e.id}</td>
                                    <td style="padding: 14px 16px;">
                                        <div style="font-weight: 700; color: var(--primary); font-size: 0.9rem;">${e.name}</div>
                                        <div style="font-size: 0.7rem; color: var(--text-muted);">${e.position}</div>
                                    </td>
                                    <td style="padding: 14px 16px; font-family: monospace; font-weight: 700; color: #0891b2; letter-spacing: 0.1em;">${e.pin}</td>
                                    <td style="padding: 14px 16px;"><span class="badge" style="background: #e0f2fe; color: #0369a1; font-size: 0.7rem;">${e.cat}</span></td>
                                    <td style="padding: 14px 16px; font-weight: 700;">${e.years}</td>
                                    <td style="padding: 14px 16px; text-align: right;">
                                        <button class="btn" style="padding: 6px; background: transparent; color: var(--primary);" onclick="app.editEmployeeUI('${e.id}')">
                                            <span class="material-symbols-outlined" style="font-size: 1.2rem;">edit_note</span>
                                        </button>
                                        <button class="btn" style="padding: 6px; background: transparent; color: #ef4444;" onclick="app.deleteEmployeeUI('${e.id}')">
                                            <span class="material-symbols-outlined" style="font-size: 1.2rem;">person_remove</span>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
  },

  editEmployeeUI: function(id) {
    const emp = state.employeesList.find(e => e.id == id);
    if (!emp) return;
    
    document.getElementById('form-title').innerText = "✏️ Editando Empleado: " + emp.name;
    document.getElementById('edit-emp-id').value = emp.id;
    document.getElementById('emp-name').value = emp.name;
    document.getElementById('emp-pin').value = emp.pin;
    document.getElementById('emp-cat').value = emp.cat;
    document.getElementById('emp-position').value = emp.position;
    document.getElementById('emp-years').value = emp.years;
    document.getElementById('btn-save-emp').innerText = "ACTUALIZAR DATOS";
    document.getElementById('btn-cancel-edit').style.display = "block";
    document.getElementById('emp-form-container').style.background = "#fffbeb";
    document.getElementById('emp-form-container').style.borderColor = "#fcd34d";
    document.getElementById('emp-name').focus();
  },

  cancelEmployeeEdit: function() {
    document.getElementById('form-title').innerText = "➕ Registrar Nuevo Empleado";
    document.getElementById('edit-emp-id').value = "";
    document.getElementById('emp-name').value = "";
    document.getElementById('emp-pin').value = "";
    document.getElementById('emp-years').value = "0";
    document.getElementById('btn-save-emp').innerText = "GUARDAR CAMBIOS";
    document.getElementById('btn-cancel-edit').style.display = "none";
    document.getElementById('emp-form-container').style.background = "#f8fafc";
    document.getElementById('emp-form-container').style.borderColor = "#e2e8f0";
  },

  saveEmployeeUI: async function() {
    const id = document.getElementById('edit-emp-id').value;
    const name = document.getElementById('emp-name').value.trim();
    const pin = document.getElementById('emp-pin').value.trim();
    const cat = document.getElementById('emp-cat').value;
    const pos = document.getElementById('emp-position').value;
    const years = parseInt(document.getElementById('emp-years').value) || 0;

    if (!name || pin.length < 4) {
        alert("⚠️ Por favor complete el Nombre y un PIN de 4 dígitos.");
        return;
    }

    try {
        this.showToast("🚀 Sincronizando con la nube de ADE...");
        await state.saveEmployee({
            id: id || null,
            name: name,
            pin: pin,
            cat: cat,
            position: pos,
            years: years
        });
        this.showToast("✅ ¡Datos institucionalizados con éxito!");
        this.cancelEmployeeEdit();
        // El onSnapshot de Firestore en state.js se encargará de refrescar la lista y el UI
        setTimeout(() => {
            const modal = document.getElementById('employee-manager-modal');
            if (modal) {
                modal.remove();
                this.renderEmployeeEditor(); // Re-render table within the modal
            }
        }, 800);
    } catch (e) {
        console.error(e);
        alert("Fallo al guardar: " + e.message);
    }
  },

  deleteEmployeeUI: async function(id) {
    if (!confirm("🚨 ¿Está seguro que desea ELIMINAR a este oficial? No podrá volver a ingresar al sistema y sus saldos se perderán.")) return;
    try {
        this.showToast("🗑️ Eliminando de la nube...");
        await state.deleteEmployee(id);
        this.showToast("¡Empleado removido!");
        setTimeout(() => {
            const modal = document.getElementById('employee-manager-modal');
            if (modal) {
                modal.remove();
                this.renderEmployeeEditor(); 
            }
        }, 800);
    } catch (e) {
        console.error(e);
        alert("Error al eliminar");
    }
  }
};
