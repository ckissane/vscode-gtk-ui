define([
    "module",
    "require",
    "vs/platform/instantiation/common/instantiationService",
    "vscode-gtk-ui/utils",
    "vscode-gtk-ui/activity-bar",
    "vscode-gtk-ui/fonts",
    "vscode-gtk-ui/title-bar"
    // ,
    // "vscode-gtk-ui/electron-gtk-theme/getGTKTheme"
], function (module, require, insantiationService, utils, activityBar, fonts, titleBar
    // ,getGTKTheme
    ) {
        'use strict';
       
        // console.log(getGTKTheme+"");
        // let addStyleSheet = utils.addStyleSheet;

        // let url = require.toUrl(module.id) + ".css";
        // if (!url.startsWith("file://")) {
        //     url = 'file://' + url;
        // }
        
        // addStyleSheet(url);
        // getGTKTheme({}).then(function(result) {
        //     console.log(result.raw);
        //     utils.addStyle(result.raw);
        //     // document.querySelector('head > script:nth-child(5)')
        //     // const style = document.createElement('style');
        //     //       style.id = 'theme';
        //     //       document.getElementsByTagName('head')[0].appendChild(style);
        //     // style.innerHTML = result.raw;
        //     return result;
        //   }).catch(function(e) {
        //     return console.error(e.stack);
        //   });

        class _InstantiationService extends insantiationService.InstantiationService {
            constructor() {
                super(...arguments);

                let service = this;

                let run = function(what) {
                    try {                        
                        what.run(service);                        
                    } catch (e) {
                        console.error(e);
                    }
                };

                run(activityBar);
                run(fonts);                
                run(titleBar);                
            }
        }

        insantiationService.InstantiationService = _InstantiationService;
    });
