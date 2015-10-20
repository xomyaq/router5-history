'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _browser = require('browser');

var pluginName = 'HISTORY';

function historyPlugin() {
    var router = undefined;

    function updateBrowserState(state, url, replace) {
        if (replace) (0, _browser.replaceState)(state, '', url);else (0, _browser.pushState)(state, '', url);
    }

    function onPopState(evt) {
        // Do nothing if no state or if last know state is poped state (it should never happen)
        var newState = !evt.state || !evt.state.name;
        var state = evt.state || router.matchPath(browser.getLocation());
        var _router$options = router.options;
        var defaultRoute = _router$options.defaultRoute;
        var defaultParams = _router$options.defaultParams;

        if (!state) {
            // If current state is already the default route, we will have a double entry
            // Navigating back and forth will emit SAME_STATES error
            router.navigate(defaultRoute, defaultParams, { reload: true, replace: true });
            return;
        }
        if (router.lastKnownState && router.areStatesEqual(state, router.lastKnownState, false)) {
            return;
        }

        router._transition(state, router.lastKnownState, function (err, toState) {
            if (err) {
                if (err === constants.CANNOT_DEACTIVATE) {
                    var url = router.buildUrl(router.lastKnownState.name, router.lastKnownState.params);
                    if (!newState) {
                        // Keep history state unchanged but use current URL
                        updateBrowserState(state, url, true);
                    }
                    // else do nothing or history will be messed up
                    // TODO: history.back()?
                } else {
                        // Force navigation to default state
                        router.navigate(defaultRoute, defaultParams, { reload: true, replace: true });
                    }
            } else {
                updateBrowserState(toState, router.buildUrl(toState.name, toState.params), newState);
            }
        });
    }

    function init(target) {
        router = target;
    }

    function onStart() {
        (0, _browser.addPopstateListener)(onPopState);
    }

    function onStop() {
        (0, _browser.removePopstateListener)(onPopState);
    }

    function onTransitionSuccess(toState, fromState, opts) {
        updateBrowserState(toState, router.buildUrl(toState.name, toState.params), opts.replace || opts.reload);
    }

    return { name: pluginName, init: init, onStart: onStart, onStop: onStop, onTransitionSuccess: onTransitionSuccess };
}

exports['default'] = historyPlugin;
module.exports = exports['default'];