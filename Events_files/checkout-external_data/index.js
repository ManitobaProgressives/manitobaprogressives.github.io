"use strict";

var multiplier = Math.pow(10, 2);

function round(number) {
  return Math.round(number * multiplier) / multiplier;
}

function getLoadedResources() {
  try {
    return performance.getEntriesByType('resource').filter(function (resource) {
      return resource.initiatorType === 'script';
    }).map(function (resource) {
      return '(' + round(resource.duration) + 'ms) ' + resource.name;
    });
  } catch (ex) {
    // loaded resource is a nice to have, so if it fails just let it.
    return null;
  }
}

function addLoadedResources(report) {
  report.updateMetaData('loadedResources', getLoadedResources());
}

function initializeErrorReporting(context) {
  var bugsnag = window.bugsnag;

  if (!bugsnag && typeof require !== 'undefined') {
    bugsnag = require('@bugsnag/browser');
  }

  if (!bugsnag) {
    console.error('Unable to initialize error reporting client: unable to find bugsnag globally');
    return;
  }

  var bugsnagClient = bugsnag({
    apiKey: 'b43b755774c67134549a5d1294f656ba',
    appVersion: "".concat(context.appName, "@").concat(context.appVersion),
    releaseStage: context.environment,
    autoNotify: context.shouldLogErrors,
    sessionTrackingEnabled: context.sessionTrackingEnabled,
    beforeSend: addLoadedResources
  });
  window.bugsnagClient = bugsnagClient;
  window.bugsnagClient.user = context.user;
  window.bugsnagClient.metaData = context.metaData;
  if (window.console) console.log('ebui: client error reporting initialized');
} // only initialize if the context has been sent by the server


if (window && window.errorReportingContext) {
  initializeErrorReporting(window.errorReportingContext);
}
//# sourceMappingURL=index.js.map