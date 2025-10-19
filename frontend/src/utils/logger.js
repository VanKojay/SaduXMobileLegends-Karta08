// API Logger dengan file download capability
class APILogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100; // Keep last 100 logs in memory
  }

  // Log API request
  logRequest(config) {
    const log = {
      timestamp: new Date().toISOString(),
      type: 'REQUEST',
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data,
    };

    this.addLog(log);
    console.group(`🚀 API REQUEST: ${log.method} ${log.fullURL}`);
    console.log('Timestamp:', log.timestamp);
    console.log('Headers:', log.headers);
    console.log('Data:', log.data);
    console.groupEnd();

    return log;
  }

  // Log API response success
  logResponse(response) {
    const log = {
      timestamp: new Date().toISOString(),
      type: 'RESPONSE',
      status: response.status,
      statusText: response.statusText,
      method: response.config?.method?.toUpperCase(),
      url: response.config?.url,
      fullURL: `${response.config?.baseURL}${response.config?.url}`,
      data: response.data,
      headers: response.headers,
    };

    this.addLog(log);
    console.group(`✅ API RESPONSE: ${log.status} ${log.method} ${log.fullURL}`);
    console.log('Timestamp:', log.timestamp);
    console.log('Status:', log.status, log.statusText);
    console.log('Response Data:', log.data);
    console.groupEnd();

    return log;
  }

  // Log API error
  logError(error) {
    const log = {
      timestamp: new Date().toISOString(),
      type: 'ERROR',
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'N/A',
      requestData: error.config?.data,
      responseData: error.response?.data,
      headers: error.response?.headers,
      stack: error.stack,
    };

    this.addLog(log);
    console.group(`❌ API ERROR: ${log.status || 'Network Error'} ${log.method} ${log.fullURL}`);
    console.log('Timestamp:', log.timestamp);
    console.log('Error Message:', log.message);
    console.log('Status:', log.status, log.statusText);
    console.log('Request Data:', log.requestData);
    console.log('Response Data:', log.responseData);
    console.log('Stack:', log.stack);
    console.groupEnd();

    return log;
  }

  // Add log to memory
  addLog(log) {
    this.logs.push(log);
    
    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Also save to localStorage for persistence
    try {
      localStorage.setItem('api_logs', JSON.stringify(this.logs));
    } catch (e) {
      console.warn('Failed to save logs to localStorage:', e);
    }
  }

  // Get all logs
  getLogs() {
    return this.logs;
  }

  // Load logs from localStorage
  loadLogs() {
    try {
      const savedLogs = localStorage.getItem('api_logs');
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }
    } catch (e) {
      console.warn('Failed to load logs from localStorage:', e);
    }
  }

  // Clear all logs
  clearLogs() {
    this.logs = [];
    try {
      localStorage.removeItem('api_logs');
    } catch (e) {
      console.warn('Failed to clear logs from localStorage:', e);
    }
    console.log('✨ All logs cleared');
  }

  // Download logs as JSON file
  downloadLogs() {
    const logsJSON = JSON.stringify(this.logs, null, 2);
    const blob = new Blob([logsJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `api-logs-${new Date().toISOString().replace(/:/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('📥 Logs downloaded successfully');
  }

  // Download logs as readable text file
  downloadLogsAsText() {
    const logsText = this.logs.map(log => {
      return `
===========================================
[${log.timestamp}] ${log.type}
===========================================
Method: ${log.method || 'N/A'}
URL: ${log.fullURL || log.url || 'N/A'}
Status: ${log.status || 'N/A'} ${log.statusText || ''}
${log.type === 'ERROR' ? `Error: ${log.message}` : ''}

Request Data:
${JSON.stringify(log.data || log.requestData, null, 2)}

Response Data:
${JSON.stringify(log.responseData || log.data, null, 2)}

`;
    }).join('\n');

    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `api-logs-${new Date().toISOString().replace(/:/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('📥 Logs downloaded as text file');
  }

  // Print summary to console
  printSummary() {
    const requests = this.logs.filter(l => l.type === 'REQUEST').length;
    const responses = this.logs.filter(l => l.type === 'RESPONSE').length;
    const errors = this.logs.filter(l => l.type === 'ERROR').length;

    console.group('📊 API Logs Summary');
    console.log('Total Logs:', this.logs.length);
    console.log('Requests:', requests);
    console.log('Responses:', responses);
    console.log('Errors:', errors);
    console.log('---');
    console.log('Recent Errors:');
    this.logs
      .filter(l => l.type === 'ERROR')
      .slice(-5)
      .forEach(err => {
        console.log(`- [${err.timestamp}] ${err.method} ${err.url}: ${err.message}`);
      });
    console.groupEnd();
  }
}

// Create singleton instance
const apiLogger = new APILogger();

// Load saved logs on initialization
apiLogger.loadLogs();

// Expose to window for easy access in console
if (typeof window !== 'undefined') {
  window.apiLogger = apiLogger;
  window.downloadAPILogs = () => apiLogger.downloadLogs();
  window.downloadAPILogsText = () => apiLogger.downloadLogsAsText();
  window.clearAPILogs = () => apiLogger.clearLogs();
  window.printAPILogsSummary = () => apiLogger.printSummary();
  
  console.log('📝 API Logger initialized! Available commands:');
  console.log('  - apiLogger.getLogs() - Get all logs');
  console.log('  - downloadAPILogs() - Download logs as JSON');
  console.log('  - downloadAPILogsText() - Download logs as text');
  console.log('  - clearAPILogs() - Clear all logs');
  console.log('  - printAPILogsSummary() - Print summary');
}

export default apiLogger;
