import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PrintService {

  generateReportHTML(
    dashboard: any,
    topCustomers: any,
    monthlyIncome: any,
    paymentMethods: any
  ): string {
    const fechaGeneracion = new Date().toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const periodoInicio = new Date(dashboard.period.startDate).toLocaleDateString('es-PE');
    const periodoFin = new Date(dashboard.period.endDate).toLocaleDateString('es-PE');

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte Financiero - ErmaZafe | ${fechaGeneracion}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 40px 20px;
      color: #2c3e50;
      line-height: 1.6;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 60px;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }

    /* HEADER */
    .header {
      text-align: center;
      border-bottom: 4px solid #667eea;
      padding-bottom: 30px;
      margin-bottom: 40px;
      position: relative;
    }

    .header::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 4px;
      background: linear-gradient(90deg, transparent, #764ba2, transparent);
    }

    .company-logo {
      font-size: 3.5rem;
      margin-bottom: 10px;
    }

    .header h1 {
      font-size: 3rem;
      color: #667eea;
      font-weight: 800;
      margin-bottom: 10px;
      letter-spacing: -1px;
      text-transform: uppercase;
    }

    .header .subtitle {
      font-size: 1.3rem;
      color: #6c757d;
      font-weight: 400;
      margin-bottom: 20px;
    }

    .report-metadata {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin-top: 25px;
      flex-wrap: wrap;
    }

    .metadata-item {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 25px;
      border-radius: 30px;
      font-size: 0.9rem;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .metadata-item strong {
      font-weight: 800;
    }

    /* SECCIONES */
    .section {
      margin-bottom: 50px;
    }

    .section-title {
      font-size: 2rem;
      color: #2c3e50;
      font-weight: 700;
      margin-bottom: 30px;
      border-left: 6px solid #667eea;
      padding-left: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .section-title .emoji {
      font-size: 2.5rem;
    }

    /* KPIs */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      margin-bottom: 40px;
    }

    .kpi-card {
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      padding: 35px;
      border-radius: 16px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
      text-align: center;
      position: relative;
      overflow: hidden;
      transition: transform 0.3s ease;
    }

    .kpi-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 5px;
    }

    .kpi-card.green::before { background: linear-gradient(90deg, #10b981 0%, #059669 100%); }
    .kpi-card.blue::before { background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%); }
    .kpi-card.orange::before { background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); }
    .kpi-card.purple::before { background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%); }

    .kpi-icon {
      font-size: 3rem;
      margin-bottom: 15px;
    }

    .kpi-label {
      font-size: 0.95rem;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .kpi-value {
      font-size: 2.5rem;
      color: #2c3e50;
      font-weight: 800;
      letter-spacing: -1px;
    }

    /* TABLAS */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
      border-radius: 12px;
      overflow: hidden;
    }

    thead {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    thead th {
      padding: 20px;
      text-align: left;
      color: white;
      font-weight: 700;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    tbody tr {
      border-bottom: 1px solid #e9ecef;
      transition: all 0.2s ease;
    }

    tbody tr:hover {
      background: #f8f9fa;
      transform: scale(1.01);
    }

    tbody tr:last-child {
      border-bottom: none;
    }

    tbody td {
      padding: 18px 20px;
      color: #495057;
      font-size: 0.95rem;
    }

    tbody td:last-child {
      font-weight: 700;
      color: #10b981;
      text-align: right;
    }

    tbody td:nth-child(3) {
      text-align: center;
      font-weight: 600;
      color: #667eea;
    }

    /* TOTALES */
    .total-row {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      font-weight: 800;
      color: #2c3e50 !important;
    }

    .total-row td {
      color: #2c3e50 !important;
      border-top: 3px solid #667eea;
    }

    /* FOOTER */
    .footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 3px solid #e9ecef;
      text-align: center;
    }

    .footer-content {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    }

    .footer-content h3 {
      font-size: 1.5rem;
      margin-bottom: 10px;
      font-weight: 700;
    }

    .footer-content p {
      margin: 5px 0;
      font-size: 0.95rem;
      opacity: 0.9;
    }

    .footer-legal {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 0.85rem;
      opacity: 0.8;
    }

    /* PRINT STYLES */
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .container {
        box-shadow: none;
        padding: 20px;
      }
      .kpi-card:hover, tbody tr:hover {
        transform: none;
      }
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .container {
        padding: 30px 20px;
      }
      .header h1 {
        font-size: 2rem;
      }
      .kpi-grid {
        grid-template-columns: 1fr;
      }
      .report-metadata {
        flex-direction: column;
        gap: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- HEADER -->
    <div class="header">
      <div class="company-logo">👗</div>
      <h1>ErmaZafe</h1>
      <div class="subtitle">Reporte de Gestión Financiera y Operativa</div>
      <div class="report-metadata">
        <div class="metadata-item">
          📅 <strong>Período:</strong> ${periodoInicio} - ${periodoFin}
        </div>
        <div class="metadata-item">
          🕒 <strong>Generado:</strong> ${fechaGeneracion}
        </div>
      </div>
    </div>

    <!-- KPIs PRINCIPALES -->
    <div class="section">
      <h2 class="section-title">
        <span class="emoji">📊</span>
        Indicadores Clave de Rendimiento
      </h2>
      <div class="kpi-grid">
        <div class="kpi-card green">
          <div class="kpi-icon">💰</div>
          <div class="kpi-label">Ingresos Totales</div>
          <div class="kpi-value">S/ ${dashboard.kpis.totalIncome.toFixed(2)}</div>
        </div>
        <div class="kpi-card blue">
          <div class="kpi-icon">💳</div>
          <div class="kpi-label">Pagos Procesados</div>
          <div class="kpi-value">${dashboard.kpis.totalPayments}</div>
        </div>
        <div class="kpi-card orange">
          <div class="kpi-icon">⏳</div>
          <div class="kpi-label">Pagos Pendientes</div>
          <div class="kpi-value">${dashboard.kpis.pendingPayments}</div>
        </div>
        <div class="kpi-card purple">
          <div class="kpi-icon">👥</div>
          <div class="kpi-label">Total Clientes</div>
          <div class="kpi-value">${dashboard.kpis.totalCustomers}</div>
        </div>
      </div>
    </div>

    <!-- TOP CLIENTES -->
    <div class="section">
      <h2 class="section-title">
        <span class="emoji">🏆</span>
        Clientes Principales
      </h2>
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Email</th>
            <th>Alquileres</th>
            <th>Total Gastado</th>
          </tr>
        </thead>
        <tbody>
          ${topCustomers.topCustomers.map((c: any) => `
            <tr>
              <td><strong>${c.name}</strong></td>
              <td>${c.email}</td>
              <td>${c.rentals}</td>
              <td>S/ ${c.totalSpent.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- INGRESOS MENSUALES -->
    <div class="section">
      <h2 class="section-title">
        <span class="emoji">📈</span>
        Evolución de Ingresos Mensuales
      </h2>
      <table>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Ingresos</th>
            <th>Transacciones</th>
          </tr>
        </thead>
        <tbody>
          ${monthlyIncome.months.map((m: any) => `
            <tr>
              <td><strong>${m.month}</strong></td>
              <td>S/ ${m.income.toFixed(2)}</td>
              <td>${m.transactions}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td><strong>TOTAL ANUAL</strong></td>
            <td><strong>S/ ${monthlyIncome.months.reduce((acc: number, m: any) => acc + m.income, 0).toFixed(2)}</strong></td>
            <td><strong>${monthlyIncome.months.reduce((acc: number, m: any) => acc + m.transactions, 0)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MÉTODOS DE PAGO -->
    <div class="section">
      <h2 class="section-title">
        <span class="emoji">💳</span>
        Distribución por Método de Pago
      </h2>
      <table>
        <thead>
          <tr>
            <th>Método de Pago</th>
            <th>Cantidad de Transacciones</th>
            <th>Monto Total</th>
          </tr>
        </thead>
        <tbody>
          ${paymentMethods.methods.map((m: any) => `
            <tr>
              <td><strong>${m.method.toUpperCase()}</strong></td>
              <td>${m.count}</td>
              <td>S/ ${m.total.toFixed(2)}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td><strong>TOTAL</strong></td>
            <td><strong>${paymentMethods.methods.reduce((acc: number, m: any) => acc + m.count, 0)}</strong></td>
            <td><strong>S/ ${paymentMethods.methods.reduce((acc: number, m: any) => acc + m.total, 0).toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div class="footer-content">
        <h3>👗 ErmaZafe</h3>
        <p><strong>Sistema de Gestión de Alquileres y Ventas</strong></p>
        <p>Reporte confidencial - Uso exclusivo interno</p>
        <div class="footer-legal">
          <p>© ${new Date().getFullYear()} ErmaZafe. Todos los derechos reservados.</p>
          <p>Documento generado automáticamente el ${fechaGeneracion}</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }

  imprimirReporte(html: string): void {
    const ventanaImpresion = window.open('', '_blank', 'width=1200,height=800');
    if (ventanaImpresion) {
      ventanaImpresion.document.write(html);
      ventanaImpresion.document.close();
      ventanaImpresion.focus();
      setTimeout(() => {
        ventanaImpresion.print();
      }, 500);
    } else {
      console.error('❌ No se pudo abrir la ventana de impresión');
    }
  }

  descargarReporte(html: string): void {
    const fecha = new Date().toISOString().split('T')[0];
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `Reporte_Financiero_ErmaZafe_${fecha}.html`;
    enlace.click();
    window.URL.revokeObjectURL(url);
  }
}
