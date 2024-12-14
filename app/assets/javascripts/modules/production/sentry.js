import {
    init as SentryInit,
    getCurrentScope as SentryGetCurrentScope,
    withScope as SentryWithScope,
    captureException as SentryCaptureException,
    captureMessage as SentryCaptureMessage,
    browserTracingIntegration as SentryBrowserTracing,
    // replayIntegration as SentryReplay
    // showReportDialog as SentryShowReportDialog
} from '@sentry/browser';


export function initializeSentry() {
    SentryInit({
        dsn: window.SENTRY_JAVASCRIPT_KEY,

        integrations: [
            SentryBrowserTracing(),
            // SentryReplay({
            //     maskAllText: false,
            //     blockAllMedia: true
            // }),
            // // For recording canvas elements
            // replayCanvasIntegration()
        ],

        // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
        tracesSampleRate: 0.1,
        tracePropagationTargets: [
            'localhost',
            /^https:\/\/www\.ginkonote\.com\/api/,
        ],

        // Replays will be captured for 0% of all normal sessions
        replaysSessionSampleRate: 0,
        // Replays will be captured 100% of all sessions with an error
        replaysOnErrorSampleRate: 1,

        ignoreErrors: [
            'TypeError: Failed to fetch',
            'TypeError: NetworkError when attempting to fetch resource.',
            'TypeError: cancelled',
            'TypeError: annulé',
            'TypeError: Load failed',
            'TypeError: AbortError: Fetch is aborted',
            'AbortError: Fetch is aborted',
            'UnknownError: Background Sync is disabled.',
            'Error: QuotaExceededError: QuotaExceededError',
            /ChunkLoadError/,
            'script-src wasm-eval:',
            /Loading CSS chunk/,
            /Unable to preload CSS/,
            /webkitExitFullScreen/,
            /webkitEnterFullscreen/,
            /fullscreen error/,
            /setIOSParameters/,
            /safari-web-extension/,
            /chrome-extension/,
            /script-src/,
            /manifest-src/,
            /font-src/,
            /script-src-elem/,
            /@webkit/,
            /no-response/
        ],
        denyUrls: [
            /pagead\/js/i,
            /graph\.facebook\.com/i,
            /connect\.facebook\.net\/en_US\/all\.js/i,
            /extensions\//i,
            /^chrome:\/\//i,
            /^chrome-extension:\/\//i,
            /^webkit-masked-url:\/\//i,
            /s\.pinimg\.com/i,
            /translate\.googleapis\.com/i
        ]
        // beforeSend(event, hint) {
        //     // Check if it is an exception, and if so, show the report dialog
        //     if (event.exception) {
        //         SentryShowReportDialog({eventId: event.event_id});
        //     }
        //     return event;
        // }
    });

    const scope = SentryGetCurrentScope();
    scope.setLevel('warning');

    if (window.currentUserId || window.currentUserSlug) {
        scope.setUser({
            id: window.currentUserId,
            username: window.currentUserSlug
        });
    }

    scope.setTag('locale', window.locale);
}

window.SentryWithScope = SentryWithScope;
window.SentryCaptureException = SentryCaptureException;
window.SentryCaptureMessage = SentryCaptureMessage;

export {SentryWithScope, SentryCaptureException, SentryCaptureMessage};
