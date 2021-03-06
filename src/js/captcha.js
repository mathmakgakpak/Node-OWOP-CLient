'use strict';
import { EVENTS as e } from './conf.js';
import { eventSys } from './global.js';
import { mkHTML, loadScript, setCookie } from './util/misc.js';
import { windowSys, GUIWindow, UtilDialog } from './windowsys.js';
import { misc } from './main.js';
import { PublicAPI } from './global.js';


PublicAPI.captcha = {
	siteKey: "6Lds3s4UAAAAABt8aF9F32jNkVK2Rr21xLi0_AzC",
	loadCaptcha,
	requestVerification,
	loadAndRequestCaptcha
};

export function loadCaptcha(onload) {
	if (!window.grecaptcha) {
		if (window.callback) {
			/* Hacky solution for race condition */
			window.callback = function() {
				onload();
				this();
			}.bind(window.callback);
		} else {
        	window.callback = function() {
	            delete window.callback;
            	onload();
        	};
        	eventSys.emit(e.misc.loadingCaptcha);
			loadScript("https://www.google.com/recaptcha/api.js?onload=callback&render=explicit");
		}
	} else {
		onload();
	}
}

export function requestVerification() {
	windowSys.addWindow(new GUIWindow("Verification needed", {
			centered: true
	}, wdow => {
		var id = grecaptcha.render(wdow.addObj(mkHTML("div", {
			id: "captchawdow"
		})), {
			theme: "light",
			sitekey: PublicAPI.captcha.siteKey,
			callback: token => {
				eventSys.emit(e.misc.captchaToken, token);
				wdow.close();
			}
		});
		wdow.frame.style.cssText = "";
		wdow.container.style.cssText = "overflow: hidden; background-color: #F9F9F9";
	}));
}

export function loadAndRequestCaptcha() {
	if ('owopcaptcha' in localStorage) {
		setTimeout(() => {
			eventSys.emit(e.misc.captchaToken, 'LETMEINPLZ' + localStorage.owopcaptcha);
		}, 0);
	} else {
		loadCaptcha(requestVerification);
	}
}
