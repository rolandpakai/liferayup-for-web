/*import sayHello from './hello';*/
/*import './index.scss';*/

/*document.getElementById('root').innerHTML = sayHello();*/

import $ from 'jquery';
import 'popper.js';
import 'bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import 'index.scss';
//import info from 'info.json';

/*import(
    'info.json'
).then(({default: jsonInfo}) => {
    console.log('my menu: ', jsonInfo);
});*/

/*let data = JSON.parse(info);*/
let data;

let $portalServicePack;
let $applicationServer;
let $databaseVendor;
let $storeType;

let $submitButton;

// Selectors
const formName = 'upForm';
const portalVersion = 'portalVersion';
const bundle = 'bundle';
const applicationServer = 'applicationServer';
const databaseVendor = 'databaseVendor';
const storeType = 'storeType';
const portalServicePack = 'portalServicePack';
/*
const dbLocation = 'dbLocation';
const cache = 'cache';
const cas = 'cas';
const cleanUp = 'cleanUp';
const cloudDb = 'cloudDb';
const clusterMode = 'clusterMode';
const clustering = 'clustering';
const customeDbName = 'customeDbName';
const exportSettings = 'exportSettings';
const filters = 'filters';
const hotfix = 'hotfix';
const IDPhost = 'IDPhost';
const IDPport = 'IDPport';
const IDPprotocol = 'IDPprotocol';
const imageMagick = 'imageMagick';
const installPatches = 'installPatches';
const jaas = 'jaas';
const ldap = 'ldap';
const ticket = 'ticket';
const loadFilters = 'loadFilters';
const log4j = 'log4j';
const mail = 'mail';
const openOffice = 'openOffice';
const ptinfo = 'ptinfo';
const pluginsToInstall = 'pluginsToInstall';
const portalSubVersion = 'portalSubVersion';
const saml = 'saml';
const sharding = 'sharding';
const solr = 'solr';
const config = 'config';
const vmpath = 'vmpath';
const vmpwd = 'vmpwd';
const vmuser = 'vmuser';
const xmx = 'xmx';
const xuggler = 'xuggler';
*/
const submitButton = 'submitButton';

const parameterMap = {
	'applicationServer':'as',
	'bundle':'b',
	'dbLocation':'dblocation',
	'databaseVendor':'db',
	'cache':'cache',
	'cas':'cas',
	'cleanUp':'cl',
	'cloudDb':'clouddb',
	'clusterMode':'cm',
	'clustering':'c', 
	'customeDbName':'cdbn',
	'exportSettings':'e',
	'filters':'filters',
	'hotfix':'H',
	'IDPhost':'idphost',
	'IDPport':'idpport',
	'IDPprotocol':'idpprotocol',
	'imageMagick':'im',
	'intraband':'i',
	'installPatches':'installPatches',
	'jaas':'jaas',
	'ldap':'ldap',
	'ticket':'t',
	'loadFilters':'loadFilters',
	'log4j':'log4j',
	'mail':'mail',
	'openOffice':'oo',
	'ptinfo':'ptinfo',
	'pluginsToInstall':'pli',
	'portalServicePack':'psp',
	'portalSubVersion':'psv',
	'portalVersion':'pv',
	'saml':'saml',
	'sharding':'sh',
	'solr':'solr',
	'storeType':'store',
	'config':'config',
	'vmpath':'vmpath',
	'vmpwd':'vmpwd',
	'vmuser':'vmuser',
	'xmx':'Xmx',
	'xuggler':'x'
};

let databaseVendorsData = ['db2', 'hsql', 'mariadb', 'ms sql', 'mysql', 'oracle', 'postgresql', 'sysbase'];
let storeTypesData = ['adfs', 'cmis', 'db', 'fs', 'jcr', 's3'];
		
const portalVersionAppServerMap = {
	6210: ['tomcat', 'jboss', 'glassfish'],
	7010: ['tomcat', 'jboss', 'wildfly'],
	7110: ['tomcat', 'wildfly']
};

