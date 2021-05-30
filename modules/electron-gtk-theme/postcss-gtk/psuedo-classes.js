(function() {
  var postcss;

  postcss = require('postcss');

  module.exports = postcss.plugin('gtk-color-variables', function() {
    return function(css, processor) {
      return css.walkRules(function(rule) {
        var sel, selector, selectors;
        rule.selector = rule.selector
          .replace(/:selected/g, '.selected')
          .replace(/:insensitive/g, ':disabled')
          .replace(/:inconsistent/g, ':indeterminate')
          .replace(/:prelight/g, ':hover')
          .replace(/:focused/g, ':focus');

        if (rule.selector.indexOf(':backdrop') !== -1) {
          selectors = (function() {
            var i, len, ref, results;
            ref = postcss.list.comma(rule.selector);
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              selector = ref[i];
              sel = selector;
              if (sel.indexOf(':backdrop') !== -1) {
                sel = '.window-frame:not(.active) ' + sel.replace(':backdrop', '');
              }
              // if (sel.indexOf(':backdrop') !== -1) {
              //   throw rule.error(`Unnecessary extra :backdrop in ${JSON.stringify(selector)}`);
              // }
              results.push(sel);
            }
            return results;
          })();
          (rule.selector = selectors.join(',\n'));
        }
        if (rule.selector.indexOf('.gtk-tab:checked') !== -1) {
          selectors = (function() {
            var i, len, ref, results;
            ref = postcss.list.comma(rule.selector);
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              selector = ref[i];
              sel = selector;
              if (sel.indexOf('.gtk-tab:checked') !== -1) {
                results.push(sel.replace('.gtk-tab:checked', '.gtk-tab.checked'));
                results.push(sel.replace('.gtk-tab:checked', '.gtk-tab.active'));
              }else{
                results.push(sel);
              }
              
              // if (sel.indexOf(':backdrop') !== -1) {
              //   throw rule.error(`Unnecessary extra :backdrop in ${JSON.stringify(selector)}`);
              // }
            }
            return results;
          })();
          (rule.selector = selectors.join(',\n'));
        }
      });
    };
  });
}.call(this));
