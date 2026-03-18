// Application Logic for ADE Vacaciones
const app = {
  activeView: 'dashboard',
  currentRole: 'employee',
  
  views: {
    dashboard: () => {
      const stats = state.vacationRequests.filter(r => r.status === 'pending').length;
      return `
        <header class="fade-in" style="margin-bottom: 32px;">
            <h1 style="font-size: 1.8rem; font-weight: 800; color: var(--primary);">Bienvenido, ${state.user.name}</h1>
            <p style="color: var(--text-muted); font-weight: 500;">Aquí tienes un resumen de tus solicitudes ministerial.</p>
        </header>

        <!-- Stats Grid -->
        <div class="stat-grid fade-in">
            <div class="stat-card" style="border-left-color: var(--primary);">
                <h3>Semanas Disponibles</h3>
                <div class="value">${state.user.fullWeeksPerYear.toString().padStart(2, '0')}</div>
                <p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">Ciclo 2024 - Acumulado</p>
            </div>
            <div class="stat-card" style="border-left-color: var(--tertiary);">
                <h3>Semanas Restantes</h3>
                <div class="value">${state.stats.remaining.toString().padStart(2, '0')}</div>
                <p style="font-size: 0.7rem; color: var(--tertiary); margin-top: 4px;">Después de aprobadas</p>
            </div>
            <div class="stat-card" style="border-left-color: var(--secondary);">
                <h3>Solicitudes Pendientes</h3>
                <div class="value">${stats.toString().padStart(2, '0')}</div>
                <p style="font-size: 0.7rem; color: var(--secondary); margin-top: 4px;">En revisión de secretaría</p>
            </div>
            <div class="stat-card" style="background: var(--primary); color: white; border-left: none; position: relative; overflow: hidden;">
                <h3 style="color: rgba(255,255,255,0.7);">Estatus de Antigüedad</h3>
                <div class="value" style="color: var(--secondary); font-size: 1.5rem;">${state.user.yearsOfService} Años</div>
                <p style="font-size: 0.7rem; color: rgba(255,255,255,0.8); margin-top: 4px;">Categoría: ${state.user.yearsOfService >= 5 ? 'Senior' : 'Junior'}</p>
                <span class="material-symbols-outlined" style="position: absolute; bottom: -10px; right: -10px; font-size: 80px; opacity: 0.1;">workspace_premium</span>
            </div>
        </div>

        <div class="fade-in" style="display: grid; grid-template-columns: 2fr 1.2fr; gap: 32px; margin-top: 32px;">
            <!-- Left Side: Actions -->
            <div style="display: flex; flex-direction: column; gap: 32px;">
                <section class="card">
                    <h2 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                        <span class="material-symbols-outlined">rocket_launch</span>
                        Accesos Rápidos
                    </h2>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                        <button class="btn btn-primary" onclick="app.navigate('form', event)">
                            <span class="material-symbols-outlined">add</span>
                            Solicitar Vacaciones
                        </button>
                        <button class="btn btn-tertiary" onclick="app.requestEvangelismo()">
                            <span class="material-symbols-outlined">church</span>
                            10 Días Evangelismo
                        </button>
                        <button class="btn" style="background: #f1f5f9; color: var(--primary);" onclick="app.showModal('marriage')">
                            <span class="material-symbols-outlined">favorite</span>
                            Licencia Casamiento
                        </button>
                        <button class="btn" style="background: #f1f5f9; color: var(--primary);" onclick="app.showModal('medical')">
                            <span class="material-symbols-outlined">medical_services</span>
                            Licencia Médica
                        </button>
                    </div>
                </section>

                <section class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                         <h2 style="font-size: 1.1rem; color: var(--primary); display: flex; align-items: center; gap: 10px;">
                            <span class="material-symbols-outlined">history</span>
                            Historial Reciente
                        </h2>
                        <a href="#" style="font-size: 0.8rem; color: var(--tertiary); font-weight: 600;">Ver todo</a>
                    </div>
                    
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                        <thead>
                            <tr style="text-align: left; border-bottom: 1px solid #f1f5f9; color: var(--text-muted);">
                                <th style="padding: 12px 0;">Tipo / Periodo</th>
                                <th style="padding: 12px 0;">Duración</th>
                                <th style="padding: 12px 0; text-align: center;">Estado</th>
                                <th style="padding: 12px 0; text-align: right;">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.vacationRequests.map(req => `
                                <tr style="border-bottom: 1px solid #f8fafc;">
                                    <td style="padding: 16px 0;">
                                        <p style="font-weight: 700; color: var(--primary);">${req.type.charAt(0).toUpperCase() + req.type.slice(1)}</p>
                                        <p style="font-size: 0.7rem; color: var(--text-muted);">${req.startDate} - ${req.endDate}</p>
                                    </td>
                                    <td style="padding: 16px 0;">${req.duration}</td>
                                    <td style="padding: 16px 0; text-align: center;">
                                        <span class="badge badge-${req.status}">${req.status.toUpperCase()}</span>
                                    </td>
                                    <td style="padding: 16px 0; text-align: right;">
                                        <button class="btn" style="padding: 4px; background: none; color: var(--tertiary);">
                                            <span class="material-symbols-outlined">visibility</span>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </section>
            </div>

            <!-- Right Side: Calendar Mockup -->
            <section class="card" style="display: flex; flex-direction: column;">
                <h2 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 20px;">Calendario Personal</h2>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <span style="font-weight: 800; font-size: 0.8rem; letter-spacing: 0.1em; color: var(--secondary);">AGOSTO 2024</span>
                    <div style="display: flex; gap: 4px;">
                        <button class="btn" style="padding: 4px; background: #f1f5f9; min-width: auto; height: 32px;"><span class="material-symbols-outlined" style="font-size: 1.2rem;">chevron_left</span></button>
                        <button class="btn" style="padding: 4px; background: #f1f5f9; min-width: auto; height: 32px;"><span class="material-symbols-outlined" style="font-size: 1.2rem;">chevron_right</span></button>
                    </div>
                </div>
                
                <div class="calendar-grid">
                    <div class="calendar-header">DO</div><div class="calendar-header">LU</div><div class="calendar-header">MA</div><div class="calendar-header">MI</div><div class="calendar-header">JU</div><div class="calendar-header">VI</div><div class="calendar-header">SA</div>
                    ${Array.from({length: 31}, (_, i) => {
                      const day = i + 1;
                      const isVac = day >= 1 && day <= 15;
                      const isToday = day === 14;
                      return `<div class="calendar-day ${isVac ? 'day-vacation' : ''} ${isToday ? 'day-active' : ''}">${day}</div>`;
                    }).join('')}
                </div>
                
                <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 12px; font-size: 0.75rem;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 10px; height: 10px; border-radius: 50%; background: var(--primary);"></span>
                        <span>Hoy</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 10px; height: 10px; border-radius: 50%; background: var(--tertiary);"></span>
                        <span>Vacaciones Solicitadas</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 10px; height: 10px; border-radius: 50%; background: var(--secondary);"></span>
                        <span>Día Feriado / Nacional</span>
                    </div>
                </div>

                <div style="margin-top: auto; padding-top: 24px; border-top: 1px solid #f1f5f9;">
                    <div class="glass" style="padding: 16px; border-radius: 12px; border-left: 4px solid var(--secondary);">
                        <p style="font-size: 0.75rem; font-weight: 700; color: var(--primary); margin-bottom: 4px;">Sugerencia Institucional</p>
                        <p style="font-size: 0.7rem; color: var(--text-muted);">Como empleado Senior, le sugerimos planificar sus vacaciones con antelación.</p>
                    </div>
                </div>
            </section>
        </div>
      `;
    },
    
    manager: () => {
      // Panel Manager requirement: manage approvals, view impact on availability, 3 panels (Presidency, Treasury, Secretariat)
      return `
        <header class="fade-in" style="margin-bottom: 32px;">
            <h1 style="font-size: 1.8rem; font-weight: 800; color: var(--primary);">Panel del Manager</h1>
            <p style="color: var(--text-muted); font-weight: 500;">Gestión de aprobaciones y disponibilidad de equipo.</p>
        </header>

        <div class="fade-in" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 32px;">
            <div class="card" style="border-top: 4px solid var(--primary); text-align: center;">
                <span class="material-symbols-outlined" style="font-size: 2.5rem; color: var(--primary); margin-bottom: 12px;">account_balance</span>
                <h3 style="font-size: 1rem; color: var(--primary);">1. Presidencia</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Departamentales y Pastores</p>
            </div>
            <div class="card" style="border-top: 4px solid var(--secondary); text-align: center;">
                <span class="material-symbols-outlined" style="font-size: 2.5rem; color: var(--secondary); margin-bottom: 12px;">account_balance_wallet</span>
                <h3 style="font-size: 1rem; color: var(--primary);">2. Tesorería</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Equipo de Finanzas</p>
            </div>
            <div class="card" style="border-top: 4px solid var(--tertiary); text-align: center;">
                <span class="material-symbols-outlined" style="font-size: 2.5rem; color: var(--tertiary); margin-bottom: 12px;">folder_shared</span>
                <h3 style="font-size: 1rem; color: var(--primary);">3. Secretaría</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Personal de Oficina</p>
            </div>
        </div>

        <section class="card fade-in" style="margin-bottom: 32px;">
            <h2 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 20px;">Solicitudes Pendientes por Revisar</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                <thead>
                    <tr style="text-align: left; border-bottom: 1px solid #f1f5f9; color: var(--text-muted);">
                        <th style="padding: 12px 0;">Empleado</th>
                        <th style="padding: 12px 0;">Tipo</th>
                        <th style="padding: 12px 0;">Periodo</th>
                        <th style="padding: 12px 0; text-align: right;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.vacationRequests.filter(r => !r.signatures.manager).map(req => `
                        <tr style="border-bottom: 1px solid #f8fafc;">
                            <td style="padding: 16px 0;">
                                <p style="font-weight: 700; color: var(--primary);">${req.employeeName}</p>
                                <p style="font-size: 0.7rem; color: var(--text-muted);">${req.employeeId}</p>
                            </td>
                            <td style="padding: 16px 0;">${req.type.toUpperCase()}</td>
                            <td style="padding: 16px 0;">${req.startDate} a ${req.endDate}</td>
                            <td style="padding: 16px 0; text-align: right; display: flex; gap: 8px; justify-content: flex-end;">
                                <button class="btn btn-primary" onclick="app.approveRequest('${req.id}', 'manager')" style="padding: 8px 12px;">Aprobar</button>
                                <button class="btn" style="padding: 8px 12px; background: #fee2e2; color: #991b1b;">Rechazar</button>
                            </td>
                        </tr>
                    `).join('')}
                    ${state.vacationRequests.filter(r => !r.signatures.manager).length === 0 ? '<tr><td colspan="4" style="padding: 30px; text-align: center; color: var(--text-muted);">No hay solicitudes pendientes</td></tr>' : ''}
                </tbody>
            </table>
        </section>

        <section class="card fade-in">
            <h2 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 20px;">Calendario Institucional - Impacto de Disponibilidad</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; height: 300px; display: flex; align-items: center; justify-content: center; border: 1px dashed #cbd5e1;">
                <div style="text-align: center;">
                    <span class="material-symbols-outlined" style="font-size: 3rem; color: var(--text-muted);">calendar_view_month</span>
                    <p style="margin-top: 12px; color: var(--text-muted);">Calendario Global de Ausencias habilitado para Agosto 2024</p>
                    <p style="font-size: 0.8rem; background: var(--secondary); color: var(--primary); display: inline-block; padding: 4px 12px; border-radius: 999px; font-weight: 700; margin-top: 12px;">3 Empleados no disponibles en la semana 32</p>
                </div>
            </div>
        </section>
      `;
    },
    
    hr: () => {
      return `
        <header class="fade-in" style="margin-bottom: 32px;">
            <h1 style="font-size: 1.8rem; font-weight: 800; color: var(--primary);">Panel de Recursos Humanos</h1>
            <p style="color: var(--text-muted); font-weight: 500;">Aprobación final y gestión de activos archivados en la nube.</p>
        </header>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 32px;">
            <button class="btn btn-primary" style="padding: 16px; justify-content: center;">Solicitudes Locales</button>
            <button class="btn btn-secondary" style="padding: 16px; justify-content: center;">Solicitudes Internacionales</button>
            <button class="btn btn-tertiary" style="padding: 16px; justify-content: center;">Solicitudes Conjuntas</button>
        </div>

        <section class="card fade-in" style="margin-bottom: 32px;">
            <h2 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 20px;">Pendientes de Aprobación Final (RRHH)</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                <thead>
                    <tr style="text-align: left; border-bottom: 1px solid #f1f5f9; color: var(--text-muted);">
                        <th style="padding: 12px 0;">Empleado</th>
                        <th style="padding: 12px 0;">Manager Status</th>
                        <th style="padding: 12px 0; text-align: right;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.vacationRequests.filter(r => r.signatures.manager && !r.signatures.hr).map(req => `
                        <tr style="border-bottom: 1px solid #f8fafc;">
                            <td style="padding: 16px 0;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 32px; height: 32px; border-radius: 50%; background: #e2e8f0;"></div>
                                    <div>
                                        <p style="font-weight: 700; color: var(--primary);">${req.employeeName}</p>
                                        <p style="font-size: 0.7rem; color: var(--text-muted);">${req.type.toUpperCase()}</p>
                                    </div>
                                </div>
                            </td>
                            <td style="padding: 16px 0;">
                                <span class="badge badge-approved" style="font-size: 0.6rem;">FIRMADO POR SUPERVISOR</span>
                            </td>
                            <td style="padding: 16px 0; text-align: right;">
                                <button class="btn btn-primary" onclick="app.approveRequest('${req.id}', 'hr')" style="padding: 8px 12px;">Autorizar y Archivar</button>
                            </td>
                        </tr>
                    `).join('')}
                    ${state.vacationRequests.filter(r => r.signatures.manager && !r.signatures.hr).length === 0 ? '<tr><td colspan="3" style="padding: 30px; text-align: center; color: var(--text-muted);">No hay solicitudes listas para RRHH</td></tr>' : ''}
                </tbody>
            </table>
        </section>

        <div class="card fade-in" style="background: var(--bg-dark); color: white;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="font-size: 1.2rem; margin-bottom: 8px;">Nube de Secretaría ADE</h3>
                    <p style="font-size: 0.8rem; opacity: 0.7;">Central de almacenamiento digital de expedientes.</p>
                </div>
                <button class="btn btn-secondary">
                    <span class="material-symbols-outlined">cloud_download</span>
                    Ver Archivo
                </button>
            </div>
        </div>
      `;
    },
    
    assistant: () => {
      // Assistant requirement: archives, downloads, global calendar, digital signatures check, notifications, service years update, photos.
      return `
        <header class="fade-in" style="margin-bottom: 32px;">
            <h1 style="font-size: 1.8rem; font-weight: 800; color: var(--primary);">Asistente de Recursos Humanos</h1>
            <p style="color: var(--text-muted); font-weight: 500;">Gestión operativa y actualización de records.</p>
        </header>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 32px;">
            <section class="card fade-in">
                <h3 style="font-size: 1rem; color: var(--primary); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                    <span class="material-symbols-outlined">person_add</span>
                    Actualización de Empleomanía
                </h3>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <button class="btn btn-primary" style="width: 100%; justify-content: center;" onclick="app.addYearsOfService()">+ Sumar Año de Servicio</button>
                    <button class="btn btn-tertiary" style="width: 100%; justify-content: center;">Actualizar Fotos de Perfil</button>
                    <div style="margin-top: 12px; padding: 12px; background: #f0f9ff; border-radius: 8px; border: 1px solid #bae6fd;">
                        <p style="font-size: 0.75rem; color: #0369a1;"><strong>Regulaciones ADE:</strong> La categoría cambia automáticamente al llegar a los 5 y 10 años.</p>
                    </div>
                </div>
            </section>

            <section class="card fade-in">
                <h3 style="font-size: 1rem; color: var(--primary); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                    <span class="material-symbols-outlined">notifications_active</span>
                    Procesos de Firma Digital
                </h3>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                     <div style="display: flex; justify-content: space-between; align-items:center; padding: 10px; border-bottom: 1px solid #f1f5f9;">
                        <span style="font-size: 0.8rem;">Juan Pérez (Vacaciones)</span>
                        <span class="badge badge-approved" style="font-size: 0.6rem;">FIRMADO</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items:center; padding: 10px; border-bottom: 1px solid #f1f5f9;">
                        <span style="font-size: 0.8rem;">Marta López (Casamiento)</span>
                        <span class="badge badge-pending" style="font-size: 0.6rem;">PENDIENTE RRHH</span>
                    </div>
                    <button class="btn" style="background: var(--bg-dark); color: white; margin-top: 12px;" onclick="app.notifySignatories()">
                        <span class="material-symbols-outlined">send</span>
                        Notificar por Correo
                    </button>
                </div>
            </section>
        </div>

        <section class="card fade-in">
             <h2 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 20px;">Gestión de Archivos y Descargas</h2>
             <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
                 <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; text-align: center;">
                    <span class="material-symbols-outlined" style="font-size: 2rem; color: var(--primary);">download</span>
                    <p style="font-size: 0.75rem; font-weight: 700; margin-top: 8px;">Historial 2023</p>
                 </div>
                 <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; text-align: center;">
                    <span class="material-symbols-outlined" style="font-size: 2rem; color: var(--primary);">history_edu</span>
                    <p style="font-size: 0.75rem; font-weight: 700; margin-top: 8px;">Records Firmados</p>
                 </div>
                 <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; text-align: center;">
                    <span class="material-symbols-outlined" style="font-size: 2rem; color: var(--primary);">picture_as_pdf</span>
                    <p style="font-size: 0.75rem; font-weight: 700; margin-top: 8px;">Reporte Mensual</p>
                 </div>
             </div>
        </section>
      `;
    },
    
    form: () => {
      // Form Requirement: Intuitive, names, position dropdown, vacation types, dates, 3 digital signatures.
      return `
        <header class="fade-in" style="margin-bottom: 32px;">
            <h1 style="font-size: 1.8rem; font-weight: 800; color: var(--primary);">Solicitud de Vacaciones</h1>
            <p style="color: var(--text-muted); font-weight: 500;">Completa el formulario institucional para procesar tu licencia.</p>
        </header>

        <form class="card fade-in" id="vacation-form" onsubmit="app.submitForm(event)">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                <div>
                    <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--primary); margin-bottom: 8px;">Nombre Completo</label>
                    <input type="text" value="${state.user.name}" readonly style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; font-weight: 600;">
                </div>
                <div>
                    <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--primary); margin-bottom: 8px;">Posición / Cargo</label>
                    <select style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-weight: 600;">
                        <option>Presidente</option>
                        <option>Secretario</option>
                        <option>Tesorero</option>
                        <option selected>Pastor</option>
                        <option>Contador</option>
                        <option>Mensajero</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--primary); margin-bottom: 8px;">Tipo de Vacaciones</label>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                        <button type="button" class="btn" style="background: #f1f5f9; border: 2px solid var(--primary);">Locales</button>
                        <button type="button" class="btn" style="background: #f1f5f9;">Internacionales</button>
                        <button type="button" class="btn" style="background: #f1f5f9;">Conjuntas</button>
                    </div>
                </div>
                <div>
                     <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--primary); margin-bottom: 8px;">Fecha de Inicio</label>
                     <input type="date" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;" id="start_date">
                </div>
                <div>
                     <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--primary); margin-bottom: 8px;">Fecha de Reincorporación</label>
                     <input type="date" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;" id="end_date">
                </div>
            </div>

            <div style="margin-bottom: 32px;">
                <h3 style="font-size: 1rem; color: var(--primary); margin-bottom: 16px; border-bottom: 2px solid var(--secondary); display: inline-block;">Firma Digital</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
                    <div>
                        <p style="font-size: 0.7rem; font-weight: 700; text-align: center; margin-bottom: 8px;">SOLICITANTE</p>
                        <div class="signature-box">Clic para firmar</div>
                    </div>
                    <div>
                        <p style="font-size: 0.7rem; font-weight: 700; text-align: center; margin-bottom: 8px;">RESPONSABLE INMEDIATO</p>
                        <div class="signature-box" style="background: #f1f5f9; border-style: solid; border-width: 1px; color: #cbd5e1;">Pendiente</div>
                    </div>
                    <div>
                        <p style="font-size: 0.7rem; font-weight: 700; text-align: center; margin-bottom: 8px;">RECURSOS HUMANOS</p>
                        <div class="signature-box" style="background: #f1f5f9; border-style: solid; border-width: 1px; color: #cbd5e1;">Pendiente</div>
                    </div>
                </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 16px;">
                <button type="button" class="btn" onclick="app.navigate('dashboard', event)">Cancelar</button>
                <button type="submit" class="btn btn-primary" style="padding-left: 40px; padding-right: 40px;">Enviar Solicitud</button>
            </div>
        </form>
      `;
    }
  },
  
  init: function() {
    this.render();
    this.updateNav();
    console.log("🚀 ADE Vacaciones App Iniciada");
  },
  
  navigate: function(view, e) {
    if (e) e.preventDefault();
    this.activeView = view;
    this.render();
    this.updateNav();
  },
  
  updateNav: function() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('onclick').includes(this.activeView)) {
        link.classList.add('active');
      }
    });

    // Role-based visibility
    document.getElementById('nav-manager').style.display = (this.currentRole === 'manager' || this.currentRole === 'hr' || this.currentRole === 'assistant') ? 'flex' : 'none';
    document.getElementById('nav-hr').style.display = (this.currentRole === 'hr' || this.currentRole === 'assistant') ? 'flex' : 'none';
    document.getElementById('nav-assistant').style.display = (this.currentRole === 'assistant') ? 'flex' : 'none';
  },
  
  render: function() {
    const container = document.getElementById('view-container');
    container.innerHTML = this.views[this.activeView]();
    window.scrollTo(0, 0);
  },
  
  switchRole: function(role) {
    this.currentRole = role;
    this.updateNav();
    // Auto navigate to relevant panel?
    if (role === 'employee') this.navigate('dashboard');
    else if (role === 'manager') this.navigate('manager');
    else if (role === 'hr') this.navigate('hr');
    else if (role === 'assistant') this.navigate('assistant');
  },
  
  approveRequest: function(id, role) {
    state.approveRequest(id, role);
    this.render();
    this.showToast('Solicitud aprobada correctamente');
  },
  
  submitForm: function(e) {
    e.preventDefault();
    const start = document.getElementById('start_date').value;
    const end = document.getElementById('end_date').value;
    
    if (!start || !end) {
        alert("Por favor seleccione las fechas");
        return;
    }

    const newReq = {
        id: "REQ-" + Math.floor(Math.random() * 1000),
        employeeId: state.user.id,
        employeeName: state.user.name,
        type: "Local",
        startDate: start,
        endDate: end,
        status: "pending",
        duration: "Calculando...",
        signatures: { applicant: true, manager: false, hr: false }
    };
    
    state.vacationRequests.unshift(newReq);
    state.saveToCloud();
    this.navigate('dashboard');
    this.showToast('Solicitud enviada a revisión');
  },
  
  addYearsOfService: function() {
    state.user.yearsOfService += 1;
    state.user.fullWeeksPerYear = state.calculateWeeks(state.user.yearsOfService);
    state.saveToCloud();
    this.render();
    this.showToast('Año de servicio agregado. Categoría actualizada.');
  },
  
  showToast: function(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 24px; right: 24px; 
        background: var(--primary); color: white; 
        padding: 12px 24px; border-radius: 8px; 
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        z-index: 1000; font-weight: 600;
        animation: fadeIn 0.3s ease-out;
    `;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  },

  requestEvangelismo: function() {
    if (confirm("¿Solicitar 10 días de Evangelismo? Requiere aprobación de su jefe inmediato.")) {
        this.navigate('form');
    }
  },

  notifySignatories: function() {
    this.showToast('Correos de notificación enviados a todos los responsables.');
  }
};

app.init();