/*let xhr = new XMLHttpRequest();
xhr.onload = function () {
	if (xhr.status >= 200 && xhr.status < 300) {
		data = JSON.parse(xhr.responseText);
		commander.initData(data);
	}
};
xhr.open('GET', './info.json');
xhr.send();*/

let commander = {
	initData: function () {
		let portalVersionsData = commander.getPortalVersions(data);
		
		view.renderSelectOptions(portalVersion, portalVersionsData, false);
	},

	getPortalVersions: function (data) {
		let portalVersionsData = [];

		for (let i = 1; i < data['service-packs'].length; i++) {
			portalVersionsData.push(data['service-packs'][i].version);
		}
			
		return portalVersionsData;
	},

	updateView: function (portalVersion) {
		let appServersData = portalVersionAppServerMap[portalVersion];
		let portalServicePacksData = commander.getPortalServicePacks(portalVersion);

		view.init();
		view.renderSelectOptions(portalServicePack, portalServicePacksData, true);
		view.renderSelectOptions(applicationServer, appServersData, true);
		view.renderSelectOptions(databaseVendor, databaseVendorsData, true);
		view.renderSelectOptions(storeType, storeTypesData, true);
	},

	getPortalServicePacks: function (portalVersion) {
		let portalServicePacksData = [];

		for (let i = 0; i < data['service-packs'].length; i++) {
			if (data['service-packs'][i].version == portalVersion) {
				for (let j = 0; j < data['service-packs'][i]['service-pack'].length; j++) {
					portalServicePacksData.push('SP' + data['service-packs'][i]['service-pack'][j].name);
				}
				break;
			}
		}
		
		return portalServicePacksData;
	},

	getData: function () {		
		let upForm = document.getElementById(formName);
		let formData = new FormData(upForm);
		let commandJson = {};
		let command = '';
		
		if (formData.get(bundle) == 'on') {
			formData.set(bundle, formData.get(applicationServer));
			formData.delete(applicationServer);
		}
		
		for(var entry of formData.entries()) {
			let entryName = entry[0];
			let entryValue = entry[1];
			let entryCommand = parameterMap[entryName];
			
			commandJson[entryCommand] = entryValue;
		}
		
		command = JSON.stringify(commandJson);
		
		return command;
	}
};

let view = {
	init: function () {
		$portalServicePack = document.getElementById(portalServicePack);
		$applicationServer = document.getElementById(applicationServer);
		$databaseVendor = document.getElementById(databaseVendor);
		$storeType = document.getElementById(storeType);
		$submitButton = document.getElementById(submitButton);

		let disabledFields = [$portalServicePack, $applicationServer, $databaseVendor, $storeType, $submitButton];

		for (let i = 0; i < disabledFields.length; i++) {
			disabledFields[i].removeAttribute('disabled');
		}
	},

	cleanPreviousSelection: function(DOMElement) {
		while (DOMElement.firstChild) {
			DOMElement.removeChild(DOMElement.firstChild);
		}
	},
	
	renderSelectOptions: function (selector, options, cleanPreviouseSelection) {
		let $select = document.getElementById(selector);
		
		if (cleanPreviouseSelection) {
			view.cleanPreviousSelection($select);
		}
		
		for (let i = 0; i < options.length; i++) {
			let optionNode = document.createElement('option');
			$select.appendChild(optionNode);
			optionNode.value = options[i];
			optionNode.textContent = options[i];
		}
	}
};

document.getElementById(submitButton).onclick = function (event) {
	event.preventDefault();
	commander.getData();
};

document.querySelector('select[id=\'' + portalVersion + '\']').onchange = function (event) {
	event.preventDefault();
	
	let portalVersion = event.target.value;
	
	commander.updateView(portalVersion);
};
		
