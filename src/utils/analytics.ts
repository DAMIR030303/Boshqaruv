/**
 * Analytics utility
 *
 * Bu fayl Google Analytics va boshqa analytics platformalari bilan
 * integratsiya uchun ishlatiladi.
 */

/**
 * Analytics configuration
 */
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
const IS_PRODUCTION = import.meta.env.PROD;
const IS_ANALYTICS_ENABLED = IS_PRODUCTION && MEASUREMENT_ID;

/**
 * Initialize Google Analytics (placeholder)
 *
 * Production'da react-ga4 package qo'shing:
 * pnpm add react-ga4
 */
export const initializeAnalytics = () => {
  if (!IS_ANALYTICS_ENABLED) {
    console.log('ℹ️ Analytics disabled (development mode)');
    return;
  }

  // TODO: Uncomment when react-ga4 is installed
  // import('react-ga4').then((ReactGA) => {
  //   ReactGA.initialize(MEASUREMENT_ID);
  //   console.log('✅ Google Analytics initialized');
  // });

  console.log('✅ Analytics ready (placeholder)');
};

/**
 * Track page view
 */
export const trackPageView = (path: string, title?: string) => {
  if (!IS_ANALYTICS_ENABLED) return;

  // Log for development
  console.log('[Analytics] Page view:', path, title);

  // TODO: Uncomment when react-ga4 is installed
  // import('react-ga4').then((ReactGA) => {
  //   ReactGA.send({
  //     hitType: 'pageview',
  //     page: path,
  //     title: title || document.title
  //   });
  // });
};

/**
 * Track event
 */
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  if (!IS_ANALYTICS_ENABLED) return;

  // Log for development
  console.log('[Analytics] Event:', { category, action, label, value });

  // TODO: Uncomment when react-ga4 is installed
  // import('react-ga4').then((ReactGA) => {
  //   ReactGA.event({
  //     category,
  //     action,
  //     label,
  //     value
  //   });
  // });
};

/**
 * Set user ID
 */
export const setUser = (userId: string) => {
  if (!IS_ANALYTICS_ENABLED) return;

  console.log('[Analytics] User set:', userId);

  // TODO: Uncomment when react-ga4 is installed
  // import('react-ga4').then((ReactGA) => {
  //   ReactGA.set({ userId });
  // });
};

/**
 * Common analytics events
 */
export const analytics = {
  // Authentication
  login: (method: string) => {
    trackEvent('Authentication', 'Login', method);
  },
  logout: () => {
    trackEvent('Authentication', 'Logout');
  },

  // Tasks
  taskCreated: (taskId: string) => {
    trackEvent('Tasks', 'Create', taskId);
  },
  taskUpdated: (taskId: string) => {
    trackEvent('Tasks', 'Update', taskId);
  },
  taskDeleted: (taskId: string) => {
    trackEvent('Tasks', 'Delete', taskId);
  },
  taskCompleted: (taskId: string) => {
    trackEvent('Tasks', 'Complete', taskId);
  },

  // Employees
  employeeCreated: (employeeId: string) => {
    trackEvent('Employees', 'Create', employeeId);
  },
  employeeUpdated: (employeeId: string) => {
    trackEvent('Employees', 'Update', employeeId);
  },
  employeeDeleted: (employeeId: string) => {
    trackEvent('Employees', 'Delete', employeeId);
  },

  // Reports
  reportGenerated: (reportType: string) => {
    trackEvent('Reports', 'Generate', reportType);
  },
  reportExported: (reportType: string, format: string) => {
    trackEvent('Reports', 'Export', `${reportType}-${format}`);
  },

  // Search
  searchPerformed: (query: string) => {
    trackEvent('Search', 'Query', query);
  },

  // UI Interactions
  featureUsed: (feature: string) => {
    trackEvent('Features', 'Use', feature);
  },
  buttonClicked: (buttonName: string) => {
    trackEvent('UI', 'Button Click', buttonName);
  },

  // Settings
  languageChanged: (language: string) => {
    trackEvent('Settings', 'Language', language);
  },
  themeChanged: (theme: string) => {
    trackEvent('Settings', 'Theme', theme);
  },

  // Feedback
  feedbackSubmitted: (type: string, rating?: number) => {
    trackEvent('Feedback', 'Submit', type, rating);
  },

  // Onboarding
  onboardingStarted: () => {
    trackEvent('Onboarding', 'Start');
  },
  onboardingCompleted: () => {
    trackEvent('Onboarding', 'Complete');
  },
  onboardingSkipped: () => {
    trackEvent('Onboarding', 'Skip');
  },

  // Success animations
  successAnimationShown: (variant: string) => {
    trackEvent('UI', 'Success Animation', variant);
  },

  // Errors
  errorOccurred: (errorType: string, errorMessage: string) => {
    trackEvent('Errors', errorType, errorMessage);
  },
};
