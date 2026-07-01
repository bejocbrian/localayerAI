import { GA_MEASUREMENT_ID } from '../config/constants.js';

function gtag() {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...arguments);
  }
}

export function trackPageView(pagePath, pageTitle) {
  gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
}

export function trackCTAClick(label, location) {
  gtag('event', 'cta_click', {
    event_label: label,
    event_category: 'engagement',
    cta_location: location,
  });
}

export function trackCalendlyOpen(source) {
  gtag('event', 'calendly_open', {
    event_label: source,
    event_category: 'conversion',
  });
}

export function trackPricingBuilder(action, data = {}) {
  gtag('event', `pricing_${action}`, {
    event_category: 'pricing_builder',
    ...data,
  });
}

export function trackDemoInteraction(demoName, action, data = {}) {
  gtag('event', `demo_${action}`, {
    event_label: demoName,
    event_category: 'demos',
    ...data,
  });
}

export function trackScrollDepth(percent) {
  gtag('event', 'scroll_depth', {
    event_category: 'engagement',
    percent_scrolled: percent,
  });
}

export function trackOutboundClick(url) {
  gtag('event', 'outbound_click', {
    event_label: url,
    event_category: 'navigation',
    link_url: url,
  });
}

export function trackServiceView(serviceId) {
  gtag('event', 'view_item', {
    event_category: 'services',
    item_id: serviceId,
  });
}