$('.btn-number-jvm').click(function(e){
	e.preventDefault();

	let fieldName = $(this).attr('data-field');
	let type	  = $(this).attr('data-type');
	let input = $('input[name=\''+fieldName+'\']');
	let currentVal = parseInt(input.val());
	
	if (!isNaN(currentVal)) {
		if(type == 'minus') {

			if(currentVal > input.attr('min')) {
				input.val(currentVal - 1024).change();
			}
			if(parseInt(input.val()) == input.attr('min')) {
				$(this).attr('disabled', true);
			}

		} else if(type == 'plus') {

			if(currentVal < input.attr('max')) {
				input.val(currentVal + 1024).change();
			}
			if(parseInt(input.val()) == input.attr('max')) {
				$(this).attr('disabled', true);
			}

		}
	} else {
		input.val(1024);
	}
});

$('.btn-counter').click(function(e){
	e.preventDefault();

	let fieldName = $(this).attr('data-field');
	let type	  = $(this).attr('data-type');
	let input = $('input[name=\''+fieldName+'\']');
	let currentVal = parseInt(input.val());
	
	if (!isNaN(currentVal)) {
		if(type == 'minus') {

			if(currentVal > input.attr('min')) {
				input.val(currentVal - 1).change();
			}
			if(parseInt(input.val()) == input.attr('min')) {
				$(this).attr('disabled', true);
			}

		} else if(type == 'plus') {

			if(currentVal < input.attr('max')) {
				input.val(currentVal + 1).change();
			}
			if(parseInt(input.val()) == input.attr('max')) {
				$(this).attr('disabled', true);
			}

		}
	} else {
		input.val(1);
	}
});

$('.input-number').focusin(function(){
	$(this).data('oldValue', $(this).val());
});

$('.input-number').change(function() {
	let minValue =  parseInt($(this).attr('min'));
	let maxValue =  parseInt($(this).attr('max'));
	let valueCurrent = parseInt($(this).val());
	let name = $(this).attr('name');
	
	if(valueCurrent >= minValue) {
		$('.btn-number[data-type=\'minus\'][data-field=\''+name+'\']').removeAttr('disabled');
	} else {
		alert('Sorry, the minimum value was reached');
		$(this).val($(this).data('oldValue'));
	}
	
	if(valueCurrent <= maxValue) {
		$('.btn-number[data-type=\'plus\'][data-field=\''+name+'\']').removeAttr('disabled');
	} else {
		alert('Sorry, the maximum value was reached');
		$(this).val($(this).data('oldValue'));
	}
});

$('.input-number-counter').change(function() {
	let minValue =  parseInt($(this).attr('min'));
	let maxValue =  parseInt($(this).attr('max'));
	let valueCurrent = parseInt($(this).val());
	let name = $(this).attr('name');
	
	if(valueCurrent >= minValue) {
		$('.btn-counter[data-type=\'minus\'][data-field=\''+name+'\']').removeAttr('disabled');
	} else {
		alert('Sorry, the minimum value was reached');
		$(this).val($(this).data('oldValue'));
	}
	
	if(valueCurrent <= maxValue) {
		$('.btn-counter[data-type=\'plus\'][data-field=\''+name+'\']').removeAttr('disabled');
	} else {
		alert('Sorry, the maximum value was reached');
		$(this).val($(this).data('oldValue'));
	}
});

$('.input-number').keydown(function (e) {
	// Allow: backspace, delete, tab, escape, enter and .
	if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
		// Allow: Ctrl+A
		(e.keyCode == 65 && e.ctrlKey === true) ||
		// Allow: home, end, left, right
		(e.keyCode >= 35 && e.keyCode <= 39)) {
		// let it happen, don't do anything
		return;
	}
	// Ensure that it is a number and stop the keypress
	if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
		e.preventDefault();
	}
});

$('.input-number-counter').keydown(function (e) {
	// Allow: backspace, delete, tab, escape, enter and .
	if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
		// Allow: Ctrl+A
		(e.keyCode == 65 && e.ctrlKey === true) ||
		// Allow: home, end, left, right
		(e.keyCode >= 35 && e.keyCode <= 39)) {
		// let it happen, don't do anything
		return;
	}
	// Ensure that it is a number and stop the keypress
	if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
		e.preventDefault();
	}
});

