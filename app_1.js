/* MenuMargin Profitability Web App - app.js (Fixed Navigation) */

// DOM Ready Helper
function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(() => {
  // Demo Data from JSON
  const demoData = {
    dishes: [
      {id: 1, name: "Paneer 65", category: "Appetizer", sellingPrice: 320, ingredientCost: 85, laborCost: 25, margin: 73.4},
      {id: 2, name: "Butter Chicken", category: "Main Course", sellingPrice: 450, ingredientCost: 140, laborCost: 35, margin: 61.1},
      {id: 3, name: "Dal Makhani", category: "Main Course", sellingPrice: 280, ingredientCost: 65, laborCost: 20, margin: 69.6},
      {id: 4, name: "Biryani", category: "Rice", sellingPrice: 380, ingredientCost: 120, laborCost: 30, margin: 60.5},
      {id: 5, name: "Naan", category: "Bread", sellingPrice: 80, ingredientCost: 15, laborCost: 8, margin: 71.3},
      {id: 6, name: "Samosa", category: "Appetizer", sellingPrice: 60, ingredientCost: 18, laborCost: 12, margin: 50.0},
      {id: 7, name: "Tandoori Chicken", category: "Main Course", sellingPrice: 420, ingredientCost: 160, laborCost: 40, margin: 52.4},
      {id: 8, name: "Chole Bhature", category: "Main Course", sellingPrice: 220, ingredientCost: 55, laborCost: 18, margin: 66.8},
      {id: 9, name: "Masala Dosa", category: "South Indian", sellingPrice: 180, ingredientCost: 35, laborCost: 15, margin: 72.2},
      {id: 10, name: "Gulab Jamun", category: "Dessert", sellingPrice: 120, ingredientCost: 25, laborCost: 10, margin: 70.8}
    ],
    beverages: [
      {id: 1, name: "Masala Chai", type: "Hot Beverage", sellingPrice: 40, ingredientCost: 8, margin: 80.0},
      {id: 2, name: "Fresh Lime Soda", type: "Cold Beverage", sellingPrice: 60, ingredientCost: 12, margin: 80.0},
      {id: 3, name: "Kingfisher Beer", type: "Beer", sellingPrice: 150, ingredientCost: 85, margin: 43.3},
      {id: 4, name: "House Wine", type: "Wine", sellingPrice: 200, ingredientCost: 120, margin: 40.0},
      {id: 5, name: "Whiskey Peg", type: "Spirits", sellingPrice: 180, ingredientCost: 90, margin: 50.0},
      {id: 6, name: "Mojito", type: "Cocktail", sellingPrice: 250, ingredientCost: 80, margin: 68.0},
      {id: 7, name: "Virgin Mojito", type: "Mocktail", sellingPrice: 150, ingredientCost: 45, margin: 70.0},
      {id: 8, name: "Mango Lassi", type: "Cold Beverage", sellingPrice: 80, ingredientCost: 25, margin: 68.8},
      {id: 9, name: "Filter Coffee", type: "Hot Beverage", sellingPrice: 50, ingredientCost: 12, margin: 76.0},
      {id: 10, name: "Buttermilk", type: "Cold Beverage", sellingPrice: 45, ingredientCost: 10, margin: 77.8}
    ],
    salesData: [
      {date: "2025-01-01", revenue: 45800, foodSales: 32560, beverageSales: 13240},
      {date: "2025-01-02", revenue: 52300, foodSales: 37610, beverageSales: 14690},
      {date: "2025-01-03", revenue: 48900, foodSales: 34230, beverageSales: 14670},
      {date: "2025-01-04", revenue: 51200, foodSales: 35840, beverageSales: 15360},
      {date: "2025-01-05", revenue: 47600, foodSales: 33320, beverageSales: 14280}
    ],
    costBreakdown: {
      ingredients: 45,
      labor: 25,
      overhead: 20,
      utilities: 10
    }
  };

  // Mutable working data
  let dishes = JSON.parse(JSON.stringify(demoData.dishes));
  let beverages = JSON.parse(JSON.stringify(demoData.beverages));
  let salesData = JSON.parse(JSON.stringify(demoData.salesData));
  let currentRole = 'owner';
  let isDemoMode = true;

  // Chart instances
  const charts = {};

  // Utility Functions
  function calcTotals(item) {
    const totalCost = item.ingredientCost + (item.laborCost || 0);
    const profit = item.sellingPrice - totalCost;
    const margin = item.sellingPrice ? (profit / item.sellingPrice) * 100 : 0;
    return { totalCost, profit, margin };
  }

  function formatCurrency(num) {
    return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }

  function colorForMargin(margin) {
    if (margin > 65) return '#1FB8CD'; // Teal
    if (margin >= 30) return '#FFB300'; // Amber
    return '#DB4545'; // Red
  }

  function averageMargin(arr) {
    if (!arr.length) return 0;
    const sum = arr.reduce((acc, item) => {
      const { margin } = calcTotals(item);
      return acc + margin;
    }, 0);
    return sum / arr.length;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function switchScreens(fromId, toId) {
    document.getElementById(fromId).classList.remove('active');
    document.getElementById(toId).classList.add('active');
  }

  // Authentication
  const loginBtn = document.getElementById('login-btn');
  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const roleSelect = document.getElementById('role');
    const demoToggle = document.getElementById('demo-mode');
    currentRole = roleSelect.value;
    isDemoMode = demoToggle.checked;
    
    switchScreens('login-screen', 'main-app');
    document.getElementById('current-user').textContent = capitalize(currentRole);
    initApp();
  });

  // Main App Initialization
  function initApp() {
    renderKPIs();
    renderCharts();
    renderMenuTable('food');
    setupNav();
    setupMenuTabs();
    setupUserMenu();
    setupAlerts();
    setupModals();
    setupImportExport();
    generateAlerts();
  }

  // KPI Rendering
  function renderKPIs() {
    const avgFood = averageMargin(dishes);
    const avgBev = averageMargin(beverages);
    
    document.getElementById('food-margin').textContent = `${avgFood.toFixed(0)}%`;
    document.getElementById('beverage-margin').textContent = `${avgBev.toFixed(0)}%`;

    const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
    document.getElementById('total-revenue').textContent = formatCurrency(totalRevenue);

    const allItems = [...dishes, ...beverages];
    const avgCogs = allItems.reduce((sum, item) => {
      return sum + (item.ingredientCost / item.sellingPrice);
    }, 0) / allItems.length * 100;
    
    document.getElementById('cogs-percent').textContent = `${avgCogs.toFixed(0)}%`;
  }

  // Chart Rendering
  function renderCharts() {
    renderProfitMarginsChart();
    renderMonthlyTrendsChart();
    renderCostBreakdownChart();
    renderRevenueDistributionChart();
    renderUnderperformersChart();
  }

  // 1. Profitability Champions - Horizontal Bar Chart
  function renderProfitMarginsChart() {
    const ctx = document.getElementById('profit-margins-chart');
    if (charts.profit) charts.profit.destroy();
    
    const allItems = [...dishes, ...beverages].map(item => ({
      ...item,
      ...calcTotals(item)
    })).sort((a, b) => b.margin - a.margin).slice(0, 10);

    charts.profit = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: allItems.map(item => item.name),
        datasets: [{
          label: 'Margin %',
          data: allItems.map(item => item.margin.toFixed(1)),
          backgroundColor: allItems.map(item => colorForMargin(item.margin)),
          borderColor: allItems.map(item => colorForMargin(item.margin)),
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        onClick: (e, elements) => {
          if (elements.length) {
            openItemModal(allItems[elements[0].index], 'food');
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.x.toFixed(1)}% margin`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { callback: (value) => `${value}%` }
          },
          y: {
            ticks: { maxRotation: 0 }
          }
        }
      }
    });
  }

  // 2. Monthly Trends - Line Chart
  function renderMonthlyTrendsChart() {
    const ctx = document.getElementById('monthly-trends-chart');
    if (charts.monthly) charts.monthly.destroy();

    charts.monthly = new Chart(ctx, {
      type: 'line',
      data: {
        labels: salesData.map(day => new Date(day.date).toLocaleDateString()),
        datasets: [{
          label: 'Revenue',
          data: salesData.map(day => day.revenue),
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => formatCurrency(context.parsed.y)
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => formatCurrency(value)
            }
          }
        }
      }
    });
  }

  // 3. Cost Breakdown - Pie Chart
  function renderCostBreakdownChart() {
    const ctx = document.getElementById('cost-breakdown-chart');
    if (charts.cost) charts.cost.destroy();

    const { costBreakdown } = demoData;
    const labels = Object.keys(costBreakdown).map(capitalize);
    const data = Object.values(costBreakdown);

    charts.cost = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed}%`
            }
          }
        }
      }
    });
  }

  // 4. Revenue Distribution - Doughnut Chart
  function renderRevenueDistributionChart() {
    const ctx = document.getElementById('revenue-distribution-chart');
    if (charts.revenue) charts.revenue.destroy();

    const foodRevenue = salesData.reduce((sum, day) => sum + day.foodSales, 0);
    const bevRevenue = salesData.reduce((sum, day) => sum + day.beverageSales, 0);

    charts.revenue = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Food', 'Beverages'],
        datasets: [{
          data: [foodRevenue, bevRevenue],
          backgroundColor: ['#964325', '#D2BA4C']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${formatCurrency(context.parsed)}`
            }
          }
        }
      }
    });
  }

  // 5. Underperformers Alert - Red Bar Chart
  function renderUnderperformersChart() {
    const ctx = document.getElementById('underperformers-chart');
    if (charts.underperformers) charts.underperformers.destroy();

    const underperformers = [...dishes, ...beverages]
      .map(item => ({ ...item, ...calcTotals(item) }))
      .filter(item => item.margin < 30)
      .sort((a, b) => a.margin - b.margin);

    charts.underperformers = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: underperformers.map(item => item.name),
        datasets: [{
          label: 'Margin %',
          data: underperformers.map(item => item.margin.toFixed(1)),
          backgroundColor: '#DB4545',
          borderColor: '#DB4545',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 30,
            ticks: { callback: (value) => `${value}%` }
          }
        }
      }
    });
  }

  // Menu Table Rendering
  function renderMenuTable(type) {
    const tbody = document.getElementById('menu-table-body');
    tbody.innerHTML = '';
    
    const items = type === 'food' ? dishes : beverages;
    
    items.forEach(item => {
      const { margin } = calcTotals(item);
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.category || item.type}</td>
        <td>${formatCurrency(item.sellingPrice)}</td>
        <td>${formatCurrency(item.ingredientCost)}</td>
        <td>${margin.toFixed(1)}%</td>
        <td><span class="status-badge" style="background-color: ${colorForMargin(margin)}; color: white;">${margin > 65 ? 'Excellent' : margin >= 30 ? 'Good' : 'Poor'}</span></td>
        <td><button class="btn btn--sm btn--outline" data-id="${item.id}" data-type="${type}">Edit</button></td>
      `;
      
      tbody.appendChild(row);
    });
  }

  // Navigation Setup - FIXED
  function setupNav() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(navItem => {
      navItem.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Remove active class from all nav items
        navItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to clicked nav item
        navItem.classList.add('active');
        
        // Hide all pages
        pages.forEach(page => page.classList.remove('active'));
        
        // Show the corresponding page
        const pageId = `${navItem.getAttribute('data-page')}-page`;
        const targetPage = document.getElementById(pageId);
        
        if (targetPage) {
          targetPage.classList.add('active');
          
          // If navigating to menu items, ensure table is rendered
          if (pageId === 'menu-items-page') {
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
              renderMenuTable(activeTab.getAttribute('data-tab'));
            }
          }
        }
      });
    });
  }

  // Menu Tabs Setup
  function setupMenuTabs() {
    document.querySelectorAll('.tab-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        renderMenuTable(button.getAttribute('data-tab'));
      });
    });
  }

  // User Menu Setup - FIXED
  function setupUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    const userBtn = document.getElementById('user-btn');
    const logoutBtn = document.getElementById('logout-btn');

    userBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      userMenu.classList.toggle('open');
    });

    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      location.reload();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!userMenu.contains(e.target)) {
        userMenu.classList.remove('open');
      }
    });
  }

  // Alerts Setup
  function setupAlerts() {
    const alertsBtn = document.getElementById('alerts-btn');
    alertsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showAlertsModal();
    });
  }

  function generateAlerts() {
    const lowMarginItems = [...dishes, ...beverages]
      .map(item => ({ ...item, ...calcTotals(item) }))
      .filter(item => item.margin < 30);
    
    document.getElementById('alert-badge').textContent = lowMarginItems.length;
    return lowMarginItems;
  }

  function showAlertsModal() {
    const modal = document.getElementById('alerts-modal');
    const alertsList = document.getElementById('alerts-list');
    const lowMarginItems = generateAlerts();
    
    alertsList.innerHTML = '';
    
    if (lowMarginItems.length === 0) {
      alertsList.innerHTML = '<p>No low margin items to report! 🎉</p>';
    } else {
      lowMarginItems.forEach(item => {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'status status--error';
        alertDiv.style.display = 'block';
        alertDiv.style.marginBottom = '8px';
        alertDiv.innerHTML = `<strong>${item.name}</strong> - ${item.margin.toFixed(1)}% margin (${item.category || item.type})`;
        alertsList.appendChild(alertDiv);
      });
    }
    
    modal.classList.remove('hidden');
  }

  // Modal Setup
  function setupModals() {
    // Item modal
    const itemModal = document.getElementById('item-modal');
    const menuTable = document.getElementById('menu-table');
    
    // Edit button delegation
    menuTable.addEventListener('click', (e) => {
      const editBtn = e.target.closest('button[data-id]');
      if (editBtn) {
        e.preventDefault();
        e.stopPropagation();
        
        const id = parseInt(editBtn.dataset.id);
        const type = editBtn.dataset.type;
        const items = type === 'food' ? dishes : beverages;
        const item = items.find(i => i.id === id);
        if (item) openItemModal(item, type);
      }
    });

    // Add new item button
    document.getElementById('add-item-btn').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
      const newItem = {
        id: Date.now(),
        name: 'New Item',
        [activeTab === 'food' ? 'category' : 'type']: activeTab === 'food' ? 'Main Course' : 'Cold Beverage',
        sellingPrice: 100,
        ingredientCost: 30,
        laborCost: 10
      };
      
      if (activeTab === 'food') {
        dishes.push(newItem);
      } else {
        beverages.push(newItem);
      }
      
      openItemModal(newItem, activeTab);
    });

    // Modal close handlers
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const modal = e.target.closest('.modal');
        modal.classList.add('hidden');
      });
    });

    // Close modals when clicking backdrop
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    });
  }

  // Item Modal
  function openItemModal(item, type) {
    const modal = document.getElementById('item-modal');
    
    // Populate form
    document.getElementById('modal-title').textContent = `Edit ${item.name}`;
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-category').value = item.category || item.type;
    document.getElementById('selling-price').value = item.sellingPrice;
    document.getElementById('ingredient-cost').value = item.ingredientCost;
    document.getElementById('labor-cost').value = item.laborCost || 0;
    document.getElementById('packaging-cost').value = 0;

    // Update current margin display
    const { margin } = calcTotals(item);
    document.getElementById('current-margin').textContent = `${margin.toFixed(1)}%`;

    // Reset simulator
    document.getElementById('sim-selling-price').value = '';
    document.getElementById('sim-ingredient-cost').value = '';
    document.getElementById('sim-margin').textContent = '0%';
    document.getElementById('profit-impact').textContent = '₹0';

    // Simulator event listeners
    const simPriceInput = document.getElementById('sim-selling-price');
    const simCostInput = document.getElementById('sim-ingredient-cost');
    
    function updateSimulator() {
      const simPrice = parseFloat(simPriceInput.value) || item.sellingPrice;
      const simCost = parseFloat(simCostInput.value) || item.ingredientCost;
      const simLaborCost = item.laborCost || 0;
      
      const simTotalCost = simCost + simLaborCost;
      const simProfit = simPrice - simTotalCost;
      const simMargin = simPrice ? (simProfit / simPrice) * 100 : 0;
      
      document.getElementById('sim-margin').textContent = `${simMargin.toFixed(1)}%`;
      document.getElementById('profit-impact').textContent = formatCurrency(simProfit);
    }

    simPriceInput.addEventListener('input', updateSimulator);
    simCostInput.addEventListener('input', updateSimulator);

    // Save handler
    document.getElementById('modal-save').onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      item.name = document.getElementById('item-name').value;
      item.category = document.getElementById('item-category').value;
      item.type = document.getElementById('item-category').value;
      item.sellingPrice = parseFloat(document.getElementById('selling-price').value);
      item.ingredientCost = parseFloat(document.getElementById('ingredient-cost').value);
      item.laborCost = parseFloat(document.getElementById('labor-cost').value) || 0;

      // Update displays
      renderMenuTable(document.querySelector('.tab-btn.active').dataset.tab);
      renderKPIs();
      renderCharts();
      generateAlerts();
      
      modal.classList.add('hidden');
    };

    // Cancel handler
    document.getElementById('modal-cancel').onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      modal.classList.add('hidden');
    };

    modal.classList.remove('hidden');
  }

  // Import/Export Setup
  function setupImportExport() {
    // Demo data generation
    document.getElementById('generate-demo-btn').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      dishes = JSON.parse(JSON.stringify(demoData.dishes));
      beverages = JSON.parse(JSON.stringify(demoData.beverages));
      salesData = JSON.parse(JSON.stringify(demoData.salesData));
      
      renderMenuTable(document.querySelector('.tab-btn.active').dataset.tab);
      renderKPIs();
      renderCharts();
      generateAlerts();
      
      alert('Demo data generated successfully!');
    });

    // Report generation
    document.querySelectorAll('.report-card button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const reportType = e.target.closest('.report-card').dataset.report;
        showExportModal(reportType);
      });
    });
  }

  function showExportModal(reportType) {
    const modal = document.getElementById('export-modal');
    modal.classList.remove('hidden');
    
    document.getElementById('export-confirm').onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const format = document.getElementById('export-format').value;
      exportReport(reportType, format);
      modal.classList.add('hidden');
    };
  }

  function exportReport(reportType, format) {
    if (format === 'pdf') {
      exportToPDF(reportType);
    } else if (format === 'csv') {
      exportToCSV(reportType);
    } else if (format === 'png') {
      exportChartToPNG();
    }
  }

  function exportToPDF(reportType) {
    if (typeof window.jspdf === 'undefined') {
      alert('PDF export functionality requires jsPDF library');
      return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('MenuMargin Analytics Report', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Report Type: ${reportType.replace('-', ' ').toUpperCase()}`, 20, 40);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 50);
    
    // Add some sample data
    let yPos = 70;
    const items = [...dishes, ...beverages].slice(0, 10);
    
    doc.text('Top Items:', 20, yPos);
    yPos += 10;
    
    items.forEach((item, index) => {
      const { margin } = calcTotals(item);
      doc.text(`${index + 1}. ${item.name} - ${margin.toFixed(1)}% margin`, 20, yPos);
      yPos += 10;
    });
    
    doc.save(`menumargin-${reportType}-${Date.now()}.pdf`);
  }

  function exportToCSV(reportType) {
    const items = [...dishes, ...beverages];
    const csvContent = [
      ['Name', 'Category/Type', 'Selling Price', 'Ingredient Cost', 'Labor Cost', 'Margin %'].join(','),
      ...items.map(item => {
        const { margin } = calcTotals(item);
        return [
          item.name,
          item.category || item.type,
          item.sellingPrice,
          item.ingredientCost,
          item.laborCost || 0,
          margin.toFixed(1)
        ].join(',');
      })
    ].join('\n');
    
    downloadFile(csvContent, `menumargin-${reportType}-${Date.now()}.csv`, 'text/csv');
  }

  function exportChartToPNG() {
    const canvas = document.getElementById('profit-margins-chart');
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `menumargin-chart-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Global modal close function
  window.closeModal = function(modalId) {
    document.getElementById(modalId).classList.add('hidden');
  };
});